import { SearchX } from 'lucide-react';
import Button from '../../components/common/Button';

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600"><SearchX className="h-8 w-8" /></span>
      <h1 className="mt-6 text-4xl font-extrabold">Page not found</h1>
      <p className="mt-3 max-w-md text-navy-500">The page you’re looking for doesn’t exist or has been moved.</p>
      <div className="mt-8 flex gap-3"><Button to="/">Go home</Button><Button to="/contact" variant="outline">Contact us</Button></div>
    </section>
  );
}
