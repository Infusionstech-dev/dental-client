import { NavLink } from 'react-router-dom';
import { LogOut, X } from 'lucide-react';
import { Logo } from '../layout/Navbar';
import { cn } from '../../utils/format';

export default function DashboardSidebar({ items, open, onClose, onLogout, label }) {
  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-navy-900/40 backdrop-blur-sm lg:hidden" onClick={onClose} />}
      <aside className={cn('fixed inset-y-0 left-0 z-50 flex w-64 flex-col p-3 transition-transform lg:translate-x-0', open ? 'translate-x-0' : '-translate-x-full')}>
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-soft">
          <div className="flex items-center justify-between px-4 pb-2 pt-4">
            <Logo className="[&_img]:h-16" />
            <button onClick={onClose} className="rounded-lg p-1.5 text-navy-400 hover:bg-navy-50 lg:hidden" aria-label="Close menu"><X className="h-5 w-5" /></button>
          </div>
          <p className="px-5 pb-2 pt-4 text-[11px] font-semibold uppercase tracking-wider text-navy-400">{label}</p>
          <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
            {items.map(({ to, label: l, icon: I, end, badge }) => (
              <NavLink key={to} to={to} end={end} onClick={onClose} className={({ isActive }) => cn('group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition', isActive ? 'bg-gradient-to-r from-brand-600 to-teal-500 text-white shadow-md shadow-brand-600/25' : 'text-navy-600 hover:bg-brand-50 hover:text-brand-700')}>
                {({ isActive }) => (
                  <>
                    <I className="h-[18px] w-[18px]" />
                    <span className="flex-1">{l}</span>
                    {badge > 0 && <span className={cn('rounded-full px-1.5 py-0.5 text-[10px] font-bold', isActive ? 'bg-white text-brand-700' : 'bg-brand-600 text-white')}>{badge}</span>}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="border-t border-navy-100 p-3">
            <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"><LogOut className="h-[18px] w-[18px]" />Logout</button>
          </div>
        </div>
      </aside>
    </>
  );
}
