import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { animate, useInView } from 'framer-motion';
import { Bot, Calculator, ArrowRight, Award, CalendarDays, MoveHorizontal } from 'lucide-react';
import Button from '../common/Button';
import Icon from '../common/Icon';
import Img from '../common/Img';
import { Accordion, Reveal, SectionHeading } from '../common/ui';
import TestimonialCard from './TestimonialCard';
import { beforeAfter, homeFaqs, stats, testimonials, whyChooseUs } from '../../data/clinic';
import ctaDoctor from '../../assets/cta-doctor.webp';
import { useData } from '../../context/DataContext';
import { formatBDT } from '../../utils/format';
import { startingPriceFor } from '../../utils/pricingCalculator';

export const Accent = ({ children }) => <span className="text-brand-600">{children}</span>;

function Counter({ value, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const animation = animate(0, value, { duration: 1.6, ease: 'easeOut', onUpdate: (latest) => setDisplayValue(Math.round(latest)) });
    return () => animation.stop();
  }, [inView, value]);
  return <span ref={ref}>{displayValue.toLocaleString('en-IN')}{suffix}</span>;
}

export function StatsBand() {
  return (
    <section className="bg-brand-600">
      <div className="container-x grid grid-cols-2 gap-y-8 py-12 text-center md:grid-cols-4 md:divide-x md:divide-white/25">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="font-display text-4xl font-extrabold text-white"><Counter value={stat.value} suffix={stat.suffix} /></p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/80">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ServicePhotoCard({ service }) {
  return (
    <Link to={`/services/${service.slug}`} className="group card block h-full p-3 transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="overflow-hidden rounded-xl"><Img src={service.image} alt={service.name} className="aspect-[4/3] w-full transition duration-500 group-hover:scale-105" /></div>
      <h3 className="mt-4 px-2 text-lg font-bold text-brand-600">{service.name}</h3>
      <p className="mt-1 px-2 pb-3 text-sm leading-relaxed text-navy-500">{service.short}</p>
    </Link>
  );
}

export function ServicesShowcase() {
  const { services } = useData();
  return (
    <section className="section">
      <div className="container-x">
        <SectionHeading pill eyebrow="Our Services" title={<>Explore Our <Accent>Services</Accent></>} subtitle="From routine check-ups to complete smile makeovers — all under one roof." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.filter((service) => service.active).slice(0, 6).map((service, index) => (
            <Reveal key={service.slug} delay={(index % 3) * 0.06}>
              <ServicePhotoCard service={service} />
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center"><Button to="/services" variant="solid">See All Services<ArrowRight className="h-4 w-4" /></Button></div>
      </div>
    </section>
  );
}

export function WhyChooseUs() {
  return (
    <section className="pb-16 md:pb-24">
      <div className="container-x">
        <SectionHeading pill eyebrow="Why Choose Us" title="Care That Puts You At Ease" subtitle="Everything about our clinic is designed around your comfort, safety and long-term results." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyChooseUs.map((reason, index) => (
            <Reveal key={reason.title} delay={index * 0.08}>
              <div className="card h-full p-6">
                <Icon name={reason.icon} className="h-8 w-8 text-brand-600" />
                <h3 className="mt-4 text-lg font-bold">{reason.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-500">{reason.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DentistPhotoCard({ dentist }) {
  return (
    <div className="card flex h-full flex-col p-3">
      <Img src={dentist.photo} alt={dentist.name} className="aspect-[4/3.6] w-full rounded-xl object-top" />
      <div className="flex flex-1 flex-col p-2 pt-4">
        <h3 className="text-xl font-bold text-brand-600">{dentist.name}</h3>
        <p className="text-sm font-medium text-navy-700">{dentist.title}</p>
        <div className="mt-2 space-y-1 text-sm text-navy-500">
          <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-navy-400" />{dentist.availability.join(', ')}</p>
          <p className="flex items-center gap-2"><Award className="h-4 w-4 text-navy-400" />{dentist.experience} years experience</p>
        </div>
        <div className="mt-auto flex gap-2 pt-4">
          <Button to={`/dentists/${dentist.id}`} variant="outline" size="sm" className="flex-1">View Details</Button>
          <Button to={`/appointment?dentist=${dentist.id}`} variant="solid" size="sm" className="flex-1">Book Now</Button>
        </div>
      </div>
    </div>
  );
}

export function TeamSection() {
  const { dentists } = useData();
  return (
    <section className="pb-16 md:pb-24">
      <div className="container-x">
        <SectionHeading center={false} pill eyebrow="Expert Dentists" title={<>Meet Our <Accent>Professional</Accent> Team Members</>} subtitle="Experienced specialists who listen first and treat gently." className="max-w-3xl" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dentists.filter((dentist) => dentist.featured).slice(0, 3).map((dentist, index) => (
            <Reveal key={dentist.id} delay={index * 0.06}>
              <DentistPhotoCard dentist={dentist} />
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center"><Button to="/dentists" variant="solid">See All Experts<ArrowRight className="h-4 w-4" /></Button></div>
      </div>
    </section>
  );
}

function CompareSlider({ item }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  return (
    <div className="card overflow-hidden">
      <div className="relative aspect-[4/3] select-none overflow-hidden">
        <Img src={item.after} alt={`${item.title} after`} className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
          <Img src={item.before} alt={`${item.title} before`} className="h-full w-full grayscale-[60%] sepia-[25%]" />
        </div>
        <div className="pointer-events-none absolute inset-y-0" style={{ left: `${sliderPosition}%` }}>
          <div className="h-full w-0.5 -translate-x-1/2 bg-white" />
          <span className="absolute top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy-700 shadow-lift"><MoveHorizontal className="h-4 w-4" /></span>
        </div>
        <span className="absolute left-3 top-3 rounded-full bg-navy-900/70 px-2.5 py-1 text-xs font-semibold text-white">Before</span>
        <span className="absolute right-3 top-3 rounded-full bg-teal-600 px-2.5 py-1 text-xs font-semibold text-white">After</span>
        <input type="range" min="0" max="100" value={sliderPosition} onChange={(event) => setSliderPosition(Number(event.target.value))} className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0" aria-label={`Compare before and after ${item.title}`} />
      </div>
      <div className="p-5">
        <h3 className="font-bold text-brand-600">{item.title}</h3>
        <p className="text-sm text-navy-500">{item.note}</p>
      </div>
    </div>
  );
}

export function BeforeAfterGallery() {
  return (
    <section className="pb-16 md:pb-24">
      <div className="container-x">
        <SectionHeading pill eyebrow="Smile Gallery" title={<>Before &amp; After <Accent>Transformations</Accent></>} subtitle="Drag the slider to compare. Illustrative demo images — individual results vary." />
        <div className="grid gap-6 md:grid-cols-3">
          {beforeAfter.map((item, index) => <Reveal key={item.id} delay={index * 0.08}><CompareSlider item={item} /></Reveal>)}
        </div>
      </div>
    </section>
  );
}

export function FeaturePromos() {
  const { pricing } = useData();
  return (
    <section className="pb-16 md:pb-24">
      <div className="container-x grid gap-6 lg:grid-cols-2">
        <Reveal className="h-full">
          <div className="relative h-full overflow-hidden rounded-3xl bg-brand-600 p-8 text-white sm:p-10">
            <Bot className="absolute -bottom-4 -right-4 h-44 w-44 text-white/15" />
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider">New · AI Dental Assistant</span>
            <h3 className="mt-5 text-3xl font-extrabold text-white">Questions? Ask our assistant, 24/7.</h3>
            <p className="mt-3 max-w-md text-white/80">Get simple explanations of treatments, oral-care tips, prices and help booking — any time of day.</p>
            <ul className="mt-5 space-y-1.5 text-sm text-white/90">
              <li>• “What is a root canal treatment?”</li>
              <li>• “How much does teeth whitening cost?”</li>
              <li>• “What should I do if I have a toothache?”</li>
            </ul>
            <Button to="/ai-assistant" variant="white" className="relative mt-7">Chat With AI Assistant<ArrowRight className="h-4 w-4" /></Button>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="h-full">
          <div className="card relative h-full overflow-hidden rounded-3xl p-8 sm:p-10">
            <Calculator className="absolute -bottom-6 -right-6 h-48 w-48 text-brand-50" />
            <span className="eyebrow">New · Smart Cost Estimator</span>
            <h3 className="mt-5 text-3xl font-extrabold">Know your cost before you visit.</h3>
            <p className="mt-3 max-w-md text-navy-500">Choose a treatment, adjust the details and get a transparent price breakdown in seconds.</p>
            <div className="relative mt-6 grid max-w-sm grid-cols-2 gap-2 text-sm">
              {['cleaning', 'whitening', 'rootCanal', 'implants'].map((treatmentKey) => {
                const treatment = pricing.treatments.find((candidate) => candidate.key === treatmentKey);
                return treatment ? <div key={treatmentKey} className="rounded-xl bg-navy-50 px-3 py-2"><p className="text-navy-500">{treatment.name}</p><p className="font-bold text-navy-900">from {formatBDT(startingPriceFor(pricing, treatmentKey))}</p></div> : null;
              })}
            </div>
            <Button to="/cost-estimator" variant="solid" className="relative mt-7">Estimate My Treatment<ArrowRight className="h-4 w-4" /></Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function TestimonialsMarquee() {
  const { reviews } = useData();
  // Approved reviews from Admin → Reviews are shown alongside curated testimonials.
  const approved = reviews.filter((review) => review.status === 'Approved').map((review) => ({ id: review.id, name: review.name, role: review.service, rating: review.rating, text: review.text, avatar: null }));
  const items = [...testimonials, ...approved.filter((review) => !testimonials.some((testimonial) => testimonial.name === review.name))].slice(0, 6);
  return (
    <section className="pb-16 md:pb-24">
      <div className="container-x"><SectionHeading pill eyebrow="Testimonials" title={<>What Our <Accent>Patients</Accent> Say</>} /></div>
      <div className="marquee overflow-hidden">
        <div className="marquee-track flex w-max">
          {[0, 1].map((copy) => items.map((testimonial) => (
            <div key={`${copy}-${testimonial.id}`} aria-hidden={copy === 1} className="w-80 shrink-0 pr-6"><TestimonialCard testimonial={testimonial} /></div>
          )))}
        </div>
      </div>
    </section>
  );
}

export function FaqSection() {
  return (
    <section className="pb-28 md:pb-40">
      <div className="container-x max-w-4xl">
        <SectionHeading pill eyebrow="FAQ" title={<>Frequently Asked <Accent>Questions</Accent></>} subtitle="Can’t find your answer? Ask our AI assistant or contact our team." />
        <Accordion items={homeFaqs} />
      </div>
    </section>
  );
}

export function CtaBand() {
  return (
    <section className="bg-brand-600">
      <div className="container-x grid items-end gap-8 md:grid-cols-[2fr_3fr]">
        <img src={ctaDoctor} alt="Smiling dentist with arms crossed" loading="lazy" className="mx-auto -mt-12 h-80 w-auto max-w-full md:-mt-20 md:h-[28rem]" />
        <div className="self-center pb-12 text-white md:py-12">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Get Started On Your Smile Journey</h2>
          <p className="mt-4 max-w-xl text-white/85">Gentle, modern care designed for your comfort. Our team is ready to welcome you.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button to="/contact" variant="white">Contact Us</Button>
            <Button to="/appointment" variant="white">Book Appointment</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
