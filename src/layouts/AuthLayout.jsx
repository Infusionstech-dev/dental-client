import { Outlet } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { Logo } from '../components/layout/Navbar';
import Img from '../components/common/Img';
import { images } from '../data/clinic';
import useScrollTop from '../hooks/useScrollTop';

export default function AuthLayout() {
  useScrollTop();
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <Logo />
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md"><Outlet /></div>
        </div>
      </div>
      <div className="relative hidden lg:block">
        <Img src={images.smile} alt="Smiling patient" className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-navy-900/20 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <ShieldCheck className="h-8 w-8 text-teal-500" />
          <p className="mt-4 font-display text-3xl font-extrabold leading-tight">Manage your appointments, treatments and records in one secure place.</p>
        </div>
      </div>
    </div>
  );
}
