import { env } from 'cloudflare:workers';
import { NextResponse } from 'next/server';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { formatClinicTime, makePatientQrValue, todayInLima } from '@/lib/clinic';
import { ensureDbInitialized } from '@/db';

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  await ensureDbInitialized();

  try {
    const [scheduleResult, patientsResult, statsTotalResult] = await Promise.all([
      env.DB.prepare(
        `SELECT a.id, a.patient_id AS patientId, a.start_time AS time,
                p.first_name || ' ' || p.last_name AS name,
                a.status,
                COALESCE(sp.used_sessions, 0) AS used,
                COALESCE(sp.total_sessions, 0) AS total
         FROM appointments a
         JOIN patients p ON p.id = a.patient_id
         LEFT JOIN session_packages sp ON sp.patient_id = p.id
         WHERE a.appointment_date = ?
         ORDER BY a.start_time ASC`,
      )
        .bind(todayInLima())
        .all<{ id: string; patientId: string; time: string; name: string; status: string; used: number; total: number }>(),
      env.DB.prepare(
        `SELECT p.id, p.first_name || ' ' || p.last_name AS name, p.phone,
                p.qr_token AS qrToken,
                COALESCE(sp.used_sessions, 0) AS used,
                COALESCE(sp.total_sessions, 0) AS total
         FROM patients p
         LEFT JOIN session_packages sp ON sp.patient_id = p.id
         ORDER BY p.created_at DESC
         LIMIT 200`,
      ).all<{ id: string; name: string; phone: string | null; used: number; total: number; qrToken: string | null }>(),
      env.DB.prepare('SELECT COUNT(*) as count FROM patients').first<{ count: number }>(),
    ]);

    const schedule = (scheduleResult?.results ?? []).map((item) => ({
      ...item,
      time: formatClinicTime(item.time),
    }));

    const patients = (patientsResult?.results ?? []).map((patient) => ({
      ...patient,
      qrValue: patient.qrToken ? makePatientQrValue(patient.qrToken) : null,
      qrToken: undefined,
    }));

    return NextResponse.json({
      schedule,
      patients,
      stats: {
        today: schedule.length,
        checkedIn: schedule.filter((item) => item.status === 'checked_in').length,
        completed: schedule.filter((item) => item.status === 'completed').length,
        patients: statsTotalResult?.count ?? patients.length,
      },
    });
  } catch (error) {
    console.error('dashboard.read.failed', error);
    return NextResponse.json({
      schedule: [],
      patients: [],
      stats: { today: 0, checkedIn: 0, completed: 0, patients: 0 },
    });
  }
}
