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
  onViewPatients,
}: {
  onSaved: () => void;
  onFinished: (patient: Patient) => void;
  onViewPatients?: () => void;
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

  // Evaluacion de Columna (Valores separados I y D de 1 al 5)
  const [spineInclinationLeft, setSpineInclinationLeft] = useState('1');
  const [spineInclinationRight, setSpineInclinationRight] = useState('1');
  const [spineRotationLeft, setSpineRotationLeft] = useState('1');
  const [spineRotationRight, setSpineRotationRight] = useState('1');
  const [spineExtension, setSpineExtension] = useState('1');
  const [iliacLeft, setIliacLeft] = useState('1');
  const [iliacRight, setIliacRight] = useState('1');
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
      spineInclination: `Izq: ${spineInclinationLeft}/5 • Der: ${spineInclinationRight}/5`,
      spineRotation: `Izq: ${spineRotationLeft}/5 • Der: ${spineRotationRight}/5`,
      spineExtension: `Dolor: ${spineExtension}/5`,
      iliac: `Izq: ${iliacLeft}/5 • Der: ${iliacRight}/5`,
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
    setPainDurationHours('');
    setPainLevel(5);
    setGeneralHealth('Bueno');
    setSleepHours('7 horas');
    setIsPregnant('No');
    setPregnancyTime('');
    setMedications('');
    setSpineInclinationLeft('1');
    setSpineInclinationRight('1');
    setSpineRotationLeft('1');
    setSpineRotationRight('1');
    setSpineExtension('1');
    setIliacLeft('1');
    setIliacRight('1');
    setGaitTiptoes('Normal');
    setGaitHeels('Normal');
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
                <span className="text-slate-500 font-medium block">Plan Contratado</span>
                <strong className="text-slate-900 font-bold">{totalSessions || 8} sesiones ({sessionsPerWeek}/sem)</strong>
              </div>
              <div className="sm:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-cyan-100/60">
                <div className="rounded-lg bg-white p-2 border">
                  <span className="text-[11px] text-slate-400 block font-semibold">Inclinación (I/D)</span>
                  <span className="font-black text-cyan-900 text-xs">I: {spineInclinationLeft}/5 • D: {spineInclinationRight}/5</span>
                </div>
                <div className="rounded-lg bg-white p-2 border">
                  <span className="text-[11px] text-slate-400 block font-semibold">Rotación (I/D)</span>
                  <span className="font-black text-cyan-900 text-xs">I: {spineRotationLeft}/5 • D: {spineRotationRight}/5</span>
                </div>
                <div className="rounded-lg bg-white p-2 border">
                  <span className="text-[11px] text-slate-400 block font-semibold">Extensión</span>
                  <span className="font-black text-cyan-900 text-xs">{spineExtension} / 5</span>
                </div>
                <div className="rounded-lg bg-white p-2 border">
                  <span className="text-[11px] text-slate-400 block font-semibold">Ilíaco (I/D)</span>
                  <span className="font-black text-cyan-900 text-xs">I: {iliacLeft}/5 • D: {iliacRight}/5</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              onClick={() => onFinished(result.patient)}
              className="h-12 w-full sm:w-auto rounded-xl px-7 font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-md"
            >
              <FileText className="mr-2 size-4" /> Abrir expediente clínico completo
            </Button>
            {onViewPatients && (
              <Button
                variant="outline"
                onClick={onViewPatients}
                className="h-12 w-full sm:w-auto rounded-xl px-5 font-bold border-cyan-300 text-cyan-900 hover:bg-cyan-50"
              >
                <Users className="mr-2 size-4 text-cyan-700" /> Ir a lista de Pacientes
              </Button>
            )}
            <Button
              variant="outline"
              onClick={resetForm}
              className="h-12 w-full sm:w-auto rounded-xl px-5 font-bold border-slate-300 hover:bg-slate-50"
            >
              <Plus className="mr-2 size-4" /> Registrar otro
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div ref={formTopRef} className="space-y-4 scroll-mt-20">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ==================== PÁGINA 1 ==================== */}
        {step === 1 && (
          <Card className="rounded-2xl border-0 shadow-sm bg-white overflow-hidden">
            <CardHeader className="py-3 px-4 sm:px-6 border-b bg-slate-50/50">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-7 place-items-center rounded-lg bg-cyan-700 text-white text-xs font-black shadow-xs">
                    1 / 3
                  </span>
                  <div>
                    <CardTitle className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      Página 1: Ficha de Anamnesis y Evaluación
                    </CardTitle>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      Datos personales, motivo de consulta y evaluación preliminar de columna.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0" title="Paso 1 de 3">
                  <span className="h-1.5 w-6 rounded-full bg-cyan-700" />
                  <span className="h-1.5 w-2 rounded-full bg-slate-200" />
                  <span className="h-1.5 w-2 rounded-full bg-slate-200" />
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
                    <Label htmlFor="birthDate">F/NACIMIENTO</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={birthDate}
                      onChange={(e) => handleBirthDate(e.target.value)}
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
                    <Select value={sex} onValueChange={setSex}>
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
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="address">DIRECCIÓN</Label>
                    <Input
                      id="address"
                      placeholder="Av. / Calle / Distrito"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="h-10 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-1">
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
                  Queja Principal y Estado de Salud
                </h3>

                <div className="space-y-1.5">
                  <Label htmlFor="mainComplaint">QUEJA PRINCIPAL (Motivo de consulta)</Label>
                  <Textarea
                    id="mainComplaint"
                    placeholder="Describe los dolores, zonas afectadas, inicio y molestias que siente el paciente..."
                    value={mainComplaint}
                    onChange={(e) => setMainComplaint(e.target.value)}
                    className="min-h-16 rounded-xl"
                  />
                </div>

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

              <div className="rounded-xl border border-cyan-100 bg-cyan-50/40 p-3.5 sm:p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <HeartPulse className="size-4.5 text-cyan-800" />
                  <h3 className="font-extrabold text-xs sm:text-sm text-cyan-950 uppercase tracking-wide">
                    EVALUACIÓN DE LA COLUMNA VERTEBRAL
                  </h3>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {/* 1. INCLINACIÓN */}
                  <div className="space-y-2 rounded-xl bg-white p-3 border shadow-xs">
                    <div className="flex items-center justify-between">
                      <Label className="font-bold text-xs uppercase tracking-wider text-slate-800">
                        INCLINACIÓN
                      </Label>
                      <span className="text-[11px] font-semibold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                        Escala 1 al 5
                      </span>
                    </div>

                    {/* Izquierda */}
                    <div className="rounded-lg bg-slate-50 p-2 border">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <span className="size-5 rounded-full bg-cyan-100 text-cyan-800 grid place-items-center text-[11px] font-black">I</span>
                          Izquierda:
                        </span>
                        <span className="text-xs font-black text-cyan-900">
                          Dolor: {spineInclinationLeft} / 5
                        </span>
                      </div>
                      <div className="grid grid-cols-5 gap-1.5">
                        {['1', '2', '3', '4', '5'].map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setSpineInclinationLeft(lvl)}
                            className={cn(
                              'h-8.5 rounded-lg text-xs font-black transition border',
                              spineInclinationLeft === lvl
                                ? 'bg-cyan-700 text-white border-cyan-800 shadow-xs ring-1 ring-cyan-400/40'
                                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                            )}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Derecha */}
                    <div className="rounded-lg bg-slate-50 p-2 border">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <span className="size-5 rounded-full bg-cyan-100 text-cyan-800 grid place-items-center text-[11px] font-black">D</span>
                          Derecha:
                        </span>
                        <span className="text-xs font-black text-cyan-900">
                          Dolor: {spineInclinationRight} / 5
                        </span>
                      </div>
                      <div className="grid grid-cols-5 gap-1.5">
                        {['1', '2', '3', '4', '5'].map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setSpineInclinationRight(lvl)}
                            className={cn(
                              'h-8.5 rounded-lg text-xs font-black transition border',
                              spineInclinationRight === lvl
                                ? 'bg-cyan-700 text-white border-cyan-800 shadow-xs ring-1 ring-cyan-400/40'
                                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                            )}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 2. ROTACIÓN */}
                  <div className="space-y-2 rounded-xl bg-white p-3 border shadow-xs">
                    <div className="flex items-center justify-between">
                      <Label className="font-bold text-xs uppercase tracking-wider text-slate-800">
                        ROTACIÓN
                      </Label>
                      <span className="text-[11px] font-semibold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                        Escala 1 al 5
                      </span>
                    </div>

                    {/* Izquierda */}
                    <div className="rounded-lg bg-slate-50 p-2 border">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <span className="size-5 rounded-full bg-cyan-100 text-cyan-800 grid place-items-center text-[11px] font-black">I</span>
                          Izquierda:
                        </span>
                        <span className="text-xs font-black text-cyan-900">
                          Dolor: {spineRotationLeft} / 5
                        </span>
                      </div>
                      <div className="grid grid-cols-5 gap-1.5">
                        {['1', '2', '3', '4', '5'].map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setSpineRotationLeft(lvl)}
                            className={cn(
                              'h-8.5 rounded-lg text-xs font-black transition border',
                              spineRotationLeft === lvl
                                ? 'bg-cyan-700 text-white border-cyan-800 shadow-xs ring-1 ring-cyan-400/40'
                                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                            )}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Derecha */}
                    <div className="rounded-lg bg-slate-50 p-2 border">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <span className="size-5 rounded-full bg-cyan-100 text-cyan-800 grid place-items-center text-[11px] font-black">D</span>
                          Derecha:
                        </span>
                        <span className="text-xs font-black text-cyan-900">
                          Dolor: {spineRotationRight} / 5
                        </span>
                      </div>
                      <div className="grid grid-cols-5 gap-1.5">
                        {['1', '2', '3', '4', '5'].map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setSpineRotationRight(lvl)}
                            className={cn(
                              'h-8.5 rounded-lg text-xs font-black transition border',
                              spineRotationRight === lvl
                                ? 'bg-cyan-700 text-white border-cyan-800 shadow-xs ring-1 ring-cyan-400/40'
                                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                            )}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 3. EXTENSIÓN */}
                  <div className="space-y-2 rounded-xl bg-white p-3 border shadow-xs">
                    <div className="flex items-center justify-between">
                      <Label className="font-bold text-xs uppercase tracking-wider text-slate-800">
                        EXTENSIÓN
                      </Label>
                      <span className="text-xs font-black text-cyan-900">
                        Dolor: {spineExtension} / 5
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Nivel de molestia al realizar extensión posterior
                    </p>
                    <div className="grid grid-cols-5 gap-1.5 pt-0.5">
                      {['1', '2', '3', '4', '5'].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setSpineExtension(lvl)}
                          className={cn(
                            'h-8.5 rounded-lg text-xs font-black transition border',
                            spineExtension === lvl
                              ? 'bg-slate-900 text-white border-slate-900 shadow-xs ring-1 ring-slate-400/40'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                          )}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 font-medium px-0.5">
                      <span>1: Sin dolor</span>
                      <span>5: Severo</span>
                    </div>
                  </div>

                  {/* 4. ILÍACO */}
                  <div className="space-y-2 rounded-xl bg-white p-3 border shadow-xs">
                    <div className="flex items-center justify-between">
                      <Label className="font-bold text-xs uppercase tracking-wider text-slate-800">
                        ILÍACO
                      </Label>
                      <span className="text-[11px] font-semibold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                        Escala 1 al 5
                      </span>
                    </div>

                    {/* Izquierdo */}
                    <div className="rounded-lg bg-slate-50 p-2 border">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <span className="size-5 rounded-full bg-cyan-100 text-cyan-800 grid place-items-center text-[11px] font-black">I</span>
                          Izquierdo:
                        </span>
                        <span className="text-xs font-black text-cyan-900">
                          Dolor: {iliacLeft} / 5
                        </span>
                      </div>
                      <div className="grid grid-cols-5 gap-1.5">
                        {['1', '2', '3', '4', '5'].map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setIliacLeft(lvl)}
                            className={cn(
                              'h-8.5 rounded-lg text-xs font-black transition border',
                              iliacLeft === lvl
                                ? 'bg-cyan-700 text-white border-cyan-800 shadow-xs ring-1 ring-cyan-400/40'
                                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                            )}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Derecho */}
                    <div className="rounded-lg bg-slate-50 p-2 border">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <span className="size-5 rounded-full bg-cyan-100 text-cyan-800 grid place-items-center text-[11px] font-black">D</span>
                          Derecho:
                        </span>
                        <span className="text-xs font-black text-cyan-900">
                          Dolor: {iliacRight} / 5
                        </span>
                      </div>
                      <div className="grid grid-cols-5 gap-1.5">
                        {['1', '2', '3', '4', '5'].map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setIliacRight(lvl)}
                            className={cn(
                              'h-8.5 rounded-lg text-xs font-black transition border',
                              iliacRight === lvl
                                ? 'bg-cyan-700 text-white border-cyan-800 shadow-xs ring-1 ring-cyan-400/40'
                                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                            )}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 rounded-xl bg-white p-3 border">
                    <Label className="font-bold text-xs uppercase tracking-wider text-slate-800">
                      MARCHA CON PIE PUNTAS
                    </Label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {['Normal', 'Dificultad', 'Dolor', 'No puede'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setGaitTiptoes(opt)}
                          className={cn(
                            'h-8.5 rounded-lg text-xs font-bold border transition',
                            gaitTiptoes === opt ? 'bg-slate-900 text-white border-slate-900' : 'bg-white hover:bg-slate-50 text-slate-800'
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5 rounded-xl bg-white p-3 border">
                    <Label className="font-bold text-xs uppercase tracking-wider text-slate-800">
                      MARCHA CON PIE TALONES
                    </Label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {['Normal', 'Dificultad', 'Dolor', 'No puede'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setGaitHeels(opt)}
                          className={cn(
                            'h-8.5 rounded-lg text-xs font-bold border transition',
                            gaitHeels === opt ? 'bg-slate-900 text-white border-slate-900' : 'bg-white hover:bg-slate-50 text-slate-800'
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
          <Card className="rounded-2xl border-0 shadow-sm bg-white overflow-hidden">
            <CardHeader className="py-3 px-4 sm:px-6 border-b bg-slate-50/50">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-7 place-items-center rounded-lg bg-cyan-700 text-white text-xs font-black shadow-xs">
                    2 / 3
                  </span>
                  <div>
                    <CardTitle className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      Página 2: Evaluación Postural y Palpación
                    </CardTitle>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      Posición prono, largo de piernas, palpación estática y dinámica, escaneos lumbar y torácico.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0" title="Paso 2 de 3">
                  <span className="h-1.5 w-2 rounded-full bg-slate-200" />
                  <span className="h-1.5 w-6 rounded-full bg-cyan-700" />
                  <span className="h-1.5 w-2 rounded-full bg-slate-200" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 space-y-3.5">
              <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-3.5 space-y-3">
                <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-cyan-900">
                  Evaluación Postural y Miembros Inferiores
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="pronePos">POSICIÓN PRONO</Label>
                    <Input
                      id="pronePos"
                      placeholder="Observaciones en prono (simetría, inclinación...)"
                      value={pronePosition}
                      onChange={(e) => setPronePosition(e.target.value)}
                      className="h-10 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>LARGO DE LAS PIERNAS: DERECHA / IZQUIERDA</Label>
                    <div className="flex gap-1.5">
                      {(['Derecha', 'Izquierda', 'Iguales'] as const).map((side) => (
                        <button
                          key={side}
                          type="button"
                          onClick={() => setLegLengthSide(side)}
                          className={cn(
                            'h-9 flex-1 rounded-lg text-xs sm:text-sm font-bold border transition',
                            legLengthSide === side
                              ? 'bg-cyan-700 text-white border-cyan-700 shadow-xs'
                              : 'bg-white hover:bg-slate-50 text-slate-800'
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
                        className="h-9 rounded-lg mt-1.5 font-medium text-xs sm:text-sm"
                      />
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label>SACRO ILÍACO DOLOR: ( SI ) / ( NO )</Label>
                    <div className="space-y-1.5">
                      <div className="flex gap-1.5">
                        {(['SI', 'NO'] as const).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setSacroiliacPain(opt)}
                            className={cn(
                              'h-9 flex-1 rounded-lg text-xs sm:text-sm font-black border transition',
                              sacroiliacPain === opt
                                ? opt === 'SI'
                                ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                                : 'bg-slate-900 text-white border-slate-900 shadow-xs'
                                : 'bg-white hover:bg-slate-50 text-slate-800'
                            )}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      {sacroiliacPain === 'SI' && (
                        <div className="flex gap-1.5 pt-0.5">
                          {(['Derecho', 'Izquierdo', 'Bilateral'] as const).map((side) => (
                            <button
                              key={side}
                              type="button"
                              onClick={() => setSacroiliacSide(side)}
                              className={cn(
                                'h-8 flex-1 rounded-lg text-xs font-bold border transition',
                                sacroiliacSide === side ? 'bg-cyan-700 text-white font-black' : 'bg-white'
                              )}
                            >
                              {side}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="cervicalSynd">SÍNDROME CERVICAL</Label>
                    <Input
                      id="cervicalSynd"
                      placeholder="Observaciones de síndrome cervical..."
                      value={cervicalSyndrome}
                      onChange={(e) => setCervicalSyndrome(e.target.value)}
                      className="h-10 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-3.5 space-y-3">
                <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-cyan-900">
                  Palpación y Resistencia
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="dynPalp">PALPACIÓN DINÁMICA</Label>
                    <Textarea
                      id="dynPalp"
                      placeholder="Respuesta al movimiento articular y dinamismo segmentario..."
                      value={dynamicPalpation}
                      onChange={(e) => setDynamicPalpation(e.target.value)}
                      className="min-h-16 rounded-xl bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="statPalp">PALPACIÓN ESTÁTICA</Label>
                    <Textarea
                      id="statPalp"
                      placeholder="Zonas edematosas, dolor a la presión, desalineaciones..."
                      value={staticPalpation}
                      onChange={(e) => setStaticPalpation(e.target.value)}
                      className="min-h-16 rounded-xl bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>PIERNA QUE MÁS RESISTE: DERECHA ( D ) / IZQUIERDA ( I )</Label>
                    <div className="grid grid-cols-3 gap-1.5">
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
                            'h-9 rounded-lg text-xs sm:text-sm font-bold border transition',
                            strongerLeg === item.id ? 'bg-cyan-700 text-white border-cyan-700 shadow-xs' : 'bg-white hover:bg-slate-50 text-slate-800'
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="muscleTens">TENSIÓN MUSCULAR O SENSIBILIDAD</Label>
                    <Input
                      id="muscleTens"
                      placeholder="Hipertonía, espasmo lumbar, trapecios, etc."
                      value={muscleTension}
                      onChange={(e) => setMuscleTension(e.target.value)}
                      className="h-10 rounded-xl bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-3">
                <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900">
                  Escaneos Segmentarios
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2 rounded-xl bg-cyan-50/40 p-3 border border-cyan-100">
                    <h4 className="font-extrabold text-xs text-cyan-950 uppercase">LUMBAR ESCANEO</h4>
                    <div className="space-y-1">
                      <Label htmlFor="lumbHypo" className="text-xs">HIPOMOVILIDAD</Label>
                      <Input
                        id="lumbHypo"
                        placeholder="Niveles con hipomovilidad (ej. L4-L5, L5-S1)"
                        value={lumbarHypomobility}
                        onChange={(e) => setLumbarHypomobility(e.target.value)}
                        className="h-9 rounded-lg bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">SÍ O NO</Label>
                      <div className="flex gap-1.5">
                        {['SI', 'NO'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setLumbarYesNo(opt as 'SI' | 'NO')}
                            className={cn(
                              'h-8.5 flex-1 rounded-lg text-xs font-black border transition',
                              lumbarYesNo === opt ? 'bg-slate-900 text-white border-slate-900' : 'bg-white hover:bg-slate-50 text-slate-800'
                            )}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="lumbScanNotes" className="text-xs">Notas Lumbar</Label>
                      <Input
                        id="lumbScanNotes"
                        placeholder="Detalles adicionales del escaneo lumbar"
                        value={lumbarScan}
                        onChange={(e) => setLumbarScan(e.target.value)}
                        className="h-9 rounded-lg bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 rounded-xl bg-cyan-50/40 p-3 border border-cyan-100">
                    <h4 className="font-extrabold text-xs text-cyan-950 uppercase">TORÁCICO ESCANEO</h4>
                    <div className="space-y-1">
                      <Label htmlFor="thorHypo" className="text-xs">HIPOMOVILIDAD</Label>
                      <Input
                        id="thorHypo"
                        placeholder="Niveles torácicos con hipomovilidad (ej. T3-T6)"
                        value={thoracicHypomobility}
                        onChange={(e) => setThoracicHypomobility(e.target.value)}
                        className="h-9 rounded-lg bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="thorList" className="text-xs">NIVEL LISTADO</Label>
                      <Input
                        id="thorList"
                        placeholder="Listado quiropráctico torácico (ej. T4 PL, T6 PR)"
                        value={thoracicListingLevel}
                        onChange={(e) => setThoracicListingLevel(e.target.value)}
                        className="h-9 rounded-lg bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="thorScanNotes" className="text-xs">Notas Torácico</Label>
                      <Input
                        id="thorScanNotes"
                        placeholder="Detalles adicionales del escaneo torácico"
                        value={thoracicScan}
                        onChange={(e) => setThoracicScan(e.target.value)}
                        className="h-9 rounded-lg bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-2 border-t mt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => changeStep(1)}
                  className="h-10 px-5 rounded-xl font-bold border-slate-300 hover:bg-slate-100 text-sm"
                >
                  <ArrowLeft className="mr-2 size-4" /> Anterior: Página 1
                </Button>
                <Button
                  type="button"
                  onClick={() => changeStep(3)}
                  className="h-10 px-6 rounded-xl font-bold bg-cyan-700 hover:bg-cyan-800 text-white shadow-md text-sm"
                >
                  Continuar a Página 3: Cervical, Plan y Pago <ArrowRight className="ml-2 size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ==================== PÁGINA 3 ==================== */}
        {step === 3 && (
          <Card className="rounded-2xl border-0 shadow-sm bg-white overflow-hidden">
            <CardHeader className="py-3 px-4 sm:px-6 border-b bg-slate-50/50">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-7 place-items-center rounded-lg bg-cyan-700 text-white text-xs font-black shadow-xs">
                    3 / 3
                  </span>
                  <div>
                    <CardTitle className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      Página 3: Evaluación Cervical, Plan de Tratamiento y Pago
                    </CardTitle>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      Ajuste cervical, serie listada, plan de sesiones y cobro de abono inicial.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0" title="Paso 3 de 3">
                  <span className="h-1.5 w-2 rounded-full bg-slate-200" />
                  <span className="h-1.5 w-2 rounded-full bg-slate-200" />
                  <span className="h-1.5 w-6 rounded-full bg-cyan-700" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 space-y-3.5">
              <div className="rounded-xl border border-cyan-100 bg-cyan-50/40 p-3.5 space-y-3">
                <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-cyan-950">
                  Evaluación Cervical
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="cervRot">CERVICAL: C2 y C7 Rotación</Label>
                    <Input
                      id="cervRot"
                      placeholder="Ej. C2 Rotación Derecha, C7 Rotación Izquierda con fijación"
                      value={cervicalC2C7Rotation}
                      onChange={(e) => setCervicalC2C7Rotation(e.target.value)}
                      className="h-10 rounded-xl bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="cervListing">NIVEL LISTADO (C1 al C7)</Label>
                    <Select value={cervicalListingLevel} onValueChange={setCervicalListingLevel}>
                      <SelectTrigger id="cervListing" className="h-10 rounded-xl bg-white">
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

                  <div className="space-y-1.5">
                    <Label htmlFor="cervSeries">SERIE: 1 al 7</Label>
                    <Select value={cervicalSeries} onValueChange={setCervicalSeries}>
                      <SelectTrigger id="cervSeries" className="h-10 rounded-xl bg-white">
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

                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="clinNotes">INDICACIONES Y NOTAS CLÍNICAS</Label>
                    <Textarea
                      id="clinNotes"
                      placeholder="Recomendaciones quiroprácticas, técnicas de ajuste (Gonstead, Thompson, Diversified), post-atención..."
                      value={clinicalNotes}
                      onChange={(e) => setClinicalNotes(e.target.value)}
                      className="min-h-16 rounded-xl bg-white"
                    />
                  </div>
                </div>
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

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
                      placeholder="Otro número"
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
                      {['1', '2', '3'].map((freq) => (
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
                      placeholder="Otra frec."
                      value={sessionsPerWeek}
                      onChange={(e) => setSessionsPerWeek(e.target.value)}
                      className="h-10 rounded-xl bg-white font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="appDate" className="font-bold text-xs uppercase tracking-wider text-slate-700">
                      FECHA PRIMERA CITA
                    </Label>
                    <Input
                      id="appDate"
                      type="date"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="h-10 rounded-xl bg-white font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="appTime" className="font-bold text-xs uppercase tracking-wider text-slate-700">
                      HORA DE LA CITA
                    </Label>
                    <Input
                      id="appTime"
                      type="time"
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      className="h-10 rounded-xl bg-white font-medium"
                    />
                  </div>
                </div>

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
                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
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

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => changeStep(2)}
                  className="h-11 w-full sm:w-auto px-5 rounded-xl font-bold border-slate-300 hover:bg-slate-100 text-sm"
                >
                  <ArrowLeft className="mr-2 size-4" /> Anterior: Página 2
                </Button>

                <Button
                  type="submit"
                  disabled={saving}
                  className="h-11 sm:h-12 w-full sm:w-auto px-7 rounded-xl text-sm sm:text-base font-black bg-cyan-700 hover:bg-cyan-800 text-white shadow-lg shadow-cyan-700/20"
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