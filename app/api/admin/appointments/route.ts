import { env } from 'cloudflare:workers';
import { NextResponse } from 'next/server';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { makeId, todayInLima, timeInLima } from '@/lib/clinic';

export async function PATCH(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = (await request.json()) as { appointmentId?: string; status?: string };
  if (!body.appointmentId || !['in_session', 'completed', 'cancelled', 'no_show'].includes(body.status ?? '')) {
    return NextResponse.json({ error: 'Estado no válido.' }, { status: 400 });
  }

  if (body.appointmentId.startsWith('demo-')) {
    return NextResponse.json({ ok: true, demo: true });
  }

  try {
    const appointment = await env.DB.prepare(
      'SELECT patient_id AS patientId, status FROM appointments WHERE id = ? LIMIT 1',
    )
      .bind(body.appointmentId)
      .first<{ patientId: string; status: string }>();
    if (!appointment) return NextResponse.json({ error: 'Cita no encontrada.' }, { status: 404 });

    const now = new Date().toISOString();
    const statements = [
      env.DB.prepare('UPDATE appointments SET status = ? WHERE id = ?').bind(
        body.status,
        body.appointmentId,
      ),
      env.DB.prepare(
        `INSERT INTO audit_logs
         (id, actor_id, action, entity_type, entity_id, created_at)
         VALUES (?, ?, ?, 'appointment', ?, ?)`,
      ).bind(makeId('audit'), user.userId, `appointment.${body.status}`, body.appointmentId, now),
    ];

    if (body.status === 'completed' && appointment.status !== 'completed') {
      const apptRecord = await env.DB.prepare(
        'SELECT appointment_date AS appointmentDate FROM appointments WHERE id = ? LIMIT 1',
      ).bind(body.appointmentId).first<{ appointmentDate: string }>();

      if (apptRecord) {
        const otherCompleted = await env.DB.prepare(
          `SELECT id FROM appointments
           WHERE patient_id = ? AND appointment_date = ?
             AND status = 'completed' AND id != ?
           LIMIT 1`,
        ).bind(appointment.patientId, apptRecord.appointmentDate, body.appointmentId).first<{ id: string }>();

        if (otherCompleted) {
          return NextResponse.json({
            error: 'El paciente ya tiene una asistencia completada en esta misma fecha. Solo se permite 1 asistencia por día.',
          }, { status: 409 });
        }
      }

      statements.push(
        env.DB.prepare(
          `UPDATE session_packages
           SET used_sessions = used_sessions + 1
           WHERE patient_id = ?`,
        ).bind(appointment.patientId),
        env.DB.prepare(
          `INSERT INTO clinical_visits
           (id, appointment_id, patient_id, weight_kg, height_cm, pain_level, notes, completed_at, created_at)
           VALUES (?, ?, ?, NULL, NULL, NULL, NULL, ?, ?)`,
        ).bind(makeId('visit'), body.appointmentId, appointment.patientId, now, now),
      );
    }

    await env.DB.batch(statements);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'No se pudo actualizar la cita.' }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = (await request.json()) as {
    patientId?: string;
    action?: 'register_session' | 'decrement_session' | 'adjust_sessions';
    usedSessions?: number;
    totalSessions?: number;
    notes?: string;
  };

  const patientId = body.patientId?.trim();
  if (!patientId) {
    return NextResponse.json({ error: 'Falta el ID del paciente.' }, { status: 400 });
  }

  const now = new Date().toISOString();
  const today = todayInLima();
  const time = timeInLima();

  try {
    const pkg = await env.DB.prepare(
      'SELECT id, total_sessions AS total, used_sessions AS used FROM session_packages WHERE patient_id = ? ORDER BY created_at DESC LIMIT 1',
    ).bind(patientId).first<{ id: string; total: number; used: number }>();

    if (!pkg) {
      return NextResponse.json({ error: 'El paciente no tiene un paquete de sesiones registrado.' }, { status: 404 });
    }

    if (body.action === 'register_session') {
      const alreadyAttendedToday = await env.DB.prepare(
        `SELECT a.id, a.start_time AS startTime, a.status
         FROM appointments a
         WHERE a.patient_id = ? AND a.appointment_date = ?
           AND a.status IN ('completed', 'in_session', 'checked_in')
         LIMIT 1`,
      ).bind(patientId, today).first<{ id: string; startTime: string; status: string }>();

      if (alreadyAttendedToday) {
        return NextResponse.json({
          error: 'El paciente ya cuenta con una asistencia registrada el día de hoy. Solo se permite 1 asistencia por día.',
          alreadyAttendedToday: true,
          used: pkg.used,
          total: pkg.total,
        }, { status: 409 });
      }

      const apptId = makeId('appointment');
      const newUsed = pkg.used + 1;
      await env.DB.batch([
        env.DB.prepare(
          `INSERT INTO appointments
           (id, patient_id, appointment_date, start_time, duration_minutes, status, reason, created_at)
           VALUES (?, ?, ?, ?, 45, 'completed', ?, ?)`,
        ).bind(apptId, patientId, today, time, body.notes?.trim() || 'Sesión presencial asistida', now),
        env.DB.prepare(
          `INSERT INTO check_ins
           (id, appointment_id, patient_id, location_code, checked_in_at)
           VALUES (?, ?, ?, 'manual_checkin', ?)`,
        ).bind(makeId('checkin'), apptId, patientId, now),
        env.DB.prepare(
          `INSERT INTO clinical_visits
           (id, appointment_id, patient_id, notes, completed_at, created_at)
           VALUES (?, ?, ?, ?, ?, ?)`,
        ).bind(makeId('visit'), apptId, patientId, body.notes?.trim() || 'Sesión de ajuste quiropráctico realizada', now, now),
        env.DB.prepare(
          'UPDATE session_packages SET used_sessions = ? WHERE id = ?',
        ).bind(newUsed, pkg.id),
        env.DB.prepare(
          `INSERT INTO audit_logs (id, actor_id, action, entity_type, entity_id, created_at)
           VALUES (?, ?, 'session.registered', 'patient', ?, ?)`,
        ).bind(makeId('audit'), user.userId, patientId, now),
      ]);
      return NextResponse.json({ ok: true, used: newUsed, total: pkg.total });
    }

    if (body.action === 'decrement_session') {
      const newUsed = Math.max(0, pkg.used - 1);
      await env.DB.batch([
        env.DB.prepare('UPDATE session_packages SET used_sessions = ? WHERE id = ?').bind(newUsed, pkg.id),
        env.DB.prepare(
          `INSERT INTO audit_logs (id, actor_id, action, entity_type, entity_id, created_at)
           VALUES (?, ?, 'session.decremented', 'patient', ?, ?)`,
        ).bind(makeId('audit'), user.userId, patientId, now),
      ]);
      return NextResponse.json({ ok: true, used: newUsed, total: pkg.total });
    }

    if (body.action === 'adjust_sessions') {
      const newTotal = body.totalSessions !== undefined ? Math.max(1, Math.min(99, Number(body.totalSessions) || 1)) : pkg.total;
      const newUsed = body.usedSessions !== undefined ? Math.max(0, Math.min(99, Number(body.usedSessions) || 0)) : pkg.used;
      await env.DB.batch([
        env.DB.prepare(
          'UPDATE session_packages SET total_sessions = ?, used_sessions = ? WHERE id = ?',
        ).bind(newTotal, newUsed, pkg.id),
        env.DB.prepare(
          `INSERT INTO audit_logs (id, actor_id, action, entity_type, entity_id, created_at)
           VALUES (?, ?, 'session.adjusted', 'patient', ?, ?)`,
        ).bind(makeId('audit'), user.userId, patientId, now),
      ]);
      return NextResponse.json({ ok: true, used: newUsed, total: newTotal });
    }

    return NextResponse.json({ error: 'Acción no válida.' }, { status: 400 });
  } catch (error) {
    console.error('appointments.post.failed', error);
    return NextResponse.json({ error: 'No se pudo procesar la sesión.' }, { status: 503 });
  }
}
