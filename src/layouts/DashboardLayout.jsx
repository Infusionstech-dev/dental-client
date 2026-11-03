import { Suspense } from 'react';
import { PageLoader } from '../components/common/LoadingSpinner';
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import useScrollTop from '../hooks/useScrollTop';

export default function DashboardLayout({ items, label, roleLabel, notifTo, unread }) {
  useScrollTop();
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    toast('You have been logged out.', 'info');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-navy-50">
      <DashboardSidebar items={items} open={open} onClose={() => setOpen(false)} onLogout={onLogout} label={label} />
      <div className="lg:pl-64">
        <DashboardHeader user={user} onMenu={() => setOpen(true)} notifTo={notifTo} unread={unread} roleLabel={roleLabel} />
        <main className="px-4 pb-8 pt-2 sm:px-6 lg:px-8"><Suspense fallback={<PageLoader />}><Outlet /></Suspense></main>
      </div>
    </div>
  );
}

export function DashTitle({ title, sub, children }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div><h1 className="text-2xl font-extrabold sm:text-3xl">{title}</h1>{sub && <p className="mt-1 text-navy-500">{sub}</p>}</div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}
