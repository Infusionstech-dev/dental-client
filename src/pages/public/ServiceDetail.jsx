import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, Clock, ChevronRight } from 'lucide-react';
import Img from '../../components/common/Img';
import Icon from '../../components/common/Icon';
import DentistCard from '../../components/common/DentistCard';
import PricingCard from '../../components/services/PricingCard';
import ServiceCard from '../../components/services/ServiceCard';
import { Accordion, Reveal } from '../../components/common/ui';
import { useData } from '../../context/DataContext';
import NotFound from './NotFound';

export default function ServiceDetail() {
  const { slug } = useParams();
  const { getService, servicePrice, dentists, services } = useData();
  const s = getService(slug);
  if (!s || !s.active) return <NotFound />;
  const team = dentists.filter((d) => d.services.includes(s.slug)).slice(0, 3);
  const related = services.filter((x) => x.active && x.slug !== s.slug).slice(0, 3);

  return (
    <>
      <section className="border-b border-navy-100 bg-gradient-to-b from-brand-50/70 to-white">
        <div className="container-x grid items-center gap-10 py-12 lg:grid-cols-2 lg:py-16">
          <Reveal>
            <nav className="mb-5 flex items-center gap-1 text-sm text-navy-500"><Link to="/services" className="hover:text-brand-600">Services</Link><ChevronRight className="h-4 w-4" /><span className="text-navy-800">{s.name}</span></nav>
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-soft"><Icon name={s.icon} className="h-7 w-7" /></span>
            <h1 className="mt-5 text-4xl font-extrabold sm:text-5xl">{s.name}</h1>
            <p className="mt-4 text-lg leading-relaxed text-navy-500">{s.description}</p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-navy-600 shadow-soft"><Clock className="h-4 w-4 text-teal-600" />Estimated duration: <strong>{s.duration}</strong></p>
          </Reveal>
          <Img src={s.image} alt={s.name} className="aspect-[4/3] w-full rounded-3xl shadow-lift" />
        </div>
      </section>

      <section className="section">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_340px]">
          <div className="space-y-14">
            <div>
              <h2 className="text-2xl font-bold">Benefits</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {s.benefits.map((b) => <div key={b} className="flex gap-3 rounded-xl bg-teal-50/60 p-4"><CheckCircle2 className="h-5 w-5 shrink-0 text-teal-600" /><span className="text-navy-700">{b}</span></div>)}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Treatment process</h2>
              <ol className="mt-6 space-y-0">
                {s.process.map((p, i) => (
                  <li key={p} className="relative flex gap-5 pb-8 last:pb-0">
                    {i < s.process.length - 1 && <span className="absolute left-5 top-10 h-[calc(100%-2.5rem)] w-px bg-navy-100" />}
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 font-bold text-white">{i + 1}</span>
                    <p className="pt-2 font-medium text-navy-800">{p}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h2 className="mb-5 text-2xl font-bold">Frequently asked questions</h2>
              <Accordion items={s.faqs} />
            </div>
            {team.length > 0 && (
              <div>
                <h2 className="mb-5 text-2xl font-bold">Dentists for this treatment</h2>
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{team.map((d) => <DentistCard key={d.id} dentist={d} compact />)}</div>
              </div>
            )}
          </div>
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <PricingCard title={s.name} price={servicePrice(s)} duration={s.duration} highlight ctaTo={`/appointment?service=${s.slug}`} features={['Consultation & examination', 'Personalised treatment plan', 'Transparent pricing before treatment']} />
            <p className="mt-3 px-2 text-xs text-navy-400">Starting price is a preliminary estimate and may vary after clinical examination.</p>
          </aside>
        </div>
      </section>

      <section className="section bg-navy-50/50">
        <div className="container-x">
          <h2 className="mb-8 text-2xl font-bold">Related services</h2>
          <div className="grid gap-6 md:grid-cols-3">{related.map((r) => <ServiceCard key={r.slug} service={r} />)}</div>
        </div>
      </section>
    </>
  );
}
