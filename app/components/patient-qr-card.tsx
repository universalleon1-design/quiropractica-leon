'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import QRCode from 'qrcode';
import { Download, LoaderCircle, QrCode, Sparkles } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function getScannableUrl(qrValue: string): string {
  if (!qrValue) return '';
  if (typeof window !== 'undefined' && window.location?.origin) {
    const token = qrValue.startsWith('QLU-PACIENTE:')
      ? qrValue.slice('QLU-PACIENTE:'.length)
      : qrValue;
    return `${window.location.origin}/check-in?token=${encodeURIComponent(token)}`;
  }
  return qrValue;
}

export async function buildPatientCard(name: string, qrValue: string): Promise<string> {
  if (!qrValue) throw new Error('Valor de QR vacío');
  const scannableValue = getScannableUrl(qrValue);

  const qrDataUrl = await QRCode.toDataURL(scannableValue, {
    width: 430,
    margin: 2,
    errorCorrectionLevel: 'H',
    color: { dark: '#071b2e', light: '#ffffff' },
  });

  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 680;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('No se pudo crear el lienzo 2D.');

  // Modern background gradient
  const gradient = context.createLinearGradient(0, 0, 1080, 680);
  gradient.addColorStop(0, '#0a233a');
  gradient.addColorStop(1, '#061320');
  context.fillStyle = gradient;
  context.beginPath();
  if (typeof context.roundRect === 'function') {
    context.roundRect(0, 0, 1080, 680, 48);
  } else {
    context.rect(0, 0, 1080, 680);
  }
  context.fill();

  // Cyan vertical accent bar on the left
  context.fillStyle = '#06b6d4';
  context.beginPath();
  if (typeof context.roundRect === 'function') {
    context.roundRect(0, 0, 24, 680, [48, 0, 0, 48]);
  } else {
    context.rect(0, 0, 24, 680);
  }
  context.fill();

  // Decorative subtle circle watermark in background
  context.save();
  context.strokeStyle = 'rgba(6, 182, 212, 0.08)';
  context.lineWidth = 140;
  context.beginPath();
  context.arc(950, 550, 260, 0, Math.PI * 2);
  context.stroke();
  context.restore();

  // Branding
  context.fillStyle = '#22d3ee';
  context.font = '700 28px system-ui, -apple-system, sans-serif';
  context.fillText('QUIROPRÁCTICA', 75, 120);

  context.fillStyle = '#ffffff';
  context.font = '900 48px system-ui, -apple-system, sans-serif';
  context.fillText('LEÓN UNIVERSAL', 75, 178);

  // Patient info section
  context.fillStyle = '#94a3b8';
  context.font = '700 22px system-ui, -apple-system, sans-serif';
  context.fillText('PACIENTE', 75, 305);

  context.fillStyle = '#ffffff';
  context.font = '800 42px system-ui, -apple-system, sans-serif';
  const shortName = name.length > 25 ? `${name.slice(0, 24)}…` : name;
  context.fillText(shortName, 75, 362);

  context.fillStyle = '#94a3b8';
  context.font = '400 23px system-ui, -apple-system, sans-serif';
  context.fillText('Presenta esta tarjeta al llegar a consulta.', 75, 450);
  context.fillText('Acceso rápido y seguro a tu expediente.', 75, 488);

  // QR Container (clean rounded white card)
  const qrImage = document.createElement('img');
  await new Promise<void>((resolve, reject) => {
    qrImage.onload = () => resolve();
    qrImage.onerror = () => reject(new Error('No se pudo cargar el QR.'));
    qrImage.src = qrDataUrl;
    if (qrImage.complete) {
      resolve();
    }
  });

  context.fillStyle = '#ffffff';
  context.beginPath();
  if (typeof context.roundRect === 'function') {
    context.roundRect(660, 85, 345, 510, 32);
  } else {
    context.rect(660, 85, 345, 510);
  }
  context.fill();

  // Draw QR code centered in the white container
  context.drawImage(qrImage, 695, 115, 275, 275);

  // Label under QR
  context.fillStyle = '#0f172a';
  context.font = '800 20px system-ui, -apple-system, sans-serif';
  context.textAlign = 'center';
  context.fillText('Pase Clínico Personal', 660 + 345 / 2, 440);

  context.fillStyle = '#64748b';
  context.font = '500 16px system-ui, -apple-system, sans-serif';
  context.fillText('Escanear al ingresar', 660 + 345 / 2, 475);
  context.textAlign = 'left';

  return canvas.toDataURL('image/png');
}

