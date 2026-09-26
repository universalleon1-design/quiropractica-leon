export const CLINIC_TIME_ZONE = 'America/Lima';
export const PATIENT_QR_PREFIX = 'QLU-PACIENTE:';

export function todayInLima() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: CLINIC_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

export function normalizeSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function hashPin(pin: string) {
  const bytes = new TextEncoder().encode(pin);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
}

export function formatClinicTime(time: string) {
  const [hours, minutes] = time.split(':').map(Number);
  const suffix = hours >= 12 ? 'p. m.' : 'a. m.';
  const hour = hours % 12 || 12;
  return `${hour}:${String(minutes).padStart(2, '0')} ${suffix}`;
}

export function makeId(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`;
}

export function generatePin() {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  return String(100000 + (values[0] % 900000));
}

export function generatePatientQrToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

export function makePatientQrValue(token: string) {
  return `${PATIENT_QR_PREFIX}${token}`;
}

export function readPatientQrToken(value: string): string | null {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim();

  // 1. Direct QLU prefix: QLU-PACIENTE:<token>
  if (trimmed.startsWith(PATIENT_QR_PREFIX)) {
    const token = trimmed.slice(PATIENT_QR_PREFIX.length).trim();
    if (/^[A-Za-z0-9_-]{20,128}$/.test(token)) return token;
  }

  // 2. From URL parameter: ?token=... or ?qr=... or ?scan=...
  if (trimmed.includes('://') || trimmed.startsWith('/') || trimmed.includes('?')) {
    try {
      const url = new URL(trimmed, 'http://localhost');
      const param = url.searchParams.get('token') || url.searchParams.get('qr') || url.searchParams.get('scan');
      if (param) {
        return readPatientQrToken(param);
      }
    } catch {}
  }

  // 3. Embedded QLU-PACIENTE inside string/URL
  const qluMatch = trimmed.match(/QLU-PACIENTE:([A-Za-z0-9_-]{20,128})/);
  if (qluMatch) {
    return qluMatch[1];
  }

  // 4. Raw token (standard base64url or alphanumeric token)
  if (/^[A-Za-z0-9_-]{24,128}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

export function timeInLima() {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: CLINIC_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date());
}
