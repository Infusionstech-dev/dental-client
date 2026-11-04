import { Link } from 'react-router-dom';
import { cn } from '../../utils/format';
import LoadingSpinner from './LoadingSpinner';

const variants = {
  primary: 'btn-gradient',
  solid: 'bg-brand-600 text-white hover:bg-brand-700',
  teal: 'bg-teal-600 text-white hover:bg-teal-500 shadow-sm shadow-teal-600/20',
  secondary: 'bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100 hover:bg-brand-100',
  outline: 'border border-navy-200 bg-white text-navy-800 hover:border-brand-500 hover:text-brand-700 hover:bg-brand-50',
  ghost: 'text-navy-600 hover:bg-navy-50 hover:text-navy-900',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  white: 'bg-white text-navy-900 hover:bg-navy-50',
};
const sizes = {
  sm: 'h-9 px-3.5 text-sm gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
  icon: 'h-10 w-10',
};

export default function Button({ to, href, variant = 'primary', size = 'md', loading, className, children, disabled, ...props }) {
  const cls = cn(
    'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap',
    variants[variant],
    sizes[size],
    className
  );
  const content = (
    <>
      {loading && <LoadingSpinner size="sm" className="text-current" />}
      {children}
    </>
  );
  if (to) return <Link to={to} className={cls} {...props}>{content}</Link>;
  if (href) return <a href={href} className={cls} {...props}>{content}</a>;
  return (
    <button className={cls} disabled={disabled || loading} {...props}>
      {content}
    </button>
  );
}
