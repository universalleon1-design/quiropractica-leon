'use client';

import { useState, useRef } from 'react';
import {
  Banknote,
  Check,
  CreditCard,
  FileText,
  Info,
  LoaderCircle,
  Moon,
  Plus,
  Scale,
  UserPlus,
  Users,
  WalletCards,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { PatientQrCard } from '@/app/components/patient-qr-card';

type Patient = {
  id: string;
  name: string;
  phone: string | null;
  used: number;
  total: number;
  qrValue?: string | null;
};

type PatientQrResult = {
  firstName: string;
  lastName: string;
  qrValue: string;
  patient: Patient;
};

export function NewPatientPageView({
  onSaved,
  onFinished,
  onViewPatients,
}: {
  onSaved: () => void;
  onFinished: (patient: Patient) => void;
  onViewPatients?: () => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<PatientQrResult | null>(null);

  const formTopRef = useRef<HTMLDivElement>(null);

  // Anamnesis y Evaluación
  const [evaluationDate, setEvaluationDate] = useState(today);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dni, setDni] = useState('');
  const [age, setAge] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [phone, setPhone] = useState('');
  const [occupation, setOccupation] = useState('');
  const [sex, setSex] = useState('female');
  const [painDurationHours, setPainDurationHours] = useState('');
  const [painLevel, setPainLevel] = useState<number>(5);
  const [generalHealth, setGeneralHealth] = useState('Bueno');
  const [sleepHours, setSleepHours] = useState('7 horas');
  const [isPregnant, setIsPregnant] = useState<'No' | 'Sí'>('No');
  const [pregnancyTime, setPregnancyTime] = useState('');
  const [medications, setMedications] = useState('');

  // Diagnóstico final y comentarios clínicos
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [totalSessions, setTotalSessions] = useState('10');
  const [sessionsPerWeek, setSessionsPerWeek] = useState('2');
  const [startToday, setStartToday] = useState<'SI' | 'NO'>('SI');
  const [appointmentDate, setAppointmentDate] = useState(today);
  const [appointmentTime, setAppointmentTime] = useState('09:00');
  const [totalAmount, setTotalAmount] = useState('800');
  const [initialPayment, setInitialPayment] = useState('200');
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [paymentNotes, setPaymentNotes] = useState('');

  const [showBmiHelp, setShowBmiHelp] = useState(false);

  const weight = Number(weightKg);
  const height = Number(heightCm);
  const patientAgeNum = Number(age) || 0;
  const isSenior = patientAgeNum >= 65;
  const isYouth = patientAgeNum > 0 && patientAgeNum < 18;

  // Criterios de IMC según la OMS y Geriatría clínica
  const minBmi = isSenior ? 23.0 : isYouth ? 17.0 : 18.5;
  const maxBmi = isSenior ? 28.0 : isYouth ? 23.0 : 24.9;

  const heightM = height > 0 ? height / 100 : null;
  const liveBmi = weight > 0 && heightM ? weight / (heightM * heightM) : null;

  const healthyMinKg = heightM ? Number((minBmi * heightM * heightM).toFixed(1)) : null;
  const healthyMaxKg = heightM ? Number((maxBmi * heightM * heightM).toFixed(1)) : null;

  const weightDiff =
    weight > 0 && healthyMaxKg && healthyMinKg
      ? weight > healthyMaxKg
        ? Number((weight - healthyMaxKg).toFixed(1))
        : weight < healthyMinKg
        ? Number((healthyMinKg - weight).toFixed(1))
        : 0
      : null;

  const bmiCategory = !liveBmi
    ? null
    : liveBmi < minBmi
    ? { label: 'Bajo peso', color: 'text-amber-700 bg-amber-50 border-amber-300' }
    : liveBmi <= maxBmi
    ? { label: 'Peso saludable', color: 'text-emerald-700 bg-emerald-50 border-emerald-300' }
    : liveBmi < (isSenior ? 32 : 30)
    ? { label: 'Sobrepeso', color: 'text-amber-800 bg-amber-100 border-amber-300' }
    : { label: 'Obesidad', color: 'text-red-700 bg-red-50 border-red-300' };

  const [showSleepHelp, setShowSleepHelp] = useState(false);

  // Evaluación de horas de sueño según la OMS y requerimientos biomecánicos de columna
  const parsedSleepHours = parseFloat(
    sleepHours.replace(',', '.').match(/\d+(\.\d+)?/)?.[0] ?? ''
  );
  const hasSleepNumber = !isNaN(parsedSleepHours) && parsedSleepHours > 0;
  const recommendedSleepMin = isSenior ? 7 : isYouth ? 8 : 7;
  const recommendedSleepMax = isSenior ? 8 : isYouth ? 10 : 9;
  const sleepDeficit =
    hasSleepNumber && parsedSleepHours < recommendedSleepMin
      ? Number((recommendedSleepMin - parsedSleepHours).toFixed(1))
      : 0;

  const totalAmountNum = parseFloat(totalAmount) || 0;
  const initialPaymentNum = parseFloat(initialPayment) || 0;
  const pendingBalanceNum = Math.max(0, totalAmountNum - initialPaymentNum);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setError('Por favor ingresa al menos los nombres y apellidos del paciente.');
      formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    setSaving(true);
    setError('');

    const payload = {
      evaluationDate,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      dni: dni.trim(),
      birthDate: null,
      age: age ? Number(age) : null,
      weightKg: weightKg ? Number(weightKg) : null,
      heightCm: heightCm ? Number(heightCm) : null,
      phone: phone.trim(),
      address: null,
      occupation: occupation.trim(),
      sex,
      mainComplaint: null,
      painDurationHours: painDurationHours.trim(),
      painLevel,
      generalHealth,
      sleepHours: sleepHours.trim(),
      pregnancyStatus: isPregnant === 'Sí' ? `Sí - ${pregnancyTime || 'en gestación'}` : 'No',
      medications: medications.trim(),
      spineInclination: null,
      spineRotation: null,
      spineExtension: null,
      iliac: null,
      gaitTiptoes: null,
      gaitHeels: null,
      pronePosition: null,
      legLength: null,
      sacroiliacPain: null,
      cervicalSyndrome: null,
      dynamicPalpation: null,
      strongerLeg: null,
      staticPalpation: null,
      muscleTension: null,
      lumbarScan: null,
      lumbarHypomobility: null,
      lumbarYesNo: null,
      thoracicScan: null,
      thoracicHypomobility: null,
      thoracicListingLevel: null,
      cervicalC2C7Rotation: null,
      cervicalListingLevel: null,
      cervicalSeries: null,
      clinicalNotes: clinicalNotes.trim(),
      totalSessions: Number(totalSessions) || 10,
      sessionsPerWeek: Number(sessionsPerWeek) || 2,
      startToday: startToday === 'SI',
      appointmentDate: startToday === 'SI' ? today : appointmentDate,
      appointmentTime,
      totalAmount: totalAmountNum,
      initialPayment: initialPaymentNum,
      paymentMethod,
      paymentNotes: paymentNotes.trim(),
    };

    try {
      const res = await fetch('/api/admin/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const body = (await res.json()) as {
        error?: string;
        patientId?: string;
        firstName?: string;
        lastName?: string;
        qrValue?: string;
        used?: number;
        total?: number;
      };

      setSaving(false);

      if (!res.ok || !body.patientId) {
        setError(body.error || 'No se pudo registrar al paciente.');
        return;
      }

      const newPatient: Patient = {
        id: body.patientId,
        name: `${body.firstName} ${body.lastName}`,
        phone: phone.trim() || null,
        used: body.used ?? (startToday === 'SI' ? 1 : 0),
        total: body.total ?? (Number(totalSessions) || 10),
        qrValue: body.qrValue || null,
      };

      setResult({
        firstName: body.firstName || firstName,
        lastName: body.lastName || lastName,
        qrValue: body.qrValue || '',
        patient: newPatient,
      });

      onSaved();
    } catch {
      setSaving(false);
      setError('Error de conexión al guardar el paciente.');
    }
  }

  function resetForm() {
    setResult(null);
    setError('');
    setFirstName('');
    setLastName('');
    setDni('');
    setAge('');
    setWeightKg('');
    setHeightCm('');
    setPhone('');
    setOccupation('');
    setPainDurationHours('');
    setPainLevel(5);
    setGeneralHealth('Bueno');
    setSleepHours('7 horas');
    setIsPregnant('No');
    setPregnancyTime('');
    setMedications('');
    setClinicalNotes('');
    setStartToday('SI');
    setTotalSessions('10');
  }

  if (result) {
    return (
      <div className="space-y-6">
        <Card className="mx-auto max-w-2xl rounded-3xl border-0 bg-white p-6 shadow-sm sm:p-9 text-center">
          <span className="mx-auto grid size-20 place-items-center rounded-full bg-emerald-100 text-emerald-700 shadow-sm">
            <Check className="size-10 stroke-[2.5]" />
          </span>
          <h2 className="mt-4 text-3xl font-black text-slate-900">
            ¡Paciente y Tarjeta Registrados!
          </h2>
          <p className="mt-2 text-base text-slate-600">
            Se ha creado la Ficha Clínica completa para{' '}
            <strong className="text-slate-900">
              {result.firstName} {result.lastName}
            </strong>
            .
          </p>

          <PatientQrCard
            name={`${result.firstName} ${result.lastName}`}
            qrValue={result.qrValue}
          />

          {/* Tarjeta de Resumen Clínico Rápido */}
          <div className="mt-6 text-left rounded-2xl bg-cyan-50/40 border border-cyan-100 p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-cyan-100 pb-2">
              <span className="text-xs font-black uppercase tracking-wider text-cyan-900 flex items-center gap-1.5">
                <FileText className="size-4 text-cyan-700" />
                Resumen Clínico Registrado
              </span>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Guardado en Sistema
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-500 font-medium block">DNI</span>
                <strong className="text-slate-900 font-bold">{dni || 'No registrado'}</strong>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Teléfono</span>
                <strong className="text-slate-900 font-bold">{phone || 'No registrado'}</strong>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Plan y Sesiones</span>
                <strong className="text-slate-900 font-bold">{totalSessions || 10} sesiones ({sessionsPerWeek}x sem)</strong>
                <span className={cn(
                  'text-[11px] font-black block mt-0.5',
                  startToday === 'SI' ? 'text-emerald-700' : 'text-slate-600'
                )}>
                  {startToday === 'SI' ? `✓ 1ra sesión iniciada hoy (1 de ${totalSessions || 10})` : 'Inicio agendado'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-7 space-y-2.5 w-full max-w-lg mx-auto">
            <Button
              onClick={() => onFinished(result.patient)}
              className="h-12 w-full rounded-xl px-6 font-black bg-emerald-700 hover:bg-emerald-800 text-white shadow-md text-sm sm:text-base"
            >
              <FileText className="mr-2 size-5" /> Abrir expediente clínico completo
            </Button>
            <div className="flex flex-col sm:flex-row gap-2.5 w-full">
              {onViewPatients && (
                <Button
                  variant="outline"
                  onClick={onViewPatients}
                  className="h-11 flex-1 rounded-xl px-4 font-bold border-cyan-300 text-cyan-900 hover:bg-cyan-50 text-xs sm:text-sm"
                >
                  <Users className="mr-2 size-4 text-cyan-700" /> Ir a lista de Pacientes
                </Button>
              )}
              <Button
                variant="outline"
                onClick={resetForm}
                className="h-11 flex-1 rounded-xl px-4 font-bold border-slate-300 hover:bg-slate-50 text-slate-800 text-xs sm:text-sm"
              >
                <Plus className="mr-2 size-4" /> Registrar otro paciente
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div ref={formTopRef} className="space-y-4 scroll-mt-20">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Card className="rounded-2xl border-0 shadow-sm bg-white overflow-hidden">
          <CardHeader className="py-3.5 px-4 sm:px-6 border-b bg-slate-50/50">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="grid size-8 place-items-center rounded-xl bg-cyan-700 text-white text-xs font-black shadow-xs">
                  <UserPlus className="size-4.5" />
                </span>
                <div>
                  <CardTitle className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    Ficha de Registro y Consulta Clínica
                  </CardTitle>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    Datos del paciente, estado de salud, escaneos segmentarios, plan de tratamiento y pago.
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
            <CardContent className="p-4 sm:p-5 space-y-4">
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-cyan-900 mb-2.5">
                  Datos Generales del Paciente
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="evalDate">FECHA</Label>
                    <Input
                      id="evalDate"
                      type="date"
                      value={evaluationDate}
                      onChange={(e) => setEvaluationDate(e.target.value)}
                      className="h-10 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="firstName">NOMBRES *</Label>
                    <Input
                      id="firstName"
                      required
                      placeholder="Ej. Juan Alberto"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="h-10 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName">APELLIDOS *</Label>
                    <Input
                      id="lastName"
                      required
                      placeholder="Ej. Pérez Quispe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="h-10 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="dni">DNI / DOCUMENTO</Label>
                    <Input
                      id="dni"
                      placeholder="8 dígitos"
                      value={dni}
                      onChange={(e) => setDni(e.target.value)}
                      className="h-10 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="age">EDAD</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Años"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="h-10 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="sex">SEXO</Label>
                    <Select value={sex} onValueChange={(val) => setSex(val ?? 'female')}>
                      <SelectTrigger id="sex" className="h-10 rounded-xl">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="female">Femenino</SelectItem>
                        <SelectItem value="male">Masculino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">TELÉFONO (WhatsApp)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Ej. 987654321"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-10 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2 lg:col-span-2">
                    <Label htmlFor="occupation">PROFESIÓN / OCUPACIÓN</Label>
                    <Input
                      id="occupation"
                      placeholder="Ej. Contador, Chofer, etc."
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="h-10 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-1.5">
                    <Scale className="size-4 text-cyan-800" />
                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-800">
                      PESO Y TALLA (BIOMETRÍA)
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowBmiHelp((v) => !v)}
                    className="flex items-center gap-1 text-xs font-bold text-cyan-700 hover:text-cyan-900 underline-offset-2 hover:underline"
                  >
                    <Info className="size-3.5" />
                    {showBmiHelp ? 'Ocultar explicación' : '¿Qué es el IMC y rango tolerable?'}
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="weightKg" className="text-xs font-bold text-slate-700">
                      PESO (kg)
                    </Label>
                    <Input
                      id="weightKg"
                      type="number"
                      step="0.1"
                      placeholder="Ej. 60"
                      value={weightKg}
                      onChange={(e) => setWeightKg(e.target.value)}
                      className="h-10 rounded-xl bg-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="heightCm" className="text-xs font-bold text-slate-700">
                      TALLA (cm)
                    </Label>
                    <Input
                      id="heightCm"
                      type="number"
                      step="0.1"
                      placeholder="Ej. 160"
                      value={heightCm}
                      onChange={(e) => setHeightCm(e.target.value)}
                      className="h-10 rounded-xl bg-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700">
                      IMC CALCULADO
                    </Label>
                    <div className="flex h-10 items-center justify-between rounded-xl border bg-white px-3.5">
                      <span className="font-black text-slate-900 text-sm sm:text-base">
                        {liveBmi ? liveBmi.toFixed(1) : '—'}
                      </span>
                      {bmiCategory && (
                        <span
                          className={cn(
                            'rounded-md border px-2 py-0.5 text-xs font-extrabold',
                            bmiCategory.color
                          )}
                        >
                          {bmiCategory.label}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Rango de peso tolerable según estatura y edad */}
                {height > 0 && healthyMinKg && healthyMaxKg && (
                  <div className="rounded-xl border border-cyan-200 bg-white p-3 space-y-2">
                    <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 items-center">
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
                          Rango de peso tolerable para su talla
                        </span>
                        <p className="mt-0.5 text-base font-black text-cyan-950">
                          {healthyMinKg} kg – {healthyMaxKg} kg
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {isSenior
                            ? `Adulto mayor (${patientAgeNum} años: IMC 23.0 - 28.0)`
                            : isYouth
                            ? `Juvenil (${patientAgeNum} años)`
                            : `Para ${heightCm} cm de estatura (IMC OMS 18.5 - 24.9)`}
                        </p>
                      </div>

                      {weight > 0 && (
                        <div>
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
                            Estado actual vs rango
                          </span>
                          <p className="mt-0.5 font-bold text-xs sm:text-sm">
                            {weight >= healthyMinKg && weight <= healthyMaxKg ? (
                              <span className="text-emerald-700 flex items-center gap-1.5 font-extrabold">
                                <Check className="size-3.5" /> Peso óptimo / saludable
                              </span>
                            ) : weight > healthyMaxKg ? (
                              <span className="text-amber-700 font-extrabold">
                                +{weightDiff} kg sobre peso ideal
                              </span>
                            ) : (
                              <span className="text-amber-700 font-extrabold">
                                {weightDiff} kg bajo mínimo
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            Peso ingresado: {weight} kg
                          </p>
                        </div>
                      )}

                      <div className="rounded-lg bg-cyan-50/70 p-2.5 border border-cyan-100 text-xs text-slate-700 sm:col-span-2 lg:col-span-1 leading-snug">
                        <strong className="text-cyan-900 block mb-0.5 text-[11px]">Evaluación Quiropráctica:</strong>
                        {weight > healthyMaxKg ? (
                          <span>Sobrecarga mecánica en discos lumbares y pelvis.</span>
                        ) : weight < healthyMinKg && weight > 0 ? (
                          <span>Posible debilidad muscular en sostén vertebral.</span>
                        ) : (
                          <span>Carga equilibrada, óptima para ajuste vertebral.</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Explicación médica detallada colapsable */}
                {showBmiHelp && (
                  <div className="rounded-xl border border-slate-200 bg-slate-100/70 p-3 text-xs space-y-1.5 text-slate-700 leading-relaxed">
                    <p className="font-extrabold text-slate-900 text-xs sm:text-sm">
                      ¿Qué es el IMC y qué significan esas numeraciones?
                    </p>
                    <p>
                      El <strong>IMC (Índice de Masa Corporal)</strong> relaciona peso y estatura: <code className="bg-white px-1 py-0.5 rounded font-bold">Peso ÷ (Estatura en m)²</code>.
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2 pt-1 font-medium text-[11px]">
                      <div className="bg-white p-2 rounded-lg border">
                        <strong className="text-slate-900 block mb-0.5">Escala OMS (18 a 64 años):</strong>
                        • &lt; 18.5: Bajo peso | • 18.5 - 24.9: Normal | • 25.0 - 29.9: Sobrepeso | • 30+: Obesidad
                      </div>
                      <div className="bg-white p-2 rounded-lg border">
                        <strong className="text-slate-900 block mb-0.5">Adultos mayores (65+ años):</strong>
                        IMC tolerable <strong>23.0 a 28.0</strong> para densidad ósea y prevenir sarcopenia.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-cyan-900">
                  Estado de Salud
                </h3>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="painDuration">CUÁNTAS HORAS DURA EL DOLOR</Label>
                    <Input
                      id="painDuration"
                      placeholder="Ej. Constante todo el día, 4 horas por la tarde..."
                      value={painDurationHours}
                      onChange={(e) => setPainDurationHours(e.target.value)}
                      className="h-10 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sleepHours" className="flex items-center gap-1.5 font-bold">
                        <Moon className="h-4 w-4 text-indigo-600" />
                        CUÁNTAS HORAS DUERME
                      </Label>
                      <button
                        type="button"
                        onClick={() => setShowSleepHelp(!showSleepHelp)}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold underline flex items-center gap-1"
                      >
                        <Info className="h-3.5 w-3.5" />
                        {showSleepHelp ? 'Ocultar guía' : '¿Cuánto es lo normal?'}
                      </button>
                    </div>
                    <Input
                      id="sleepHours"
                      placeholder="Ej. 5 horas, 7 horas..."
                      value={sleepHours}
                      onChange={(e) => setSleepHours(e.target.value)}
                      className="h-10 rounded-xl"
                    />
                  </div>
                </div>

                {/* Alerta Clínica Dinámica según las Horas de Sueño */}
                {hasSleepNumber && (
                  <div
                    className={cn(
                      'rounded-xl p-3 border transition-all text-xs space-y-2',
                      parsedSleepHours < 6
                        ? 'bg-rose-50/90 border-rose-300 text-rose-950 shadow-xs'
                        : parsedSleepHours < recommendedSleepMin
                        ? 'bg-amber-50/90 border-amber-300 text-amber-950 shadow-xs'
                        : parsedSleepHours <= recommendedSleepMax
                        ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 shadow-xs'
                        : 'bg-sky-50/90 border-sky-300 text-sky-950 shadow-xs'
                    )}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/10 pb-1.5">
                      <div className="flex items-center gap-2">
                        {parsedSleepHours < 6 ? (
                          <span className="flex size-6 items-center justify-center rounded-full bg-rose-600 text-white font-bold text-xs shadow-xs">
                            🚨
                          </span>
                        ) : parsedSleepHours < recommendedSleepMin ? (
                          <span className="flex size-6 items-center justify-center rounded-full bg-amber-500 text-white font-bold text-xs shadow-xs">
                            ⚠️
                          </span>
                        ) : (
                          <span className="flex size-6 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-xs shadow-xs">
                            ✓
                          </span>
                        )}
                        <div>
                          <p className="font-extrabold text-xs sm:text-sm">
                            {parsedSleepHours < 6
                              ? `Alerta: Sueño Insuficiente (${parsedSleepHours} horas/noche)`
                              : parsedSleepHours < recommendedSleepMin
                              ? `Aviso: Por Debajo de lo Recomendado (${parsedSleepHours} hrs)`
                              : parsedSleepHours <= recommendedSleepMax
                              ? `Horas de Sueño Óptimas (${parsedSleepHours} hrs)`
                              : `Aviso: Horas de Sueño Prolongadas (${parsedSleepHours} hrs)`}
                          </p>
                          <p className="text-[11px] opacity-80">
                            {isSenior
                              ? 'Adultos mayores (65+): 7 a 8 h recomendadas'
                              : isYouth
                              ? 'Jóvenes (< 18): 8 a 10 h recomendadas'
                              : 'Adultos (18-64): 7 a 9 h recomendadas'}
                          </p>
                        </div>
                      </div>
                      <span
                        className={cn(
                          'text-xs font-black px-2 py-0.5 rounded-full',
                          parsedSleepHours < 6
                            ? 'bg-rose-600 text-white'
                            : parsedSleepHours < recommendedSleepMin
                            ? 'bg-amber-600 text-white'
                            : parsedSleepHours <= recommendedSleepMax
                            ? 'bg-emerald-700 text-white'
                            : 'bg-sky-700 text-white'
                        )}
                      >
                        {parsedSleepHours < recommendedSleepMin
                          ? `Déficit de -${sleepDeficit} h`
                          : 'Descanso Óptimo'}
                      </span>
                    </div>

                    {parsedSleepHours < 6 ? (
                      <div className="space-y-1.5 pt-0.5">
                        <div className="grid gap-2 sm:grid-cols-3">
                          <div className="bg-white/90 p-2.5 rounded-lg border border-rose-200">
                            <strong className="text-rose-900 block font-bold mb-0.5 text-[11px] uppercase tracking-wide">
                              1. Deshidratación Discal
                            </strong>
                            <p className="text-[11px] text-slate-700 leading-snug">
                              Los discos intervertebrales requieren mínimo 7h horizontales para hidratarse.
                            </p>
                          </div>
                          <div className="bg-white/90 p-2.5 rounded-lg border border-rose-200">
                            <strong className="text-rose-900 block font-bold mb-0.5 text-[11px] uppercase tracking-wide">
                              2. Mayor Dolor
                            </strong>
                            <p className="text-[11px] text-slate-700 leading-snug">
                              Eleva citoquinas inflamatorias y sensibiliza el sistema nervioso.
                            </p>
                          </div>
                          <div className="bg-white/90 p-2.5 rounded-lg border border-rose-200">
                            <strong className="text-rose-900 block font-bold mb-0.5 text-[11px] uppercase tracking-wide">
                              3. Rigidez Postural
                            </strong>
                            <p className="text-[11px] text-slate-700 leading-snug">
                              Espasmos miofasciales vuelven a desalinear las vértebras corregidas.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : parsedSleepHours < recommendedSleepMin ? (
                      <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200 text-slate-700 text-xs">
                        <p>
                          Menos de <strong>{recommendedSleepMin} horas</strong> dificulta la regeneración de tejidos posturales.
                        </p>
                      </div>
                    ) : parsedSleepHours <= recommendedSleepMax ? (
                      <div className="bg-white/80 p-2.5 rounded-lg border border-emerald-200 text-slate-700 text-xs">
                        <p>
                          Excelente hábito. Facilita la relajación miofascial y estabiliza los ajustes quiroprácticos.
                        </p>
                      </div>
                    ) : (
                      <div className="bg-white/80 p-2.5 rounded-lg border border-sky-200 text-slate-700 text-xs">
                        <p>
                          Más de {recommendedSleepMax} horas puede asociarse a fatiga o hipotonía muscular.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-1.5 rounded-xl bg-slate-50/80 p-3 border">
                  <div className="flex justify-between items-center">
                    <Label className="font-bold text-xs uppercase tracking-wide text-slate-800">
                      CALIFIQUE SU DOLOR 1 A 10:
                    </Label>
                    <span className="text-sm font-black text-cyan-900">
                      Nivel {painLevel} / 10
                    </span>
                  </div>
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 pt-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setPainLevel(val)}
                        className={cn(
                          'h-9 rounded-lg font-black text-sm transition',
                          painLevel === val
                            ? val <= 3
                              ? 'bg-emerald-600 text-white shadow-xs scale-105'
                              : val <= 6
                              ? 'bg-amber-500 text-white shadow-xs scale-105'
                              : 'bg-red-600 text-white shadow-xs scale-105'
                            : 'bg-white hover:bg-slate-100 border text-slate-700'
                        )}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-[11px] text-muted-foreground pt-0.5 px-0.5">
                    <span>1: Leve</span>
                    <span>5: Moderado</span>
                    <span>10: Insupportable</span>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>CÓMO EVALÚA SU ESTADO DE SALUD GENERAL?</Label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {['Excelente', 'Bueno', 'Regular', 'Malo'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setGeneralHealth(opt)}
                          className={cn(
                            'h-9 rounded-lg text-xs sm:text-sm font-bold border transition',
                            generalHealth === opt
                              ? 'bg-cyan-700 text-white border-cyan-700 shadow-xs'
                              : 'bg-white hover:bg-slate-50 text-slate-700'
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>ESTÁS EMBARAZADA Y CUÁNTO TIEMPO</Label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setIsPregnant('No')}
                        className={cn(
                          'h-9 px-4 rounded-lg text-xs sm:text-sm font-bold border transition',
                          isPregnant === 'No'
                            ? 'bg-slate-900 text-white'
                            : 'bg-white hover:bg-slate-50 text-slate-700'
                        )}
                      >
                        No
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsPregnant('Sí')}
                        className={cn(
                          'h-9 px-4 rounded-lg text-xs sm:text-sm font-bold border transition',
                          isPregnant === 'Sí'
                            ? 'bg-cyan-700 text-white'
                            : 'bg-white hover:bg-slate-50 text-slate-700'
                        )}
                      >
                        Sí
                      </button>
                      {isPregnant === 'Sí' && (
                        <Input
                          placeholder="¿Cuánto tiempo? (ej. 20 semanas)"
                          value={pregnancyTime}
                          onChange={(e) => setPregnancyTime(e.target.value)}
                          className="h-9 rounded-lg flex-1 text-xs"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="meds">MEDICAMENTO QUE TOMA</Label>
                  <Input
                    id="meds"
                    placeholder="Analgésicos, antiinflamatorios, tratamientos crónicos..."
                    value={medications}
                    onChange={(e) => setMedications(e.target.value)}
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-cyan-200/90 bg-cyan-50/40 p-4 sm:p-5 space-y-3.5 shadow-xs">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-cyan-800 text-white shadow-xs">
                    <FileText className="size-5" />
                  </span>
                  <div>
                    <Label htmlFor="clinNotes" className="font-black text-sm sm:text-base text-cyan-950 uppercase tracking-wide cursor-pointer">
                      DIAGNÓSTICO FINAL Y COMENTARIO
                    </Label>
                    <p className="text-xs text-slate-600 font-medium">
                      Escriba aquí todo lo referente al paciente: diagnóstico quiropráctico final, hallazgos, antecedentes y comentarios del operador.
                    </p>
                  </div>
                </div>
                <Textarea
                  id="clinNotes"
                  rows={6}
                  placeholder="Escriba aquí el diagnóstico final completo, observaciones clínicas, ajustes quiroprácticos realizados y cualquier comentario o indicación para el paciente..."
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  className="min-h-36 rounded-xl bg-white border-cyan-200 focus-visible:ring-cyan-500 text-sm leading-relaxed"
                />
              </div>

              <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/30 p-3.5 space-y-3.5">
                <div className="flex items-center gap-2">
                  <span className="grid size-8 place-items-center rounded-lg bg-emerald-700 text-white shadow-xs">
                    <WalletCards className="size-4" />
                  </span>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-emerald-950">
                      Plan de Tratamiento, Sesiones y Pago
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Define las sesiones pactadas, frecuencia, costo del plan y abono inicial en caja.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="totSessions" className="font-bold text-xs uppercase tracking-wider text-slate-700">
                      PLAN DE SESIONES
                    </Label>
                    <div className="flex gap-1.5">
                      {['6', '8', '10', '12'].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setTotalSessions(num)}
                          className={cn(
                            'h-9 flex-1 rounded-lg text-xs sm:text-sm font-black border transition',
                            totalSessions === num
                              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                              : 'bg-white hover:bg-slate-50 text-slate-800'
                          )}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                    <Input
                      id="totSessions"
                      type="number"
                      min="1"
                      max="99"
                      placeholder="Otro número (ej. 10, 12...)"
                      value={totalSessions}
                      onChange={(e) => setTotalSessions(e.target.value)}
                      className="h-10 rounded-xl bg-white font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="sessPerWeek" className="font-bold text-xs uppercase tracking-wider text-slate-700">
                      FRECUENCIA SEMANAL
                    </Label>
                    <div className="flex gap-1.5">
                      {['1', '2', '3', '4'].map((freq) => (
                        <button
                          key={freq}
                          type="button"
                          onClick={() => setSessionsPerWeek(freq)}
                          className={cn(
                            'h-9 flex-1 rounded-lg text-xs sm:text-sm font-black border transition',
                            sessionsPerWeek === freq
                              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                              : 'bg-white hover:bg-slate-50 text-slate-800'
                          )}
                        >
                          {freq}x sem
                        </button>
                      ))}
                    </div>
                    <Input
                      id="sessPerWeek"
                      type="number"
                      min="1"
                      max="7"
                      placeholder="Otra frec. semanal"
                      value={sessionsPerWeek}
                      onChange={(e) => setSessionsPerWeek(e.target.value)}
                      className="h-10 rounded-xl bg-white font-medium"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
                    <Label className="font-bold text-xs uppercase tracking-wider text-slate-700">
                      ¿INICIA HOY SU PRIMERA SESIÓN?
                    </Label>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => setStartToday('SI')}
                        className={cn(
                          'h-9 flex-1 rounded-lg text-xs sm:text-sm font-black border transition',
                          startToday === 'SI'
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                            : 'bg-white hover:bg-slate-50 text-slate-800'
                        )}
                      >
                        SÍ - Comienza Hoy
                      </button>
                      <button
                        type="button"
                        onClick={() => setStartToday('NO')}
                        className={cn(
                          'h-9 flex-1 rounded-lg text-xs sm:text-sm font-black border transition',
                          startToday === 'NO'
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-white hover:bg-slate-50 text-slate-800'
                        )}
                      >
                        NO - Agendar Cita
                      </button>
                    </div>
                    <p className="text-[11px] text-muted-foreground font-medium">
                      {startToday === 'SI'
                        ? '✅ Contabilizará 1 sesión cumplida hoy al registrar.'
                        : 'El paciente agendará una fecha para su 1ra sesión.'}
                    </p>
                  </div>
                </div>

                {startToday === 'SI' ? (
                  <div className="rounded-xl border border-emerald-300 bg-emerald-100/40 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="grid size-8 place-items-center rounded-xl bg-emerald-700 text-white text-xs font-black shadow-xs">
                        1
                      </span>
                      <div>
                        <p className="text-xs sm:text-sm font-black text-emerald-950">
                          Primera sesión realizada hoy ({today})
                        </p>
                        <p className="text-[11px] text-emerald-800 font-medium">
                          Quedará registrada como Sesión 1 de {totalSessions || 10} cumplida en el expediente.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Label htmlFor="appTime" className="text-xs font-bold text-slate-700 whitespace-nowrap">
                        Hora de atención hoy:
                      </Label>
                      <Input
                        id="appTime"
                        type="time"
                        value={appointmentTime}
                        onChange={(e) => setAppointmentTime(e.target.value)}
                        className="h-9 w-28 rounded-lg bg-white font-medium text-xs"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 rounded-xl border border-slate-200 bg-white p-3.5">
                    <div className="space-y-1">
                      <Label htmlFor="appDate" className="font-bold text-xs text-slate-700">
                        FECHA PRIMERA CITA
                      </Label>
                      <Input
                        id="appDate"
                        type="date"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        className="h-9 rounded-lg bg-white font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="appTime" className="font-bold text-xs text-slate-700">
                        HORA DE LA CITA
                      </Label>
                      <Input
                        id="appTime"
                        type="time"
                        value={appointmentTime}
                        onChange={(e) => setAppointmentTime(e.target.value)}
                        className="h-9 rounded-lg bg-white font-medium"
                      />
                    </div>
                  </div>
                )}

                {/* Bloque Financiero y Pagos */}
                <div className="rounded-xl bg-white p-3.5 border border-emerald-200 space-y-3 shadow-xs">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="totAmount" className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                        <Banknote className="size-4 text-emerald-700" />
                        MONTO TOTAL DEL PLAN (S/)
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 font-bold text-slate-500 text-sm">S/</span>
                        <Input
                          id="totAmount"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Ej. 800.00"
                          value={totalAmount}
                          onChange={(e) => setTotalAmount(e.target.value)}
                          className="h-10 pl-9 rounded-xl font-bold text-sm sm:text-base"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="initPayment" className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                          <CreditCard className="size-4 text-emerald-700" />
                          ABONO O PAGO INICIAL (S/)
                        </Label>
                        <span className="text-[11px] text-muted-foreground font-semibold">Opcional</span>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 font-bold text-slate-500 text-sm">S/</span>
                        <Input
                          id="initPayment"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Ej. 200.00"
                          value={initialPayment}
                          onChange={(e) => setInitialPayment(e.target.value)}
                          className="h-10 pl-9 rounded-xl font-bold text-sm sm:text-base"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="payMethod" className="font-bold text-xs text-slate-800">
                        FORMA DE PAGO DEL ABONO
                      </Label>
                      <Select value={paymentMethod} onValueChange={(val) => setPaymentMethod(val ?? 'Efectivo')}>
                        <SelectTrigger id="payMethod" className="h-10 rounded-xl bg-white font-medium">
                          <SelectValue placeholder="Forma de pago" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Efectivo">💵 Efectivo</SelectItem>
                          <SelectItem value="Yape">📱 Yape</SelectItem>
                          <SelectItem value="Plin">📱 Plin</SelectItem>
                          <SelectItem value="Transferencia">🏦 Transferencia Bancaria</SelectItem>
                          <SelectItem value="Tarjeta">💳 Tarjeta de Débito / Crédito</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Atajos de pago rápido */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="text-xs font-bold text-slate-600">Atajos de pago:</span>
                    <button
                      type="button"
                      onClick={() => setInitialPayment('0')}
                      className={cn(
                        'text-xs px-2.5 py-1 rounded-lg border font-bold transition',
                        initialPaymentNum === 0 ? 'bg-slate-900 text-white' : 'bg-slate-50 hover:bg-slate-100 text-slate-800'
                      )}
                    >
                      Sin abono hoy (S/ 0)
                    </button>
                    {totalAmountNum > 0 && (
                      <>
                        <button
                          type="button"
                          onClick={() => setInitialPayment((totalAmountNum * 0.5).toFixed(2))}
                          className={cn(
                            'text-xs px-2.5 py-1 rounded-lg border font-bold transition',
                            initialPaymentNum === Number((totalAmountNum * 0.5).toFixed(2))
                              ? 'bg-cyan-700 text-white'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-800'
                          )}
                        >
                          50% de inicial (S/ {(totalAmountNum * 0.5).toFixed(2)})
                        </button>
                        <button
                          type="button"
                          onClick={() => setInitialPayment(totalAmountNum.toFixed(2))}
                          className={cn(
                            'text-xs px-2.5 py-1 rounded-lg border font-bold transition',
                            initialPaymentNum === totalAmountNum
                              ? 'bg-emerald-700 text-white'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-800'
                          )}
                        >
                          Pago 100% (S/ {totalAmountNum.toFixed(2)})
                        </button>
                      </>
                    )}
                  </div>

                  {/* Resumen financiero */}
                  <div className="grid gap-2.5 sm:grid-cols-3 pt-1">
                    <div className="rounded-xl bg-slate-50 p-3 border">
                      <span className="text-[11px] text-muted-foreground block font-semibold">Monto Total del Plan</span>
                      <strong className="text-base sm:text-lg font-black text-slate-900">
                        S/ {totalAmountNum.toFixed(2)}
                      </strong>
                    </div>
                    <div className="rounded-xl bg-emerald-50 p-3 border border-emerald-200">
                      <span className="text-[11px] text-emerald-800 font-semibold block">Abono Inicial en Caja</span>
                      <strong className="text-base sm:text-lg font-black text-emerald-900">
                        S/ {initialPaymentNum.toFixed(2)}
                      </strong>
                      <span className="text-[11px] text-emerald-700 block mt-0.5">
                        Vía {paymentMethod}
                      </span>
                    </div>
                    <div className={cn(
                      'rounded-xl p-3 border',
                      pendingBalanceNum === 0 && totalAmountNum > 0
                        ? 'bg-emerald-100/70 border-emerald-300 text-emerald-950'
                        : 'bg-amber-50 border-amber-200 text-amber-950'
                    )}>
                      <span className="text-[11px] font-semibold block opacity-80">Saldo Pendiente por Cobrar</span>
                      <strong className="text-base sm:text-lg font-black block">
                        S/ {pendingBalanceNum.toFixed(2)}
                      </strong>
                      <span className="text-[11px] opacity-80 block mt-0.5">
                        {pendingBalanceNum === 0 && totalAmountNum > 0
                          ? '✅ Pagado en su totalidad'
                          : pendingBalanceNum > 0
                          ? 'Se amortizará en las próximas visitas'
                          : 'Sin monto fijado'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="payNotes" className="text-xs font-medium text-muted-foreground">
                      Nro. de Operación / Observaciones de Pago (opcional)
                    </Label>
                    <Input
                      id="payNotes"
                      placeholder="Ej. Operación Yape #39281, pago en efectivo recepción..."
                      value={paymentNotes}
                      onChange={(e) => setPaymentNotes(e.target.value)}
                      className="h-10 rounded-xl bg-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3.5 text-sm font-medium text-red-800">
                  {error}
                </div>
              )}

              <div className="flex justify-end pt-3 border-t">
                <Button
                  type="submit"
                  disabled={saving}
                  className="h-12 w-full sm:w-auto px-8 rounded-xl text-sm sm:text-base font-black bg-cyan-700 hover:bg-cyan-800 text-white shadow-lg shadow-cyan-700/20"
                >
                  {saving ? (
                    <>
                      <LoaderCircle className="mr-2 size-5 animate-spin" /> Guardando paciente...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 size-5" /> Guardar Ficha y Generar Tarjeta QR
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
      </form>
    </div>
  );
}