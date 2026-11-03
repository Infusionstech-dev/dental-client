import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const styles = {
  success: { icon: CheckCircle2, cls: 'text-teal-600' },
  error: { icon: AlertCircle, cls: 'text-red-500' },
  info: { icon: Info, cls: 'text-brand-600' },
};

export default function ToastNotification({ toasts, onDismiss }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:items-end sm:pr-6">
      <AnimatePresence>
        {toasts.map((t) => {
          const { icon: Ico, cls } = styles[t.type] || styles.info;
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40 }}
              role="status"
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-navy-100 bg-white p-4 shadow-lift"
            >
              <Ico className={`mt-0.5 h-5 w-5 shrink-0 ${cls}`} />
              <p className="flex-1 text-sm text-navy-800">{t.message}</p>
              <button onClick={() => onDismiss(t.id)} className="text-navy-400 hover:text-navy-700" aria-label="Dismiss">
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
