import { env } from 'cloudflare:workers';
import { NextResponse } from 'next/server';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { ensureDbInitialized } from '@/db';

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  await ensureDbInitialized();

  try {
    const [patients, anamnesis, packages, appointments, payments, assessments] = await Promise.all([
      env.DB.prepare('SELECT * FROM patients').all(),
      env.DB.prepare('SELECT * FROM patient_anamnesis').all(),
      env.DB.prepare('SELECT * FROM session_packages').all(),
      env.DB.prepare('SELECT * FROM appointments').all(),
      env.DB.prepare('SELECT * FROM payments').all(),
      env.DB.prepare('SELECT * FROM patient_assessments').all(),
    ]);

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      patients: patients.results || [],
      anamnesis: anamnesis.results || [],
      packages: packages.results || [],
      appointments: appointments.results || [],
      payments: payments.results || [],
      assessments: assessments.results || [],
    });
  } catch (error) {
    console.error('sync.export.failed', error);
    return NextResponse.json({ error: 'Error al exportar datos.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  await ensureDbInitialized();

  try {
    const data = (await request.json()) as any;
    const stmts: any[] = [];

    if (Array.isArray(data.patients)) {
      for (const p of data.patients) {
        stmts.push(
          env.DB.prepare(
            `INSERT OR REPLACE INTO patients
             (id, first_name, last_name, search_name, birth_date, sex, phone, email, pin_hash, qr_token, qr_issued_at, created_at, dni, address, occupation)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          ).bind(
            p.id,
            p.first_name,
            p.last_name,
            p.search_name,
            p.birth_date || null,
            p.sex || null,
            p.phone || null,
            p.email || null,
            p.pin_hash,
            p.qr_token || null,
            p.qr_issued_at || null,
            p.created_at || new Date().toISOString(),
            p.dni || null,
            p.address || null,
            p.occupation || null,
          ),
        );
      }
    }

    if (Array.isArray(data.anamnesis)) {
      for (const a of data.anamnesis) {
        stmts.push(
          env.DB.prepare(
            `INSERT OR REPLACE INTO patient_anamnesis
             (id, patient_id, evaluation_date, dni, age, birth_date, weight_kg, height_cm, address, occupation,
              main_complaint, pain_duration_hours, pain_level, general_health, sleep_hours, pregnancy_status,
              medications, spine_inclination, spine_rotation, spine_extension, iliac, gait_tiptoes, gait_heels,
              prone_position, leg_length, sacroiliac_pain, cervical_syndrome, dynamic_palpation, stronger_leg,
              static_palpation, muscle_tension, lumbar_scan, lumbar_hypomobility, lumbar_yes_no, thoracic_scan,
              thoracic_hypomobility, thoracic_listing_level, cervical_c2_c7_rotation, cervical_listing_level,
              cervical_series, clinical_notes, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          ).bind(
            a.id,
            a.patient_id,
            a.evaluation_date,
            a.dni || null,
            a.age || null,
            a.birth_date || null,
            a.weight_kg || null,
            a.height_cm || null,
            a.address || null,
            a.occupation || null,
            a.main_complaint || null,
            a.pain_duration_hours || null,
            a.pain_level || null,
            a.general_health || null,
            a.sleep_hours || null,
            a.pregnancy_status || null,
            a.medications || null,
            a.spine_inclination || null,
            a.spine_rotation || null,
            a.spine_extension || null,
            a.iliac || null,
            a.gait_tiptoes || null,
            a.gait_heels || null,
            a.prone_position || null,
            a.leg_length || null,
            a.sacroiliac_pain || null,
            a.cervical_syndrome || null,
            a.dynamic_palpation || null,
            a.stronger_leg || null,
            a.static_palpation || null,
            a.muscle_tension || null,
            a.lumbar_scan || null,
            a.lumbar_hypomobility || null,
            a.lumbar_yes_no || null,
            a.thoracic_scan || null,
            a.thoracic_hypomobility || null,
            a.thoracic_listing_level || null,
            a.cervical_c2_c7_rotation || null,
            a.cervical_listing_level || null,
            a.cervical_series || null,
            a.clinical_notes || null,
            a.created_at || new Date().toISOString(),
          ),
        );
      }
    }

    if (Array.isArray(data.packages)) {
      for (const pkg of data.packages) {
        stmts.push(
          env.DB.prepare(
            `INSERT OR REPLACE INTO session_packages
             (id, patient_id, total_sessions, used_sessions, sessions_per_week, start_date, total_amount_cents, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          ).bind(
            pkg.id,
            pkg.patient_id,
            pkg.total_sessions,
            pkg.used_sessions,
            pkg.sessions_per_week,
            pkg.start_date || null,
            pkg.total_amount_cents || 0,
            pkg.created_at || new Date().toISOString(),
          ),
        );
      }
    }

    if (Array.isArray(data.appointments)) {
      for (const apt of data.appointments) {
        stmts.push(
          env.DB.prepare(
            `INSERT OR REPLACE INTO appointments
             (id, patient_id, appointment_date, start_time, duration_minutes, status, reason, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          ).bind(
            apt.id,
            apt.patient_id,
            apt.appointment_date,
            apt.start_time,
            apt.duration_minutes,
            apt.status,
            apt.reason || null,
            apt.created_at || new Date().toISOString(),
          ),
        );
      }
    }

    if (Array.isArray(data.payments)) {
      for (const pm of data.payments) {
        stmts.push(
          env.DB.prepare(
            `INSERT OR REPLACE INTO payments
             (id, patient_id, amount_cents, method, notes, paid_at)
             VALUES (?, ?, ?, ?, ?, ?)`,
          ).bind(
            pm.id,
            pm.patient_id,
            pm.amount_cents,
            pm.method || null,
            pm.notes || null,
            pm.paid_at || new Date().toISOString(),
          ),
        );
      }
    }

    if (stmts.length > 0) {
      for (let i = 0; i < stmts.length; i += 50) {
        await env.DB.batch(stmts.slice(i, i + 50));
      }
    }

    return NextResponse.json({
      success: true,
      importedCount: (data.patients || []).length,
    });
  } catch (error) {
    console.error('sync.import.failed', error);
    return NextResponse.json({ error: 'Error al importar datos.' }, { status: 500 });
  }
}
