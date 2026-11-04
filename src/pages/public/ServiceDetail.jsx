import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, Clock, ChevronRight } from 'lucide-react';
import Img from '../../components/common/Img';
import PricingCard from '../../components/services/PricingCard';
import { DentistPhotoCard, ServicePhotoCard } from '../../components/home/HomeSections';
import { Accordion, Reveal } from '../../components/common/ui';
import { useData } from '../../context/DataContext';
import NotFound from './NotFound';

export default function ServiceDetail() {
  const { slug } = useParams();
  const { getService, servicePrice, dentists, services } = useData();
  const service = getService(slug);
  if (!service || !service.active) return <NotFound />;
  const team = dentists.filter((dentist) => dentist.services.includes(service.slug)).slice(0, 3);
  const related = services.filter((other) => other.active && other.slug !== service.slug).slice(0, 3);

  return (
    <div className="bg-cream">
      <section>
        <div className="container-x grid items-center gap-10 py-12 lg:grid-cols-2 lg:py-16">
          <Reveal>
            <nav className="mb-5 flex items-center gap-1 text-sm text-navy-500"><Link to="/services" className="hover:text-brand-600">Services</Link><ChevronRight className="h-4 w-4" /><span className="text-navy-800">{service.name}</span></nav>
            <h1 className="text-4xl font-extrabold text-brand-600 sm:text-5xl">{service.name}</h1>
            <p className="mt-4 text-lg leading-relaxed text-navy-500">{service.description}</p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-navy-600 shadow-soft"><Clock className="h-4 w-4 text-brand-600" />Estimated duration: <strong>{service.duration}</strong></p>
          </Reveal>
          <Img src={service.image} alt={service.name} className="aspect-[16/10] w-full rounded-3xl shadow-lift" />
        </div>
      </section>

      <section className="pb-16 pt-4 md:pb-20">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_340px]">
          <div className="min-w-0 space-y-12">
            <div>
              <h2 className="text-2xl font-bold">Benefits</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {service.benefits.map((benefit) => <div key={benefit} className="flex gap-3 rounded-xl border border-teal-100 bg-teal-50 p-3"><CheckCircle2 className="h-5 w-5 shrink-0 text-teal-600" /><span className="text-sm text-navy-700">{benefit}</span></div>)}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Treatment process</h2>
              <ol className="mt-6">
                {service.process.map((step, index) => (
                  <li key={step} className="relative flex gap-4 pb-5 last:pb-0">
                    {index < service.process.length - 1 && <span className="absolute left-4 top-8 h-[calc(100%-2rem)] w-px bg-brand-200" />}
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">{index + 1}</span>
                    <p className="pt-1 font-medium text-navy-800">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h2 className="mb-5 text-2xl font-bold">Frequently asked questions</h2>
              <Accordion items={service.faqs} />
            </div>
            {team.length > 0 && (
              <div>
                <h2 className="mb-5 text-2xl font-bold">Dentists For This Treatment</h2>
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{team.map((dentist) => <DentistPhotoCard key={dentist.id} dentist={dentist} />)}</div>
              </div>
            )}
          </div>
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <PricingCard title={service.name} price={servicePrice(service)} duration={service.duration} highlight ctaTo={`/appointment?service=${service.slug}`} features={['Consultation & examination', 'Personalised treatment plan', 'Transparent pricing before treatment']} />
            <p className="mt-3 px-2 text-xs text-navy-400">Starting price is a preliminary estimate and may vary after clinical examination.</p>
          </aside>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="container-x">
          <h2 className="mb-8 text-2xl font-bold">Related Treatments</h2>
          <div className="grid gap-6 md:grid-cols-3">{related.map((other) => <ServicePhotoCard key={other.slug} service={other} />)}</div>
        </div>
      </section>
    </div>
  );
}
