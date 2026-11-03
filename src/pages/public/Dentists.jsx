import { useState } from 'react';
import DentistCard from '../../components/common/DentistCard';
import EmptyState from '../../components/common/EmptyState';
import { PageHeader, Reveal } from '../../components/common/ui';
import { useData } from '../../context/DataContext';
import { cn } from '../../utils/format';

export default function Dentists() {
  const { dentists, services } = useData();
  const [filter, setFilter] = useState('all');
  const list = filter === 'all' ? dentists : dentists.filter((d) => d.services.includes(filter));
  const chips = [{ slug: 'all', name: 'All' }, ...services.filter((s) => s.active)];
  return (
    <>
      <PageHeader eyebrow="Our dentists" title="Experienced hands, gentle hearts" subtitle="Our team of specialists brings decades of combined experience across every area of dentistry." />
      <section className="section">
        <div className="container-x">
          <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
            {chips.map((c) => (
              <button key={c.slug} onClick={() => setFilter(c.slug)} className={cn('shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition', filter === c.slug ? 'border-brand-600 bg-brand-600 text-white' : 'border-navy-200 bg-white text-navy-600 hover:border-navy-400')}>{c.name}</button>
            ))}
          </div>
          {list.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{list.map((d, i) => <Reveal key={d.id} delay={(i % 3) * 0.06}><DentistCard dentist={d} /></Reveal>)}</div>
          ) : (
            <EmptyState title="No dentists for this service" message="Please choose another service." actionLabel="Show all" onAction={() => setFilter('all')} />
          )}
        </div>
      </section>
    </>
  );
}
