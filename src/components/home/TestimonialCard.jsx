import { Quote } from 'lucide-react';
import Img from '../common/Img';
import { StarRating } from '../common/ui';

export default function TestimonialCard({ testimonial }) {
  return (
    <figure className="card relative flex h-full flex-col p-6">
      <Quote className="absolute right-5 top-5 h-8 w-8 text-brand-100" />
      <StarRating value={testimonial.rating} />
      <blockquote className="mt-4 flex-1 leading-relaxed text-navy-600">“{testimonial.text}”</blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <Img src={testimonial.avatar} alt={testimonial.name} className="h-11 w-11 rounded-full" />
        <div>
          <p className="font-semibold text-navy-900">{testimonial.name}</p>
          <p className="text-xs text-navy-500">{testimonial.role}</p>
        </div>
      </figcaption>
    </figure>
  );
}
