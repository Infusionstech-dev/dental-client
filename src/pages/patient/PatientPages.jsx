import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CalendarCheck, CalendarDays, Clock, FileText, Download, Pill, Bell, ClipboardList, Receipt, CheckCheck, Plus, Save, FolderOpen, Stethoscope } from 'lucide-react';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import DataTable from '../../components/common/DataTable';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import StatCard from '../../components/dashboard/StatCard';
import { Badge, Field } from '../../components/common/ui';
import { DashTitle } from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { documents, invoices } from '../../data/mockRecords';
import { cn, formatBDT, formatDate, todayISO } from '../../utils/format';
import { downloadFile, downloadInvoice } from '../../utils/download';

// Demo records belong to the seeded demo patient only; new accounts see empty states.
function usePatientData() {
  const { user } = useAuth();
  const data = useData();
  const isDemo = user?.id === 'p1';
  const own = (r) => r.patientId === user?.id || (r.patientId && r.patientId === user?.email);
  const mine = data.appointments.filter((a) => a.patientId === user?.id || (a.email && a.email === user?.email));
  const today = todayISO();
  const upcoming = mine.filter((a) => a.date >= today && a.status !== 'Cancelled' && a.status !== 'Completed').sort((a, b) => a.date.localeCompare(b.date));
  const past = mine.filter((a) => !upcoming.includes(a)).sort((a, b) => b.date.localeCompare(a.date));
  return { user, ...data, mine, upcoming, past, treatments: data.treatments.filter(own).sort((a, b) => b.date.localeCompare(a.date)), rx: data.prescriptions.filter(own).sort((a, b) => b.date.localeCompare(a.date)), invoices: isDemo ? invoices : [], docs: isDemo ? documents : [] };
}

function AppointmentRow({ a, onCancel }) {
  const { getService, getDentist } = useData();
  const d = getDentist(a.dentistId);
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-navy-100 bg-white p-4 sm:flex-row sm:items-center">
      <div className="flex w-16 shrink-0 flex-col items-center rounded-xl bg-brand-50 py-2 text-brand-700">
        <span className="text-xs font-semibold uppercase">{formatDate(a.date, { month: 'short' })}</span>
        <span className="font-display text-2xl font-extrabold">{formatDate(a.date, { day: 'numeric' })}</span>
      </div>
      <div className="flex-1">
        <p className="font-semibold text-navy-900">{getService(a.service)?.name || a.service}</p>
        <p className="text-sm text-navy-500">{d?.name} · <Clock className="inline h-3.5 w-3.5" /> {a.time}</p>
        <p className="text-xs text-navy-400">Ref {a.id}</p>
      </div>
      <div className="flex items-center gap-2">
        <Badge>{a.status}</Badge>
        {onCancel && <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => onCancel(a)}>Cancel</Button>}
      </div>
    </div>
  );
}

function Card({ title, action, children, className }) {
  return (
    <section className={cn('card p-5 sm:p-6', className)}>
      <div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-lg font-bold">{title}</h2>{action}</div>
      {children}
    </section>
  );
}

function InvoiceList({ list }) {
  const { user, siteSettings } = usePatientData();
  const toast = useToast();
  if (!list.length) return <EmptyState icon={Receipt} title="No invoices yet" message="Invoices appear here after your treatments." />;
  return (
    <ul className="divide-y divide-navy-100">
      {list.map((inv) => (
        <li key={inv.id} className="flex items-center justify-between gap-3 py-3">
          <div><p className="font-semibold text-navy-900">{inv.id} · {inv.description}</p><p className="text-sm text-navy-500">{formatDate(inv.date)} · {formatBDT(inv.items.reduce((s, i) => s + i.amount, 0))}</p></div>
          <div className="flex items-center gap-2"><Badge>{inv.paid ? 'Paid' : 'Unpaid'}</Badge><Button size="sm" variant="outline" onClick={() => { downloadInvoice(inv, user, siteSettings); toast(`${inv.id} downloaded`); }}><Download className="h-4 w-4" /><span className="hidden sm:inline">Download</span></Button></div>
        </li>
      ))}
    </ul>
  );
}

