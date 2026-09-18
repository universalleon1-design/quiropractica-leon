'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Banknote,
  Check,
  CreditCard,
  HeartPulse,
  Info,
  LoaderCircle,
  Moon,
  Plus,
  Scale,
  Sparkles,
  User,
  UserPlus,
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
}: {
  onSaved: () => void;
  onFinished: (patient: Patient) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<PatientQrResult | null>(null);

  const formTopRef = useRef<HTMLDivElement>(null);

  function changeStep(nextStep: 1 | 2 | 3) {
    setStep(nextStep);
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
      document.body.scrollTo({ top: 0, behavior: 'smooth' });
      formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch {}
  }

  useEffect(() => {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch {}
  }, [step]);

  // Pagina 1: Anamnesis y Evaluacion
  const [evaluationDate, setEvaluationDate] = useState(today);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dni, setDni] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [age, setAge] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [occupation, setOccupation] = useState('');
  const [sex, setSex] = useState('female');
  const [mainComplaint, setMainComplaint] = useState('');
  const [painDurationHours, setPainDurationHours] = useState('');
  const [painLevel, setPainLevel] = useState<number>(5);
  const [generalHealth, setGeneralHealth] = useState('Bueno');
  const [sleepHours, setSleepHours] = useState('7 horas');
  const [isPregnant, setIsPregnant] = useState<'No' | 'Sí'>('No');
  const [pregnancyTime, setPregnancyTime] = useState('');
  const [medications, setMedications] = useState('');

  // Evaluacion de Columna
  const [spineInclinationDir, setSpineInclinationDir] = useState<'I' | 'D'>('D');
  const [spineInclinationLevel, setSpineInclinationLevel] = useState('2');
  const [spineRotationDir, setSpineRotationDir] = useState<'I' | 'D'>('D');
  const [spineRotationLevel, setSpineRotationLevel] = useState('2');
  const [spineExtension, setSpineExtension] = useState('3');
  const [iliac, setIliac] = useState<'Derecho' | 'Izquierdo'>('Derecho');
  const [gaitTiptoes, setGaitTiptoes] = useState('Normal');
  const [gaitHeels, setGaitHeels] = useState('Normal');

  // Pagina 2: Postura y Palpacion
  const [pronePosition, setPronePosition] = useState('');
  const [legLengthSide, setLegLengthSide] = useState<'Derecha' | 'Izquierda' | 'Iguales'>('Derecha');
  const [legLengthDiff, setLegLengthDiff] = useState('');
  const [sacroiliacPain, setSacroiliacPain] = useState<'SI' | 'NO'>('NO');
  const [sacroiliacSide, setSacroiliacSide] = useState<'Derecho' | 'Izquierdo' | 'Bilateral'>('Derecho');
  const [cervicalSyndrome, setCervicalSyndrome] = useState('');
  const [dynamicPalpation, setDynamicPalpation] = useState('');
  const [strongerLeg, setStrongerLeg] = useState<'D' | 'I' | 'Neutro'>('D');
  const [staticPalpation, setStaticPalpation] = useState('');
  const [muscleTension, setMuscleTension] = useState('');
  const [lumbarScan, setLumbarScan] = useState('');
  const [lumbarHypomobility, setLumbarHypomobility] = useState('');
  const [lumbarYesNo, setLumbarYesNo] = useState<'SI' | 'NO'>('NO');
  const [thoracicScan, setThoracicScan] = useState('');
  const [thoracicHypomobility, setThoracicHypomobility] = useState('');
  const [thoracicListingLevel, setThoracicListingLevel] = useState('');

  // Pagina 3: Cervical, Citas y Pagos
  const [cervicalC2C7Rotation, setCervicalC2C7Rotation] = useState('C2 Rotación D / C7 Rotación I');
  const [cervicalListingLevel, setCervicalListingLevel] = useState('C2');
  const [cervicalSeries, setCervicalSeries] = useState('Serie 1 al 7');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [totalSessions, setTotalSessions] = useState('8');
  const [sessionsPerWeek, setSessionsPerWeek] = useState('2');
  const [appointmentDate, setAppointmentDate] = useState(today);
  const [appointmentTime, setAppointmentTime] = useState('09:00');
  const [totalAmount, setTotalAmount] = useState('800');
  const [initialPayment, setInitialPayment] = useState('200');
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [paymentNotes, setPaymentNotes] = useState('');

  function handleBirthDate(val: string) {
    setBirthDate(val);
    if (!val) return;
    try {
      const birth = new Date(val);
      const now = new Date();
      let calculated = now.getFullYear() - birth.getFullYear();
      const m = now.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
        calculated--;
      }
      if (calculated >= 0 && calculated <= 120) {
        setAge(calculated.toString());
      }
    } catch {}
  }

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setError('Por favor ingresa al menos los nombres y apellidos del paciente.');
      changeStep(1);
      return;
    }

    setSaving(true);
    setError('');

    const payload = {
      evaluationDate,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      dni: dni.trim(),
      birthDate,
      age: age ? Number(age) : null,
      weightKg: weightKg ? Number(weightKg) : null,
      heightCm: heightCm ? Number(heightCm) : null,
      phone: phone.trim(),
      address: address.trim(),
      occupation: occupation.trim(),
      sex,
      mainComplaint: mainComplaint.trim(),
      painDurationHours: painDurationHours.trim(),
      painLevel,
      generalHealth,
      sleepHours: sleepHours.trim(),
      pregnancyStatus: isPregnant === 'Sí' ? `Sí - ${pregnancyTime || 'en gestación'}` : 'No',
      medications: medications.trim(),
      spineInclination: `${spineInclinationDir} - Nivel ${spineInclinationLevel}`,
      spineRotation: `${spineRotationDir} - Nivel ${spineRotationLevel}`,
      spineExtension: `Nivel ${spineExtension}`,
      iliac,
      gaitTiptoes,
      gaitHeels,
      pronePosition: pronePosition.trim(),
      legLength: `${legLengthSide}${legLengthDiff ? ` (${legLengthDiff})` : ''}`,
      sacroiliacPain: `${sacroiliacPain}${sacroiliacPain === 'SI' ? ` (${sacroiliacSide})` : ''}`,
      cervicalSyndrome: cervicalSyndrome.trim(),
      dynamicPalpation: dynamicPalpation.trim(),
      strongerLeg,
      staticPalpation: staticPalpation.trim(),
      muscleTension: muscleTension.trim(),
      lumbarScan: lumbarScan.trim(),
      lumbarHypomobility: lumbarHypomobility.trim(),
      lumbarYesNo,
      thoracicScan: thoracicScan.trim(),
      thoracicHypomobility: thoracicHypomobility.trim(),
      thoracicListingLevel: thoracicListingLevel.trim(),
      cervicalC2C7Rotation: cervicalC2C7Rotation.trim(),
      cervicalListingLevel: cervicalListingLevel.trim(),
      cervicalSeries: cervicalSeries.trim(),
      clinicalNotes: clinicalNotes.trim(),
      totalSessions: Number(totalSessions) || 8,
      sessionsPerWeek: Number(sessionsPerWeek) || 2,
      appointmentDate,
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
        used: 0,
        total: Number(totalSessions) || 8,
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
    setStep(1);
    setFirstName('');
    setLastName('');
    setDni('');
    setBirthDate('');
    setAge('');
    setWeightKg('');
    setHeightCm('');
    setPhone('');
    setAddress('');
    setOccupation('');
    setMainComplaint('');
    setMedications('');
    setClinicalNotes('');
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

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              onClick={() => onFinished(result.patient)}
              className="h-12 w-full sm:w-auto rounded-xl px-7 font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-md"
            >
              Abrir expediente clínico <ArrowRight className="ml-2 size-4" />
            </Button>
            <Button
              variant="outline"
              onClick={resetForm}
              className="h-12 w-full sm:w-auto rounded-xl px-6 font-bold border-slate-300 hover:bg-slate-50"
            >
              <Plus className="mr-2 size-4" /> Registrar otro paciente
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div ref={formTopRef} className="space-y-6 scroll-mt-20">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-950">
            Registrar Paciente
          </h2>
          <p className="text-muted-foreground">
            Ficha de anamnesis quiropráctica, evaluación postural, plan de pagos y tarjeta QR.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {[
          { num: 1, title: 'Página 1', subtitle: 'Anamnesis y Columna' },
          { num: 2, title: 'Página 2', subtitle: 'Postura y Palpación' },
          { num: 3, title: 'Página 3', subtitle: 'Cervical, Plan y Pago' },
        ].map((item) => (
          <button
            key={item.num}
            type="button"
            onClick={() => changeStep(item.num as 1 | 2 | 3)}
            className={cn(
              'flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 rounded-2xl p-3 sm:p-4 text-left transition border',
              step === item.num
                ? 'border-cyan-600 bg-cyan-50/70 shadow-sm ring-1 ring-cyan-600'
                : 'border-border bg-white hover:bg-slate-50'
            )}
          >
            <span
              className={cn(
                'grid size-8 shrink-0 place-items-center rounded-xl text-xs font-black',
                step === item.num
                  ? 'bg-cyan-700 text-white shadow-sm'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {item.num}
            </span>
            <div className="min-w-0">
              <p
                className={cn(
                  'text-xs font-bold uppercase tracking-wider',
                  step === item.num ? 'text-cyan-800' : 'text-muted-foreground'
                )}
              >
                {item.title}
              </p>
              <p className="truncate text-xs sm:text-sm font-extrabold text-slate-900">
                {item.subtitle}
              </p>
            </div>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">        {/* ==================== PÁGINA 1 ==================== */}
        {step === 1 && (
          <Card className="rounded-3xl border-0 shadow-sm bg-white">
            <CardHeader className="pb-4 border-b">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-2xl bg-cyan-100 text-cyan-900">
                  <User className="size-5" />
                </span>
                <div>
                  <CardTitle className="text-xl font-extrabold text-slate-950">
                    Página 1: Ficha de Anamnesis y Evaluación
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Datos personales, motivo de consulta y evaluación preliminar de columna.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 sm:p-8 space-y-7">
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-cyan-800 mb-4">
                  Datos Generales del Paciente
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor="evalDate">FECHA</Label>
                    <Input
                      id="evalDate"
                      type="date"
                      value={evaluationDate}
                      onChange={(e) => setEvaluationDate(e.target.value)}
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="firstName">NOMBRES *</Label>
                    <Input
                      id="firstName"
                      required
                      placeholder="Ej. Juan Alberto"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">APELLIDOS *</Label>
                    <Input
                      id="lastName"
                      required
                      placeholder="Ej. Pérez Quispe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dni">DNI / DOCUMENTO</Label>
                    <Input
                      id="dni"
                      placeholder="8 dígitos"
                      value={dni}
                      onChange={(e) => setDni(e.target.value)}
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">F/NACIMIENTO</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={birthDate}
                      onChange={(e) => handleBirthDate(e.target.value)}
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">EDAD</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Años"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sex">SEXO</Label>
                    <Select value={sex} onValueChange={setSex}>
                      <SelectTrigger id="sex" className="h-11 rounded-xl">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="female">Femenino</SelectItem>
                        <SelectItem value="male">Masculino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">TELÉFONO (WhatsApp)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Ej. 987654321"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address">DIRECCIÓN</Label>
                    <Input
                      id="address"
                      placeholder="Av. / Calle / Distrito"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-1">
                    <Label htmlFor="occupation">PROFESIÓN / OCUPACIÓN</Label>
                    <Input
                      id="occupation"
                      placeholder="Ej. Contador, Chofer, etc."
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="h-11 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Scale className="size-4 text-cyan-800" />
                    <h4 className="font-extrabold text-sm text-slate-800">
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

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
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
                      className="h-11 rounded-xl bg-white"
                    />
                  </div>
                  <div className="space-y-2">
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
                      className="h-11 rounded-xl bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-700">
                      IMC CALCULADO
                    </Label>
                    <div className="flex h-11 items-center justify-between rounded-xl border bg-white px-4">
                      <span className="font-black text-slate-900 text-base">
                        {liveBmi ? liveBmi.toFixed(1) : '—'}
                      </span>
                      {bmiCategory && (
                        <span
                          className={cn(
                            'rounded-lg border px-2.5 py-0.5 text-xs font-extrabold',
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
                  <div className="rounded-xl border border-cyan-200 bg-white p-4 space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 items-center">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                          Rango de peso tolerable para su talla
                        </span>
                        <p className="mt-1 text-lg font-black text-cyan-950">
                          {healthyMinKg} kg – {healthyMaxKg} kg
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {isSenior
                            ? `Adulto mayor (${patientAgeNum} años: IMC 23.0 - 28.0 para protección ósea)`
                            : isYouth
                            ? `Juvenil (${patientAgeNum} años)`
                            : `Para ${heightCm} cm de estatura (IMC normal OMS 18.5 - 24.9)`}
                        </p>
                      </div>

                      {weight > 0 && (
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                            Estado actual vs rango
                          </span>
                          <p className="mt-1 font-bold text-sm">
                            {weight >= healthyMinKg && weight <= healthyMaxKg ? (
                              <span className="text-emerald-700 flex items-center gap-1.5 font-extrabold">
                                <Check className="size-4" /> Peso óptimo / saludable
                              </span>
                            ) : weight > healthyMaxKg ? (
                              <span className="text-amber-700 font-extrabold">
                                +{weightDiff} kg por encima del peso ideal
                              </span>
                            ) : (
                              <span className="text-amber-700 font-extrabold">
                                {weightDiff} kg por debajo del mínimo saludable
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Peso ingresado: {weight} kg
                          </p>
                        </div>
                      )}

                      <div className="rounded-xl bg-cyan-50/70 p-3 border border-cyan-100 text-xs text-slate-700 sm:col-span-2 lg:col-span-1">
                        <strong className="text-cyan-900 block mb-0.5">Evaluación Quiropráctica:</strong>
                        {weight > healthyMaxKg ? (
                          <span>El sobrepeso genera sobrecarga mecánica en discos lumbares (L4-L5-S1) y pelvis.</span>
                        ) : weight < healthyMinKg && weight > 0 ? (
                          <span>El bajo peso puede asociarse a debilidad muscular para el sostén de la columna.</span>
                        ) : (
                          <span>Carga articular equilibrada, óptima para la alineación vertebral y el tratamiento.</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Explicación médica detallada colapsable */}
                {showBmiHelp && (
                  <div className="rounded-xl border border-slate-200 bg-slate-100/70 p-4 text-xs space-y-2 text-slate-700 leading-relaxed">
                    <p className="font-extrabold text-slate-900 text-sm">
                      ¿Qué es el IMC y qué significan esas numeraciones?
                    </p>
                    <p>
                      El <strong>IMC (Índice de Masa Corporal)</strong> es el indicador internacional oficial de la <strong>OMS (Organización Mundial de la Salud)</strong> que relaciona el peso y la estatura de una persona mediante la fórmula: <code className="bg-white px-1.5 py-0.5 rounded font-bold">Peso ÷ (Estatura en metros)²</code>.
                    </p>
                    <p>
                      <strong>Ejemplo con tu imagen (Peso 60 kg y Talla 160 cm = 1.60 m):</strong>
                      <br />
                      • Se multiplica la talla por sí misma: 1.60 × 1.60 = <strong>2.56</strong>
                      <br />
                      • Se divide el peso entre ese número: 60 ÷ 2.56 = <strong className="text-cyan-800">23.4</strong>
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2 pt-1 font-medium">
                      <div className="bg-white p-2.5 rounded-lg border">
                        <strong className="text-slate-900 block mb-1">Escala OMS (Adultos 18 a 64 años):</strong>
                        • <strong>Menos de 18.5:</strong> Bajo peso<br />
                        • <strong>18.5 a 24.9:</strong> Peso saludable (Normal)<br />
                        • <strong>25.0 a 29.9:</strong> Sobrepeso<br />
                        • <strong>30.0 a más:</strong> Obesidad
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border">
                        <strong className="text-slate-900 block mb-1">Adultos mayores (65+ años):</strong>
                        En geriatría se tolera un IMC de <strong>23.0 a 28.0</strong> para proteger la densidad ósea y prevenir la pérdida de masa muscular (sarcopenia).
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-cyan-800">
                  Queja Principal y Estado de Salud
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="mainComplaint">QUEJA PRINCIPAL (Motivo de consulta)</Label>
                  <Textarea
                    id="mainComplaint"
                    placeholder="Describe los dolores, zonas afectadas, inicio y molestias que siente el paciente..."
                    value={mainComplaint}
                    onChange={(e) => setMainComplaint(e.target.value)}
                    className="min-h-20 rounded-xl"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="painDuration">CUÁNTAS HORAS DURA EL DOLOR</Label>
                    <Input
                      id="painDuration"
                      placeholder="Ej. Constante todo el día, 4 horas por la tarde..."
                      value={painDurationHours}
                      onChange={(e) => setPainDurationHours(e.target.value)}
                      className="h-11 rounded-xl"
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
                      className="h-11 rounded-xl"
                    />
                  </div>
                </div>

                {/* Alerta Clínica Dinámica según las Horas de Sueño */}
                {hasSleepNumber && (
                  <div
                    className={cn(
                      'rounded-2xl p-4 border transition-all text-xs space-y-2.5',
                      parsedSleepHours < 6
                        ? 'bg-rose-50/90 border-rose-300 text-rose-950 shadow-sm'
                        : parsedSleepHours < recommendedSleepMin
                        ? 'bg-amber-50/90 border-amber-300 text-amber-950 shadow-sm'
                        : parsedSleepHours <= recommendedSleepMax
                        ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 shadow-sm'
                        : 'bg-sky-50/90 border-sky-300 text-sky-950 shadow-sm'
                    )}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/10 pb-2">
                      <div className="flex items-center gap-2">
                        {parsedSleepHours < 6 ? (
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-600 text-white font-bold text-xs shadow-sm">
                            🚨
                          </span>
                        ) : parsedSleepHours < recommendedSleepMin ? (
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-white font-bold text-xs shadow-sm">
                            ⚠️
                          </span>
                        ) : (
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-xs shadow-sm">
                            ✓
                          </span>
                        )}
                        <div>
                          <p className="font-extrabold text-sm">
                            {parsedSleepHours < 6
                              ? `Alerta Clínica: Sueño Críticamente Insuficiente (${parsedSleepHours} horas/noche)`
                              : parsedSleepHours < recommendedSleepMin
                              ? `Aviso Clínico: Horas de Sueño por Debajo de lo Recomendado (${parsedSleepHours} hrs)`
                              : parsedSleepHours <= recommendedSleepMax
                              ? `Horas de Sueño en Rango Óptimo y Terapéutico (${parsedSleepHours} hrs)`
                              : `Aviso: Horas de Sueño Prolongadas (${parsedSleepHours} hrs)`}
                          </p>
                          <p className="text-[11px] opacity-80">
                            {isSenior
                              ? 'Criterio para adultos mayores (65+ años): 7 a 8 horas recomendadas'
                              : isYouth
                              ? 'Criterio para jóvenes/menores (< 18 años): 8 a 10 horas recomendadas'
                              : 'Criterio oficial OMS / NSF para adultos (18-64 años): 7 a 9 horas recomendadas'}
                          </p>
                        </div>
                      </div>
                      <span
                        className={cn(
                          'text-xs font-black px-2.5 py-1 rounded-full shadow-xs',
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
                          ? `Déficit de -${sleepDeficit} horas`
                          : 'Descanso Óptimo'}
                      </span>
                    </div>

                    {parsedSleepHours < 6 ? (
                      <div className="space-y-2 pt-1">
                        <p className="font-bold text-rose-950 text-xs">
                          ⚠️ Consecuencias directas en la columna y la efectividad del tratamiento quiropráctico:
                        </p>
                        <div className="grid gap-2 sm:grid-cols-3">
                          <div className="bg-white/90 p-3 rounded-xl border border-rose-200">
                            <strong className="text-rose-900 block font-bold mb-1 text-[11px] uppercase tracking-wide">
                              1. Deshidratación de Discos
                            </strong>
                            <p className="text-[11px] text-slate-700 leading-snug">
                              Los discos intervertebrales no tienen vasos sanguíneos directos; solo absorben agua y nutrientes en decúbito (reposo horizontal prolongado de mínimo 7h). Con 5 horas, amanecen deshidratados, rígidos y propensos a fisuras y hernias.
                            </p>
                          </div>
                          <div className="bg-white/90 p-3 rounded-xl border border-rose-200">
                            <strong className="text-rose-900 block font-bold mb-1 text-[11px] uppercase tracking-wide">
                              2. Mayor Dolor (Hiperalgesia)
                            </strong>
                            <p className="text-[11px] text-slate-700 leading-snug">
                              Dormir 5 horas activa citoquinas inflamatorias (IL-6, PCR) y sensibiliza el sistema nervioso central. El cerebro magnifica las señales de dolor lumbar y cervical, duplicando la molestia.
                            </p>
                          </div>
                          <div className="bg-white/90 p-3 rounded-xl border border-rose-200">
                            <strong className="text-rose-900 block font-bold mb-1 text-[11px] uppercase tracking-wide">
                              3. Pérdida del Ajuste Quiropráctico
                            </strong>
                            <p className="text-[11px] text-slate-700 leading-snug">
                              La falta de sueño profundo impide la relajación miofascial nocturna. Los espasmos y contracturas paravertebrales continúan jalando las vértebras a su posición desalineada previa.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : parsedSleepHours < recommendedSleepMin ? (
                      <div className="bg-white/80 p-3 rounded-xl border border-amber-200 text-slate-700 leading-relaxed text-xs">
                        <p>
                          El paciente duerme menos del umbral biológico mínimo de <strong>{recommendedSleepMin} horas</strong>. Se aconseja pautas de higiene del sueño para acelerar la regeneración de tejidos y estabilizar los ajustes articulares.
                        </p>
                      </div>
                    ) : parsedSleepHours <= recommendedSleepMax ? (
                      <div className="bg-white/80 p-3 rounded-xl border border-emerald-200 text-slate-700 leading-relaxed text-xs">
                        <p>
                          Excelente hábito. Dormir entre <strong>{recommendedSleepMin} y {recommendedSleepMax} horas</strong> permite la descompresión intervertebral, adecuada segregación de hormona de crecimiento y relajación de la musculatura postural.
                        </p>
                      </div>
                    ) : (
                      <div className="bg-white/80 p-3 rounded-xl border border-sky-200 text-slate-700 leading-relaxed text-xs">
                        <p>
                          Dormir más de {recommendedSleepMax} horas con frecuencia puede indicar fatiga acumulada, hipersomnia o hipotonía muscular postural que requiere evaluación.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Explicación médica detallada sobre el sueño (colapsable) */}
                {showSleepHelp && (
                  <div className="rounded-2xl border border-indigo-200 bg-indigo-50/80 p-4 text-xs space-y-3 text-indigo-950 leading-relaxed">
                    <div className="flex items-center justify-between">
                      <p className="font-extrabold text-sm text-indigo-900 flex items-center gap-1.5">
                        <Moon className="h-4 w-4 text-indigo-600" />
                        ¿Cuánto es lo normal que debe dormir un paciente? (Guía Médica y Quiropráctica)
                      </p>
                      <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-full">
                        OMS / CDC / National Sleep Foundation
                      </span>
                    </div>

                    <p>
                      El descanso nocturno no es solo tiempo de reposo mental; para la columna vertebral es el <strong>único momento en que se revierte la compresión gravitacional del día a día</strong> y se regeneran los tejidos articulares.
                    </p>

                    <div className="grid gap-2.5 sm:grid-cols-3 pt-1 font-medium text-[11px]">
                      <div className="bg-white p-3 rounded-xl border border-indigo-100 shadow-xs">
                        <strong className="text-slate-900 block text-xs mb-0.5">Adultos (18 a 64 años)</strong>
                        <span className="text-emerald-700 font-extrabold text-sm block">7 a 9 horas</span>
                        <p className="text-muted-foreground mt-1 leading-snug">
                          Mínimo 7 horas para completar 4 a 5 ciclos de sueño REM/NREM y permitir la rehidratación completa de los discos intervertebrales.
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-indigo-100 shadow-xs">
                        <strong className="text-slate-900 block text-xs mb-0.5">Adultos mayores (65+ años)</strong>
                        <span className="text-cyan-700 font-extrabold text-sm block">7 a 8 horas</span>
                        <p className="text-muted-foreground mt-1 leading-snug">
                          Suelen tener despertares intermedios, pero alcanzar al menos 7 horas previene la rigidez articular matutina y dolor crónico.
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-indigo-100 shadow-xs">
                        <strong className="text-slate-900 block text-xs mb-0.5">Jóvenes y Adolescentes</strong>
                        <span className="text-indigo-700 font-extrabold text-sm block">8 a 10 horas</span>
                        <p className="text-muted-foreground mt-1 leading-snug">
                          Indispensable para el pico de secreción de hormona del crecimiento (GH), remodelación ósea y postura durante el desarrollo.
                        </p>
                      </div>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-indigo-100 text-[11px] space-y-1.5 text-slate-700">
                      <strong className="text-indigo-950 font-bold text-xs block">
                        ¿Qué sucede clínicamente cuando un paciente duerme solo 5 horas?
                      </strong>
                      <p>
                        • <strong>Efecto Esponja de los Discos (Imbibición Osmótica):</strong> Durante el día perdemos entre 1 y 2 cm de estatura porque el peso corporal exprime el agua de los discos. Rehidratarlos requiere de 7 a 8 horas seguidas en posición horizontal. Al dormir solo 5 horas, el disco amanece deshidratado y pierde hasta 30% de su capacidad para absorber impactos mecánicos.
                      </p>
                      <p>
                        • <strong>Sensibilización Central e Hiperalgesia:</strong> La falta crónica de sueño suprime los mecanismos analgésicos naturales del cerebro y eleva los niveles de cortisol y citoquinas inflamatorias. El paciente se vuelve hipersensible al dolor.
                      </p>
                      <p>
                        • <strong>Menor Retención de los Ajustes Quiroprácticos:</strong> La musculatura postural no logra la fase de relajación atónica del sueño profundo, manteniendo espasmos y contracturas que fuerzan a las vértebras corregidas a desalinearse de nuevo en poco tiempo.
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-2 rounded-2xl bg-muted/40 p-4 border">
                  <div className="flex justify-between items-center">
                    <Label className="font-bold">CALIFIQUE SU DOLOR 1 A 10:</Label>
                    <span className="text-lg font-black text-cyan-900">
                      Nivel {painLevel} / 10
                    </span>
                  </div>
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 pt-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setPainLevel(val)}
                        className={cn(
                          'h-11 rounded-xl font-black text-sm transition',
                          painLevel === val
                            ? val <= 3
                              ? 'bg-emerald-600 text-white shadow-md scale-105'
                              : val <= 6
                              ? 'bg-amber-500 text-white shadow-md scale-105'
                              : 'bg-red-600 text-white shadow-md scale-105'
                            : 'bg-white hover:bg-slate-100 border text-slate-700'
                        )}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground pt-1 px-1">
                    <span>1: Leve</span>
                    <span>5: Moderado</span>
                    <span>10: Insupportable</span>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>CÓMO EVALÚA SU ESTADO DE SALUD GENERAL?</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {['Excelente', 'Bueno', 'Regular', 'Malo'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setGeneralHealth(opt)}
                          className={cn(
                            'h-11 rounded-xl text-xs sm:text-sm font-bold border transition',
                            generalHealth === opt
                              ? 'bg-cyan-700 text-white border-cyan-700 shadow-sm'
                              : 'bg-white hover:bg-slate-50 text-slate-700'
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>ESTÁS EMBARAZADA Y CUÁNTO TIEMPO</Label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setIsPregnant('No')}
                        className={cn(
                          'h-11 px-5 rounded-xl text-sm font-bold border transition',
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
                          'h-11 px-5 rounded-xl text-sm font-bold border transition',
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
                          className="h-11 rounded-xl flex-1"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meds">MEDICAMENTO QUE TOMA</Label>
                  <Input
                    id="meds"
                    placeholder="Analgésicos, antiinflamatorios, tratamientos crónicos..."
                    value={medications}
                    onChange={(e) => setMedications(e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>

              <div className="rounded-2xl border-2 border-cyan-100 bg-cyan-50/30 p-5 sm:p-6 space-y-6">
                <div className="flex items-center gap-2">
                  <HeartPulse className="size-5 text-cyan-800" />
                  <h3 className="font-extrabold text-base text-cyan-950">
                    EVALUACIÓN DE LA COLUMNA VERTEBRAL
                  </h3>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2.5 rounded-xl bg-white p-4 border">
                    <Label className="font-bold text-xs uppercase tracking-wider text-slate-700">
                      INCLINACIÓN: I / D (1 AL 5)
                    </Label>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex rounded-xl bg-muted p-1">
                        <button
                          type="button"
                          onClick={() => setSpineInclinationDir('I')}
                          className={cn(
                            'rounded-lg px-3 py-1.5 text-xs font-black transition',
                            spineInclinationDir === 'I' ? 'bg-cyan-700 text-white shadow-sm' : 'text-slate-600'
                          )}
                        >
                          I (Izquierda)
                        </button>
                        <button
                          type="button"
                          onClick={() => setSpineInclinationDir('D')}
                          className={cn(
                            'rounded-lg px-3 py-1.5 text-xs font-black transition',
                            spineInclinationDir === 'D' ? 'bg-cyan-700 text-white shadow-sm' : 'text-slate-600'
                          )}
                        >
                          D (Derecha)
                        </button>
                      </div>
                      <div className="flex gap-1">
                        {['1', '2', '3', '4', '5'].map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setSpineInclinationLevel(lvl)}
                            className={cn(
                              'size-9 rounded-xl text-xs font-black transition border',
                              spineInclinationLevel === lvl ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 hover:bg-slate-100'
                            )}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5 rounded-xl bg-white p-4 border">
                    <Label className="font-bold text-xs uppercase tracking-wider text-slate-700">
                      ROTACIÓN: I / D (1 AL 5)
                    </Label>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex rounded-xl bg-muted p-1">
                        <button
                          type="button"
                          onClick={() => setSpineRotationDir('I')}
                          className={cn(
                            'rounded-lg px-3 py-1.5 text-xs font-black transition',
                            spineRotationDir === 'I' ? 'bg-cyan-700 text-white shadow-sm' : 'text-slate-600'
                          )}
                        >
                          I (Izquierda)
                        </button>
                        <button
                          type="button"
                          onClick={() => setSpineRotationDir('D')}
                          className={cn(
                            'rounded-lg px-3 py-1.5 text-xs font-black transition',
                            spineRotationDir === 'D' ? 'bg-cyan-700 text-white shadow-sm' : 'text-slate-600'
                          )}
                        >
                          D (Derecha)
                        </button>
                      </div>
                      <div className="flex gap-1">
                        {['1', '2', '3', '4', '5'].map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setSpineRotationLevel(lvl)}
                            className={cn(
                              'size-9 rounded-xl text-xs font-black transition border',
                              spineRotationLevel === lvl ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 hover:bg-slate-100'
                            )}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5 rounded-xl bg-white p-4 border">
                    <Label className="font-bold text-xs uppercase tracking-wider text-slate-700">
                      EXTENSIÓN: (1 AL 5)
                    </Label>
                    <div className="flex gap-2">
                      {['1', '2', '3', '4', '5'].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setSpineExtension(lvl)}
                          className={cn(
                            'size-11 rounded-xl text-sm font-black transition border flex-1',
                            spineExtension === lvl ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-slate-50 hover:bg-slate-100'
                          )}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2.5 rounded-xl bg-white p-4 border">
                    <Label className="font-bold text-xs uppercase tracking-wider text-slate-700">
                      ILÍACO: DERECHO / IZQUIERDO
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Derecho', 'Izquierdo'].map((side) => (
                        <button
                          key={side}
                          type="button"
                          onClick={() => setIliac(side as 'Derecho' | 'Izquierdo')}
                          className={cn(
                            'h-11 rounded-xl text-sm font-bold border transition',
                            iliac === side ? 'bg-cyan-700 text-white border-cyan-700 shadow-sm' : 'bg-white hover:bg-slate-50'
                          )}
                        >
                          {side}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2.5 rounded-xl bg-white p-4 border">
                    <Label className="font-bold text-xs uppercase tracking-wider text-slate-700">
                      MARCHA CON PIE PUNTAS
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Normal', 'Dificultad', 'Dolor', 'No puede'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setGaitTiptoes(opt)}
                          className={cn(
                            'h-10 rounded-xl text-xs font-bold border transition',
                            gaitTiptoes === opt ? 'bg-slate-900 text-white border-slate-900' : 'bg-white hover:bg-slate-50'
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2.5 rounded-xl bg-white p-4 border">
                    <Label className="font-bold text-xs uppercase tracking-wider text-slate-700">
                      MARCHA CON PIE TALONES
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Normal', 'Dificultad', 'Dolor', 'No puede'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setGaitHeels(opt)}
                          className={cn(
                            'h-10 rounded-xl text-xs font-bold border transition',
                            gaitHeels === opt ? 'bg-slate-900 text-white border-slate-900' : 'bg-white hover:bg-slate-50'
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm font-medium text-red-800">
                  {error}
                </div>
              )}

              <div className="flex justify-end pt-2">
                <Button
                  type="button"
                  onClick={() => {
                    if (!firstName.trim() || !lastName.trim()) {
                      setError('Por favor ingresa los nombres y apellidos antes de continuar.');
                      return;
                    }
                    setError('');
                    changeStep(2);
                  }}
                  className="h-12 px-7 rounded-xl font-bold bg-cyan-700 hover:bg-cyan-800 text-white shadow-md"
                >
                  Continuar a Página 2: Postura y Palpación <ArrowRight className="ml-2 size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}        {/* ==================== PÁGINA 2 ==================== */}
        {step === 2 && (
          <Card className="rounded-3xl border-0 shadow-sm bg-white">
            <CardHeader className="pb-4 border-b">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-2xl bg-cyan-100 text-cyan-900">
                  <Activity className="size-5" />
                </span>
                <div>
                  <CardTitle className="text-xl font-extrabold text-slate-950">
                    Página 2: Evaluación Postural y Palpación
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Posición prono, largo de piernas, palpación estática y dinámica, escaneos lumbar y torácico.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 sm:p-8 space-y-7">
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-cyan-800 mb-4">
                  Evaluación Postural y Miembros Inferiores
                </h3>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="pronePos">POSICIÓN PRONO</Label>
                    <Input
                      id="pronePos"
                      placeholder="Observaciones en prono (simetría, inclinación...)"
                      value={pronePosition}
                      onChange={(e) => setPronePosition(e.target.value)}
                      className="h-11 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>LARGO DE LAS PIERNAS: DERECHA / IZQUIERDA</Label>
                    <div className="flex gap-2">
                      {(['Derecha', 'Izquierda', 'Iguales'] as const).map((side) => (
                        <button
                          key={side}
                          type="button"
                          onClick={() => setLegLengthSide(side)}
                          className={cn(
                            'h-11 flex-1 rounded-xl text-xs sm:text-sm font-bold border transition',
                            legLengthSide === side
                              ? 'bg-cyan-700 text-white border-cyan-700 shadow-sm'
                              : 'bg-white hover:bg-slate-50 text-slate-700'
                          )}
                        >
                          {side}
                        </button>
                      ))}
                    </div>
                    {legLengthSide !== 'Iguales' && (
                      <Input
                        placeholder="Diferencia aprox. (ej. Corta 1 cm, Corta 5 mm)"
                        value={legLengthDiff}
                        onChange={(e) => setLegLengthDiff(e.target.value)}
                        className="h-10 rounded-xl mt-2"
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>SACRO ILÍACO DOLOR: ( SI ) / ( NO )</Label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        {(['SI', 'NO'] as const).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setSacroiliacPain(opt)}
                            className={cn(
                              'h-11 flex-1 rounded-xl text-sm font-black border transition',
                              sacroiliacPain === opt
                                ? opt === 'SI'
                                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                                  : 'bg-slate-900 text-white border-slate-900 shadow-sm'
                                : 'bg-white hover:bg-slate-50 text-slate-700'
                            )}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      {sacroiliacPain === 'SI' && (
                        <div className="flex gap-2 pt-1">
                          {(['Derecho', 'Izquierdo', 'Bilateral'] as const).map((side) => (
                            <button
                              key={side}
                              type="button"
                              onClick={() => setSacroiliacSide(side)}
                              className={cn(
                                'h-11 flex-1 rounded-xl text-xs font-bold border transition',
                                sacroiliacSide === side ? 'bg-cyan-700 text-white' : 'bg-white'
                              )}
                            >
                              {side}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cervicalSynd">SÍNDROME CERVICAL</Label>
                    <Input
                      id="cervicalSynd"
                      placeholder="Observaciones de síndrome cervical..."
                      value={cervicalSyndrome}
                      onChange={(e) => setCervicalSyndrome(e.target.value)}
                      className="h-11 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-5">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-cyan-800">
                  Palpación y Resistencia
                </h3>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="dynPalp">PALPACIÓN DINÁMICA</Label>
                    <Textarea
                      id="dynPalp"
                      placeholder="Respuesta al movimiento articular y dinamismo segmentario..."
                      value={dynamicPalpation}
                      onChange={(e) => setDynamicPalpation(e.target.value)}
                      className="min-h-20 rounded-xl bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="statPalp">PALPACIÓN ESTÁTICA</Label>
                    <Textarea
                      id="statPalp"
                      placeholder="Zonas edematosas, dolor a la presión, desalineaciones..."
                      value={staticPalpation}
                      onChange={(e) => setStaticPalpation(e.target.value)}
                      className="min-h-20 rounded-xl bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>PIERNA QUE MÁS RESISTE: DERECHA ( D ) / IZQUIERDA ( I )</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'D', label: 'Derecha ( D )' },
                        { id: 'I', label: 'Izquierda ( I )' },
                        { id: 'Neutro', label: 'Sin diferencia' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setStrongerLeg(item.id as 'D' | 'I' | 'Neutro')}
                          className={cn(
                            'h-11 rounded-xl text-xs sm:text-sm font-bold border transition',
                            strongerLeg === item.id ? 'bg-cyan-700 text-white border-cyan-700 shadow-sm' : 'bg-white hover:bg-slate-50'
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="muscleTens">TENSIÓN MUSCULAR O SENSIBILIDAD</Label>
                    <Input
                      id="muscleTens"
                      placeholder="Hipertonía, espasmo lumbar, trapecios, etc."
                      value={muscleTension}
                      onChange={(e) => setMuscleTension(e.target.value)}
                      className="h-11 rounded-xl bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border-2 border-slate-200 bg-white p-5 space-y-6">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                  Escaneos Segmentarios
                </h3>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-3 rounded-2xl bg-cyan-50/40 p-4 border border-cyan-100">
                    <h4 className="font-extrabold text-sm text-cyan-950">LUMBAR ESCANEO</h4>
                    <div className="space-y-2">
                      <Label htmlFor="lumbHypo">HIPOMOVILIDAD: ( )</Label>
                      <Input
                        id="lumbHypo"
                        placeholder="Niveles con hipomovilidad (ej. L4-L5, L5-S1)"
                        value={lumbarHypomobility}
                        onChange={(e) => setLumbarHypomobility(e.target.value)}
                        className="h-11 rounded-xl bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>SÍ O NO: ( )</Label>
                      <div className="flex gap-2">
                        {['SI', 'NO'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setLumbarYesNo(opt as 'SI' | 'NO')}
                            className={cn(
                              'h-10 flex-1 rounded-xl text-xs font-black border transition',
                              lumbarYesNo === opt ? 'bg-slate-900 text-white border-slate-900' : 'bg-white'
                            )}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lumbScanNotes">Notas Lumbar</Label>
                      <Input
                        id="lumbScanNotes"
                        placeholder="Detalles adicionales del escaneo lumbar"
                        value={lumbarScan}
                        onChange={(e) => setLumbarScan(e.target.value)}
                        className="h-11 rounded-xl bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 rounded-2xl bg-cyan-50/40 p-4 border border-cyan-100">
                    <h4 className="font-extrabold text-sm text-cyan-950">TORÁCICO ESCANEO</h4>
                    <div className="space-y-2">
                      <Label htmlFor="thorHypo">HIPOMOVILIDAD: ( )</Label>
                      <Input
                        id="thorHypo"
                        placeholder="Niveles torácicos con hipomovilidad (ej. T3-T6)"
                        value={thoracicHypomobility}
                        onChange={(e) => setThoracicHypomobility(e.target.value)}
                        className="h-11 rounded-xl bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="thorList">NIVEL LISTADO: ( )</Label>
                      <Input
                        id="thorList"
                        placeholder="Listado quiropráctico torácico (ej. T4 PL, T6 PR)"
                        value={thoracicListingLevel}
                        onChange={(e) => setThoracicListingLevel(e.target.value)}
                        className="h-11 rounded-xl bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="thorScanNotes">Notas Torácico</Label>
                      <Input
                        id="thorScanNotes"
                        placeholder="Detalles adicionales del escaneo torácico"
                        value={thoracicScan}
                        onChange={(e) => setThoracicScan(e.target.value)}
                        className="h-11 rounded-xl bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => changeStep(1)}
                  className="h-12 px-6 rounded-xl font-bold border-slate-300 hover:bg-slate-100"
                >
                  <ArrowLeft className="mr-2 size-4" /> Anterior: Página 1
                </Button>
                <Button
                  type="button"
                  onClick={() => changeStep(3)}
                  className="h-12 px-7 rounded-xl font-bold bg-cyan-700 hover:bg-cyan-800 text-white shadow-md"
                >
                  Continuar a Página 3: Cervical, Plan y Pago <ArrowRight className="ml-2 size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ==================== PÁGINA 3 ==================== */}
        {step === 3 && (
          <Card className="rounded-3xl border-0 shadow-sm bg-white">
            <CardHeader className="pb-4 border-b">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-2xl bg-cyan-100 text-cyan-900">
                  <Sparkles className="size-5" />
                </span>
                <div>
                  <CardTitle className="text-xl font-extrabold text-slate-950">
                    Página 3: Evaluación Cervical y Plan de Tratamiento
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Ajuste cervical, serie listada, plan de sesiones y emisión de tarjeta QR.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 sm:p-8 space-y-7">
              <div className="rounded-2xl border-2 border-cyan-100 bg-cyan-50/40 p-5 sm:p-6 space-y-5">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-cyan-950">
                  Evaluación Cervical
                </h3>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="cervRot">CERVICAL: C2 y C7 Rotación</Label>
                    <Input
                      id="cervRot"
                      placeholder="Ej. C2 Rotación Derecha, C7 Rotación Izquierda con fijación"
                      value={cervicalC2C7Rotation}
                      onChange={(e) => setCervicalC2C7Rotation(e.target.value)}
                      className="h-11 rounded-xl bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cervListing">NIVEL LISTADO (C1 al C7)</Label>
                    <Select value={cervicalListingLevel} onValueChange={setCervicalListingLevel}>
                      <SelectTrigger id="cervListing" className="h-11 rounded-xl bg-white">
                        <SelectValue placeholder="Seleccionar nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        {['Atlas (C1)', 'Axis (C2)', 'C3', 'C4', 'C5', 'C6', 'C7'].map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cervSeries">SERIE: 1 al 7</Label>
                    <Select value={cervicalSeries} onValueChange={setCervicalSeries}>
                      <SelectTrigger id="cervSeries" className="h-11 rounded-xl bg-white">
                        <SelectValue placeholder="Seleccionar serie" />
                      </SelectTrigger>
                      <SelectContent>
                        {['Serie 1', 'Serie 2', 'Serie 3', 'Serie 4', 'Serie 5', 'Serie 6', 'Serie 7', 'Serie 1 al 7'].map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="clinNotes">INDICACIONES Y NOTAS CLÍNICAS</Label>
                    <Textarea
                      id="clinNotes"
                      placeholder="Recomendaciones quiroprácticas, técnicas de ajuste (Gonstead, Thompson, Diversified), post-atención..."
                      value={clinicalNotes}
                      onChange={(e) => setClinicalNotes(e.target.value)}
                      className="min-h-24 rounded-xl bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border-2 border-emerald-100 bg-emerald-50/40 p-5 sm:p-6 space-y-5">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-10 place-items-center rounded-xl bg-emerald-700 text-white shadow-sm">
                    <WalletCards className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-extrabold text-base text-emerald-950">
                      Plan de Tratamiento, Sesiones y Pago
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Define las sesiones pactadas, frecuencia, costo del plan y abono inicial en caja.
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
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
                            'h-10 flex-1 rounded-xl text-xs font-black border transition',
                            totalSessions === num
                              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                              : 'bg-white hover:bg-slate-100 text-slate-700'
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
                      placeholder="Otro número"
                      value={totalSessions}
                      onChange={(e) => setTotalSessions(e.target.value)}
                      className="h-10 rounded-xl bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sessPerWeek" className="font-bold text-xs uppercase tracking-wider text-slate-700">
                      FRECUENCIA SEMANAL
                    </Label>
                    <div className="flex gap-1.5">
                      {['1', '2', '3'].map((freq) => (
                        <button
                          key={freq}
                          type="button"
                          onClick={() => setSessionsPerWeek(freq)}
                          className={cn(
                            'h-10 flex-1 rounded-xl text-xs font-black border transition',
                            sessionsPerWeek === freq
                              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                              : 'bg-white hover:bg-slate-100 text-slate-700'
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
                      placeholder="Otra frec."
                      value={sessionsPerWeek}
                      onChange={(e) => setSessionsPerWeek(e.target.value)}
                      className="h-10 rounded-xl bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="appDate" className="font-bold text-xs uppercase tracking-wider text-slate-700">
                      FECHA PRIMERA CITA
                    </Label>
                    <Input
                      id="appDate"
                      type="date"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="h-10 rounded-xl bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="appTime" className="font-bold text-xs uppercase tracking-wider text-slate-700">
                      HORA DE LA CITA
                    </Label>
                    <Input
                      id="appTime"
                      type="time"
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      className="h-10 rounded-xl bg-white"
                    />
                  </div>
                </div>

                {/* Bloque Financiero y Pagos */}
                <div className="rounded-2xl bg-white p-5 border border-emerald-200 space-y-4 shadow-xs">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
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
                          className="h-11 pl-9 rounded-xl font-bold text-base"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="initPayment" className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                          <CreditCard className="size-4 text-emerald-700" />
                          ABONO O PAGO INICIAL (S/)
                        </Label>
                        <span className="text-[11px] text-muted-foreground">Opcional</span>
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
                          className="h-11 pl-9 rounded-xl font-bold text-base"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="payMethod" className="font-bold text-xs text-slate-800">
                        FORMA DE PAGO DEL ABONO
                      </Label>
                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger id="payMethod" className="h-11 rounded-xl bg-white font-semibold">
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
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-xs font-semibold text-slate-500">Atajos de pago:</span>
                    <button
                      type="button"
                      onClick={() => setInitialPayment('0')}
                      className={cn(
                        'text-xs px-2.5 py-1 rounded-lg border font-bold transition',
                        initialPaymentNum === 0 ? 'bg-slate-900 text-white' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
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
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
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
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                          )}
                        >
                          Pago completo 100% (S/ {totalAmountNum.toFixed(2)})
                        </button>
                      </>
                    )}
                  </div>

                  {/* Resumen financiero */}
                  <div className="grid gap-3 sm:grid-cols-3 pt-2">
                    <div className="rounded-xl bg-slate-50 p-3 border">
                      <span className="text-xs text-muted-foreground block">Monto Total del Plan</span>
                      <strong className="text-lg font-black text-slate-900">
                        S/ {totalAmountNum.toFixed(2)}
                      </strong>
                    </div>
                    <div className="rounded-xl bg-emerald-50 p-3 border border-emerald-200">
                      <span className="text-xs text-emerald-800 font-semibold block">Abono Inicial en Caja</span>
                      <strong className="text-lg font-black text-emerald-900">
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
                      <span className="text-xs font-semibold block opacity-80">Saldo Pendiente por Cobrar</span>
                      <strong className="text-lg font-black block">
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

                  <div className="space-y-2">
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
                <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm font-medium text-red-800">
                  {error}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => changeStep(2)}
                  className="h-12 w-full sm:w-auto px-6 rounded-xl font-bold border-slate-300 hover:bg-slate-100"
                >
                  <ArrowLeft className="mr-2 size-4" /> Anterior: Página 2
                </Button>

                <Button
                  type="submit"
                  disabled={saving}
                  className="h-14 w-full sm:w-auto px-8 rounded-2xl text-base font-black bg-cyan-700 hover:bg-cyan-800 text-white shadow-xl shadow-cyan-700/25"
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
        )}
      </form>
    </div>
  );
}