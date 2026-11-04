import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Search, SearchX } from 'lucide-react';
import { Accent, ServicePhotoCard } from '../../components/home/HomeSections';
import EmptyState from '../../components/common/EmptyState';
import Img from '../../components/common/Img';
import { Reveal, SectionHeading } from '../../components/common/ui';
import { useData } from '../../context/DataContext';
import { cn } from '../../utils/format';
import heroPhoto from '../../assets/hero-dental.jpg';

const SERVICES_PER_PAGE = 9;

export default function Services() {
  const { services } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const matchingServices = services.filter((service) => service.active && (service.name + service.short).toLowerCase().includes(searchTerm.toLowerCase()));
  const [currentPage, setCurrentPage] = useState(1);
  const servicesTop = useRef(null);
  const totalPages = Math.ceil(matchingServices.length / SERVICES_PER_PAGE);
  const visibleServices = matchingServices.slice((currentPage - 1) * SERVICES_PER_PAGE, currentPage * SERVICES_PER_PAGE);
  const updateSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };
  const goToPage = (page) => {
    setCurrentPage(page);
    servicesTop.current?.scrollIntoView();
  };
  const pageButtonClass = 'flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-40';
  const inactivePageClass = 'border-navy-200 bg-white text-navy-700 hover:border-brand-500 hover:text-brand-700';
  return (
    <div className="bg-cream">
      <section className="relative isolate overflow-hidden bg-navy-900">
        <Img src={heroPhoto} alt="" className="absolute inset-0 -z-20 h-full w-full" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-900/95 via-navy-900/75 to-navy-900/20" />
        <div className="container-x py-16 md:py-24">
          <Reveal>
            <span className="inline-block rounded-full bg-white/15 px-4 py-1 text-xs font-semibold text-white">Dental Services</span>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold text-white sm:text-5xl">Complete care for every smile</h1>
            <p className="mt-4 max-w-2xl text-lg text-white/85">Preventive, restorative, cosmetic and specialist treatments — planned around you.</p>
            <div className="relative mt-8 max-w-md">
              <Search className="absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-white/70" />
              <input value={searchTerm} onChange={(event) => updateSearch(event.target.value)} placeholder="Search treatments…" className="h-12 w-full rounded-xl border border-white/25 bg-white/15 pl-11 pr-4 text-sm text-white backdrop-blur placeholder:text-white/70 focus:border-white/60 focus:outline-none" aria-label="Search services" />
            </div>
          </Reveal>
        </div>
      </section>
      <section ref={servicesTop} className="section scroll-mt-20">
        <div className="container-x">
          <SectionHeading pill eyebrow="Our Services" title={<>Explore Our <Accent>Services</Accent></>} subtitle="From routine check-ups to complete smile makeovers — all under one roof." />
          {matchingServices.length ? (
            <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleServices.map((service, index) => <Reveal key={service.slug} delay={(index % 3) * 0.06}><ServicePhotoCard service={service} /></Reveal>)}
            </div>
            {totalPages > 1 && (
              <nav aria-label="Services pages" className="mt-10 flex items-center justify-center gap-2">
                <button type="button" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} aria-label="Previous page" className={cn(pageButtonClass, inactivePageClass)}><ChevronLeft className="h-4 w-4" /></button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button type="button" key={page} onClick={() => goToPage(page)} aria-current={page === currentPage ? 'page' : undefined} className={cn(pageButtonClass, page === currentPage ? 'border-brand-600 bg-brand-600 text-white' : inactivePageClass)}>{page}</button>
                ))}
                <button type="button" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Next page" className={cn(pageButtonClass, inactivePageClass)}><ChevronRight className="h-4 w-4" /></button>
              </nav>
            )}
            </>
          ) : (
            <EmptyState icon={SearchX} title="No services match your search" message="Try another keyword, or ask our AI assistant for help." actionLabel="Clear search" onAction={() => updateSearch('')} />
          )}
        </div>
      </section>
    </div>
  );
}
