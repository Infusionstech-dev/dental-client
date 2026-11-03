import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Field } from '../common/ui';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { cn, todayISO, uid } from '../../utils/format';

const emptyItem = { name: '', dosage: '', duration: '' };

// Modal for doctors to write a prescription; optionally records the treatment and completes the appointment.
// patients: [{ key, name }] — selectable when no patient is preset.
export default function PrescriptionForm({ open, onClose, doctor, patient, appointment, patients = [] }) {
  const { setPrescriptions, setTreatments, updateAppointment } = useData();
  const toast = useToast();
  const { register, control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  useEffect(() => {
    if (open) reset({ patientKey: patient?.key || '', diagnosis: '', treatment: '', items: [{ ...emptyItem }], notes: '', followUp: '', complete: !!appointment });
  }, [open, patient, appointment, reset]);

  const submit = handleSubmit(async (d) => {
    const p = patient || patients.find((x) => x.key === d.patientKey);
    const date = todayISO();
    const items = d.items.filter((i) => i.name.trim());
    setPrescriptions((l) => [{ id: uid('rx'), date, patientId: p.key, patientName: p.name, dentistId: doctor.dentistId, dentist: doctor.name, appointmentId: appointment?.id, diagnosis: d.diagnosis, items, notes: d.notes, followUp: d.followUp }, ...l]);
    if (d.treatment.trim()) {
      setTreatments((l) => [{ id: uid('t'), date, patientId: p.key, dentistId: doctor.dentistId, dentist: doctor.name, treatment: d.treatment, status: 'Completed', notes: d.diagnosis }, ...l]);
    }
    if (appointment && d.complete) updateAppointment(appointment.id, { status: 'Completed' });
    toast(`Prescription saved for ${p.name}`);
    onClose();
  });

  return (
    <Modal open={open} onClose={onClose} size="xl" title={patient ? `New prescription — ${patient.name}` : 'New prescription'}
      footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={submit} loading={isSubmitting}>Save prescription</Button></>}>
      <form onSubmit={submit} noValidate className="space-y-5">
        {!patient && (
          <Field label="Patient *" error={errors.patientKey?.message}>
            <select className={cn('input', errors.patientKey && 'input-error')} {...register('patientKey', { required: 'Select a patient' })}>
              <option value="">Select patient</option>
              {patients.map((p) => <option key={p.key} value={p.key}>{p.name}</option>)}
            </select>
          </Field>
        )}
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Diagnosis / chief complaint *" error={errors.diagnosis?.message}><input className={cn('input', errors.diagnosis && 'input-error')} {...register('diagnosis', { required: 'Diagnosis is required' })} /></Field>
          <Field label="Treatment performed" hint="Adds an entry to the patient’s treatment history"><input className="input" placeholder="e.g. Scaling & polishing" {...register('treatment')} /></Field>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="label mb-0">Medicines</p>
            <Button type="button" size="sm" variant="secondary" onClick={() => append({ ...emptyItem })}><Plus className="h-3.5 w-3.5" />Add medicine</Button>
          </div>
          <div className="space-y-2">
            {fields.map((f, i) => (
              <div key={f.id} className="grid gap-2 rounded-xl bg-navy-50/60 p-3 sm:grid-cols-[1.4fr_1.2fr_0.8fr_auto]">
                <input className={cn('input', errors.items?.[i]?.name && 'input-error')} placeholder="Medicine name & strength" {...register(`items.${i}.name`, { required: i === 0 ? 'At least one medicine' : false })} />
                <input className="input" placeholder="Dosage (e.g. 1+0+1 after meals)" {...register(`items.${i}.dosage`)} />
                <input className="input" placeholder="Duration" {...register(`items.${i}.duration`)} />
                <button type="button" onClick={() => remove(i)} disabled={fields.length === 1} className="rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:opacity-30" aria-label="Remove medicine"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
          {errors.items?.[0]?.name && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.items[0].name.message}</p>}
        </div>

        <div className="grid gap-5 sm:grid-cols-[1fr_200px]">
          <Field label="Advice / instructions"><textarea rows={3} className="input resize-none" placeholder="e.g. Avoid hard food for 24 hours" {...register('notes')} /></Field>
          <Field label="Follow-up date"><input type="date" min={todayISO()} className="input" {...register('followUp')} /></Field>
        </div>
        {appointment && <label className="flex items-center gap-2 text-sm text-navy-700"><input type="checkbox" className="accent-brand-600" {...register('complete')} />Mark appointment {appointment.id} as completed</label>}
        <button type="submit" className="hidden" />
      </form>
    </Modal>
  );
}
