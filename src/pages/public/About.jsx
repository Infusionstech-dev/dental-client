import { Target, Eye, ArrowRight } from 'lucide-react';
import Img from '../../components/common/Img';
import Icon from '../../components/common/Icon';
import Button from '../../components/common/Button';
import DentistCard from '../../components/common/DentistCard';
import { PageHeader, Reveal, SectionHeading } from '../../components/common/ui';
import { facilities, images, technology } from '../../data/clinic';
import { useData } from '../../context/DataContext';
import { StatsSection } from '../../components/home/HomeSections';

export default function About() {
  const { dentists } = useData();
  return (
    <>
      <PageHeader eyebrow="About us" title="Gentle dentistry, modern technology, honest care." subtitle="Since 2008, SmileCare Dental has helped families across Dhaka keep healthy, confident smiles." />

      <section className="section">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <Reveal><Img src={images.clinic} alt="SmileCare clinic interior" className="aspect-[4/3] w-full rounded-3xl shadow-lift" /></Reveal>
          <Reveal delay={0.1}>
            <span className="eyebrow">Our story</span>
            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">A clinic built around patients</h2>
            <p className="mt-5 leading-relaxed text-navy-500">SmileCare started as a two-chair practice in Gulshan with one simple idea: dental care should never feel rushed, painful or confusing. Today we are a team of 12 dentists and specialists, but that idea hasn’t changed.</p>
            <p className="mt-4 leading-relaxed text-navy-500">We explain every option clearly, share transparent cost estimates before treatment, and use the latest digital tools to make visits shorter and more comfortable.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-brand-50 p-5"><Target className="h-6 w-6 text-brand-600" /><h3 className="mt-3 font-bold">Our mission</h3><p className="mt-1 text-sm text-navy-600">To provide safe, comfortable and evidence-based dental care that every patient understands and trusts.</p></div>
              <div className="rounded-2xl bg-teal-50 p-5"><Eye className="h-6 w-6 text-teal-600" /><h3 className="mt-3 font-bold">Our vision</h3><p className="mt-1 text-sm text-navy-600">To be Bangladesh’s most trusted dental clinic — known for kindness, quality and transparency.</p></div>
            </div>
          </Reveal>
        </div>
      </section>

      <StatsSection />

      <section className="section">
        <div className="container-x">
          <SectionHeading eyebrow="Facilities" title="Designed for comfort" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {facilities.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.06}>
                <div className="card h-full p-6"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600"><Icon name={f.icon} className="h-6 w-6" /></span><h3 className="mt-5 font-bold">{f.title}</h3><p className="mt-2 text-sm text-navy-500">{f.text}</p></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-navy-50/50">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading center={false} eyebrow="Technology & equipment" title="Precision you can feel" subtitle="Digital tools mean more accurate diagnosis, less discomfort and fewer visits." className="mb-8" />
            <div className="grid gap-4 sm:grid-cols-2">
              {technology.map((t) => (
                <div key={t.title} className="flex gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-teal-600 shadow-soft"><Icon name={t.icon} className="h-5 w-5" /></span><div><h3 className="font-bold">{t.title}</h3><p className="text-sm text-navy-500">{t.text}</p></div></div>
              ))}
            </div>
          </div>
          <Img src={images.equipment} alt="Modern dental equipment" className="aspect-[4/3] w-full rounded-3xl shadow-lift" />
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <SectionHeading eyebrow="Our team" title="Meet our dental team" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dentists.slice(0, 3).map((d) => <DentistCard key={d.id} dentist={d} />)}
          </div>
          <div className="mt-10 text-center"><Button to="/dentists" variant="outline">See the full team<ArrowRight className="h-4 w-4" /></Button></div>
        </div>
      </section>
    </>
  );
}
