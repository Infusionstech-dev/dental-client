import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { MapPin, Phone, Mail, Clock, Siren, Send, CheckCircle2 } from 'lucide-react';
import Button from '../../components/common/Button';
import { Field, PageHeader } from '../../components/common/ui';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { contactService } from '../../services/appointmentService';
import { clinicInfo } from '../../data/clinic';
import { cn } from '../../utils/format';

export default function Contact() {
  const [params] = useSearchParams();
  const { siteSettings: s, setMessages } = useData();
  const toast = useToast();
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ defaultValues: { subject: params.get('subject') || '' } });

  const onSubmit = async (data) => {
    try {
      const msg = await contactService.send(data);
      setMessages((m) => [msg, ...m]);
      setSent(true);
      reset({ subject: '' });
      toast('Message sent! We’ll get back to you within 24 hours.');
    } catch (e) {
      toast(e.message || 'Could not send message.', 'error');
    }
  };

  const info = [
    { icon: MapPin, label: 'Address', value: s.address },
    { icon: Phone, label: 'Phone', value: s.phone, href: `tel:${s.phone}` },
    { icon: Mail, label: 'Email', value: s.email, href: `mailto:${s.email}` },
  ];

  return (
    <>
      <PageHeader eyebrow="Contact us" title="We’re here to help" subtitle="Questions, consultations or feedback — reach out and our team will respond promptly." />
      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div className="card p-6 sm:p-8">
            {sent ? (
              <div className="flex flex-col items-center py-12 text-center">
                <CheckCircle2 className="h-14 w-14 text-teal-500" />
                <h2 className="mt-4 text-2xl font-bold">Thank you!</h2>
                <p className="mt-2 max-w-sm text-navy-500">Your message has been received. A member of our team will contact you within 24 hours.</p>
                <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>Send another message</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5 sm:grid-cols-2">
                <h2 className="text-2xl font-bold sm:col-span-2">Send us a message</h2>
                <Field label="Full name *" error={errors.name?.message}><input className={cn('input', errors.name && 'input-error')} {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name is too short' } })} /></Field>
                <Field label="Phone"><input className="input" placeholder="+880 1XXX-XXXXXX" {...register('phone', { pattern: { value: /^[+\d\s-]{8,}$/, message: 'Invalid phone number' } })} /></Field>
                <Field label="Email *" error={errors.email?.message} className="sm:col-span-2"><input type="email" className={cn('input', errors.email && 'input-error')} {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } })} /></Field>
                <Field label="Subject *" error={errors.subject?.message} className="sm:col-span-2"><input className={cn('input', errors.subject && 'input-error')} {...register('subject', { required: 'Subject is required' })} /></Field>
                <Field label="Message *" error={errors.message?.message} className="sm:col-span-2"><textarea rows={5} className={cn('input resize-none', errors.message && 'input-error')} {...register('message', { required: 'Message is required', minLength: { value: 10, message: 'Please write at least 10 characters' } })} /></Field>
                <div className="sm:col-span-2"><Button type="submit" loading={isSubmitting} size="lg"><Send className="h-4 w-4" />Send message</Button></div>
              </form>
            )}
          </div>

          <div className="space-y-5">
            {info.map(({ icon: I, ...it }) => (
              <div key={it.label} className="card flex gap-4 p-5"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><I className="h-5 w-5" /></span><div><p className="text-sm text-navy-500">{it.label}</p>{it.href ? <a href={it.href} className="font-semibold text-navy-900 hover:text-brand-600">{it.value}</a> : <p className="font-semibold text-navy-900">{it.value}</p>}</div></div>
            ))}
            <div className="card flex gap-4 p-5"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><Clock className="h-5 w-5" /></span><div><p className="text-sm text-navy-500">Opening hours</p>{clinicInfo.hours.map((h) => <p key={h.day} className="font-semibold text-navy-900">{h.day}: <span className="font-normal text-navy-600">{h.time}</span></p>)}</div></div>
            <div className="flex gap-4 rounded-2xl border border-red-100 bg-red-50 p-5"><Siren className="h-6 w-6 shrink-0 text-red-600" /><div><p className="font-bold text-red-900">Dental emergency?</p><p className="text-sm text-red-800">{clinicInfo.emergencyNote}</p><a href={`tel:${s.emergencyPhone}`} className="mt-1 inline-block text-lg font-bold text-red-700">{s.emergencyPhone}</a></div></div>
          </div>
        </div>

        <div className="container-x mt-10">
          <div className="relative flex aspect-[21/8] min-h-56 items-center justify-center overflow-hidden rounded-3xl border border-navy-100 bg-[linear-gradient(90deg,#e3e9f3_1px,transparent_1px),linear-gradient(#e3e9f3_1px,transparent_1px)] bg-[size:40px_40px]">
            <div className="text-center">
              <span className="mx-auto flex h-14 w-14 animate-bounce items-center justify-center rounded-full bg-brand-600 text-white shadow-lift"><MapPin className="h-7 w-7" /></span>
              <p className="mt-4 font-semibold text-navy-900">Google Maps placeholder</p>
              <p className="text-sm text-navy-500">{s.address}</p>
              <a href={`https://maps.google.com/?q=${encodeURIComponent(s.address)}`} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-semibold text-brand-600 hover:underline">Open in Google Maps →</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
