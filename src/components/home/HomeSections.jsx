import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';
import { Bot, Calculator, ArrowRight, MapPin, Phone, Clock, Siren, MoveHorizontal } from 'lucide-react';
import Button from '../common/Button';
import Icon from '../common/Icon';
import Img from '../common/Img';
import { Reveal, SectionHeading } from '../common/ui';
import { beforeAfter, clinicInfo, stats, whyChooseUs } from '../../data/clinic';
import { useData } from '../../context/DataContext';
import { formatBDT } from '../../utils/format';
import { startingPriceFor } from '../../utils/pricingCalculator';

function Counter({ value, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, value, { duration: 1.6, ease: 'easeOut', onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, value]);
  return <span ref={ref}>{n.toLocaleString('en-IN')}{suffix}</span>;
}

export function StatsSection() {
  return (
    <section className="py-12">
      <div className="container-x">
        <div className="grid grid-cols-2 gap-6 rounded-3xl bg-navy-900 px-6 py-10 text-center md:grid-cols-4 md:px-12">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-3xl font-extrabold text-white sm:text-4xl"><Counter value={s.value} suffix={s.suffix} /></p>
              <p className="mt-1 text-sm text-navy-200">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyChooseUs() {
  return (
    <section className="section bg-navy-50/50">
      <div className="container-x">
        <SectionHeading eyebrow="Why SmileCare" title="Care that puts you at ease" subtitle="Everything about our clinic is designed around your comfort, safety and long-term results." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyChooseUs.map((w, i) => (
            <Reveal key={w.title} delay={i * 0.08}>
              <div className="card h-full p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600"><Icon name={w.icon} className="h-6 w-6" /></span>
                <h3 className="mt-5 text-lg font-bold">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-500">{w.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CompareSlider({ item }) {
  const [pos, setPos] = useState(50);
  return (
    <div className="card overflow-hidden">
      <div className="relative aspect-[4/3] select-none overflow-hidden">
        <Img src={item.after} alt={`${item.title} after`} className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Img src={item.before} alt={`${item.title} before`} className="h-full w-full grayscale-[60%] sepia-[25%]" />
        </div>
        <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }}>
          <div className="h-full w-0.5 -translate-x-1/2 bg-white" />
          <span className="absolute top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy-700 shadow-lift"><MoveHorizontal className="h-4 w-4" /></span>
        </div>
        <span className="absolute left-3 top-3 rounded-full bg-navy-900/70 px-2.5 py-1 text-xs font-semibold text-white">Before</span>
        <span className="absolute right-3 top-3 rounded-full bg-teal-600 px-2.5 py-1 text-xs font-semibold text-white">After</span>
        <input type="range" min="0" max="100" value={pos} onChange={(e) => setPos(Number(e.target.value))} className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0" aria-label={`Compare before and after ${item.title}`} />
      </div>
      <div className="p-5">
        <h3 className="font-bold">{item.title}</h3>
        <p className="text-sm text-navy-500">{item.note}</p>
      </div>
    </div>
  );
}

export function BeforeAfterGallery() {
  return (
    <section className="section">
      <div className="container-x">
        <SectionHeading eyebrow="Smile gallery" title="Before & after transformations" subtitle="Drag the slider to compare. Illustrative demo images — individual results vary." />
        <div className="grid gap-6 md:grid-cols-3">
          {beforeAfter.map((b, i) => <Reveal key={b.id} delay={i * 0.08}><CompareSlider item={b} /></Reveal>)}
        </div>
      </div>
    </section>
  );
}

export function FeaturePromos() {
  const { pricing } = useData();
  return (
    <section className="section bg-navy-50/50">
      <div className="container-x grid gap-6 lg:grid-cols-2">
        <Reveal>
          <div className="relative h-full overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 p-8 text-white sm:p-10">
            <Bot className="absolute -bottom-6 -right-6 h-48 w-48 text-white/10" />
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider">New · AI Dental Assistant</span>
            <h3 className="mt-5 text-3xl font-extrabold text-white">Questions? Ask our assistant, 24/7.</h3>
            <p className="mt-3 max-w-md text-white/80">Get simple explanations of treatments, oral-care tips, prices and help booking — any time of day.</p>
            <ul className="mt-5 space-y-1.5 text-sm text-white/90">
              <li>• “What is a root canal treatment?”</li>
              <li>• “How much does teeth whitening cost?”</li>
              <li>• “What should I do if I have a toothache?”</li>
            </ul>
            <Button to="/ai-assistant" variant="white" className="mt-7">Chat with the assistant<ArrowRight className="h-4 w-4" /></Button>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="card relative h-full overflow-hidden p-8 sm:p-10">
            <Calculator className="absolute -bottom-6 -right-6 h-48 w-48 text-brand-50" />
            <span className="eyebrow">New · Smart Cost Estimator</span>
            <h3 className="mt-5 text-3xl font-extrabold">Know your cost before you visit.</h3>
            <p className="mt-3 max-w-md text-navy-500">Choose a treatment, adjust the details and get a transparent price breakdown in seconds.</p>
            <div className="relative mt-6 grid max-w-sm grid-cols-2 gap-2 text-sm">
              {['cleaning', 'whitening', 'rootCanal', 'implants'].map((k) => {
                const t = pricing.treatments.find((x) => x.key === k);
                return t ? <div key={k} className="rounded-xl bg-navy-50 px-3 py-2"><p className="text-navy-500">{t.name}</p><p className="font-bold text-navy-900">from {formatBDT(startingPriceFor(pricing, k))}</p></div> : null;
              })}
            </div>
            <Button to="/cost-estimator" className="relative mt-7">Estimate my treatment<ArrowRight className="h-4 w-4" /></Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function ContactStrip() {
  const { siteSettings: s } = useData();
  const items = [
    { icon: MapPin, title: 'Visit us', text: s.address },
    { icon: Phone, title: 'Call us', text: s.phone, href: `tel:${s.phone}` },
    { icon: Clock, title: 'Opening hours', text: clinicInfo.hours.map((h) => `${h.day}: ${h.time}`).join(' · ') },
    { icon: Siren, title: '24/7 Emergency', text: s.emergencyPhone, href: `tel:${s.emergencyPhone}`, danger: true },
  ];
  return (
    <section className="pb-16 md:pb-24">
      <div className="container-x">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: I, ...it }) => (
            <div key={it.title} className="card flex gap-4 p-5">
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${it.danger ? 'bg-red-50 text-red-600' : 'bg-brand-50 text-brand-600'}`}><I className="h-5 w-5" /></span>
              <div>
                <p className="font-semibold text-navy-900">{it.title}</p>
                {it.href ? <a href={it.href} className="text-sm text-navy-500 hover:text-brand-600">{it.text}</a> : <p className="text-sm text-navy-500">{it.text}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
