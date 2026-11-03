import { Inbox } from 'lucide-react';
import Button from './Button';

export default function EmptyState({ icon: Ico = Inbox, title = 'Nothing here yet', message, actionLabel, actionTo, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-navy-200 bg-navy-50/50 px-6 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-navy-400 shadow-soft">
        <Ico className="h-6 w-6" />
      </div>
      <h4 className="text-base font-semibold">{title}</h4>
      {message && <p className="mt-1 max-w-sm text-sm text-navy-500">{message}</p>}
      {actionLabel && (
        <Button to={actionTo} onClick={onAction} size="sm" className="mt-5">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
