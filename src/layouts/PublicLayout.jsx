import { Suspense } from 'react';
import { PageLoader } from '../components/common/LoadingSpinner';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { X, Megaphone } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import AIChatWidget from '../components/ai-assistant/AIChatWidget';
import { useData } from '../context/DataContext';
import useScrollTop from '../hooks/useScrollTop';

export default function PublicLayout() {
  useScrollTop();
  const { siteSettings } = useData();
  const [hideBar, setHideBar] = useState(false);
  return (
    <div className="flex min-h-screen flex-col">
      {siteSettings.showAnnouncement && siteSettings.announcement && !hideBar && (
        <div className="bg-navy-900 text-white">
          <div className="container-x flex items-center justify-center gap-2 py-2 text-center text-xs sm:text-sm">
            <Megaphone className="h-4 w-4 shrink-0 text-teal-500" />
            <span>{siteSettings.announcement}</span>
            <button onClick={() => setHideBar(true)} className="ml-2 opacity-70 hover:opacity-100" aria-label="Dismiss announcement"><X className="h-4 w-4" /></button>
          </div>
        </div>
      )}
      <Navbar />
      <main className="flex-1"><Suspense fallback={<PageLoader />}><Outlet /></Suspense></main>
      <Footer />
      <AIChatWidget />
    </div>
  );
}
