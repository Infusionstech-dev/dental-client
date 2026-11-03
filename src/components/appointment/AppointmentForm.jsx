import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, CalendarDays, Clock, User, Stethoscope, Star } from 'lucide-react';
import Button from '../common/Button';
import Icon from '../common/Icon';
import Img from '../common/Img';
import EmptyState from '../common/EmptyState';
import { Field, Stepper } from '../common/ui';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { appointmentService } from '../../services/appointmentService';
import { timeSlots } from '../../data/dentists';
import { WEEKDAYS, cn, formatBDT, formatDate } from '../../utils/format';

const STEPS = ['Service', 'Dentist', 'Date', 'Time', 'Details', 'Confirm'];

// Pseudo-random but stable "already booked" slots, so the demo feels realistic.
const isMockBooked = (dentistId, date, slot) => {
  const s = `${dentistId}${date}${slot}`;
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % 4 === 0;
};

export default function AppointmentForm() {
  const [params] = useSearchParams();
  const { services, dentists, appointments, addAppointment, getService, getDentist, servicePrice, setNotifications } = useData();
  const { user } = useAuth();
  const toast = useToast();

  const presetDentist = getDentist(params.get('dentist'));
  const presetService = getService(params.get('service'));
  const [booking, setBooking] = useState({ service: presetService?.slug || null, dentistId: presetDentist?.id || null, date: null, time: null });
  const [step, setStep] = useState(presetService ? 1 : 0);
  const [done, setDone] = useState(null);

  const { register, handleSubmit, getValues, trigger, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { name: user?.name || '', email: user?.email || '', phone: user?.phone || '', age: '', gender: '', notes: '', firstVisit: 'no' },
  });

  const activeServices = services.filter((s) => s.active);
  const availableDentists = dentists.filter((d) => !booking.service || d.services.includes(booking.service));
  const dentist = getDentist(booking.dentistId);
  const service = getService(booking.service);

  const days = useMemo(() => {
    const out = [];
    for (let i = 1; out.length < 14 && i < 40; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const wd = WEEKDAYS[d.getDay()];
      out.push({ iso: d.toISOString().slice(0, 10), wd, dayNum: d.getDate(), month: d.toLocaleString('en', { month: 'short' }), available: dentist ? dentist.availability.includes(wd) : true });
    }
    return out;
  }, [dentist]);

  const slots = timeSlots.map((t) => ({
    time: t,
    taken: !!booking.date && (isMockBooked(booking.dentistId, booking.date, t) || appointments.some((a) => a.dentistId === booking.dentistId && a.date === booking.date && a.time === t && a.status !== 'Cancelled')),
  }));

  const set = (patch, next) => {
    setBooking((b) => ({ ...b, ...patch }));
    if (next !== undefined) setStep(next);
  };

  const canNext = [booking.service, booking.dentistId, booking.date, booking.time, true, true][step];

  const next = async () => {
    if (step === 4 && !(await trigger())) return;
    setStep((s) => Math.min(s + 1, 5));
  };

  const confirm = handleSubmit(async (data) => {
    try {
      const apt = await appointmentService.create({ ...booking, patientId: user?.role === 'patient' ? user.id : undefined, patientName: data.name, email: data.email, phone: data.phone, age: data.age, gender: data.gender, notes: data.notes });
      addAppointment(apt);
      if (user?.role === 'patient') setNotifications((n) => [{ id: `n${Date.now()}`, title: 'Appointment requested', text: `${service.name} on ${formatDate(apt.date)} at ${apt.time}.`, date: new Date().toISOString().slice(0, 10), read: false, type: 'appointment' }, ...n]);
      setDone(apt);
      toast('Appointment booked successfully!');
    } catch (e) {
      toast(e.message || 'Booking failed, please try again.', 'error');
    }
  });

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="card mx-auto max-w-xl p-8 text-center sm:p-10">
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }} className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-teal-50"><CheckCircle2 className="h-11 w-11 text-teal-500" /></motion.span>
        <h2 className="mt-6 text-3xl font-extrabold">Appointment requested!</h2>
        <p className="mt-2 text-navy-500">Booking reference <strong className="text-navy-900">{done.id}</strong>. We’ve sent the details to {done.email}, and our team will call to confirm.</p>
        <div className="mt-6 space-y-2 rounded-2xl bg-navy-50 p-5 text-left text-sm">
          <p className="flex justify-between"><span className="text-navy-500">Service</span><strong>{service?.name}</strong></p>
          <p className="flex justify-between"><span className="text-navy-500">Dentist</span><strong>{dentist?.name}</strong></p>
          <p className="flex justify-between"><span className="text-navy-500">Date & time</span><strong>{formatDate(done.date)} · {done.time}</strong></p>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {user?.role === 'patient' ? <Button to="/patient/appointments">View my appointments</Button> : <Button to="/register">Create an account</Button>}
          <Button to="/" variant="outline">Back to home</Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="card p-5 sm:p-8">
      <div className="mb-8"><Stepper steps={STEPS} current={step} /></div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}>
          {step === 0 && (
            <>
              <StepTitle title="Select a dental service" sub="What would you like to come in for?" />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {activeServices.map((s) => (
                  <button key={s.slug} onClick={() => set({ service: s.slug, dentistId: dentist && !dentist.services.includes(s.slug) ? null : booking.dentistId, time: null }, 1)} className={cn('flex items-center gap-3 rounded-2xl border p-4 text-left transition hover:border-brand-500', booking.service === s.slug ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-100' : 'border-navy-100')}>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><Icon name={s.icon} className="h-5 w-5" /></span>
                    <span><span className="block font-semibold text-navy-900">{s.name}</span><span className="text-xs text-navy-500">From {formatBDT(servicePrice(s))} · {s.duration}</span></span>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <StepTitle title="Choose your dentist" sub={service ? `Dentists who provide ${service.name}` : ''} />
              {availableDentists.length ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {availableDentists.map((d) => (
                    <button key={d.id} onClick={() => set({ dentistId: d.id, date: null, time: null }, 2)} className={cn('flex items-center gap-4 rounded-2xl border p-4 text-left transition hover:border-brand-500', booking.dentistId === d.id ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-100' : 'border-navy-100')}>
                      <Img src={d.photo} alt={d.name} className="h-16 w-16 shrink-0 rounded-xl" />
                      <span>
                        <span className="block font-semibold text-navy-900">{d.name}</span>
                        <span className="block text-sm text-brand-600">{d.title}</span>
                        <span className="mt-1 flex items-center gap-1 text-xs text-navy-500"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{d.rating} · {d.experience} yrs · {d.availability.join(', ')}</span>
                      </span>
                    </button>
                  ))}
                </div>
              ) : <EmptyState title="No dentist available" message="Please choose a different service." />}
            </>
          )}

          {step === 2 && (
            <>
              <StepTitle title="Select an available date" sub={`${dentist?.name} is available on ${dentist?.availability.join(', ')}`} />
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                {days.map((d) => (
                  <button key={d.iso} disabled={!d.available} onClick={() => set({ date: d.iso, time: null }, 3)} className={cn('rounded-2xl border py-3 text-center transition', booking.date === d.iso ? 'border-brand-600 bg-brand-600 text-white' : d.available ? 'border-navy-100 hover:border-brand-500' : 'cursor-not-allowed border-navy-50 bg-navy-50/50 text-navy-300')}>
                    <span className="block text-xs font-medium uppercase">{d.wd}</span>
                    <span className="block font-display text-xl font-bold">{d.dayNum}</span>
                    <span className="block text-xs">{d.month}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <StepTitle title="Select a time slot" sub={formatDate(booking.date, { weekday: 'long', day: 'numeric', month: 'long' })} />
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {slots.map((s) => (
                  <button key={s.time} disabled={s.taken} onClick={() => set({ time: s.time }, 4)} className={cn('rounded-xl border py-3 text-sm font-semibold transition', booking.time === s.time ? 'border-brand-600 bg-brand-600 text-white' : s.taken ? 'cursor-not-allowed border-navy-50 bg-navy-50/60 text-navy-300 line-through' : 'border-navy-100 text-navy-800 hover:border-brand-500')}>{s.time}</button>
                ))}
              </div>
              <p className="mt-4 text-xs text-navy-400">Crossed-out slots are already booked.</p>
            </>
          )}

          {step === 4 && (
            <>
              <StepTitle title="Patient information" sub={user ? 'We’ve pre-filled your details.' : 'Tell us who the appointment is for.'} />
              <form className="grid gap-5 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); next(); }} noValidate>
                <Field label="Full name *" error={errors.name?.message}><input className={cn('input', errors.name && 'input-error')} {...register('name', { required: 'Full name is required' })} /></Field>
                <Field label="Phone *" error={errors.phone?.message}><input className={cn('input', errors.phone && 'input-error')} placeholder="+880 1XXX-XXXXXX" {...register('phone', { required: 'Phone is required', pattern: { value: /^[+\d\s-]{8,}$/, message: 'Enter a valid phone number' } })} /></Field>
                <Field label="Email *" error={errors.email?.message}><input type="email" className={cn('input', errors.email && 'input-error')} {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } })} /></Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Age *" error={errors.age?.message}><input type="number" className={cn('input', errors.age && 'input-error')} {...register('age', { required: 'Required', min: { value: 0, message: 'Invalid' }, max: { value: 120, message: 'Invalid' } })} /></Field>
                  <Field label="Gender"><select className="input" {...register('gender')}><option value="">Select</option><option>Female</option><option>Male</option><option>Other</option></select></Field>
                </div>
                <Field label="Notes for the dentist (optional)" className="sm:col-span-2"><textarea rows={3} className="input resize-none" placeholder="Symptoms, concerns, or preferences" {...register('notes')} /></Field>
                <button type="submit" className="hidden" />
              </form>
            </>
          )}

          {step === 5 && (
            <>
              <StepTitle title="Review & confirm" sub="Please check your appointment details." />
              <div className="grid gap-4 sm:grid-cols-2">
                <Summary icon={Stethoscope} label="Service" value={service?.name} sub={`From ${formatBDT(servicePrice(service))}`} onEdit={() => setStep(0)} />
                <Summary icon={User} label="Dentist" value={dentist?.name} sub={dentist?.title} onEdit={() => setStep(1)} />
                <Summary icon={CalendarDays} label="Date" value={formatDate(booking.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} onEdit={() => setStep(2)} />
                <Summary icon={Clock} label="Time" value={booking.time} onEdit={() => setStep(3)} />
                <div className="rounded-2xl border border-navy-100 p-5 sm:col-span-2">
                  <div className="flex items-center justify-between"><p className="text-sm font-semibold text-navy-500">Patient</p><button onClick={() => setStep(4)} className="text-sm font-semibold text-brand-600 hover:underline">Edit</button></div>
                  <p className="mt-2 font-semibold text-navy-900">{getValues('name')}</p>
                  <p className="text-sm text-navy-500">{getValues('email')} · {getValues('phone')}{getValues('age') ? ` · ${getValues('age')} yrs` : ''}</p>
                  {getValues('notes') && <p className="mt-2 text-sm italic text-navy-500">“{getValues('notes')}”</p>}
                </div>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex justify-between gap-3 border-t border-navy-100 pt-6">
        <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={step === 0}><ArrowLeft className="h-4 w-4" />Back</Button>
        {step < 5 ? (
          <Button onClick={next} disabled={!canNext}>Continue<ArrowRight className="h-4 w-4" /></Button>
        ) : (
          <Button variant="teal" onClick={confirm} loading={isSubmitting}><CheckCircle2 className="h-4 w-4" />Confirm appointment</Button>
        )}
      </div>
    </div>
  );
}

function StepTitle({ title, sub }) {
  return <div className="mb-6"><h3 className="text-xl font-bold">{title}</h3>{sub && <p className="mt-1 text-sm text-navy-500">{sub}</p>}</div>;
}

function Summary({ icon: I, label, value, sub, onEdit }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-navy-100 p-5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><I className="h-5 w-5" /></span>
      <div className="flex-1"><p className="text-sm text-navy-500">{label}</p><p className="font-semibold text-navy-900">{value}</p>{sub && <p className="text-xs text-navy-500">{sub}</p>}</div>
      <button onClick={onEdit} className="text-sm font-semibold text-brand-600 hover:underline">Edit</button>
    </div>
  );
}
