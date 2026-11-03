import { Link } from 'react-router-dom';
import { Bell, Menu } from 'lucide-react';
import { initials } from '../../utils/format';

export default function DashboardHeader({ user, onMenu, notifTo, unread = 0, roleLabel }) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 bg-navy-50/80 px-4 backdrop-blur sm:px-6 lg:px-8">
      <button onClick={onMenu} className="rounded-lg p-2 text-navy-600 hover:bg-white lg:hidden" aria-label="Open menu"><Menu className="h-5 w-5" /></button>
      <div className="hidden lg:block">
        <p className="font-display text-xl font-extrabold text-navy-900">Hello, {user?.name?.replace(/^Dr\.?\s+/i, '').split(' ')[0]}</p>
        <p className="text-sm text-navy-500">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>
      <div className="flex items-center gap-2">
        {notifTo && (
          <Link to={notifTo} className="relative rounded-xl border border-navy-100 bg-white p-2.5 text-navy-600 shadow-soft transition hover:text-brand-700" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            {unread > 0 && <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">{unread}</span>}
          </Link>
        )}
        <div className="ml-1 flex items-center gap-3 rounded-2xl border border-navy-100 bg-white py-1.5 pl-1.5 pr-4 shadow-soft">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-teal-500 text-sm font-bold text-white">{initials(user?.name)}</span>
          <div className="hidden sm:block"><p className="text-sm font-semibold leading-tight text-brand-700">{user?.name}</p><p className="text-xs font-medium text-navy-500">{roleLabel}</p></div>
        </div>
      </div>
    </header>
  );
}
