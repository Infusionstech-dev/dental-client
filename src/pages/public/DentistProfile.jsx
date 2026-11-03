import { Link, useParams } from 'react-router-dom';
import { Award, CalendarDays, GraduationCap, ChevronRight, CalendarCheck } from 'lucide-react';
import Img from '../../components/common/Img';
import Button from '../../components/common/Button';
import { StarRating } from '../../components/common/ui';
import { useData } from '../../context/DataContext';
import { WEEKDAYS, cn } from '../../utils/format';
import NotFound from './NotFound';

export default function DentistProfile() {
  const { id } = useParams();
  const { getDentist, getService } = useData();
  const d = getDentist(id);
  if (!d) return <NotFound />;
  return (
    <section className="section bg-gradient-to-b from-brand-50/60 to-white">
      <div className="container-x">
        <nav className="mb-8 flex items-center gap-1 text-sm text-navy-500"><Link to="/dentists" className="hover:text-brand-600">Our Dentists</Link><ChevronRight className="h-4 w-4" /><span className="text-navy-800">{d.name}</span></nav>
        <div className="grid gap-10 lg:grid-cols-[380px_1fr]">
          <Img src={d.photo} alt={d.name} className="aspect-[4/4.6] w-full rounded-3xl shadow-lift" />
          <div>
            <h1 className="text-4xl font-extrabold">{d.name}</h1>
            <p className="mt-1 text-lg font-medium text-brand-600">{d.title}</p>
            <div className="mt-3 flex items-center gap-2"><StarRating value={d.rating} /><span className="text-sm text-navy-500">{d.rating} · {d.reviews} reviews</span></div>
            <p className="mt-6 max-w-2xl leading-relaxed text-navy-600">{d.bio}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="card flex gap-4 p-5"><GraduationCap className="h-6 w-6 shrink-0 text-brand-600" /><div><p className="text-sm text-navy-500">Qualifications</p><p className="font-semibold text-navy-900">{d.qualifications}</p></div></div>
              <div className="card flex gap-4 p-5"><Award className="h-6 w-6 shrink-0 text-brand-600" /><div><p className="text-sm text-navy-500">Experience</p><p className="font-semibold text-navy-900">{d.experience} years</p></div></div>
            </div>
            <div className="mt-8">
              <h2 className="text-lg font-bold">Specializations</h2>
              <div className="mt-3 flex flex-wrap gap-2">{d.specializations.map((s) => <span key={s} className="rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-600">{s}</span>)}</div>
            </div>
            <div className="mt-8">
              <h2 className="flex items-center gap-2 text-lg font-bold"><CalendarDays className="h-5 w-5 text-navy-400" />Weekly availability</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'].filter((x) => WEEKDAYS.includes(x)).map((day) => (
                  <span key={day} className={cn('w-14 rounded-xl py-2 text-center text-sm font-semibold', d.availability.includes(day) ? 'bg-brand-600 text-white' : 'bg-navy-50 text-navy-300 line-through')}>{day}</span>
                ))}
              </div>
            </div>
            <div className="mt-8">
              <h2 className="text-lg font-bold">Treatments offered</h2>
              <div className="mt-3 flex flex-wrap gap-2">{d.services.map((slug) => { const s = getService(slug); return s ? <Link key={slug} to={`/services/${slug}`} className="rounded-full border border-navy-200 px-3 py-1 text-sm text-navy-700 hover:border-brand-500 hover:text-brand-600">{s.name}</Link> : null; })}</div>
            </div>
            <Button to={`/appointment?dentist=${d.id}`} size="lg" className="mt-10"><CalendarCheck className="h-5 w-5" />Book with {d.name.split(' ').slice(0, 2).join(' ')}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