export function PatientDashboard() {
  const { user, upcoming, past, treatments, rx, invoices: inv, docs, notifications } = usePatientData();
  const unread = notifications.filter((n) => !n.read);
  return (
    <>
      <DashTitle title={`Welcome back, ${user.name.split(' ')[0]} 👋`} sub="Here’s an overview of your dental care.">
        <Button to="/appointment"><Plus className="h-4 w-4" />Book New Appointment</Button>
      </DashTitle>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={CalendarCheck} label="Upcoming appointments" value={upcoming.length} />
        <StatCard icon={ClipboardList} label="Completed treatments" value={treatments.length} tone="teal" />
        <StatCard icon={Pill} label="Prescriptions" value={rx.length} tone="amber" />
        <StatCard icon={Bell} label="Unread notifications" value={unread.length} tone="navy" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card title="Upcoming appointments" className="xl:col-span-2" action={<Button to="/patient/appointments" size="sm" variant="ghost">View all</Button>}>
          {upcoming.length ? <div className="space-y-3">{upcoming.slice(0, 3).map((a) => <AppointmentRow key={a.id} a={a} />)}</div> : <EmptyState icon={CalendarDays} title="No upcoming appointments" message="Book your next check-up in under a minute." actionLabel="Book appointment" actionTo="/appointment" />}
        </Card>
        <Card title="Profile" action={<Button to="/patient/profile" size="sm" variant="ghost">Edit</Button>}>
          <dl className="space-y-3 text-sm">
            {[['Name', user.name], ['Email', user.email], ['Phone', user.phone], ['Blood group', user.bloodGroup], ['Allergies', user.allergies], ['Patient since', formatDate(user.joined)]].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3"><dt className="text-navy-500">{k}</dt><dd className="text-right font-medium text-navy-900">{v || '—'}</dd></div>
            ))}
          </dl>
        </Card>
        <Card title="Notifications" action={<Button to="/patient/notifications" size="sm" variant="ghost">View all</Button>}>
          {notifications.length ? <ul className="space-y-3">{notifications.slice(0, 3).map((n) => <li key={n.id} className="flex gap-3"><span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', n.read ? 'bg-navy-200' : 'bg-brand-600')} /><div><p className="text-sm font-semibold text-navy-900">{n.title}</p><p className="text-xs text-navy-500">{n.text}</p></div></li>)}</ul> : <EmptyState icon={Bell} title="All caught up" />}
        </Card>
        <Card title="Invoices" className="xl:col-span-2"><InvoiceList list={inv.slice(0, 3)} /></Card>
        <Card title="Appointment history" className="xl:col-span-3" action={<Button to="/patient/appointments" size="sm" variant="ghost">View all</Button>}>
          {past.length ? <div className="space-y-3">{past.slice(0, 3).map((a) => <AppointmentRow key={a.id} a={a} />)}</div> : <EmptyState title="No past appointments" />}
        </Card>
      </div>
    </>
  );
}

export function PatientProfile() {
  const { user, updateProfile } = useAuth();
  const toast = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting, isDirty }, reset } = useForm({ defaultValues: user });
  const onSubmit = async (data) => {
    await updateProfile(data);
    reset(data);
    toast('Profile updated');
  };
  return (
    <>
      <DashTitle title="My Profile" sub="Keep your personal and medical details up to date." />
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="card grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
        <Field label="Full name" error={errors.name?.message}><input className="input" {...register('name', { required: 'Required' })} /></Field>
        <Field label="Email" hint="Contact the clinic to change your login email"><input className="input bg-navy-50" disabled {...register('email')} /></Field>
        <Field label="Phone" error={errors.phone?.message}><input className="input" {...register('phone', { required: 'Required' })} /></Field>
        <Field label="Date of birth"><input type="date" className="input" {...register('dob')} /></Field>
        <Field label="Gender"><select className="input" {...register('gender')}><option value="">Select</option><option>Female</option><option>Male</option><option>Other</option></select></Field>
        <Field label="Blood group"><select className="input" {...register('bloodGroup')}><option value="">Select</option>{['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((b) => <option key={b}>{b}</option>)}</select></Field>
        <Field label="Address" className="sm:col-span-2"><input className="input" {...register('address')} /></Field>
        <Field label="Allergies / medical notes" className="sm:col-span-2"><textarea rows={3} className="input resize-none" {...register('allergies')} /></Field>
        <div className="sm:col-span-2"><Button type="submit" loading={isSubmitting} disabled={!isDirty}><Save className="h-4 w-4" />Save changes</Button></div>
      </form>
    </>
  );
}

export function PatientAppointments() {
  const { upcoming, past, updateAppointment } = usePatientData();
  const toast = useToast();
  const [tab, setTab] = useState('upcoming');
  const [cancel, setCancel] = useState(null);
  const list = tab === 'upcoming' ? upcoming : past;
  return (
    <>
      <DashTitle title="My Appointments" sub="View, track and manage your visits."><Button to="/appointment"><Plus className="h-4 w-4" />Book New Appointment</Button></DashTitle>
      <div className="mb-5 inline-flex rounded-xl bg-white p-1 shadow-soft">
        {[['upcoming', `Upcoming (${upcoming.length})`], ['past', `History (${past.length})`]].map(([k, l]) => <button key={k} onClick={() => setTab(k)} className={cn('rounded-lg px-4 py-2 text-sm font-semibold transition', tab === k ? 'bg-brand-600 text-white' : 'text-navy-600 hover:text-navy-900')}>{l}</button>)}
      </div>
      {list.length ? <div className="space-y-3">{list.map((a) => <AppointmentRow key={a.id} a={a} onCancel={tab === 'upcoming' ? setCancel : undefined} />)}</div> : <EmptyState icon={CalendarDays} title={tab === 'upcoming' ? 'No upcoming appointments' : 'No appointment history'} actionLabel="Book appointment" actionTo="/appointment" />}
      <ConfirmationDialog open={!!cancel} onClose={() => setCancel(null)} title="Cancel appointment?" message={`This will cancel your appointment ${cancel?.id} on ${formatDate(cancel?.date)} at ${cancel?.time}.`} confirmLabel="Cancel appointment" onConfirm={() => { updateAppointment(cancel.id, { status: 'Cancelled' }); toast('Appointment cancelled', 'info'); }} />
    </>
  );
}

export function TreatmentHistory() {
  const { treatments, invoices: inv } = usePatientData();
  return (
    <>
      <DashTitle title="Treatment History" sub="A record of treatments you’ve received at SmileCare." />
      {treatments.length ? (
        <div className="card p-6">
          <ol className="relative space-y-8 border-l-2 border-navy-100 pl-6">
            {treatments.map((t) => (
              <li key={t.id} className="relative">
                <span className="absolute -left-[33px] flex h-4 w-4 items-center justify-center rounded-full bg-teal-500 ring-4 ring-white" />
                <p className="text-xs font-semibold uppercase text-navy-400">{formatDate(t.date)}</p>
                <p className="mt-1 font-semibold text-navy-900">{t.treatment}</p>
                <p className="text-sm text-brand-600">{t.dentist}</p>
                <p className="mt-1 text-sm text-navy-500">{t.notes}</p>
              </li>
            ))}
          </ol>
        </div>
      ) : <EmptyState icon={Stethoscope} title="No treatments yet" message="Your treatment records will appear here after your first visit." actionLabel="Book appointment" actionTo="/appointment" />}
      <Card title="Invoices" className="mt-6"><InvoiceList list={inv} /></Card>
    </>
  );
}

export function Prescriptions() {
  const { rx } = usePatientData();
  return (
    <>
      <DashTitle title="Prescriptions" sub="Prescriptions issued by your dentist during visits." />
      <p className="mb-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">Always follow your dentist’s instructions. Do not start, stop or change medication without consulting a qualified professional.</p>
      {rx.length ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {rx.map((p) => (
            <div key={p.id} className="card p-6">
              <div className="flex items-center justify-between"><p className="font-semibold text-navy-900">{p.dentist}</p><span className="text-sm text-navy-500">{formatDate(p.date)}</span></div>
              <ul className="mt-4 space-y-3">{p.items.map((i) => <li key={i.name} className="flex gap-3 rounded-xl bg-navy-50 p-3"><Pill className="h-5 w-5 shrink-0 text-brand-600" /><div><p className="font-medium text-navy-900">{i.name}</p><p className="text-sm text-navy-500">{i.dosage} · {i.duration}</p></div></li>)}</ul>
              <p className="mt-3 text-xs text-navy-400">{p.notes}</p>
            </div>
          ))}
        </div>
      ) : <EmptyState icon={Pill} title="No prescriptions" />}
    </>
  );
}

