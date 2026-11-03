import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CalendarCheck, CalendarClock, Users, Pill, FilePlus2, Eye, Clock, Download, ChevronLeft, ClipboardList, CalendarDays, Phone, Mail, Stethoscope, CheckCircle2, Save } from 'lucide-react';
import Button from '../../components/common/Button';
import DataTable from '../../components/common/DataTable';
import EmptyState from '../../components/common/EmptyState';
import StatCard from '../../components/dashboard/StatCard';
import PrescriptionForm from '../../components/doctor/PrescriptionForm';
import { Badge, Field } from '../../components/common/ui';
import { DashTitle } from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { cn, formatDate, todayISO } from '../../utils/format';
import { downloadPrescription } from '../../utils/download';

const keyOf = (a) => a.patientId || a.email || a.patientName;
const timeValue = (t = '') => {
  const [hm, ap] = t.split(' ');
  const [h, m] = hm.split(':').map(Number);
  return ((h % 12) + (ap === 'PM' ? 12 : 0)) * 60 + (m || 0);
};

function useDoctor() {
  const { user } = useAuth();
  const data = useData();
  const today = todayISO();
  const mine = useMemo(() => data.appointments.filter((a) => a.dentistId === user?.dentistId), [data.appointments, user]);
  const todays = mine.filter((a) => a.date === today && a.status !== 'Cancelled').sort((a, b) => timeValue(a.time) - timeValue(b.time));
  const patients = useMemo(() => {
    const map = new Map();
    mine.forEach((a) => {
      const k = keyOf(a);
      const prev = map.get(k);
      const record = data.patients.find((p) => p.id === a.patientId || (a.email && p.email === a.email));
      if (!prev || a.date > prev.lastVisit) map.set(k, { key: k, name: a.patientName, phone: a.phone, email: a.email || record?.email, age: record?.age, gender: record?.gender, lastVisit: a.date, visits: (prev?.visits || 0) + 1 });
      else prev.visits += 1;
    });
    return [...map.values()].sort((a, b) => b.lastVisit.localeCompare(a.lastVisit));
  }, [mine, data.patients]);
  const myRx = data.prescriptions.filter((r) => r.dentistId === user?.dentistId).sort((a, b) => b.date.localeCompare(a.date));
  return { user, ...data, today, mine, todays, patients, myRx };
}

// Shared state for opening the prescription modal from any page.
function usePrescriptionModal() {
  const [ctx, setCtx] = useState(null); // { patient?, appointment? }
  return { ctx, open: (c = {}) => setCtx(c), close: () => setCtx(null) };
}

function AppointmentCard({ a, onPrescribe, onComplete }) {
  const { getService } = useData();
  const done = a.status === 'Completed';
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-navy-100 bg-white p-4 sm:flex-row sm:items-center">
      <div className="flex w-20 shrink-0 items-center gap-1.5 font-display text-sm font-bold text-brand-700"><Clock className="h-4 w-4" />{a.time}</div>
      <div className="flex-1">
        <p className="font-semibold text-navy-900">{a.patientName}</p>
        <p className="text-sm text-navy-500">{getService(a.service)?.name}{a.notes && <span className="italic"> · “{a.notes}”</span>}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge>{a.status}</Badge>
        <Button size="sm" variant="outline" to={`/doctor/patients/${encodeURIComponent(keyOf(a))}`}><Eye className="h-4 w-4" />History</Button>
        <Button size="sm" onClick={() => onPrescribe(a)}><FilePlus2 className="h-4 w-4" />Prescribe</Button>
        {!done && onComplete && <Button size="sm" variant="ghost" onClick={() => onComplete(a)} aria-label="Mark completed"><CheckCircle2 className="h-4 w-4 text-teal-600" /></Button>}
      </div>
    </div>
  );
}

