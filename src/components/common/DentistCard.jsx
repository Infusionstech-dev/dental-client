import { Award, CalendarDays, Star } from 'lucide-react';
import Img from './Img';
import Button from './Button';

export default function DentistCard({ dentist, compact }) {
  return (
    <div className="group card flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[4/3.6] overflow-hidden bg-brand-50">
        <Img src={dentist.photo} alt={dentist.name} className="h-full w-full transition duration-500 group-hover:scale-105" />
        <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-navy-800 shadow-sm">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{dentist.rating} <span className="font-normal text-navy-400">({dentist.reviews})</span>
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold">{dentist.name}</h3>
        <p className="text-sm font-medium text-brand-600">{dentist.title}</p>
        {!compact && <p className="mt-2 text-xs text-navy-500">{dentist.qualifications}</p>}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {dentist.specializations.slice(0, compact ? 2 : 3).map((s) => <span key={s} className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-600">{s}</span>)}
        </div>
        <div className="mt-4 space-y-1.5 text-sm text-navy-500">
          <p className="flex items-center gap-2"><Award className="h-4 w-4 text-navy-400" />{dentist.experience} years experience</p>
          {!compact && <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-navy-400" />{dentist.availability.join(', ')}</p>}
        </div>
        <div className="mt-auto flex gap-2 pt-5">
          <Button to={`/dentists/${dentist.id}`} variant="outline" size="sm" className="flex-1">View Profile</Button>
          <Button to={`/appointment?dentist=${dentist.id}`} size="sm" className="flex-1">Book</Button>
        </div>
      </div>
    </div>
  );
}
