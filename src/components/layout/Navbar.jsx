import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { cn, homeFor } from '../../utils/format';
import logo from '../../assets/logo.png';

export const publicLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/dentists', label: 'Our Dentists' },
  { to: '/cost-estimator', label: 'Cost Estimator' },
  { to: '/ai-assistant', label: 'AI Assistant' },
  { to: '/contact', label: 'Contact' },
];
const headerLinks = publicLinks.filter((link) => link.to !== '/ai-assistant');

export function Logo({ light, className }) {
  return (
    <Link to="/" className={cn('flex items-center', light && 'rounded-xl bg-white px-3 py-1.5', className)} aria-label="MEDRECEPI home">
      <img src={logo} alt="MEDRECEPI — Smarter care for a healthier tomorrow" className="h-12 w-auto object-contain" />
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const dashTo = homeFor(user?.role);
  const linkClassName = ({ isActive }) => cn('rounded-lg px-3 py-2 text-sm font-medium transition', isActive ? 'text-brand-700 bg-brand-50' : 'text-navy-600 hover:text-navy-900 hover:bg-navy-50');

  return (
    <header className={cn('sticky top-0 z-50 bg-white/85 backdrop-blur-lg transition-shadow', scrolled && 'shadow-soft')}>
      <nav className="container-x flex h-18 items-center justify-between py-3">
        <Logo />
        <div className="hidden items-center gap-1 xl:flex">
          {headerLinks.map((link) => <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClassName}>{link.label}</NavLink>)}
        </div>
        <div className="hidden items-center gap-2 xl:flex">
          {user ? (
            <Button to={dashTo} variant="ghost" size="sm"><LayoutDashboard className="h-4 w-4" />Dashboard</Button>
          ) : (
            <Button to="/login" variant="ghost" size="sm">Login</Button>
          )}
          <Button to="/appointment" size="sm">Book Appointment</Button>
        </div>
        <button className="rounded-lg p-2 text-navy-700 hover:bg-navy-50 xl:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-navy-100 bg-white xl:hidden">
            <div className="container-x flex flex-col gap-1 py-4">
              {headerLinks.map((link) => <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClassName}>{link.label}</NavLink>)}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button to={user ? dashTo : '/login'} variant="outline">{user ? 'Dashboard' : 'Login'}</Button>
                <Button to="/appointment">Book Appointment</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