export function DoctorDashboard() {
  const { user, todays, mine, patients, myRx, today, updateAppointment } = useDoctor();
  const toast = useToast();
  const modal = usePrescriptionModal();
  const upcoming = mine.filter((a) => a.date > today && a.status !== 'Cancelled').sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4);
  const prescribe = (a) => modal.open({ appointment: a, patient: { key: keyOf(a), name: a.patientName } });
  const complete = (a) => { updateAppointment(a.id, { status: 'Completed' }); toast(`${a.patientName}'s visit marked completed`); };

  return (
    <>
      <DashTitle title={`Good day, ${user.name}`} sub={`${user.specialization || 'Dentist'} · ${todays.length} appointment${todays.length === 1 ? '' : 's'} today`} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={CalendarClock} label="Today’s appointments" value={todays.length} />
        <StatCard icon={CalendarCheck} label="Completed today" value={todays.filter((a) => a.status === 'Completed').length} tone="teal" />
        <StatCard icon={Users} label="My patients" value={patients.length} tone="amber" />
        <StatCard icon={Pill} label="Prescriptions written" value={myRx.length} tone="navy" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <section className="card p-5 sm:p-6 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold">Today’s schedule · {formatDate(today, { weekday: 'long', day: 'numeric', month: 'short' })}</h2><Button to="/doctor/appointments" size="sm" variant="ghost">All appointments</Button></div>
          {todays.length ? <div className="space-y-3">{todays.map((a) => <AppointmentCard key={a.id} a={a} onPrescribe={prescribe} onComplete={complete} />)}</div> : <EmptyState icon={CalendarDays} title="No appointments today" message="Enjoy the quiet day — upcoming visits are listed alongside." />}
        </section>
        <section className="card p-5 sm:p-6">
          <h2 className="mb-4 text-lg font-bold">Upcoming</h2>
          {upcoming.length ? (
            <ul className="space-y-3">{upcoming.map((a) => <li key={a.id} className="flex items-center gap-3 rounded-xl bg-navy-50/60 p-3"><div className="w-14 text-center"><p className="text-xs font-semibold uppercase text-navy-400">{formatDate(a.date, { month: 'short' })}</p><p className="font-display text-xl font-extrabold text-navy-900">{formatDate(a.date, { day: 'numeric' })}</p></div><div className="flex-1"><p className="text-sm font-semibold text-navy-900">{a.patientName}</p><p className="text-xs text-navy-500">{a.time}</p></div><Badge>{a.status}</Badge></li>)}</ul>
          ) : <p className="text-sm text-navy-500">No upcoming appointments.</p>}
        </section>
      </div>

      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-bold">Recent prescriptions</h2><Button to="/doctor/prescriptions" size="sm" variant="ghost">View all</Button></div>
        <RxTable rows={myRx.slice(0, 5)} searchable={false} />
      </section>
      <PrescriptionForm open={!!modal.ctx} onClose={modal.close} doctor={user} patient={modal.ctx?.patient} appointment={modal.ctx?.appointment} patients={patients} />
    </>
  );
}

