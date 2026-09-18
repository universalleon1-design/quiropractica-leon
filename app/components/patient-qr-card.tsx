'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import QRCode from 'qrcode';
import { Download, LoaderCircle, QrCode } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export async function buildPatientCard(name: string, qrValue: string) {
  const qrDataUrl = await QRCode.toDataURL(qrValue, {
    width: 430,
    margin: 2,
    errorCorrectionLevel: 'H',
    color: { dark: '#071b2e', light: '#ffffff' },
  });
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 680;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('No se pudo crear la tarjeta.');

  // Modern background gradient
  const gradient = context.createLinearGradient(0, 0, 1080, 680);
  gradient.addColorStop(0, '#0a233a');
  gradient.addColorStop(1, '#061320');
  context.fillStyle = gradient;
  context.beginPath();
  context.roundRect(0, 0, 1080, 680, 48);
  context.fill();

  // Cyan vertical accent bar on the left
  context.fillStyle = '#06b6d4';
  context.beginPath();
  context.roundRect(0, 0, 24, 680, [48, 0, 0, 48]);
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
  qrImage.src = qrDataUrl;
  await new Promise<void>((resolve, reject) => {
    qrImage.onload = () => resolve();
    qrImage.onerror = () => reject(new Error('No se pudo cargar el QR.'));
  });

  context.fillStyle = '#ffffff';
  context.beginPath();
  context.roundRect(660, 85, 345, 510, 32);
  context.fill();

  // Draw QR code centered in the white container
  context.drawImage(qrImage, 695, 115, 275, 275);

  return canvas.toDataURL('image/png');
}

export function PatientQrCard({ name, qrValue }: { name: string; qrValue: string }) {
  const [cardUrl, setCardUrl] = useState('');
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    let active = true;
    void buildPatientCard(name, qrValue).then((url) => {
      if (active) setCardUrl(url);
    });
    return () => { active = false; };
  }, [name, qrValue]);

  const fileName = `tarjeta-qr-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`;

  async function share() {
    if (!cardUrl) return;
    setSharing(true);
    try {
      const blob = await (await fetch(cardUrl)).blob();
      const file = new File([blob], fileName, { type: 'image/png' });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `Tarjeta QR de ${name}`,
          text: 'Tarjeta de paciente de Quiropráctica León Universal.',
          files: [file],
        });
      } else {
        const link = document.createElement('a');
        link.href = cardUrl;
        link.download = fileName;
        link.click();
      }
    } finally {
      setSharing(false);
    }
  }

  return (
    <div className="mt-5 w-full">
      <div className="mx-auto max-w-lg overflow-hidden rounded-2xl shadow-xl ring-1 ring-slate-900/10">
        {cardUrl ? (
          <Image
            unoptimized
            src={cardUrl}
            width={1080}
            height={680}
            alt={`Tarjeta QR de ${name}`}
            className="block h-auto w-full object-contain"
          />
        ) : (
          <div className="grid aspect-[1080/680] place-items-center bg-slate-900 text-white">
            <LoaderCircle className="size-8 animate-spin" />
          </div>
        )}
      </div>
      <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto">
        <Button
          onClick={() => void share()}
          disabled={!cardUrl || sharing}
          className="h-11 w-full sm:w-auto flex-1 rounded-xl font-bold bg-cyan-700 hover:bg-cyan-800 text-white shadow-sm"
        >
          {sharing ? <LoaderCircle className="size-4 animate-spin mr-2" /> : <QrCode className="size-4 mr-2" />} Enviar o compartir
        </Button>
        {cardUrl && (
          <a
            href={cardUrl}
            download={fileName}
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'h-11 w-full sm:w-auto flex-1 rounded-xl px-5 font-bold border-slate-200 hover:bg-slate-50',
            )}
          >
            <Download className="size-4 mr-2" /> Descargar imagen
          </a>
        )}
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Puedes enviarla por WhatsApp o imprimirla. El QR no muestra datos médicos.
      </p>
    </div>
  );
}