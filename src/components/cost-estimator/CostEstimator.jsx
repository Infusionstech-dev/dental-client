import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Calculator, Clock, Info, Minus, Plus, RotateCcw, CalendarCheck, MessageSquare, Check } from 'lucide-react';
import Button from '../common/Button';
import Icon from '../common/Icon';
import EmptyState from '../common/EmptyState';
import { Stepper } from '../common/ui';
import { useData } from '../../context/DataContext';
import { calculateEstimate, startingPriceFor } from '../../utils/pricingCalculator';
import { cn, formatBDT } from '../../utils/format';

export const ESTIMATE_DISCLAIMER =
  "These prices are preliminary estimates only. Actual treatment costs may vary depending on clinical examination, X-rays, treatment complexity and the dentist's recommendation.";

// Maps estimator keys to service slugs so "Book Appointment" pre-selects the right service.
const SERVICE_FOR = { cleaning: 'teeth-cleaning', whitening: 'teeth-whitening', rootCanal: 'root-canal-treatment', implants: 'dental-implants', braces: 'braces-orthodontics', veneers: 'dental-veneers', extraction: 'tooth-extraction', filling: 'general-dentistry' };

const initial = { treatmentKey: null, teeth: 1, complexity: 'simple', optionId: null, addons: [] };

export default function CostEstimator() {
  const { pricing } = useData();
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState(initial);
  const treatments = pricing.treatments.filter((t) => t.enabled);
  const treatment = treatments.find((t) => t.key === sel.treatmentKey);
  const estimate = useMemo(() => (sel.treatmentKey ? calculateEstimate(pricing, sel) : null), [pricing, sel]);

  const choose = (t) => {
    setSel({ ...initial, treatmentKey: t.key, optionId: t.options.find((o) => o.enabled)?.id });
    setStep(1);
  };
  const toggleAddon = (id) => setSel((s) => ({ ...s, addons: s.addons.includes(id) ? s.addons.filter((a) => a !== id) : [...s.addons, id] }));
  const reset = () => { setSel(initial); setStep(0); };

  if (!treatments.length) return <EmptyState icon={Calculator} title="Estimator unavailable" message="No treatments are currently enabled. Please contact the clinic." actionLabel="Contact us" actionTo="/contact" />;

  return (
    <div className="card p-5 sm:p-8">
      <div className="mb-8"><Stepper steps={['Treatment', 'Details', 'Estimate']} current={step} /></div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
          {step === 0 && (
            <>
              <h3 className="text-xl font-bold">Select a treatment category</h3>
              <p className="mt-1 text-sm text-navy-500">Choose the treatment you’d like an estimate for.</p>
              <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                {treatments.map((t) => (
                  <button key={t.key} onClick={() => choose(t)} className={cn('group rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:border-brand-500 hover:shadow-soft', sel.treatmentKey === t.key ? 'border-brand-500 bg-brand-50' : 'border-navy-100 bg-white')}>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white"><Icon name={t.icon} className="h-5 w-5" /></span>
                    <p className="mt-3 font-semibold text-navy-900">{t.name}</p>
                    <p className="text-xs text-navy-500">from {formatBDT(startingPriceFor(pricing, t.key))}{t.perTooth ? ' / tooth' : ''}</p>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 1 && treatment && (
            <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
              <div className="space-y-7">
                <div>
                  <h3 className="text-xl font-bold">{treatment.name} — details</h3>
                  <p className="mt-1 text-sm text-navy-500">Adjust the options below. The estimate updates instantly.</p>
                </div>

                {treatment.perTooth && (
                  <div>
                    <p className="label">Number of teeth</p>
                    <div className="inline-flex items-center rounded-xl border border-navy-200">
                      <button onClick={() => setSel((s) => ({ ...s, teeth: Math.max(1, s.teeth - 1) }))} className="p-3 text-navy-600 hover:text-brand-600" aria-label="Decrease"><Minus className="h-4 w-4" /></button>
                      <span className="w-12 text-center font-bold text-navy-900">{sel.teeth}</span>
                      <button onClick={() => setSel((s) => ({ ...s, teeth: Math.min(32, s.teeth + 1) }))} className="p-3 text-navy-600 hover:text-brand-600" aria-label="Increase"><Plus className="h-4 w-4" /></button>
                    </div>
                  </div>
                )}

                {treatment.usesComplexity && (
                  <div>
                    <p className="label">Treatment complexity</p>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {Object.entries(pricing.complexity).map(([k, c]) => (
                        <button key={k} onClick={() => setSel((s) => ({ ...s, complexity: k }))} className={cn('rounded-xl border p-3 text-left transition', sel.complexity === k ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-100' : 'border-navy-200 hover:border-navy-400')}>
                          <p className="text-sm font-semibold text-navy-900">{c.label} {c.multiplier > 1 && <span className="font-normal text-navy-400">+{Math.round((c.multiplier - 1) * 100)}%</span>}</p>
                          <p className="mt-0.5 text-xs text-navy-500">{c.hint}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="label">Preferred treatment option</p>
                  <div className="space-y-2">
                    {treatment.options.filter((o) => o.enabled).map((o) => (
                      <label key={o.id} className={cn('flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition', sel.optionId === o.id ? 'border-brand-500 bg-brand-50' : 'border-navy-200 hover:border-navy-400')}>
                        <span className="flex items-center gap-3">
                          <input type="radio" name="option" checked={sel.optionId === o.id} onChange={() => setSel((s) => ({ ...s, optionId: o.id }))} className="accent-brand-600" />
                          <span className="text-sm font-medium text-navy-800">{o.name}</span>
                        </span>
                        <span className="text-sm text-navy-500">{o.price === 0 ? 'Included' : `${o.price > 0 ? '+' : '−'}${formatBDT(Math.abs(o.price))}`}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {treatment.addons.some((a) => a.enabled) && (
                  <div>
                    <p className="label">Additional services</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {treatment.addons.filter((a) => a.enabled).map((a) => {
                        const on = sel.addons.includes(a.id);
                        return (
                          <button key={a.id} onClick={() => toggleAddon(a.id)} className={cn('flex items-center justify-between gap-3 rounded-xl border p-3.5 text-left transition', on ? 'border-teal-500 bg-teal-50' : 'border-navy-200 hover:border-navy-400')}>
                            <span className="flex items-center gap-3">
                              <span className={cn('flex h-5 w-5 items-center justify-center rounded-md border', on ? 'border-teal-500 bg-teal-500 text-white' : 'border-navy-300')}>{on && <Check className="h-3.5 w-3.5" />}</span>
                              <span className="text-sm font-medium text-navy-800">{a.name}</span>
                            </span>
                            <span className="text-sm text-navy-500">+{formatBDT(a.price)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <aside className="h-fit rounded-2xl bg-navy-900 p-6 text-white lg:sticky lg:top-24">
                <p className="text-sm text-navy-200">Running estimate</p>
                <p className="mt-1 font-display text-3xl font-extrabold">{formatBDT(estimate?.total)}</p>
                {estimate?.discount > 0 && <p className="mt-1 text-xs text-teal-500">Includes {formatBDT(estimate.discount)} discount</p>}
                <p className="mt-4 flex items-center gap-2 text-sm text-navy-200"><Clock className="h-4 w-4" />{estimate?.duration}</p>
              </aside>

              <div className="flex justify-between gap-3 lg:col-span-2">
                <Button variant="outline" onClick={() => setStep(0)}><ArrowLeft className="h-4 w-4" />Back</Button>
                <Button onClick={() => setStep(2)}>See full estimate<ArrowRight className="h-4 w-4" /></Button>
              </div>
            </div>
          )}

          {step === 2 && estimate && (
            <div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-teal-600">Your preliminary estimate</p>
                  <h3 className="text-2xl font-bold">{estimate.treatment.name}</h3>
                </div>
                <p className="flex items-center gap-2 text-sm text-navy-500"><Clock className="h-4 w-4" />Estimated duration: <strong className="text-navy-800">{estimate.duration}</strong></p>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
                <div className="rounded-2xl border border-navy-100">
                  <div className="border-b border-navy-100 px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-navy-400">Treatment details</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-sm">
                      <span className="rounded-lg bg-navy-50 px-2.5 py-1">{estimate.option?.name}</span>
                      {estimate.treatment.perTooth && <span className="rounded-lg bg-navy-50 px-2.5 py-1">{estimate.teeth} {estimate.teeth > 1 ? 'teeth' : 'tooth'}</span>}
                      {estimate.treatment.usesComplexity && <span className="rounded-lg bg-navy-50 px-2.5 py-1">{estimate.complexity.label} complexity</span>}
                    </div>
                  </div>
                  <dl className="divide-y divide-navy-100 text-sm">
                    <Row label={`Estimated base price${estimate.treatment.perTooth ? ` (${formatBDT(estimate.unitPrice)} × ${estimate.teeth})` : ''}`} value={formatBDT(estimate.basePrice)} />
                    {estimate.complexityCharge > 0 && <Row label={`Complexity adjustment (${estimate.complexity.label})`} value={`+${formatBDT(estimate.complexityCharge)}`} />}
                    {estimate.addons.map((a) => <Row key={a.id} label={`${a.name}${a.perTooth && estimate.teeth > 1 ? ` × ${estimate.teeth}` : ''}`} value={`+${formatBDT(a.total)}`} />)}
                    <Row label="Additional charges (total)" value={formatBDT(estimate.additionalCharges)} muted />
                    <Row label={estimate.discountLabel || `Possible discount${pricing.discount.enabled ? ` (${pricing.discount.percent}% on estimates over ${formatBDT(pricing.discount.minTotal)})` : ''}`} value={estimate.discount ? `−${formatBDT(estimate.discount)}` : formatBDT(0)} accent={estimate.discount > 0} />
                  </dl>
                </div>

                <div className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-brand-600 to-teal-600 p-6 text-white">
                  <div>
                    <p className="text-sm text-white/80">Estimated total</p>
                    <p className="mt-1 font-display text-4xl font-extrabold">{formatBDT(estimate.total)}</p>
                    <p className="mt-2 text-xs text-white/70">BDT, incl. selected options</p>
                  </div>
                  <div className="mt-6 space-y-2">
                    <Button to={`/appointment?service=${SERVICE_FOR[estimate.treatment.key] || ''}`} variant="white" className="w-full"><CalendarCheck className="h-4 w-4" />Book Appointment</Button>
                    <Button to={`/contact?subject=${encodeURIComponent(`Consultation: ${estimate.treatment.name} (est. ${formatBDT(estimate.total)})`)}`} variant="ghost" className="w-full text-white hover:bg-white/10 hover:text-white"><MessageSquare className="h-4 w-4" />Request a Consultation</Button>
                  </div>
                </div>
              </div>

              <p className="mt-6 flex gap-2 rounded-xl bg-amber-50 p-4 text-sm text-amber-800"><Info className="mt-0.5 h-4 w-4 shrink-0" />{ESTIMATE_DISCLAIMER}</p>

              <div className="mt-6 flex flex-wrap justify-between gap-3">
                <Button variant="outline" onClick={() => setStep(1)}><ArrowLeft className="h-4 w-4" />Edit selections</Button>
                <Button variant="ghost" onClick={reset}><RotateCcw className="h-4 w-4" />Start over</Button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Row({ label, value, muted, accent }) {
  return (
    <div className={cn('flex items-center justify-between gap-4 px-5 py-3.5', muted && 'bg-navy-50/50')}>
      <dt className={cn('text-navy-600', muted && 'font-medium')}>{label}</dt>
      <dd className={cn('font-semibold', accent ? 'text-teal-600' : 'text-navy-900')}>{value}</dd>
    </div>
  );
}
