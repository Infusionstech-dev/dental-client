import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Sparkles, Calculator, Trash2, Eye, Check, EyeOff, Mail, MailOpen, Star, RotateCcw, Save, Bot, X } from 'lucide-react';
import Button from '../../components/common/Button';
import DataTable from '../../components/common/DataTable';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import Modal from '../../components/common/Modal';
import Img from '../../components/common/Img';
import EmptyState from '../../components/common/EmptyState';
import FormModal from '../../components/dashboard/FormModal';
import { Badge, Field, StarRating, Toggle } from '../../components/common/ui';
import { DashTitle } from '../../layouts/DashboardLayout';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { categoryLabels, defaultAssistantSettings } from '../../data/assistant';
import { authService } from '../../services/authService';
import { defaultPricing } from '../../data/pricing';
import { cn, formatBDT, formatDate, uid } from '../../utils/format';

const iconBtn = 'rounded-lg p-2 text-navy-500 transition hover:bg-navy-50 hover:text-navy-900';

// Shared hook for list CRUD with modal + delete confirmation.
function useCrud(setList, label) {
  const toast = useToast();
  const [editing, setEditing] = useState(null); // null | {} (new) | item
  const [deleting, setDeleting] = useState(null);
  const save = (data, idKey = 'id', prefix = 'x') => {
    if (editing?.[idKey]) {
      setList((l) => l.map((x) => (x[idKey] === editing[idKey] ? { ...x, ...data } : x)));
      toast(`${label} updated`);
    } else {
      setList((l) => [{ ...data, [idKey]: data[idKey] || uid(prefix) }, ...l]);
      toast(`${label} added`);
    }
  };
  const remove = (idKey = 'id') => {
    setList((l) => l.filter((x) => x[idKey] !== deleting[idKey]));
    toast(`${label} deleted`, 'info');
  };
  return { editing, setEditing, deleting, setDeleting, save, remove };
}

/* ---------------- Patients ---------------- */
export function AdminPatients() {
  const { patients, setPatients } = useData();
  const c = useCrud(setPatients, 'Patient');
  const fields = [
    { name: 'name', label: 'Full name', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Phone', required: true },
    { name: 'age', label: 'Age', type: 'number' },
    { name: 'gender', label: 'Gender', type: 'select', options: ['Female', 'Male', 'Other'] },
    { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] },
  ];
  return (
    <>
      <DashTitle title="Patient Management" sub={`${patients.length} registered patients`}><Button onClick={() => c.setEditing({})}><Plus className="h-4 w-4" />Add patient</Button></DashTitle>
      <DataTable rows={patients} searchPlaceholder="Search patients…" columns={[
        { key: 'name', header: 'Patient', render: (p) => <div><p className="font-medium text-navy-900">{p.name}</p><p className="text-xs text-navy-500">{p.email}</p></div>, searchValue: (p) => p.name + p.email },
        { key: 'phone', header: 'Phone' },
        { key: 'age', header: 'Age / Gender', render: (p) => `${p.age ?? '—'} · ${p.gender || '—'}` },
        { key: 'lastVisit', header: 'Last visit', render: (p) => formatDate(p.lastVisit) },
        { key: 'status', header: 'Status', render: (p) => <Badge>{p.status}</Badge> },
        { key: 'a', header: '', className: 'text-right', render: (p) => <><button className={iconBtn} onClick={() => c.setEditing(p)} aria-label="Edit"><Pencil className="h-4 w-4" /></button><button className={iconBtn} onClick={() => c.setDeleting(p)} aria-label="Delete"><Trash2 className="h-4 w-4 text-red-500" /></button></> },
      ]} />
      <FormModal open={!!c.editing} onClose={() => c.setEditing(null)} title={c.editing?.id ? 'Edit patient' : 'Add patient'} fields={fields} initial={c.editing?.id ? c.editing : { status: 'Active', gender: 'Female', joined: new Date().toISOString().slice(0, 10), lastVisit: '' }} onSubmit={(d) => c.save({ joined: new Date().toISOString().slice(0, 10), ...d }, 'id', 'p')} />
      <ConfirmationDialog open={!!c.deleting} onClose={() => c.setDeleting(null)} title="Delete patient?" message={`${c.deleting?.name} will be removed permanently.`} confirmLabel="Delete" onConfirm={() => c.remove()} />
    </>
  );
}

