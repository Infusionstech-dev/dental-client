import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../utils/format';

export default function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const widths = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-4">
          <motion.div className="absolute inset-0 bg-navy-900/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className={cn('relative flex max-h-[92vh] w-full flex-col rounded-t-2xl bg-white shadow-lift sm:rounded-2xl', widths[size])}
          >
            <div className="flex items-center justify-between border-b border-navy-100 px-6 py-4">
              <h3 className="text-lg font-bold">{title}</h3>
              <button onClick={onClose} className="rounded-lg p-1.5 text-navy-400 hover:bg-navy-50 hover:text-navy-800" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto px-6 py-5">{children}</div>
            {footer && <div className="flex justify-end gap-3 border-t border-navy-100 px-6 py-4">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
