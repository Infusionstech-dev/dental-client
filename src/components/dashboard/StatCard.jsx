import { TrendingUp, TrendingDown } from 'lucide-react';

const tones = {
  brand: { icon: 'bg-brand-50 text-brand-600', bar: 'from-brand-600 to-brand-500' },
  teal: { icon: 'bg-teal-50 text-teal-600', bar: 'from-teal-600 to-teal-500' },
  amber: { icon: 'bg-amber-50 text-amber-600', bar: 'from-amber-500 to-amber-400' },
  navy: { icon: 'bg-violet-50 text-violet-600', bar: 'from-violet-600 to-violet-400' },
};

export default function StatCard({ icon: I, label, value, trend, tone = 'brand' }) {
  const t = tones[tone];
  return (
    <div className="dash-card relative overflow-hidden p-5 transition hover:-translate-y-0.5 hover:shadow-lift">
      <span className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${t.bar}`} />
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-navy-600">{label}</p>
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${t.icon}`}><I className="h-4 w-4" /></span>
      </div>
      <p className="mt-2 font-display text-3xl font-extrabold text-navy-900">{value}</p>
      {trend !== undefined && (
        <p className={`mt-1 inline-flex items-center gap-1 text-xs font-semibold ${trend >= 0 ? 'text-teal-600' : 'text-red-600'}`}>
          {trend >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}{Math.abs(trend)}% vs last month
        </p>
      )}
    </div>
  );
}
