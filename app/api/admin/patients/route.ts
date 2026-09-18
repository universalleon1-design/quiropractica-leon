import { env } from 'cloudflare:workers';
import { NextResponse } from 'next/server';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { ensureDbInitialized } from '@/db';
import {
  generatePin,
  generatePatientQrToken,
  hashPin,
  makePatientQrValue,
  makeId,
  normalizeSearch,
  todayInLima,
} from '@/lib/clinic';

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  await ensureDbInitialized();

  const body = (await request.json()) as {
    firstName?: string;
    lastName?: string;
    dni?: string;
    address?: string;
    occupation?: string;
    age?: string | number;
    birthDate?: string;
    weightKg?: string | number;
    heightCm?: string | number;
    sex?: string;
    phone?: string;
    mainComplaint?: string;
    painDurationHours?: string;
    painLevel?: string | number;
    generalHealth?: string;
    sleepHours?: string;
    pregnancyStatus?: string;
    medications?: string;
    spineInclination?: string;
    spineRotation?: string;
    spineExtension?: string;
    iliac?: string;
    gaitTiptoes?: string;
    gaitHeels?: string;
    pronePosition?: string;
    legLength?: string;
    sacroiliacPain?: string;
    cervicalSyndrome?: string;
    dynamicPalpation?: string;
    strongerLeg?: string;
    staticPalpation?: string;
    muscleTension?: string;
    lumbarScan?: string;
    lumbarHypomobility?: string;
    lumbarYesNo?: string;
    thoracicScan?: string;
    thoracicHypomobility?: string;
    thoracicListingLevel?: string;
    cervicalC2C7Rotation?: string;
    cervicalListingLevel?: string;
    cervicalSeries?: string;
    clinicalNotes?: string;
    totalSessions?: number;
    appointmentDate?: string;
    appointmentTime?: string;
    evaluationDate?: string;
  };

  const firstName = body.firstName?.trim();
  const lastName = body.lastName?.trim();
  if (!firstName || !lastName) {
    return NextResponse.json({ error: 'Nombre y apellido son obligatorios.' }, { status: 400 });
  }

  const patientId = makeId('patient');
  const pin = generatePin();
  const qrToken = generatePatientQrToken();
  const now = new Date().toISOString();
  const appointmentDate = body.appointmentDate || todayInLima();
  const totalSessions = Math.max(1, Math.min(99, Number(body.totalSessions) || 1));
  const weight = Number(body.weightKg) || null;
  const height = Number(body.heightCm) || null;
  const bmi = weight && height ? Number((weight / ((height / 100) ** 2)).toFixed(1)) : null;

  try {
    const statements = [
      env.DB.prepare(
        `INSERT INTO patients
         (id, first_name, last_name, search_name, dni, address, occupation, birth_date, sex, phone, email, pin_hash, qr_token, qr_issued_at, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?, ?, ?)`,
      ).bind(
        patientId,
        firstName,
        lastName,
        normalizeSearch(`${firstName} ${lastName}`),
        body.dni?.trim() || null,
        body.address?.trim() || null,
        body.occupation?.trim() || null,
        body.birthDate || null,
        body.sex || null,
        body.phone?.trim() || null,
        await hashPin(pin),
        qrToken,
        now,
        now,
      ),
      env.DB.prepare(
        `INSERT INTO patient_anamnesis
         (id, patient_id, evaluation_date, dni, age, birth_date, weight_kg, height_cm, address, occupation,
          main_complaint, pain_duration_hours, pain_level, general_health, sleep_hours, pregnancy_status,
          medications, spine_inclination, spine_rotation, spine_extension, iliac, gait_tiptoes, gait_heels,
          prone_position, leg_length, sacroiliac_pain, cervical_syndrome, dynamic_palpation, stronger_leg,
          static_palpation, muscle_tension, lumbar_scan, lumbar_hypomobility, lumbar_yes_no, thoracic_scan,
          thoracic_hypomobility, thoracic_listing_level, cervical_c2_c7_rotation, cervical_listing_level,
          cervical_series, clinical_notes, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ).bind(
        makeId('anamnesis'),
        patientId,
        body.evaluationDate || todayInLima(),
        body.dni?.trim() || null,
        body.age ? Number(body.age) : null,
        body.birthDate || null,
        weight,
        height,
        body.address?.trim() || null,
        body.occupation?.trim() || null,
        body.mainComplaint?.trim() || null,
        body.painDurationHours?.trim() || null,
        body.painLevel ? Number(body.painLevel) : null,
        body.generalHealth?.trim() || null,
        body.sleepHours?.trim() || null,
        body.pregnancyStatus?.trim() || null,
        body.medications?.trim() || null,
        body.spineInclination?.trim() || null,
        body.spineRotation?.trim() || null,
        body.spineExtension?.trim() || null,
        body.iliac?.trim() || null,
        body.gaitTiptoes?.trim() || null,
        body.gaitHeels?.trim() || null,
        body.pronePosition?.trim() || null,
        body.legLength?.trim() || null,
        body.sacroiliacPain?.trim() || null,
        body.cervicalSyndrome?.trim() || null,
        body.dynamicPalpation?.trim() || null,
        body.strongerLeg?.trim() || null,
        body.staticPalpation?.trim() || null,
        body.muscleTension?.trim() || null,
        body.lumbarScan?.trim() || null,
        body.lumbarHypomobility?.trim() || null,
        body.lumbarYesNo?.trim() || null,
        body.thoracicScan?.trim() || null,
        body.thoracicHypomobility?.trim() || null,
        body.thoracicListingLevel?.trim() || null,
        body.cervicalC2C7Rotation?.trim() || null,
        body.cervicalListingLevel?.trim() || null,
        body.cervicalSeries?.trim() || null,
        body.clinicalNotes?.trim() || null,
        now,
      ),
      env.DB.prepare(
        `INSERT INTO session_packages
         (id, patient_id, total_sessions, used_sessions, created_at)
         VALUES (?, ?, ?, 0, ?)`,
      ).bind(makeId('package'), patientId, totalSessions, now),
      env.DB.prepare(
        `INSERT INTO audit_logs
         (id, actor_id, action, entity_type, entity_id, created_at)
         VALUES (?, ?, 'patient.created', 'patient', ?, ?)`,
      ).bind(makeId('audit'), user.userId, patientId, now),
    ];

    if (weight || height || body.mainComplaint) {
      statements.push(
        env.DB.prepare(
          `INSERT INTO patient_assessments
           (id, patient_id, reason, conditions, body_analysis, weight_kg, height_cm, bmi, healthy_weight_min_kg, healthy_weight_max_kg, target_weight_kg, diet_plan, notes, assessed_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?)`,
        ).bind(
          makeId('assessment'),
          patientId,
          body.mainComplaint?.trim() || 'Evaluación inicial',
          body.medications?.trim() || null,
          `Inclinación: ${body.spineInclination || '-'} | Rotación: ${body.spineRotation || '-'} | Ilíaco: ${body.iliac || '-'}`,
          weight,
          height,
          bmi,
          height ? Number((18.5 * ((height / 100) ** 2)).toFixed(1)) : null,
          height ? Number((24.9 * ((height / 100) ** 2)).toFixed(1)) : null,
          null,
          body.clinicalNotes?.trim() || null,
          now,
        ),
      );
    }

    if (body.appointmentTime) {
      statements.push(
        env.DB.prepare(
          `INSERT INTO appointments
           (id, patient_id, appointment_date, start_time, duration_minutes, status, reason, created_at)
           VALUES (?, ?, ?, ?, 45, 'scheduled', NULL, ?)`,
        ).bind(makeId('appointment'), patientId, appointmentDate, body.appointmentTime, now),
      );
    }

    await env.DB.batch(statements);
    return NextResponse.json({
      patientId,
      firstName,
      lastName,
      qrValue: makePatientQrValue(qrToken),
    });
  } catch (error) {
    console.error('patient.create.failed', error);
    return NextResponse.json(
      { error: 'No se pudo guardar al paciente. Inténtalo nuevamente.' },
      { status: 503 },
    );
  }
}

export async function PATCH(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = (await request.json()) as { patientId?: string };
  if (!body.patientId) {
    return NextResponse.json(
      { error: 'Falta el paciente para renovar su QR.' },
      { status: 400 },
    );
  }

  const qrToken = generatePatientQrToken();
  const now = new Date().toISOString();
  try {
    const patient = await env.DB.prepare(
      `SELECT first_name AS firstName, last_name AS lastName
       FROM patients WHERE id = ? LIMIT 1`,
    )
      .bind(body.patientId)
      .first<{ firstName: string; lastName: string }>();
    if (!patient) {
      return NextResponse.json({ error: 'Paciente no encontrado.' }, { status: 404 });
    }

    await env.DB.batch([
      env.DB.prepare(
        `UPDATE patients SET qr_token = ?, qr_issued_at = ? WHERE id = ?`,
      ).bind(qrToken, now, body.patientId),
      env.DB.prepare(
        `INSERT INTO audit_logs
         (id, actor_id, action, entity_type, entity_id, created_at)
         VALUES (?, ?, 'patient.qr_renewed', 'patient', ?, ?)`,
      ).bind(makeId('audit'), user.userId, body.patientId, now),
    ]);

    return NextResponse.json({
      firstName: patient.firstName,
      lastName: patient.lastName,
      qrValue: makePatientQrValue(qrToken),
    });
  } catch {
    return NextResponse.json(
      { error: 'No se pudo generar la tarjeta QR.' },
      { status: 503 },
    );
  }
}

export async function DELETE(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const body = (await request.json()) as { patientId?: string };
  if (!body.patientId) {
    return NextResponse.json({ error: 'Selecciona un paciente válido.' }, { status: 400 });
  }
  if (body.patientId.startsWith('demo-')) {
    return NextResponse.json({ deleted: true });
  }
  try {
    const files = await env.DB.prepare(
      'SELECT object_key AS objectKey FROM media_files WHERE patient_id = ?',
    ).bind(body.patientId).all<{ objectKey: string }>();
    if (env.FILES) {
      await Promise.all(files.results.map((file) => env.FILES!.delete(file.objectKey)));
    }
    await env.DB.batch([
      env.DB.prepare('DELETE FROM patient_anamnesis WHERE patient_id = ?').bind(body.patientId),
      env.DB.prepare('DELETE FROM patient_assessments WHERE patient_id = ?').bind(body.patientId),
      env.DB.prepare('DELETE FROM appointments WHERE patient_id = ?').bind(body.patientId),
      env.DB.prepare('DELETE FROM check_ins WHERE patient_id = ?').bind(body.patientId),
      env.DB.prepare('DELETE FROM session_packages WHERE patient_id = ?').bind(body.patientId),
      env.DB.prepare('DELETE FROM clinical_visits WHERE patient_id = ?').bind(body.patientId),
      env.DB.prepare('DELETE FROM payments WHERE patient_id = ?').bind(body.patientId),
      env.DB.prepare('DELETE FROM supplements WHERE patient_id = ?').bind(body.patientId),
      env.DB.prepare('DELETE FROM media_files WHERE patient_id = ?').bind(body.patientId),
      env.DB.prepare('DELETE FROM patients WHERE id = ?').bind(body.patientId),
    ]);
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('patient.delete.failed', error);
    return NextResponse.json({ error: 'No se pudo eliminar el paciente.' }, { status: 503 });
  }
}
