import { Quote } from 'lucide-react';
import Img from '../common/Img';
import { StarRating } from '../common/ui';

export default function TestimonialCard({ t }) {
  return (
    <figure className="card relative flex h-full flex-col p-6">
      <Quote className="absolute right-5 top-5 h-8 w-8 text-brand-100" />
      <StarRating value={t.rating} />
      <blockquote className="mt-4 flex-1 leading-relaxed text-navy-600">“{t.text}”</blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <Img src={t.avatar} alt={t.name} className="h-11 w-11 rounded-full" />
        <div>
          <p className="font-semibold text-navy-900">{t.name}</p>
          <p className="text-xs text-navy-500">{t.role}</p>
        </div>
      </figcaption>
    </figure>
  );
}
