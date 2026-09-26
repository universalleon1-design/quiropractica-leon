import { env } from 'cloudflare:workers';
import { NextResponse } from 'next/server';
import {
  formatClinicTime,
  makeId,
  readPatientQrToken,
  timeInLima,
  todayInLima,
} from '@/lib/clinic';

type PatientRecord = {
  id: string;
  name: string;
  used: number;
  total: number;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      token?: string;
      qrValue?: string;
    };
    const raw = body.token || body.qrValue || '';
    const token = readPatientQrToken(raw);

    if (!token) {
      return NextResponse.json(
        { error: 'Código de pase no válido o no reconocido.' },
        { status: 400 },
      );
    }

    const patient = await env.DB.prepare(
      `SELECT p.id, p.first_name || ' ' || p.last_name AS name,
              COALESCE(sp.used_sessions, 0) AS used,
              COALESCE(sp.total_sessions, 0) AS total
       FROM patients p
       LEFT JOIN session_packages sp ON sp.patient_id = p.id
       WHERE p.qr_token = ?
       LIMIT 1`,
    )
      .bind(token)
      .first<PatientRecord>();

    if (!patient) {
      return NextResponse.json(
        { error: 'El pase QR no corresponde a ningún paciente registrado.' },
        { status: 404 },
      );
    }

    const today = todayInLima();
    const previous = await env.DB.prepare(
      `SELECT c.checked_in_at AS checkedInAt, a.start_time AS startTime
       FROM check_ins c
       JOIN appointments a ON a.id = c.appointment_id
       WHERE c.patient_id = ? AND a.appointment_date = ?
       ORDER BY c.checked_in_at DESC
       LIMIT 1`,
    )
      .bind(patient.id, today)
      .first<{ checkedInAt: string; startTime: string }>();

    if (previous) {
      return NextResponse.json({
        success: true,
        patientId: patient.id,
        name: patient.name,
        used: patient.used,
        total: patient.total,
        appointmentTime: formatClinicTime(previous.startTime),
        checkedInAt: previous.checkedInAt,
        alreadyRegistered: true,
      });
    }

    const existingAppointment = await env.DB.prepare(
      `SELECT id, start_time AS startTime
       FROM appointments
       WHERE patient_id = ? AND appointment_date = ?
         AND status NOT IN ('cancelled', 'no_show')
       ORDER BY start_time ASC
       LIMIT 1`,
    )
      .bind(patient.id, today)
      .first<{ id: string; startTime: string }>();

    const appointmentId = existingAppointment?.id ?? makeId('appointment');
    const appointmentTime = existingAppointment?.startTime ?? timeInLima();
    const now = new Date().toISOString();
    const statements = [];

    if (!existingAppointment) {
      statements.push(
        env.DB.prepare(
          `INSERT INTO appointments
           (id, patient_id, appointment_date, start_time, duration_minutes, status, reason, created_at)
           VALUES (?, ?, ?, ?, 45, 'checked_in', 'Llegada escaneo QR móvil', ?)`,
        ).bind(appointmentId, patient.id, today, appointmentTime, now),
      );
    } else {
      statements.push(
        env.DB.prepare(
          `UPDATE appointments SET status = 'checked_in'
           WHERE id = ? AND status = 'scheduled'`,
        ).bind(appointmentId),
      );
    }

    statements.push(
      env.DB.prepare(
        `INSERT INTO check_ins
         (id, appointment_id, patient_id, location_code, checked_in_at)
         VALUES (?, ?, ?, 'mobile_qr_camera', ?)`,
      ).bind(makeId('checkin'), appointmentId, patient.id, now),
      env.DB.prepare(
        `INSERT INTO audit_logs
         (id, actor_id, action, entity_type, entity_id, created_at)
         VALUES (?, 'mobile_qr_scan', 'patient.checked_in', 'patient', ?, ?)`,
      ).bind(makeId('audit'), patient.id, now),
    );

    await env.DB.batch(statements);

    return NextResponse.json({
      success: true,
      patientId: patient.id,
      name: patient.name,
      used: patient.used,
      total: patient.total,
      appointmentTime: formatClinicTime(appointmentTime),
      checkedInAt: now,
      walkIn: !existingAppointment,
      alreadyRegistered: false,
    });
  } catch (error) {
    console.error('public.check-in.failed', error);
    return NextResponse.json(
      { error: 'Error al procesar la llegada. Inténtalo nuevamente.' },
      { status: 500 },
    );
  }
}
