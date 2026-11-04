// Small shared UI primitives.
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Star, Check } from 'lucide-react';
import { cn } from '../../utils/format';

const badgeTones = {
  Confirmed: 'bg-teal-50 text-teal-600 ring-teal-100',
  Completed: 'bg-brand-50 text-brand-700 ring-brand-100',
  Pending: 'bg-amber-50 text-amber-700 ring-amber-100',
  Cancelled: 'bg-red-50 text-red-600 ring-red-100',
  Active: 'bg-teal-50 text-teal-600 ring-teal-100',
  Inactive: 'bg-navy-50 text-navy-500 ring-navy-100',
  Approved: 'bg-teal-50 text-teal-600 ring-teal-100',
  Hidden: 'bg-navy-50 text-navy-500 ring-navy-100',
  Paid: 'bg-teal-50 text-teal-600 ring-teal-100',
  Unpaid: 'bg-amber-50 text-amber-700 ring-amber-100',
  New: 'bg-brand-50 text-brand-700 ring-brand-100',
};

export function Badge({ children, tone, className }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset', badgeTones[tone || children] || 'bg-navy-50 text-navy-600 ring-navy-100', className)}>
      {children}
    </span>
  );
}

export function SectionHeading({ eyebrow, title, subtitle, center = true, pill, className }) {
  return (
    <div className={cn('mb-12 max-w-2xl', center && 'mx-auto text-center', className)}>
      {eyebrow && <span className={cn('mb-4', pill ? 'inline-block rounded-full bg-brand-100 px-4 py-1 text-xs font-semibold text-brand-700' : 'eyebrow')}>{eyebrow}</span>}
      <h2 className="text-3xl font-extrabold sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-lg leading-relaxed text-navy-500">{subtitle}</p>}
    </div>
  );
}

export function Reveal({ children, delay = 0, className, y = 24 }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

export function StarRating({ value = 5, size = 'h-4 w-4' }) {
  return (
    <div className="flex gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={cn(size, i <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-navy-200')} />
      ))}
    </div>
  );
}

export function Accordion({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="divide-y divide-navy-100 rounded-2xl border border-navy-100 bg-white">
      {items.map((item, i) => (
        <div key={item.q}>
          <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left" aria-expanded={open === i}>
            <span className="font-semibold text-navy-900">{item.q}</span>
            <ChevronDown className={cn('h-5 w-5 shrink-0 text-navy-400 transition-transform', open === i && 'rotate-180 text-brand-600')} />
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <p className="px-6 pb-5 leading-relaxed text-navy-500">{item.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export function Field({ label, error, children, hint, className }) {
  return (
    <div className={className}>
      {label && <label className="label">{label}</label>}
      {children}
      {error ? <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p> : hint ? <p className="mt-1.5 text-xs text-navy-400">{hint}</p> : null}
    </div>
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className={cn('relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition', checked ? 'bg-teal-500' : 'bg-navy-200')}>
      <span className={cn('inline-block h-5 w-5 rounded-full bg-white shadow transition', checked ? 'translate-x-5' : 'translate-x-0.5')} />
    </button>
  );
}

// Horizontal progress indicator for multi-step flows.
export function Stepper({ steps, current }) {
  return (
    <ol className="flex items-center">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={s} className={cn('flex items-center', i < steps.length - 1 && 'flex-1')}>
            <div className="flex flex-col items-center gap-2">
              <span className={cn('flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition', done ? 'bg-teal-500 text-white' : active ? 'bg-brand-600 text-white ring-4 ring-brand-100' : 'bg-navy-100 text-navy-400')}>
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span className={cn('hidden text-xs font-medium md:block', active ? 'text-navy-900' : 'text-navy-400')}>{s}</span>
            </div>
            {i < steps.length - 1 && <div className={cn('mx-2 h-0.5 flex-1 rounded md:mb-6', done ? 'bg-teal-500' : 'bg-navy-100')} />}
          </li>
        );
      })}
    </ol>
  );
}

export function PageHeader({ eyebrow, title, subtitle, children }) {
  return (
    <section className="border-b border-navy-100 bg-gradient-to-b from-brand-50/70 to-white">
      <div className="container-x py-14 md:py-20">
        <Reveal>
          {eyebrow && <span className="eyebrow mb-4">{eyebrow}</span>}
          <h1 className="max-w-3xl text-4xl font-extrabold sm:text-5xl">{title}</h1>
          {subtitle && <p className="mt-4 max-w-2xl text-lg text-navy-500">{subtitle}</p>}
          {children}
        </Reveal>
      </div>
    </section>
  );
}
