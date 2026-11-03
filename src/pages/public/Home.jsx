import { ArrowRight } from 'lucide-react';
import HeroSection from '../../components/home/HeroSection';
import TestimonialCard from '../../components/home/TestimonialCard';
import { BeforeAfterGallery, ContactStrip, FeaturePromos, StatsSection, WhyChooseUs } from '../../components/home/HomeSections';
import ServiceCard from '../../components/services/ServiceCard';
import DentistCard from '../../components/common/DentistCard';
import Button from '../../components/common/Button';
import { Accordion, Reveal, SectionHeading } from '../../components/common/ui';
import { useData } from '../../context/DataContext';
import { homeFaqs, testimonials } from '../../data/clinic';

export default function Home() {
  const { services, dentists, reviews } = useData();
  // Approved reviews from Admin → Reviews are shown alongside curated testimonials.
  const approved = reviews.filter((r) => r.status === 'Approved').map((r) => ({ id: r.id, name: r.name, role: r.service, rating: r.rating, text: r.text, avatar: null }));
  const allTestimonials = [...testimonials, ...approved.filter((a) => !testimonials.some((t) => t.name === a.name))].slice(0, 6);

  return (
    <>
      <HeroSection />
      <StatsSection />

      <section className="section">
        <div className="container-x">
          <SectionHeading eyebrow="Our services" title="Explore our dental services" subtitle="From routine check-ups to complete smile makeovers — all under one roof." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.filter((s) => s.active).slice(0, 8).map((s, i) => <Reveal key={s.slug} delay={(i % 4) * 0.06}><ServiceCard service={s} /></Reveal>)}
          </div>
          <div className="mt-10 text-center"><Button to="/services" variant="outline">View all services<ArrowRight className="h-4 w-4" /></Button></div>
        </div>
      </section>

      <WhyChooseUs />

      <section className="section">
        <div className="container-x">
          <SectionHeading eyebrow="Meet the team" title="Featured dentists" subtitle="Experienced specialists who listen first and treat gently." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dentists.filter((d) => d.featured).slice(0, 4).map((d, i) => <Reveal key={d.id} delay={i * 0.06}><DentistCard dentist={d} compact /></Reveal>)}
          </div>
          <div className="mt-10 text-center"><Button to="/dentists" variant="outline">Meet all dentists<ArrowRight className="h-4 w-4" /></Button></div>
        </div>
      </section>

      <FeaturePromos />

      <section className="section">
        <div className="container-x">
          <SectionHeading eyebrow="Testimonials" title="What our patients say" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {allTestimonials.slice(0, 3).map((t, i) => <Reveal key={t.id} delay={i * 0.06}><TestimonialCard t={t} /></Reveal>)}
          </div>
        </div>
      </section>

      <div className="bg-navy-50/50"><BeforeAfterGallery /></div>

      <section className="section">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading center={false} eyebrow="FAQ" title="Frequently asked questions" subtitle="Can’t find your answer? Ask our AI assistant or contact our team." className="mb-0" />
          <Accordion items={homeFaqs} />
        </div>
      </section>

      <ContactStrip />
    </>
  );
}
