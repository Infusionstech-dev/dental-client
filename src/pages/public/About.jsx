import { Target, Eye } from 'lucide-react';
import Img from '../../components/common/Img';
import Icon from '../../components/common/Icon';
import { Reveal, SectionHeading } from '../../components/common/ui';
import { facilities, images, technology } from '../../data/clinic';
import { CtaBand, StatsBand } from '../../components/home/HomeSections';
import heroPhoto from '../../assets/hero-dental.jpg';

export default function About() {
  return (
    <div className="bg-cream">
      <section className="relative isolate overflow-hidden bg-navy-900">
        <Img src={heroPhoto} alt="" className="absolute inset-0 -z-20 h-full w-full" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-900/95 via-navy-900/75 to-navy-900/20" />
        <div className="container-x py-16 md:py-24">
          <Reveal>
            <span className="inline-block rounded-full bg-white/15 px-4 py-1 text-xs font-semibold text-white">About Us</span>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold text-white sm:text-5xl">Gentle dentistry, modern technology, honest care.</h1>
            <p className="mt-4 max-w-2xl text-lg text-white/85">Since 2008, SmileCare Dental has helped families across Dhaka keep healthy, confident smiles.</p>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <Reveal><Img src={images.clinic} alt="Dentist treating a patient at SmileCare" className="aspect-[4/3] w-full rounded-3xl shadow-lift" /></Reveal>
          <Reveal delay={0.1}>
            <span className="inline-block rounded-full bg-brand-100 px-4 py-1 text-xs font-semibold text-brand-700">Our Story</span>
            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">A clinic built around patients</h2>
            <p className="mt-5 leading-relaxed text-navy-500">SmileCare started as a two-chair practice in Gulshan with one simple idea: dental care should never feel rushed, painful or confusing. Today we are a team of 12 dentists and specialists, but that idea hasn’t changed.</p>
            <p className="mt-4 leading-relaxed text-navy-500">We explain every option clearly, share transparent cost estimates before treatment, and use the latest digital tools to make visits shorter and more comfortable.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="group card p-5 transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"><Target className="h-7 w-7 text-brand-600 transition duration-300 group-hover:scale-110" /><h3 className="mt-3 font-bold">Our mission</h3><p className="mt-1 text-sm text-navy-500">To provide safe, comfortable and evidence-based dental care that every patient understands and trusts.</p></div>
              <div className="group card p-5 transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"><Eye className="h-7 w-7 text-brand-600 transition duration-300 group-hover:scale-110" /><h3 className="mt-3 font-bold">Our vision</h3><p className="mt-1 text-sm text-navy-500">To be Bangladesh’s most trusted dental clinic — known for kindness, quality and transparency.</p></div>
            </div>
          </Reveal>
        </div>
      </section>

      <StatsBand />

      <section className="section">
        <div className="container-x">
          <SectionHeading pill eyebrow="Facilities" title="Designed For Comfort" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {facilities.map((facility, index) => (
              <Reveal key={facility.title} delay={index * 0.06}>
                <div className="group card h-full p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"><Icon name={facility.icon} className="h-8 w-8 text-brand-600 transition duration-300 group-hover:scale-110" /><h3 className="mt-4 font-bold">{facility.title}</h3><p className="mt-2 text-sm text-navy-500">{facility.text}</p></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Extra bottom padding leaves room for the doctor's head rising out of the CTA band. */}
      <section className="pb-28 md:pb-40">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading center={false} pill eyebrow="Technology & Equipment" title="Precision you can feel" subtitle="Digital tools mean more accurate diagnosis, less discomfort and fewer visits." className="mb-8" />
            <div className="grid gap-4 sm:grid-cols-2">
              {technology.map((tool) => (
                <div key={tool.title} className="group card p-4 transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"><Icon name={tool.icon} className="h-6 w-6 text-brand-600 transition duration-300 group-hover:scale-110" /><h3 className="mt-2 font-bold">{tool.title}</h3><p className="mt-1 text-sm text-navy-500">{tool.text}</p></div>
              ))}
            </div>
          </div>
          <Img src={images.equipment} alt="Modern dental equipment" className="aspect-[4/5] w-full rounded-3xl shadow-lift" />
        </div>
      </section>

      <CtaBand />
    </div>
  );
}
