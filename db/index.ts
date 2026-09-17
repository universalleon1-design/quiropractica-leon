import { env } from 'cloudflare:workers';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

let initDone = false;

export async function ensureDbInitialized(db = env.DB) {
  if (initDone || !db) return;
  try {
    await db.batch([
      db.prepare(`CREATE TABLE IF NOT EXISTS patients (
        id text PRIMARY KEY NOT NULL,
        first_name text NOT NULL,
        last_name text NOT NULL,
        search_name text NOT NULL,
        birth_date text,
        sex text,
        phone text,
        email text,
        pin_hash text NOT NULL,
        qr_token text,
        qr_issued_at text,
        created_at text NOT NULL
      )`),
      db.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS idx_patients_qr_token ON patients (qr_token)`),
      db.prepare(`CREATE INDEX IF NOT EXISTS idx_patients_search_name ON patients (search_name)`),
      db.prepare(`CREATE TABLE IF NOT EXISTS appointments (
        id text PRIMARY KEY NOT NULL,
        patient_id text NOT NULL,
        appointment_date text NOT NULL,
        start_time text NOT NULL,
        duration_minutes integer DEFAULT 45 NOT NULL,
        status text DEFAULT 'scheduled' NOT NULL,
        reason text,
        created_at text NOT NULL
      )`),
      db.prepare(`CREATE TABLE IF NOT EXISTS check_ins (
        id text PRIMARY KEY NOT NULL,
        appointment_id text NOT NULL,
        patient_id text NOT NULL,
        location_code text NOT NULL,
        checked_in_at text NOT NULL
      )`),
      db.prepare(`CREATE TABLE IF NOT EXISTS session_packages (
        id text PRIMARY KEY NOT NULL,
        patient_id text NOT NULL,
        total_sessions integer NOT NULL,
        used_sessions integer DEFAULT 0 NOT NULL,
        sessions_per_week integer NOT NULL DEFAULT 1,
        start_date text,
        total_amount_cents integer NOT NULL DEFAULT 0,
        created_at text NOT NULL
      )`),
      db.prepare(`CREATE TABLE IF NOT EXISTS clinical_visits (
        id text PRIMARY KEY NOT NULL,
        appointment_id text,
        patient_id text NOT NULL,
        weight_kg integer,
        height_cm integer,
        pain_level integer,
        notes text,
        completed_at text,
        created_at text NOT NULL
      )`),
      db.prepare(`CREATE TABLE IF NOT EXISTS supplements (
        id text PRIMARY KEY NOT NULL,
        patient_id text NOT NULL,
        name text NOT NULL,
        instructions text,
        quantity text,
        lot_number text,
        expires_at text,
        recorded_at text NOT NULL
      )`),
      db.prepare(`CREATE TABLE IF NOT EXISTS media_files (
        id text PRIMARY KEY NOT NULL,
        patient_id text NOT NULL,
        visit_id text,
        object_key text NOT NULL,
        file_name text NOT NULL,
        content_type text NOT NULL,
        category text NOT NULL,
        created_at text NOT NULL
      )`),
      db.prepare(`CREATE TABLE IF NOT EXISTS audit_logs (
        id text PRIMARY KEY NOT NULL,
        actor_id text NOT NULL,
        action text NOT NULL,
        entity_type text NOT NULL,
        entity_id text NOT NULL,
        created_at text NOT NULL
      )`),
      db.prepare(`CREATE TABLE IF NOT EXISTS patient_assessments (
        id text PRIMARY KEY NOT NULL,
        patient_id text NOT NULL,
        reason text,
        conditions text,
        body_analysis text,
        weight_kg real,
        height_cm real,
        bmi real,
        healthy_weight_min_kg real,
        healthy_weight_max_kg real,
        target_weight_kg real,
        diet_plan text,
        notes text,
        assessed_at text NOT NULL
      )`),
      db.prepare(`CREATE TABLE IF NOT EXISTS payments (
        id text PRIMARY KEY NOT NULL,
        patient_id text NOT NULL,
        amount_cents integer NOT NULL,
        method text,
        notes text,
        paid_at text NOT NULL
      )`)
    ]);
    initDone = true;
  } catch (err) {
    console.warn('ensureDbInitialized error:', err);
  }
}

export function getDb() {
  if (!env.DB) {
    throw new Error(
      'Cloudflare D1 binding `DB` is unavailable. Set the `d1` field in .openai/hosting.json to `DB` or let your control plane inject the real binding values before using the database.',
    );
  }

  return drizzle(env.DB, { schema });
}