export function PatientQrCard({ name, qrValue }: { name: string; qrValue: string }) {
  const [cardUrl, setCardUrl] = useState('');
  const [directQrUrl, setDirectQrUrl] = useState('');
  const [sharing, setSharing] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'qr'>('card');

  useEffect(() => {
    let active = true;
    const scannableValue = getScannableUrl(qrValue);

    // 1. Inmediatamente generar el QR directo para visualización instantánea (0ms de espera)
    void QRCode.toDataURL(scannableValue, {
      width: 320,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: { dark: '#071b2e', light: '#ffffff' },
    })
      .then((url) => {
        if (active) setDirectQrUrl(url);
      })
      .catch((err) => console.error('Error generando QR directo:', err));

    // 2. Generar la tarjeta gráfica de presentación completa
    void buildPatientCard(name, qrValue)
      .then((url) => {
        if (active) setCardUrl(url);
      })
      .catch((err) => {
        console.error('Error generando tarjeta gráfica:', err);
        // Si la tarjeta gráfica falla por canvas en algún navegador, usamos el QR directo
        if (active) setViewMode('qr');
      });

    return () => {
      active = false;
    };
  }, [name, qrValue]);

  const fileName = `tarjeta-qr-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`;
  const currentImageUrl = viewMode === 'card' && cardUrl ? cardUrl : directQrUrl;

  async function share() {
    if (!currentImageUrl) return;
    setSharing(true);
    try {
      const blob = await (await fetch(currentImageUrl)).blob();
      const file = new File([blob], fileName, { type: 'image/png' });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `Tarjeta QR de ${name}`,
          text: 'Tarjeta de paciente de Quiropráctica León Universal.',
          files: [file],
        });
      } else {
        const link = document.createElement('a');
        link.href = currentImageUrl;
        link.download = fileName;
        link.click();
      }
    } finally {
      setSharing(false);
    }
  }

  return (
    <div className="mt-4 w-full">
      {/* Selector de vista: Tarjeta Completa o QR Directo */}
      <div className="flex items-center justify-center gap-2 mb-3">
        <button
          type="button"
          onClick={() => setViewMode('card')}
          className={cn(
            'px-3 py-1.5 rounded-lg text-xs font-bold transition border',
            viewMode === 'card'
              ? 'bg-cyan-700 text-white border-cyan-700 shadow-xs'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200',
          )}
        >
          <Sparkles className="inline-block size-3.5 mr-1" />
          Tarjeta Digital
        </button>
        <button
          type="button"
          onClick={() => setViewMode('qr')}
          className={cn(
            'px-3 py-1.5 rounded-lg text-xs font-bold transition border',
            viewMode === 'qr'
              ? 'bg-cyan-700 text-white border-cyan-700 shadow-xs'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200',
          )}
        >
          <QrCode className="inline-block size-3.5 mr-1" />
          QR Directo
        </button>
      </div>

      <div className="mx-auto max-w-md overflow-hidden rounded-2xl shadow-lg ring-1 ring-slate-900/10 bg-white">
        {viewMode === 'card' ? (
          cardUrl ? (
            <Image
              unoptimized
              src={cardUrl}
              width={1080}
              height={680}
              alt={`Tarjeta QR de ${name}`}
              className="block h-auto w-full object-contain"
            />
          ) : directQrUrl ? (
            <div className="p-6 text-center bg-slate-900 text-white space-y-3">
              <p className="text-sm font-black text-cyan-300">Generando diseño de tarjeta...</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={directQrUrl}
                alt="Código QR del paciente"
                className="size-48 mx-auto rounded-xl bg-white p-2 shadow-md"
              />
              <p className="text-xs text-slate-300 font-bold">{name}</p>
            </div>
          ) : (
            <div className="grid aspect-[1080/680] place-items-center bg-slate-900 text-white">
              <LoaderCircle className="size-8 animate-spin" />
            </div>
          )
        ) : directQrUrl ? (
          <div className="p-6 text-center space-y-3 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={directQrUrl}
              alt="Código QR del paciente"
              className="size-56 mx-auto rounded-2xl border-2 border-cyan-200 p-2 shadow-sm"
            />
            <div>
              <p className="font-extrabold text-base text-slate-900">{name}</p>
              <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                Pase Quiropráctico Personal
              </p>
            </div>
          </div>
        ) : (
          <div className="grid aspect-square place-items-center bg-slate-50 text-slate-400">
            <LoaderCircle className="size-8 animate-spin" />
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-md mx-auto">
        <Button
          onClick={() => void share()}
          disabled={!currentImageUrl || sharing}
          className="h-10 w-full sm:w-auto flex-1 rounded-xl text-sm font-bold bg-cyan-700 hover:bg-cyan-800 text-white shadow-xs"
        >
          {sharing ? (
            <LoaderCircle className="size-4 animate-spin mr-2" />
          ) : (
            <QrCode className="size-4 mr-2" />
          )}{' '}
          Enviar o compartir
        </Button>
        {currentImageUrl && (
          <a
            href={currentImageUrl}
            download={fileName}
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'h-10 w-full sm:w-auto flex-1 rounded-xl px-4 text-sm font-bold border-slate-200 hover:bg-slate-50 text-slate-800',
            )}
          >
            <Download className="size-4 mr-2" /> Descargar imagen
          </a>
        )}
      </div>
      <p className="mt-2.5 text-center text-[11px] text-muted-foreground">
        Compatible con la cámara de cualquier celular (iPhone / Android) y con el lector de recepción. Puedes enviarlo por WhatsApp o imprimirlo.
      </p>
    </div>
  );
}