export function DoctorAppointments() {
  const { user, mine, today, patients, updateAppointment, getService } = useDoctor();
  const toast = useToast();
  const modal = usePrescriptionModal();
  const [tab, setTab] = useState('today');
  const filters = {
    today: (a) => a.date === today,
    upcoming: (a) => a.date > today,
    past: (a) => a.date < today,
    all: () => true,
  };
  const rows = mine.filter(filters[tab]).sort((a, b) => (tab === 'past' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)) || timeValue(a.time) - timeValue(b.time));
  return (
    <>
      <DashTitle title="My Appointments" sub="Manage your schedule and patient visits." />
      <DataTable rows={rows} searchPlaceholder="Search patient…" emptyTitle="No appointments in this view" toolbar={
        <div className="flex flex-wrap gap-1">{[['today', 'Today'], ['upcoming', 'Upcoming'], ['past', 'Past'], ['all', 'All']].map(([k, l]) => <button key={k} onClick={() => setTab(k)} className={cn('rounded-lg px-3 py-1.5 text-xs font-semibold', tab === k ? 'bg-brand-600 text-white' : 'bg-navy-50 text-navy-600 hover:bg-navy-100')}>{l} ({mine.filter(filters[k]).length})</button>)}</div>
      } columns={[
        { key: 'date', header: 'Date & time', render: (a) => <span className="font-medium text-navy-900">{formatDate(a.date)} · {a.time}</span> },
        { key: 'patientName', header: 'Patient', render: (a) => <div><p className="font-medium text-navy-900">{a.patientName}</p><p className="text-xs text-navy-500">{a.phone}</p></div> },
        { key: 'service', header: 'Service', render: (a) => getService(a.service)?.name, searchValue: (a) => getService(a.service)?.name },
        { key: 'notes', header: 'Notes', render: (a) => <span className="block max-w-[180px] truncate text-navy-500">{a.notes || '—'}</span> },
        { key: 'status', header: 'Status', render: (a) => (
          <select value={a.status} onChange={(e) => { updateAppointment(a.id, { status: e.target.value }); toast(`Marked ${e.target.value}`); }} className="rounded-lg border border-navy-200 bg-white px-2 py-1 text-xs font-semibold" aria-label="Change status">
            {['Pending', 'Confirmed', 'Completed', 'Cancelled'].map((s) => <option key={s}>{s}</option>)}
          </select>
        ) },
        { key: 'x', header: '', className: 'text-right', render: (a) => <div className="flex justify-end gap-1"><Button size="sm" variant="outline" to={`/doctor/patients/${encodeURIComponent(keyOf(a))}`}>History</Button><Button size="sm" onClick={() => modal.open({ appointment: a, patient: { key: keyOf(a), name: a.patientName } })}>Prescribe</Button></div> },
      ]} />
      <PrescriptionForm open={!!modal.ctx} onClose={modal.close} doctor={user} patient={modal.ctx?.patient} appointment={modal.ctx?.appointment} patients={patients} />
    </>
  );
}

export function DoctorPatients() {
  const { patients } = useDoctor();
  return (
    <>
      <DashTitle title="My Patients" sub="Patients who have booked with you." />
      <DataTable rows={patients.map((p) => ({ ...p, id: p.key }))} searchPlaceholder="Search patients…" emptyTitle="No patients yet" columns={[
        { key: 'name', header: 'Patient', render: (p) => <div><p className="font-medium text-navy-900">{p.name}</p><p className="text-xs text-navy-500">{p.email || '—'}</p></div>, searchValue: (p) => p.name + (p.email || '') + (p.phone || '') },
        { key: 'phone', header: 'Phone' },
        { key: 'age', header: 'Age / Gender', render: (p) => `${p.age ?? '—'} · ${p.gender || '—'}` },
        { key: 'visits', header: 'Visits with you' },
        { key: 'lastVisit', header: 'Last / next visit', render: (p) => formatDate(p.lastVisit) },
        { key: 'x', header: '', className: 'text-right', render: (p) => <Button size="sm" variant="outline" to={`/doctor/patients/${encodeURIComponent(p.key)}`}><Eye className="h-4 w-4" />View history</Button> },
      ]} />
    </>
  );
}

