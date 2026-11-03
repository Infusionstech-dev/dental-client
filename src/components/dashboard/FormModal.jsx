import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Field } from '../common/ui';
import { cn } from '../../utils/format';

// Config-driven create/edit modal. fields: [{ name, label, type?, options?, required?, full? }]
export default function FormModal({ open, onClose, title, fields, initial, onSubmit, submitLabel = 'Save' }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  useEffect(() => { if (open) reset(initial || {}); }, [open, initial, reset]);

  const submit = handleSubmit(async (data) => {
    await onSubmit(data);
    onClose();
  });

  return (
    <Modal open={open} onClose={onClose} title={title} size="lg" footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={submit} loading={isSubmitting}>{submitLabel}</Button></>}>
      <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => {
          const rules = { required: f.required && `${f.label} is required`, ...(f.type === 'number' ? { valueAsNumber: true, min: { value: 0, message: 'Must be 0 or more' } } : {}), ...(f.type === 'email' ? { pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } } : {}) };
          const cls = cn('input', errors[f.name] && 'input-error', f.type === 'textarea' && 'resize-none');
          return (
            <Field key={f.name} label={`${f.label}${f.required ? ' *' : ''}`} error={errors[f.name]?.message} hint={f.hint} className={f.full || f.type === 'textarea' ? 'sm:col-span-2' : ''}>
              {f.type === 'select' ? (
                <select className={cls} {...register(f.name, rules)}>{f.options.map((o) => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}</select>
              ) : f.type === 'textarea' ? (
                <textarea rows={3} className={cls} {...register(f.name, rules)} />
              ) : (
                <input type={f.type || 'text'} className={cls} {...register(f.name, rules)} />
              )}
            </Field>
          );
        })}
        <button type="submit" className="hidden" />
      </form>
    </Modal>
  );
}
