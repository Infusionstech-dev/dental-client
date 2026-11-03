import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Icon from '../common/Icon';
import { useData } from '../../context/DataContext';
import { formatBDT } from '../../utils/format';

export default function ServiceCard({ service }) {
  const { servicePrice } = useData();
  return (
    <Link to={`/services/${service.slug}`} className="group card flex h-full flex-col p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
        <Icon name={service.icon} className="h-6 w-6" />
      </span>
      <h3 className="mt-5 text-lg font-bold">{service.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-500">{service.short}</p>
      <div className="mt-5 flex items-center justify-between border-t border-navy-100 pt-4">
        <span className="text-sm text-navy-500">From <strong className="text-navy-900">{formatBDT(servicePrice(service))}</strong></span>
        <ArrowRight className="h-4 w-4 text-brand-600 transition group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
