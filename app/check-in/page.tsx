'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check, Clock3, AlertCircle, LoaderCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type CheckInResult = {
  success: boolean;
  name: string;
  appointmentTime: string;
  used: number;
  total: number;
  alreadyRegistered: boolean;
  walkIn: boolean;
  error?: string;
};

function CheckInContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || searchParams.get('qr') || searchParams.get('scan') || '';

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<CheckInResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError('No se proporcionó ningún código de pase.');
      return;
    }

    let active = true;

    async function processCheckIn() {
      try {
        const response = await fetch('/api/check-in', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'No se pudo registrar la llegada.');
        }
        if (active) {
          setResult(data);
          setLoading(false);
        }
      } catch (err) {
        if (active) {
          setError((err as Error).message || 'Error de conexión.');
          setLoading(false);
        }
      }
    }

    void processCheckIn();

    return () => {
      active = false;
    };
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 selection:bg-cyan-500 selection:text-white">
      {/* Header Branding */}
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-widest mb-3">
          <Sparkles className="size-3.5" /> Quiropráctica León Universal
        </span>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          Control de Asistencia
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Registro automático de llegada por escaneo de QR
        </p>
      </div>

      <Card className="w-full max-w-md rounded-3xl border-0 bg-slate-900 shadow-2xl text-white overflow-hidden ring-1 ring-white/10">
        <CardContent className="p-6 sm:p-8 text-center">
          {loading ? (
            <div className="py-12 space-y-4">
              <LoaderCircle className="size-12 animate-spin text-cyan-400 mx-auto" />
              <p className="font-extrabold text-base text-cyan-200">
                Registrando tu llegada...
              </p>
              <p className="text-xs text-slate-400">
                Verificando tu expediente y paquete de sesiones.
              </p>
            </div>
          ) : result ? (
            <div className="space-y-6">
              <span
                className={`mx-auto grid size-20 place-items-center rounded-2xl shadow-lg ${
                  result.alreadyRegistered
                    ? 'bg-amber-400 text-amber-950 shadow-amber-500/20'
                    : 'bg-emerald-400 text-emerald-950 shadow-emerald-500/20'
                }`}
              >
                {result.alreadyRegistered ? (
                  <Clock3 className="size-10 stroke-[2.5]" />
                ) : (
                  <Check className="size-10 stroke-[3]" />
                )}
              </span>

              <div>
                <span
                  className={`inline-block text-xs font-black uppercase tracking-wider px-3 py-0.5 rounded-full ${
                    result.alreadyRegistered
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                      : 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                  }`}
                >
                  {result.alreadyRegistered
                    ? 'Asistencia Ya Registrada Hoy'
                    : '¡Llegada Registrada con Éxito!'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black mt-2 text-white capitalize">
                  {result.name}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Hora de Llegada
                  </span>
                  <strong className="text-lg font-black text-cyan-300 mt-0.5 block">
                    {result.appointmentTime}
                  </strong>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Plan de Sesiones
                  </span>
                  <strong className="text-lg font-black text-emerald-300 mt-0.5 block">
                    {result.used} de {result.total}
                  </strong>
                </div>
              </div>

              <div className="rounded-2xl bg-cyan-500/10 border border-cyan-500/20 p-4 text-xs text-cyan-200">
                {result.alreadyRegistered
                  ? 'Tu asistencia ya fue contabilizada para el día de hoy. Puedes esperar cómodamente.'
                  : 'Tu llegada ha sido notificada al especialista. Por favor toma asiento en la sala de espera.'}
              </div>

              <Button
                onClick={() => window.location.href = '/'}
                className="w-full h-11 rounded-xl bg-white text-slate-950 hover:bg-slate-100 font-black text-sm"
              >
                Cerrar
              </Button>
            </div>
          ) : (
            <div className="py-8 space-y-5">
              <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <AlertCircle className="size-8" />
              </span>

              <div>
                <h2 className="text-lg font-black text-white">
                  No se pudo registrar
                </h2>
                <p className="text-xs text-rose-300 mt-1 max-w-xs mx-auto">
                  {error || 'Código de pase inválido o no reconocido.'}
                </p>
              </div>

              <Button
                onClick={() => window.location.href = '/'}
                className="w-full h-11 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm"
              >
                Ir a Inicio
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <p className="mt-6 text-[11px] text-slate-500 text-center">
        Quiropráctica León Universal • Especialistas en Columna y Bienestar
      </p>
    </div>
  );
}

export default function CheckInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 grid place-items-center text-white">
          <LoaderCircle className="size-10 animate-spin text-cyan-400" />
        </div>
      }
    >
      <CheckInContent />
    </Suspense>
  );
}
