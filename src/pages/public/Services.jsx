import { useState } from 'react';
import { Search, SearchX } from 'lucide-react';
import ServiceCard from '../../components/services/ServiceCard';
import EmptyState from '../../components/common/EmptyState';
import { PageHeader, Reveal } from '../../components/common/ui';
import { useData } from '../../context/DataContext';

export default function Services() {
  const { services } = useData();
  const [q, setQ] = useState('');
  const list = services.filter((s) => s.active && (s.name + s.short).toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageHeader eyebrow="Dental services" title="Complete care for every smile" subtitle="Preventive, restorative, cosmetic and specialist treatments — planned around you.">
        <div className="relative mt-8 max-w-md">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search treatments…" className="input h-12 pl-11" aria-label="Search services" />
        </div>
      </PageHeader>
      <section className="section">
        <div className="container-x">
          {list.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {list.map((s, i) => <Reveal key={s.slug} delay={(i % 4) * 0.05}><ServiceCard service={s} /></Reveal>)}
            </div>
          ) : (
            <EmptyState icon={SearchX} title="No services match your search" message="Try another keyword, or ask our AI assistant for help." actionLabel="Clear search" onAction={() => setQ('')} />
          )}
        </div>
      </section>
    </>
  );
}
