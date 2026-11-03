import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import ChatPanel from './ChatPanel';
import { useData } from '../../context/DataContext';

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const { assistantSettings } = useData();
  const { pathname } = useLocation();

  // Hidden when disabled by admin, and on the full-page assistant (which renders its own panel).
  if (!assistantSettings.enabled || pathname === '/ai-assistant') return null;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            className="fixed inset-0 z-[80] sm:inset-auto sm:bottom-24 sm:right-6"
          >
            <ChatPanel onClose={() => setOpen(false)} onNavigate={() => setOpen(false)} className="h-full w-full sm:h-[600px] sm:max-h-[calc(100vh-8rem)] sm:w-[400px] sm:rounded-2xl sm:border sm:border-navy-100 sm:shadow-lift" />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed bottom-5 right-5 z-[81] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-teal-600 text-white shadow-lift sm:bottom-6 sm:right-6 ${open ? 'max-sm:hidden' : ''}`}
        aria-label={open ? 'Close AI assistant' : 'Open AI assistant'}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!open && <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4"><span className="absolute h-full w-full animate-ping rounded-full bg-teal-500 opacity-60" /><span className="relative h-4 w-4 rounded-full border-2 border-white bg-teal-500" /></span>}
      </motion.button>
    </>
  );
}