export function Documents() {
  const { docs } = usePatientData();
  const toast = useToast();
  const download = (d) => {
    downloadFile(`${d.name}.txt`, `${d.name}\nType: ${d.type}\nDate: ${formatDate(d.date)}\n\nDemo placeholder document from SmileCare Dental.`, 'text/plain');
    toast(`Downloading ${d.name}`);
  };
  return (
    <>
      <DashTitle title="Dental Documents" sub="X-rays, reports and forms from your visits." />
      <DataTable rows={docs} emptyTitle="No documents yet" searchPlaceholder="Search documents…" columns={[
        { key: 'name', header: 'Document', render: (d) => <span className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600"><FileText className="h-4 w-4" /></span><span className="font-medium text-navy-900">{d.name}</span></span> },
        { key: 'type', header: 'Type', render: (d) => <Badge tone="New">{d.type}</Badge> },
        { key: 'date', header: 'Date', render: (d) => formatDate(d.date) },
        { key: 'size', header: 'Size' },
        { key: 'actions', header: '', render: (d) => <Button size="sm" variant="outline" onClick={() => download(d)}><Download className="h-4 w-4" />Download</Button>, className: 'text-right' },
      ]} />
    </>
  );
}

export function Notifications() {
  const { notifications, setNotifications } = useData();
  const markAll = () => setNotifications((l) => l.map((n) => ({ ...n, read: true })));
  return (
    <>
      <DashTitle title="Notifications" sub="Reminders and updates about your care.">
        <Button variant="outline" onClick={markAll} disabled={!notifications.some((n) => !n.read)}><CheckCheck className="h-4 w-4" />Mark all as read</Button>
      </DashTitle>
      {notifications.length ? (
        <div className="card divide-y divide-navy-100">
          {notifications.map((n) => (
            <button key={n.id} onClick={() => setNotifications((l) => l.map((x) => (x.id === n.id ? { ...x, read: true } : x)))} className={cn('flex w-full gap-4 p-5 text-left transition hover:bg-navy-50/50', !n.read && 'bg-brand-50/40')}>
              <span className={cn('mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full', n.read ? 'bg-navy-200' : 'bg-brand-600')} />
              <div className="flex-1"><p className="font-semibold text-navy-900">{n.title}</p><p className="text-sm text-navy-500">{n.text}</p></div>
              <span className="shrink-0 text-xs text-navy-400">{formatDate(n.date)}</span>
            </button>
          ))}
        </div>
      ) : <EmptyState icon={Bell} title="No notifications" />}
    </>
  );
}

