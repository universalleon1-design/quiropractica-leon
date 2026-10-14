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
  timeInLima,
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
    sessionsPerWeek?: number;
    appointmentDate?: string;
    appointmentTime?: string;
    evaluationDate?: string;
    totalAmount?: number;
    initialPayment?: number;
    paymentMethod?: string;
    paymentNotes?: string;
    startToday?: boolean | string;
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
  const today = todayInLima();
  const startsToday = body.startToday === true || body.startToday === 'SI';
  const appointmentDate = startsToday ? today : (body.appointmentDate || today);
  const totalSessions = Math.max(1, Math.min(99, Number(body.totalSessions) || 1));
  const usedSessions = startsToday ? 1 : 0;
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
         (id, patient_id, total_sessions, used_sessions, sessions_per_week, start_date, total_amount_cents, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      ).bind(
        makeId('package'),
        patientId,
        totalSessions,
        usedSessions,
        Math.max(1, Math.min(7, Number(body.sessionsPerWeek) || 1)),
        appointmentDate,
        Math.round((Number(body.totalAmount) || 0) * 100),
        now,
      ),
      env.DB.prepare(
        `INSERT INTO audit_logs
         (id, actor_id, action, entity_type, entity_id, created_at)
         VALUES (?, ?, 'patient.created', 'patient', ?, ?)`,
      ).bind(makeId('audit'), user.userId, patientId, now),
    ];

    if (Number(body.initialPayment) > 0) {
      statements.push(
        env.DB.prepare(
          `INSERT INTO payments
           (id, patient_id, amount_cents, method, notes, paid_at)
           VALUES (?, ?, ?, ?, ?, ?)`,
        ).bind(
          makeId('payment'),
          patientId,
          Math.round(Number(body.initialPayment) * 100),
          body.paymentMethod || 'Efectivo',
          body.paymentNotes?.trim() || 'Abono inicial al registrar paciente',
          now,
        ),
      );
    }

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

    const apptTime = body.appointmentTime || timeInLima();
    const apptId = makeId('appointment');
    if (startsToday) {
      statements.push(
        env.DB.prepare(
          `INSERT INTO appointments
           (id, patient_id, appointment_date, start_time, duration_minutes, status, reason, created_at)
           VALUES (?, ?, ?, ?, 45, 'completed', '1ra sesión de ajuste realizada al registrarse', ?)`,
        ).bind(apptId, patientId, appointmentDate, apptTime, now),
        env.DB.prepare(
          `INSERT INTO check_ins
           (id, appointment_id, patient_id, location_code, checked_in_at)
           VALUES (?, ?, ?, 'registration_day', ?)`,
        ).bind(makeId('checkin'), apptId, patientId, now),
        env.DB.prepare(
          `INSERT INTO clinical_visits
           (id, appointment_id, patient_id, notes, completed_at, created_at)
           VALUES (?, ?, ?, 'Primera sesión de ajuste quiropráctico realizada', ?, ?)`,
        ).bind(makeId('visit'), apptId, patientId, now, now),
      );
    } else if (body.appointmentTime) {
      statements.push(
        env.DB.prepare(
          `INSERT INTO appointments
           (id, patient_id, appointment_date, start_time, duration_minutes, status, reason, created_at)
           VALUES (?, ?, ?, ?, 45, 'scheduled', NULL, ?)`,
        ).bind(apptId, patientId, appointmentDate, body.appointmentTime, now),
      );
    }

    await env.DB.batch(statements);

    // Auto-mirror to Cloudflare Workers cloud DB if request comes from local dev
    const host = request.headers.get('host') || '';
    if (host.includes('localhost') || host.includes('127.0.0.1')) {
      void (async () => {
        try {
          const syncPayload = {
            patients: [
              {
                id: patientId,
                first_name: firstName,
                last_name: lastName,
                search_name: normalizeSearch(`${firstName} ${lastName}`),
                dni: body.dni?.trim() || null,
                address: body.address?.trim() || null,
                occupation: body.occupation?.trim() || null,
                birth_date: body.birthDate || null,
                sex: body.sex || null,
                phone: body.phone?.trim() || null,
                pin_hash: await hashPin(pin),
                qr_token: qrToken,
                qr_issued_at: now,
                created_at: now,
              },
            ],
            anamnesis: [
              {
                id: makeId('anamnesis'),
                patient_id: patientId,
                evaluation_date: body.evaluationDate || today,
                dni: body.dni?.trim() || null,
                age: body.age ? Number(body.age) : null,
                birth_date: body.birthDate || null,
                weight_kg: weight,
                height_cm: height,
                address: body.address?.trim() || null,
                occupation: body.occupation?.trim() || null,
                main_complaint: body.mainComplaint?.trim() || null,
                pain_duration_hours: body.painDurationHours?.trim() || null,
                pain_level: body.painLevel ? Number(body.painLevel) : null,
                general_health: body.generalHealth?.trim() || null,
                sleep_hours: body.sleepHours?.trim() || null,
                pregnancy_status: body.pregnancyStatus?.trim() || null,
                medications: body.medications?.trim() || null,
                spine_inclination: body.spineInclination?.trim() || null,
                spine_rotation: body.spineRotation?.trim() || null,
                spine_extension: body.spineExtension?.trim() || null,
                iliac: body.iliac?.trim() || null,
                gait_tiptoes: body.gaitTiptoes?.trim() || null,
                gait_heels: body.gaitHeels?.trim() || null,
                prone_position: body.pronePosition?.trim() || null,
                leg_length: body.legLength?.trim() || null,
                sacroiliac_pain: body.sacroiliacPain?.trim() || null,
                cervical_syndrome: body.cervicalSyndrome?.trim() || null,
                dynamic_palpation: body.dynamicPalpation?.trim() || null,
                stronger_leg: body.strongerLeg?.trim() || null,
                static_palpation: body.staticPalpation?.trim() || null,
                muscle_tension: body.muscleTension?.trim() || null,
                lumbar_scan: body.lumbarScan?.trim() || null,
                lumbar_hypomobility: body.lumbarHypomobility?.trim() || null,
                lumbar_yes_no: body.lumbarYesNo?.trim() || null,
                thoracic_scan: body.thoracicScan?.trim() || null,
                thoracic_hypomobility: body.thoracicHypomobility?.trim() || null,
                thoracic_listing_level: body.thoracicListingLevel?.trim() || null,
                cervical_c2_c7_rotation: body.cervicalC2C7Rotation?.trim() || null,
                cervical_listing_level: body.cervicalListingLevel?.trim() || null,
                cervical_series: body.cervicalSeries?.trim() || null,
                clinical_notes: body.clinicalNotes?.trim() || null,
                created_at: now,
              },
            ],
            packages: [
              {
                id: makeId('package'),
                patient_id: patientId,
                total_sessions: totalSessions,
                used_sessions: usedSessions,
                sessions_per_week: Math.max(1, Math.min(7, Number(body.sessionsPerWeek) || 1)),
                start_date: appointmentDate,
                total_amount_cents: Math.round((Number(body.totalAmount) || 0) * 100),
                created_at: now,
              },
            ],
            appointments: [
              {
                id: apptId,
                patient_id: patientId,
                appointment_date: appointmentDate,
                start_time: apptTime,
                duration_minutes: 45,
                status: startsToday ? 'completed' : 'scheduled',
                reason: startsToday ? '1ra sesión de ajuste realizada al registrarse' : null,
                created_at: now,
              },
            ],
          };

          await fetch('https://quiropractica-leon.universalleon1.workers.dev/api/admin/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(syncPayload),
          });
        } catch (syncErr) {
          console.warn('Auto-mirror to cloud warning:', syncErr);
        }
      })();
    }

    return NextResponse.json({
      patientId,
      firstName,
      lastName,
      qrValue: makePatientQrValue(qrToken),
      used: usedSessions,
      total: totalSessions,
      startsToday,
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

    // Auto-mirror renew QR to cloud if on localhost
    const host = request.headers.get('host') || '';
    if (host.includes('localhost') || host.includes('127.0.0.1')) {
      void fetch('https://quiropractica-leon.universalleon1.workers.dev/api/admin/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patients: [
            {
              id: body.patientId,
              first_name: patient.firstName,
              last_name: patient.lastName,
              search_name: normalizeSearch(`${patient.firstName} ${patient.lastName}`),
              pin_hash: '',
              qr_token: qrToken,
              qr_issued_at: now,
              created_at: now,
            },
          ],
        }),
      }).catch(() => {});
    }

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

    // Auto-mirror delete to cloud if on localhost
    const host = request.headers.get('host') || '';
    if (host.includes('localhost') || host.includes('127.0.0.1')) {
      void fetch('https://quiropractica-leon.universalleon1.workers.dev/api/admin/patients', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId: body.patientId }),
      }).catch(() => {});
    }

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('patient.delete.failed', error);
    return NextResponse.json({ error: 'No se pudo eliminar el paciente.' }, { status: 503 });
  }
}
