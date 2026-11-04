import { Check } from 'lucide-react';
import Button from '../common/Button';
import { formatBDT } from '../../utils/format';

export default function PricingCard({ title, price, duration, features = [], ctaTo = '/appointment', highlight }) {
  return (
    <div className={`rounded-2xl p-6 ${highlight ? 'bg-navy-900 text-white shadow-lift' : 'card'}`}>
      <p className={`text-sm font-medium ${highlight ? 'text-teal-500' : 'text-teal-600'}`}>Starting price</p>
      <p className={`mt-1 font-display text-4xl font-extrabold ${highlight ? 'text-white' : 'text-navy-900'}`}>{formatBDT(price)}</p>
      <p className={`mt-1 text-sm ${highlight ? 'text-navy-200' : 'text-navy-500'}`}>{title} · {duration}</p>
      {features.length > 0 && (
        <ul className="mt-5 space-y-2 text-sm">
          {features.map((f) => <li key={f} className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-teal-500" />{f}</li>)}
        </ul>
      )}
      <Button to={ctaTo} variant={highlight ? 'solid' : 'primary'} className="mt-6 w-full">Book Appointment</Button>
      <Button to="/cost-estimator" variant={highlight ? 'white' : 'ghost'} className="mt-2 w-full">Get a detailed estimate</Button>
    </div>
  );
}