export function DoctorPatientHistory() {
  const { key } = useParams();
  const patientKey = decodeURIComponent(key);
  const { user, appointments, prescriptions, treatments, patients: allPatients, getService, getDentist } = useDoctor();
  const modal = usePrescriptionModal();
  const visits = appointments.filter((a) => keyOf(a) === patientKey).sort((a, b) => b.date.localeCompare(a.date));
  const record = allPatients.find((p) => p.id === patientKey || p.email === patientKey);
  const name = record?.name || visits[0]?.patientName;
  const rx = prescriptions.filter((r) => r.patientId === patientKey).sort((a, b) => b.date.localeCompare(a.date));
  const tx = treatments.filter((t) => t.patientId === patientKey).sort((a, b) => b.date.localeCompare(a.date));

  if (!name) return <EmptyState title="Patient not found" actionLabel="Back to patients" actionTo="/doctor/patients" />;
  const openVisit = visits.find((a) => a.dentistId === user.dentistId && a.date === todayISO() && a.status !== 'Completed');

  return (
    <>
      <Link to="/doctor/patients" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-navy-500 hover:text-brand-600"><ChevronLeft className="h-4 w-4" />My patients</Link>
      <DashTitle title={name} sub="Complete dental history across all SmileCare dentists.">
        <Button onClick={() => modal.open({ patient: { key: patientKey, name }, appointment: openVisit })}><FilePlus2 className="h-4 w-4" />Write prescription</Button>
      </DashTitle>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="card p-5 sm:p-6">
          <h2 className="mb-4 text-lg font-bold">Patient details</h2>
          <dl className="space-y-3 text-sm">
            {[[Phone, 'Phone', record?.phone || visits[0]?.phone], [Mail, 'Email', record?.email || visits[0]?.email], [Users, 'Age / Gender', `${record?.age ?? '—'} · ${record?.gender || '—'}`], [CalendarDays, 'Total visits', visits.length]].map(([I, k, v]) => (
              <div key={k} className="flex items-center gap-3"><I className="h-4 w-4 text-navy-400" /><dt className="w-24 text-navy-500">{k}</dt><dd className="font-medium text-navy-900">{v || '—'}</dd></div>
            ))}
          </dl>
          {record?.id === 'p1' && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"><strong>Allergy:</strong> Penicillin</p>}
        </section>

        <section className="card p-5 sm:p-6 xl:col-span-2">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold"><ClipboardList className="h-5 w-5 text-navy-400" />Treatment history</h2>
          {tx.length ? (
            <ol className="relative space-y-6 border-l-2 border-navy-100 pl-6">
              {tx.map((t) => (
                <li key={t.id} className="relative">
                  <span className="absolute -left-[33px] top-1 h-4 w-4 rounded-full bg-teal-500 ring-4 ring-white" />
                  <p className="text-xs font-semibold uppercase text-navy-400">{formatDate(t.date)} · {t.dentist || getDentist(t.dentistId)?.name}</p>
                  <p className="mt-0.5 font-semibold text-navy-900">{t.treatment}</p>
                  {t.notes && <p className="text-sm text-navy-500">{t.notes}</p>}
                </li>
              ))}
            </ol>
          ) : <EmptyState icon={Stethoscope} title="No treatments recorded" message="Treatments you add with a prescription will appear here." />}
        </section>

        <section className="xl:col-span-3">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold"><Pill className="h-5 w-5 text-navy-400" />Prescriptions</h2>
          {rx.length ? (
            <div className="grid gap-4 lg:grid-cols-2">{rx.map((r) => <RxCard key={r.id} rx={r} />)}</div>
          ) : <EmptyState icon={Pill} title="No prescriptions yet" />}
        </section>

        <section className="xl:col-span-3">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold"><CalendarDays className="h-5 w-5 text-navy-400" />Appointment history</h2>
          <DataTable rows={visits} searchable={false} pageSize={6} columns={[
            { key: 'date', header: 'Date', render: (a) => `${formatDate(a.date)} · ${a.time}` },
            { key: 'service', header: 'Service', render: (a) => getService(a.service)?.name },
            { key: 'dentistId', header: 'Dentist', render: (a) => getDentist(a.dentistId)?.name },
            { key: 'notes', header: 'Notes', render: (a) => a.notes || '—' },
            { key: 'status', header: 'Status', render: (a) => <Badge>{a.status}</Badge> },
          ]} />
        </section>
      </div>
      <PrescriptionForm open={!!modal.ctx} onClose={modal.close} doctor={user} patient={modal.ctx?.patient} appointment={modal.ctx?.appointment} />
    </>
  );
}

function RxCard({ rx }) {
  const { siteSettings, getDentist } = useData();
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div><p className="font-semibold text-navy-900">{rx.diagnosis || 'Prescription'}</p><p className="text-xs text-navy-500">{formatDate(rx.date)} · {rx.dentist || getDentist(rx.dentistId)?.name}</p></div>
        <Button size="sm" variant="outline" onClick={() => downloadPrescription({ ...rx, dentist: rx.dentist || getDentist(rx.dentistId)?.name }, siteSettings)}><Download className="h-4 w-4" /></Button>
      </div>
      <ul className="mt-3 space-y-1.5">{rx.items.map((i, n) => <li key={n} className="flex gap-2 rounded-lg bg-navy-50 px-3 py-2 text-sm"><Pill className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" /><span><strong className="font-medium text-navy-900">{i.name}</strong>{i.dosage && ` — ${i.dosage}`}{i.duration && ` · ${i.duration}`}</span></li>)}</ul>
      {rx.notes && <p className="mt-2 text-sm text-navy-500">Advice: {rx.notes}</p>}
      {rx.followUp && <p className="mt-1 text-sm text-teal-600">Follow-up: {formatDate(rx.followUp)}</p>}
    </div>
  );
}

function RxTable({ rows, searchable = true }) {
  const { siteSettings } = useData();
  return (
    <DataTable rows={rows} searchable={searchable} searchPlaceholder="Search prescriptions…" emptyTitle="No prescriptions written yet" columns={[
      { key: 'date', header: 'Date', render: (r) => formatDate(r.date) },
      { key: 'patientName', header: 'Patient', render: (r) => <Link to={`/doctor/patients/${encodeURIComponent(r.patientId)}`} className="font-medium text-navy-900 hover:text-brand-600">{r.patientName}</Link> },
      { key: 'diagnosis', header: 'Diagnosis', render: (r) => <span className="block max-w-[220px] truncate">{r.diagnosis || '—'}</span> },
      { key: 'items', header: 'Medicines', render: (r) => `${r.items.length} item${r.items.length === 1 ? '' : 's'}`, searchValue: (r) => r.items.map((i) => i.name).join(' ') },
      { key: 'x', header: '', className: 'text-right', render: (r) => <Button size="sm" variant="outline" onClick={() => downloadPrescription(r, siteSettings)}><Download className="h-4 w-4" />Print</Button> },
    ]} />
  );
}

export function DoctorPrescriptions() {
  const { user, myRx, patients } = useDoctor();
  const modal = usePrescriptionModal();
  return (
    <>
      <DashTitle title="Prescriptions" sub="All prescriptions you have written."><Button onClick={() => modal.open()}><FilePlus2 className="h-4 w-4" />New prescription</Button></DashTitle>
      <RxTable rows={myRx} />
      <PrescriptionForm open={!!modal.ctx} onClose={modal.close} doctor={user} patients={patients} />
    </>
  );
}

export function DoctorProfile() {
  const { user, updateProfile } = useAuth();
  const toast = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting, isDirty }, reset } = useForm({ defaultValues: user });
  const onSubmit = async (data) => {
    await updateProfile({ ...data, experience: Number(data.experience) || 0 });
    reset(data);
    toast('Profile updated');
  };
  return (
    <>
      <DashTitle title="My Profile" sub="Keep your professional details up to date." />
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="card grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
        <Field label="Full name" error={errors.name?.message}><input className="input" {...register('name', { required: 'Required' })} /></Field>
        <Field label="Email" hint="Contact the clinic admin to change your login email"><input className="input bg-navy-50" disabled {...register('email')} /></Field>
        <Field label="Phone" error={errors.phone?.message}><input className="input" {...register('phone', { required: 'Required' })} /></Field>
        <Field label="Specialization"><input className="input" {...register('specialization')} /></Field>
        <Field label="Qualifications"><input className="input" {...register('qualifications')} /></Field>
        <Field label="Years of experience" error={errors.experience?.message}><input type="number" className="input" {...register('experience', { min: { value: 0, message: 'Must be 0 or more' } })} /></Field>
        <Field label="BMDC registration no." hint="Verified by the admin; contact them to change it"><input className="input bg-navy-50" disabled {...register('regNo')} /></Field>
        <div className="sm:col-span-2"><Button type="submit" loading={isSubmitting} disabled={!isDirty}><Save className="h-4 w-4" />Save changes</Button></div>
      </form>
    </>
  );
}