/* ---------------- Appointments ---------------- */
export function AdminAppointments() {
  const { appointments, updateAppointment, setAppointments, getService, getDentist } = useData();
  const toast = useToast();
  const [status, setStatus] = useState('All');
  const [deleting, setDeleting] = useState(null);
  const rows = [...appointments].filter((a) => status === 'All' || a.status === status).sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <DashTitle title="Appointment Management" sub="Confirm, complete or cancel bookings."><Button to="/appointment" variant="outline"><Plus className="h-4 w-4" />New booking</Button></DashTitle>
      <DataTable rows={rows} searchPlaceholder="Search by patient, ID…" toolbar={
        <div className="flex flex-wrap gap-1">{['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((s) => <button key={s} onClick={() => setStatus(s)} className={cn('rounded-lg px-3 py-1.5 text-xs font-semibold', status === s ? 'bg-brand-600 text-white' : 'bg-navy-50 text-navy-600 hover:bg-navy-100')}>{s}</button>)}</div>
      } columns={[
        { key: 'id', header: 'ID', render: (a) => <span className="font-mono text-xs">{a.id}</span> },
        { key: 'patientName', header: 'Patient', render: (a) => <div><p className="font-medium text-navy-900">{a.patientName}</p><p className="text-xs text-navy-500">{a.phone}</p></div> },
        { key: 'service', header: 'Service', render: (a) => getService(a.service)?.name, searchValue: (a) => getService(a.service)?.name },
        { key: 'dentistId', header: 'Dentist', render: (a) => getDentist(a.dentistId)?.name, searchValue: (a) => getDentist(a.dentistId)?.name },
        { key: 'date', header: 'Date & time', render: (a) => `${formatDate(a.date)} · ${a.time}` },
        { key: 'status', header: 'Status', render: (a) => (
          <select value={a.status} onChange={(e) => { updateAppointment(a.id, { status: e.target.value }); toast(`${a.id} marked ${e.target.value}`); }} className="rounded-lg border border-navy-200 bg-white px-2 py-1 text-xs font-semibold" aria-label="Change status">
            {['Pending', 'Confirmed', 'Completed', 'Cancelled'].map((s) => <option key={s}>{s}</option>)}
          </select>
        ) },
        { key: 'x', header: '', render: (a) => <button className={iconBtn} onClick={() => setDeleting(a)} aria-label="Delete"><Trash2 className="h-4 w-4 text-red-500" /></button> },
      ]} />
      <ConfirmationDialog open={!!deleting} onClose={() => setDeleting(null)} title="Delete appointment?" message={`Appointment ${deleting?.id} will be removed.`} confirmLabel="Delete" onConfirm={() => { setAppointments((l) => l.filter((x) => x.id !== deleting.id)); toast('Appointment deleted', 'info'); }} />
    </>
  );
}

/* ---------------- Dentists ---------------- */
export function AdminDentists() {
  const { dentists, setDentists, services } = useData();
  const c = useCrud(setDentists, 'Dentist');
  const fields = [
    { name: 'name', label: 'Full name', required: true },
    { name: 'title', label: 'Title', required: true },
    { name: 'qualifications', label: 'Qualifications', required: true, full: true },
    { name: 'experience', label: 'Years of experience', type: 'number', required: true },
    { name: 'photo', label: 'Photo URL' },
    { name: 'specializationsText', label: 'Specializations', hint: 'Comma separated', full: true },
    { name: 'availabilityText', label: 'Availability', hint: 'e.g. Sat, Mon, Wed', full: true },
    { name: 'bio', label: 'Short bio', type: 'textarea' },
  ];
  const toForm = (d) => ({ ...d, specializationsText: d.specializations?.join(', '), availabilityText: d.availability?.join(', ') });
  const fromForm = ({ specializationsText = '', availabilityText = '', ...d }) => ({
    ...d,
    specializations: specializationsText.split(',').map((s) => s.trim()).filter(Boolean),
    availability: availabilityText.split(',').map((s) => s.trim().slice(0, 3)).filter(Boolean).map((s) => s[0].toUpperCase() + s.slice(1).toLowerCase()),
  });
  return (
    <>
      <DashTitle title="Dentist Management" sub={`${dentists.length} dentists`}><Button onClick={() => c.setEditing({})}><Plus className="h-4 w-4" />Add dentist</Button></DashTitle>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {dentists.map((d) => (
          <div key={d.id} className="card flex gap-4 p-4">
            <Img src={d.photo} alt={d.name} className="h-20 w-20 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-navy-900">{d.name}</p>
              <p className="truncate text-sm text-brand-600">{d.title}</p>
              <p className="mt-1 text-xs text-navy-500">{d.experience} yrs · {d.availability?.join(', ')}</p>
              <div className="mt-2 flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs text-navy-500"><Toggle checked={!!d.featured} onChange={(v) => setDentists((l) => l.map((x) => (x.id === d.id ? { ...x, featured: v } : x)))} label="Featured" />Featured</label>
                <span className="flex-1" />
                <button className={iconBtn} onClick={() => c.setEditing(toForm(d))} aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                <button className={iconBtn} onClick={() => c.setDeleting(d)} aria-label="Delete"><Trash2 className="h-4 w-4 text-red-500" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <FormModal open={!!c.editing} onClose={() => c.setEditing(null)} title={c.editing?.id ? 'Edit dentist' : 'Add dentist'} fields={fields} initial={c.editing?.id ? c.editing : { experience: 1, availabilityText: 'Sat, Mon, Wed' }} onSubmit={(d) => c.save({ rating: 5, reviews: 0, services: services.slice(0, 2).map((s) => s.slug), ...fromForm(d) }, 'id', 'd')} />
      <ConfirmationDialog open={!!c.deleting} onClose={() => c.setDeleting(null)} title="Remove dentist?" message={`${c.deleting?.name} will be removed from the website and booking.`} confirmLabel="Remove" onConfirm={() => c.remove()} />
    </>
  );
}

/* ---------------- Services ---------------- */
// Services and their treatment pricing, managed together under one admin menu item.
export function AdminServicesPricing() {
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') === 'pricing' ? 'pricing' : 'services';
  const tabs = [['services', 'Services', Sparkles], ['pricing', 'Treatment Pricing', Calculator]];
  return (
    <>
      <div className="mb-6 inline-flex rounded-xl border border-navy-100 bg-white p-1 shadow-soft">
        {tabs.map(([key, label, I]) => (
          <button key={key} onClick={() => setParams(key === 'pricing' ? { tab: key } : {})} className={cn('inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition', tab === key ? 'bg-gradient-to-r from-brand-600 to-teal-500 text-white shadow-sm' : 'text-navy-600 hover:bg-brand-50 hover:text-brand-700')}>
            <I className="h-4 w-4" />{label}
          </button>
        ))}
      </div>
      {tab === 'pricing' ? <AdminPricing /> : <AdminServices />}
    </>
  );
}

export function AdminServices() {
  const { services, setServices, servicePrice } = useData();
  const c = useCrud(setServices, 'Service');
  const fields = [
    { name: 'name', label: 'Service name', required: true },
    { name: 'icon', label: 'Icon (Lucide name)', hint: 'e.g. Smile, Sparkles' },
    { name: 'startingPrice', label: 'Starting price (BDT)', type: 'number', required: true, hint: 'Used when not linked to estimator pricing' },
    { name: 'duration', label: 'Estimated duration', required: true },
    { name: 'short', label: 'Short description', type: 'textarea' },
    { name: 'description', label: 'Full description', type: 'textarea' },
  ];
  const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return (
    <>
      <DashTitle title="Dental Services Management" sub="Edit service details shown across the website."><Button onClick={() => c.setEditing({})}><Plus className="h-4 w-4" />Add service</Button></DashTitle>
      <DataTable rows={services.map((s) => ({ ...s, id: s.slug }))} searchPlaceholder="Search services…" columns={[
        { key: 'name', header: 'Service', render: (s) => <div><p className="font-medium text-navy-900">{s.name}</p><p className="max-w-xs truncate text-xs text-navy-500">{s.short}</p></div> },
        { key: 'price', header: 'Starting price', render: (s) => <span>{formatBDT(servicePrice(s))}{s.pricingKey && <span className="ml-2 rounded bg-teal-50 px-1.5 py-0.5 text-[10px] font-semibold text-teal-600">ESTIMATOR</span>}</span> },
        { key: 'duration', header: 'Duration' },
        { key: 'active', header: 'Visible', render: (s) => <Toggle checked={s.active} onChange={(v) => setServices((l) => l.map((x) => (x.slug === s.slug ? { ...x, active: v } : x)))} label="Visible" /> },
        { key: 'a', header: '', className: 'text-right', render: (s) => <><button className={iconBtn} onClick={() => c.setEditing(s)} aria-label="Edit"><Pencil className="h-4 w-4" /></button><button className={iconBtn} onClick={() => c.setDeleting(s)} aria-label="Delete"><Trash2 className="h-4 w-4 text-red-500" /></button></> },
      ]} />
      <p className="mt-3 text-xs text-navy-500">Services tagged “ESTIMATOR” take their starting price from Treatment Pricing.</p>
      <FormModal open={!!c.editing} onClose={() => c.setEditing(null)} title={c.editing?.slug ? 'Edit service' : 'Add service'} fields={fields} initial={c.editing?.slug ? c.editing : { icon: 'Smile', startingPrice: 1000, duration: '30 minutes' }}
        onSubmit={(d) => c.save(c.editing?.slug ? d : { active: true, pricingKey: null, image: '', benefits: ['Personalised care'], process: ['Consultation', 'Treatment', 'Follow-up'], faqs: [], ...d, slug: slugify(d.name) }, 'slug')} />
      <ConfirmationDialog open={!!c.deleting} onClose={() => c.setDeleting(null)} title="Delete service?" message={`${c.deleting?.name} will be removed from the website.`} confirmLabel="Delete" onConfirm={() => c.remove('slug')} />
    </>
  );
}

/* ---------------- Treatment Pricing ---------------- */
export function AdminPricing() {
  const { pricing, setPricing, resetPricing } = useData();
  const toast = useToast();
  const [draft, setDraft] = useState(pricing);
  const [openKey, setOpenKey] = useState(pricing.treatments[0]?.key);
  const [adding, setAdding] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(pricing);

  const updT = (key, patch) => setDraft((d) => ({ ...d, treatments: d.treatments.map((t) => (t.key === key ? { ...t, ...patch } : t)) }));
  const updItem = (key, list, id, patch) => setDraft((d) => ({ ...d, treatments: d.treatments.map((t) => (t.key === key ? { ...t, [list]: t[list].map((x) => (x.id === id ? { ...x, ...patch } : x)) } : t)) }));
  const addItem = (key, list) => setDraft((d) => ({ ...d, treatments: d.treatments.map((t) => (t.key === key ? { ...t, [list]: [...t[list], { id: uid('o'), name: list === 'options' ? 'New option' : 'New service', price: 0, enabled: true }] } : t)) }));
  const delItem = (key, list, id) => setDraft((d) => ({ ...d, treatments: d.treatments.map((t) => (t.key === key ? { ...t, [list]: t[list].filter((x) => x.id !== id) } : t)) }));
  const num = (v) => (v === '' ? 0 : Number(v));

  const save = () => { setPricing(draft); toast('Pricing saved — estimator and service prices updated'); };

  return (
    <>
      <DashTitle title="Treatment Pricing Management" sub="Prices here power the Cost Estimator and service starting prices.">
        <Button variant="outline" onClick={() => setConfirmReset(true)}><RotateCcw className="h-4 w-4" />Reset defaults</Button>
        <Button variant="outline" onClick={() => setAdding(true)}><Plus className="h-4 w-4" />Add treatment</Button>
        <Button onClick={save} disabled={!dirty}><Save className="h-4 w-4" />Save changes</Button>
      </DashTitle>
      {dirty && <p className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">You have unsaved changes.</p>}

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          {draft.treatments.map((t) => (
            <div key={t.key} className="card overflow-hidden">
              <div className="flex flex-wrap items-center gap-3 p-4">
                <button onClick={() => setOpenKey(openKey === t.key ? null : t.key)} className="min-w-0 flex-1 text-left">
                  <p className="font-semibold text-navy-900">{t.name}</p>
                  <p className="text-xs text-navy-500">Base {formatBDT(t.basePrice)}{t.perTooth ? ' / tooth' : ''} · {t.options.length} options · {t.addons.length} add-ons</p>
                </button>
                <label className="flex items-center gap-2 text-xs text-navy-500">{t.enabled ? 'Enabled' : 'Disabled'}<Toggle checked={t.enabled} onChange={(v) => updT(t.key, { enabled: v })} label={`Enable ${t.name}`} /></label>
                <Button size="sm" variant="ghost" onClick={() => setOpenKey(openKey === t.key ? null : t.key)}>{openKey === t.key ? 'Close' : 'Edit'}</Button>
              </div>
              {openKey === t.key && (
                <div className="space-y-6 border-t border-navy-100 bg-navy-50/30 p-4 sm:p-5">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field label="Treatment name"><input className="input" value={t.name} onChange={(e) => updT(t.key, { name: e.target.value })} /></Field>
                    <Field label="Base price (BDT)"><input type="number" min="0" className="input" value={t.basePrice} onChange={(e) => updT(t.key, { basePrice: num(e.target.value) })} /></Field>
                    <Field label="Duration"><input className="input" value={t.duration} onChange={(e) => updT(t.key, { duration: e.target.value })} /></Field>
                  </div>
                  <div className="flex flex-wrap gap-6 text-sm text-navy-700">
                    <label className="flex items-center gap-2"><Toggle checked={t.perTooth} onChange={(v) => updT(t.key, { perTooth: v })} label="Per tooth" />Priced per tooth</label>
                    <label className="flex items-center gap-2"><Toggle checked={t.usesComplexity} onChange={(v) => updT(t.key, { usesComplexity: v })} label="Uses complexity" />Apply complexity multiplier</label>
                  </div>
                  {[['options', 'Treatment options (price adjustment)'], ['addons', 'Additional charges / services']].map(([list, label]) => (
                    <div key={list}>
                      <div className="mb-2 flex items-center justify-between"><p className="text-sm font-semibold text-navy-800">{label}</p><Button size="sm" variant="secondary" onClick={() => addItem(t.key, list)}><Plus className="h-3.5 w-3.5" />Add</Button></div>
                      <div className="space-y-2">
                        {t[list].map((o) => (
                          <div key={o.id} className="flex items-center gap-2 rounded-xl bg-white p-2 ring-1 ring-navy-100">
                            <input className="input flex-1 py-2" value={o.name} onChange={(e) => updItem(t.key, list, o.id, { name: e.target.value })} aria-label="Name" />
                            <input type="number" className="input w-28 py-2" value={o.price} onChange={(e) => updItem(t.key, list, o.id, { price: num(e.target.value) })} aria-label="Price" />
                            <Toggle checked={o.enabled} onChange={(v) => updItem(t.key, list, o.id, { enabled: v })} label="Enabled" />
                            <button className={iconBtn} onClick={() => delItem(t.key, list, o.id)} aria-label="Remove"><X className="h-4 w-4" /></button>
                          </div>
                        ))}
                        {!t[list].length && <p className="text-xs text-navy-400">None yet.</p>}
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end"><Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => setDraft((d) => ({ ...d, treatments: d.treatments.filter((x) => x.key !== t.key) }))}><Trash2 className="h-4 w-4" />Delete treatment</Button></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-bold">Complexity multipliers</h3>
            <div className="mt-3 space-y-3">
              {Object.entries(draft.complexity).map(([k, c]) => (
                <Field key={k} label={c.label}><input type="number" step="0.05" min="1" className="input" value={c.multiplier} onChange={(e) => setDraft((d) => ({ ...d, complexity: { ...d.complexity, [k]: { ...c, multiplier: num(e.target.value) || 1 } } }))} /></Field>
              ))}
            </div>
          </div>
          <div className="card p-5">
            <div className="flex items-center justify-between"><h3 className="font-bold">Discount</h3><Toggle checked={draft.discount.enabled} onChange={(v) => setDraft((d) => ({ ...d, discount: { ...d.discount, enabled: v } }))} label="Enable discount" /></div>
            <div className="mt-3 space-y-3">
              <Field label="Label"><input className="input" value={draft.discount.label} onChange={(e) => setDraft((d) => ({ ...d, discount: { ...d.discount, label: e.target.value } }))} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Percent"><input type="number" min="0" max="100" className="input" value={draft.discount.percent} onChange={(e) => setDraft((d) => ({ ...d, discount: { ...d.discount, percent: num(e.target.value) } }))} /></Field>
                <Field label="Min total (৳)"><input type="number" min="0" className="input" value={draft.discount.minTotal} onChange={(e) => setDraft((d) => ({ ...d, discount: { ...d.discount, minTotal: num(e.target.value) } }))} /></Field>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FormModal open={adding} onClose={() => setAdding(false)} title="Add treatment" fields={[
        { name: 'name', label: 'Treatment name', required: true },
        { name: 'basePrice', label: 'Base price (BDT)', type: 'number', required: true },
        { name: 'duration', label: 'Duration', required: true },
        { name: 'perTooth', label: 'Pricing', type: 'select', options: [{ value: 'no', label: 'Flat price' }, { value: 'yes', label: 'Per tooth' }] },
      ]} initial={{ basePrice: 1000, duration: '30 minutes', perTooth: 'no' }} onSubmit={(d) => {
        const key = uid('t');
        setDraft((p) => ({ ...p, treatments: [...p.treatments, { key, name: d.name, icon: 'Smile', enabled: true, basePrice: d.basePrice, perTooth: d.perTooth === 'yes', usesComplexity: true, duration: d.duration, options: [{ id: 'standard', name: 'Standard', price: 0, enabled: true }], addons: [] }] }));
        setOpenKey(key);
        toast('Treatment added — remember to save', 'info');
      }} />
      <ConfirmationDialog open={confirmReset} onClose={() => setConfirmReset(false)} title="Reset pricing?" message="All treatment prices will be restored to defaults." confirmLabel="Reset" onConfirm={() => { resetPricing(); setDraft(defaultPricing); toast('Pricing reset to defaults', 'info'); }} />
    </>
  );
}

/* ---------------- AI Assistant Settings ---------------- */
export function AdminAssistant() {
  const { assistantSettings, setAssistantSettings, resetAssistant } = useData();
  const toast = useToast();
  const [s, setS] = useState(assistantSettings);
  const [newQ, setNewQ] = useState('');
  const save = () => {
    setAssistantSettings(s);
    localStorage.removeItem('smilecare:chat'); // restart chat so the new welcome message applies
    toast('Assistant settings saved');
  };
  return (
    <>
      <DashTitle title="AI Assistant Settings" sub="Mock configuration for the AI Dental Assistant.">
        <Button variant="outline" onClick={() => { resetAssistant(); setS(defaultAssistantSettings); localStorage.removeItem('smilecare:chat'); toast('Assistant settings reset', 'info'); }}><RotateCcw className="h-4 w-4" />Reset</Button>
        <Button onClick={save}><Save className="h-4 w-4" />Save settings</Button>
      </DashTitle>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="card space-y-5 p-6">
          <div className="flex items-center justify-between rounded-xl bg-navy-50 p-4">
            <div className="flex items-center gap-3"><Bot className="h-6 w-6 text-brand-600" /><div><p className="font-semibold text-navy-900">Assistant enabled</p><p className="text-xs text-navy-500">Show the chat widget and assistant page</p></div></div>
            <Toggle checked={s.enabled} onChange={(v) => setS({ ...s, enabled: v })} label="Assistant enabled" />
          </div>
          <Field label="Assistant name"><input className="input" value={s.name} onChange={(e) => setS({ ...s, name: e.target.value })} /></Field>
          <Field label="Welcome message"><textarea rows={4} className="input resize-none" value={s.welcomeMessage} onChange={(e) => setS({ ...s, welcomeMessage: e.target.value })} /></Field>
          <div>
            <p className="label">Response categories</p>
            <div className="space-y-2">
              {Object.entries(categoryLabels).map(([k, l]) => (
                <label key={k} className="flex items-center justify-between rounded-xl border border-navy-100 px-4 py-2.5 text-sm">
                  <span>{l}{k === 'emergency' && <span className="ml-2 text-xs text-navy-400">(always on for safety)</span>}</span>
                  <Toggle checked={k === 'emergency' ? true : s.categories[k]} onChange={(v) => k !== 'emergency' && setS({ ...s, categories: { ...s.categories, [k]: v } })} label={l} />
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="card p-6">
          <p className="label">Suggested questions</p>
          <ul className="space-y-2">
            {s.suggestedQuestions.map((q, i) => (
              <li key={i} className="flex items-center gap-2">
                <input className="input flex-1" value={q} onChange={(e) => setS({ ...s, suggestedQuestions: s.suggestedQuestions.map((x, j) => (j === i ? e.target.value : x)) })} aria-label={`Question ${i + 1}`} />
                <button className={iconBtn} onClick={() => setS({ ...s, suggestedQuestions: s.suggestedQuestions.filter((_, j) => j !== i) })} aria-label="Remove"><X className="h-4 w-4" /></button>
              </li>
            ))}
          </ul>
          <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (newQ.trim()) { setS({ ...s, suggestedQuestions: [...s.suggestedQuestions, newQ.trim()] }); setNewQ(''); } }}>
            <input className="input flex-1" placeholder="Add a suggested question" value={newQ} onChange={(e) => setNewQ(e.target.value)} />
            <Button type="submit" variant="secondary"><Plus className="h-4 w-4" />Add</Button>
          </form>
          <div className="mt-6 rounded-xl border border-dashed border-navy-200 p-4 text-sm text-navy-500">
            <p className="font-semibold text-navy-700">Integration note</p>
            <p className="mt-1">Responses currently come from the local mock engine in <code className="rounded bg-navy-50 px-1">src/services/assistantService.js</code>. Set <code className="rounded bg-navy-50 px-1">VITE_USE_MOCK=false</code> to route messages to the backend <code className="rounded bg-navy-50 px-1">/assistant/chat</code> endpoint.</p>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------------- Reviews ---------------- */
export function AdminReviews() {
  const { reviews, setReviews } = useData();
  const toast = useToast();
  const [deleting, setDeleting] = useState(null);
  const setStatus = (r, status) => { setReviews((l) => l.map((x) => (x.id === r.id ? { ...x, status } : x))); toast(`Review ${status.toLowerCase()}`); };
  return (
    <>
      <DashTitle title="Reviews Management" sub="Approved reviews appear on the homepage testimonials." />
      {reviews.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {reviews.map((r) => (
            <div key={r.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div><p className="font-semibold text-navy-900">{r.name}</p><p className="text-xs text-navy-500">{r.service} · {formatDate(r.date)}</p></div>
                <Badge>{r.status}</Badge>
              </div>
              <div className="mt-2"><StarRating value={r.rating} /></div>
              <p className="mt-3 text-sm text-navy-600">“{r.text}”</p>
              <div className="mt-4 flex gap-2">
                {r.status !== 'Approved' && <Button size="sm" variant="teal" onClick={() => setStatus(r, 'Approved')}><Check className="h-4 w-4" />Approve</Button>}
                {r.status !== 'Hidden' && <Button size="sm" variant="outline" onClick={() => setStatus(r, 'Hidden')}><EyeOff className="h-4 w-4" />Hide</Button>}
                <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => setDeleting(r)}><Trash2 className="h-4 w-4" />Delete</Button>
              </div>
            </div>
          ))}
        </div>
      ) : <EmptyState icon={Star} title="No reviews yet" />}
      <ConfirmationDialog open={!!deleting} onClose={() => setDeleting(null)} title="Delete review?" message={`The review by ${deleting?.name} will be deleted.`} confirmLabel="Delete" onConfirm={() => { setReviews((l) => l.filter((x) => x.id !== deleting.id)); toast('Review deleted', 'info'); }} />
    </>
  );
}

/* ---------------- Contact Messages ---------------- */
export function AdminMessages() {
  const { messages, setMessages } = useData();
  const toast = useToast();
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const open = (m) => { setViewing(m); setMessages((l) => l.map((x) => (x.id === m.id ? { ...x, read: true } : x))); };
  return (
    <>
      <DashTitle title="Contact Messages" sub={`${messages.filter((m) => !m.read).length} unread`} />
      <DataTable rows={messages} emptyTitle="No messages" searchPlaceholder="Search messages…" columns={[
        { key: 'read', header: '', render: (m) => (m.read ? <MailOpen className="h-4 w-4 text-navy-300" /> : <Mail className="h-4 w-4 text-brand-600" />) },
        { key: 'name', header: 'From', render: (m) => <div><p className={cn('text-navy-900', !m.read && 'font-semibold')}>{m.name}</p><p className="text-xs text-navy-500">{m.email}</p></div>, searchValue: (m) => m.name + m.email },
        { key: 'subject', header: 'Subject', render: (m) => <span className={cn(!m.read && 'font-semibold')}>{m.subject}</span> },
        { key: 'date', header: 'Date', render: (m) => formatDate(m.date) },
        { key: 'a', header: '', className: 'text-right', render: (m) => <><button className={iconBtn} onClick={() => open(m)} aria-label="View"><Eye className="h-4 w-4" /></button><button className={iconBtn} onClick={() => setDeleting(m)} aria-label="Delete"><Trash2 className="h-4 w-4 text-red-500" /></button></> },
      ]} />
      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.subject} footer={<><Button variant="outline" onClick={() => setViewing(null)}>Close</Button><Button href={`mailto:${viewing?.email}?subject=Re: ${viewing?.subject}`}><Mail className="h-4 w-4" />Reply by email</Button></>}>
        {viewing && <div className="space-y-3 text-sm"><p><strong>{viewing.name}</strong> · {viewing.email}{viewing.phone && ` · ${viewing.phone}`}</p><p className="text-navy-500">{formatDate(viewing.date)}</p><p className="whitespace-pre-wrap rounded-xl bg-navy-50 p-4 text-navy-700">{viewing.message}</p></div>}
      </Modal>
      <ConfirmationDialog open={!!deleting} onClose={() => setDeleting(null)} title="Delete message?" message={`Message from ${deleting?.name} will be deleted.`} confirmLabel="Delete" onConfirm={() => { setMessages((l) => l.filter((x) => x.id !== deleting.id)); toast('Message deleted', 'info'); }} />
    </>
  );
}

/* ---------------- Website Settings ---------------- */
export function AdminSettings() {
  const { siteSettings, setSiteSettings, resetDemoData } = useData();
  const toast = useToast();
  const [s, setS] = useState(siteSettings);
  const [confirm, setConfirm] = useState(false);
  const f = (k) => ({ value: s[k] ?? '', onChange: (e) => setS({ ...s, [k]: e.target.value }) });
  return (
    <>
      <DashTitle title="Website Settings" sub="Clinic details shown across the public website."><Button onClick={() => { setSiteSettings(s); toast('Settings saved'); }}><Save className="h-4 w-4" />Save settings</Button></DashTitle>
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="card grid gap-5 p-6 sm:grid-cols-2">
          <Field label="Clinic name"><input className="input" {...f('clinicName')} /></Field>
          <Field label="Email"><input className="input" {...f('email')} /></Field>
          <Field label="Phone"><input className="input" {...f('phone')} /></Field>
          <Field label="Emergency phone"><input className="input" {...f('emergencyPhone')} /></Field>
          <Field label="Address" className="sm:col-span-2"><input className="input" {...f('address')} /></Field>
          <Field label="Announcement bar text" className="sm:col-span-2"><input className="input" {...f('announcement')} /></Field>
          <label className="flex items-center gap-3 text-sm text-navy-700 sm:col-span-2"><Toggle checked={s.showAnnouncement} onChange={(v) => setS({ ...s, showAnnouncement: v })} label="Show announcement" />Show announcement bar</label>
        </div>
        <div className="card h-fit border-red-100 p-6">
          <h3 className="font-bold">Demo data</h3>
          <p className="mt-1 text-sm text-navy-500">All changes are stored in your browser’s localStorage. Reset to restore the original mock data (you will be logged out).</p>
          <Button variant="danger" className="mt-4" onClick={() => setConfirm(true)}><RotateCcw className="h-4 w-4" />Reset all demo data</Button>
        </div>
      </div>
      <ConfirmationDialog open={confirm} onClose={() => setConfirm(false)} title="Reset all demo data?" message="Appointments, patients, pricing, settings and accounts will return to defaults." confirmLabel="Reset everything" onConfirm={resetDemoData} />
    </>
  );
}

/* ---------------- Doctor Approvals ---------------- */
export function AdminDoctorApprovals() {
  const { setDentists, dentists } = useData();
  const toast = useToast();
  const [doctors, setDoctors] = useState(() => authService.listUsers('doctor'));
  const [tab, setTab] = useState('pending');
  const [action, setAction] = useState(null); // { doc, status }
  const refresh = () => setDoctors(authService.listUsers('doctor'));

  const apply = async ({ doc, status }) => {
    let patch = {};
    if (status === 'approved' && !doc.dentistId) {
      // Approved doctors get a public dentist profile so they can be booked.
      const dentistId = `d-${doc.id}`;
      if (!dentists.some((d) => d.id === dentistId)) {
        setDentists((l) => [...l, { id: dentistId, name: doc.name, title: doc.specialization || 'Dentist', qualifications: doc.qualifications || '', specializations: doc.specialization ? [doc.specialization] : [], experience: doc.experience || 0, availability: ['Sat', 'Mon', 'Wed'], rating: 5, reviews: 0, photo: '', bio: `${doc.name} is a member of the SmileCare dental team.`, services: ['general-dentistry'], featured: false }]);
      }
      patch = { dentistId };
    }
    await authService.setDoctorStatus(doc.id, status, patch);
    refresh();
    toast(status === 'approved' ? `${doc.name} approved — they can now log in` : `${doc.name} ${status === 'rejected' ? 'rejected' : 'updated'}`, status === 'approved' ? 'success' : 'info');
  };

  const counts = { pending: 0, approved: 0, rejected: 0 };
  doctors.forEach((d) => { counts[d.status || 'pending'] += 1; });
  const list = doctors.filter((d) => (d.status || 'pending') === tab);
  const tone = { pending: 'Pending', approved: 'Approved', rejected: 'Cancelled' };

  return (
    <>
      <DashTitle title="Doctor Approvals" sub="Verify credentials before doctors can access the doctor dashboard." />
      <div className="mb-5 inline-flex rounded-xl bg-white p-1 shadow-soft">
        {['pending', 'approved', 'rejected'].map((k) => <button key={k} onClick={() => setTab(k)} className={cn('rounded-lg px-4 py-2 text-sm font-semibold capitalize transition', tab === k ? 'bg-brand-600 text-white' : 'text-navy-600 hover:text-navy-900')}>{k} ({counts[k]})</button>)}
      </div>
      {list.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {list.map((d) => (
            <div key={d.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div><p className="font-semibold text-navy-900">{d.name}</p><p className="text-sm text-brand-600">{d.specialization}</p></div>
                <Badge tone={tone[d.status || 'pending']}>{(d.status || 'pending').replace(/^./, (c) => c.toUpperCase())}</Badge>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {[['BMDC reg. no.', d.regNo], ['Experience', `${d.experience ?? 0} years`], ['Qualifications', d.qualifications], ['Applied', formatDate(d.joined)], ['Email', d.email], ['Phone', d.phone]].map(([k, v]) => (
                  <div key={k} className="min-w-0"><dt className="text-xs text-navy-400">{k}</dt><dd className="truncate font-medium text-navy-800">{v || '—'}</dd></div>
                ))}
              </dl>
              <div className="mt-5 flex flex-wrap gap-2">
                {d.status !== 'approved' && <Button size="sm" variant="teal" onClick={() => setAction({ doc: d, status: 'approved' })}><Check className="h-4 w-4" />Approve</Button>}
                {d.status !== 'rejected' && <Button size="sm" variant="outline" className="text-red-600" onClick={() => setAction({ doc: d, status: 'rejected' })}><X className="h-4 w-4" />{d.status === 'approved' ? 'Revoke access' : 'Reject'}</Button>}
              </div>
            </div>
          ))}
        </div>
      ) : <EmptyState title={`No ${tab} doctor accounts`} message={tab === 'pending' ? 'New doctor registrations will appear here for review.' : undefined} />}
      <ConfirmationDialog open={!!action} onClose={() => setAction(null)} danger={action?.status !== 'approved'}
        title={action?.status === 'approved' ? 'Approve doctor?' : 'Reject / revoke doctor?'}
        message={action?.status === 'approved' ? `${action?.doc.name} will be able to log in, view their appointments and write prescriptions. A public dentist profile will be created.` : `${action?.doc.name} will not be able to log in to the doctor dashboard.`}
        confirmLabel={action?.status === 'approved' ? 'Approve' : 'Confirm'} onConfirm={() => apply(action)} />
    </>
  );
}
