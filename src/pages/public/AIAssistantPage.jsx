import { BookOpen, CalendarCheck, Calculator, Siren, Bot } from 'lucide-react';
import ChatPanel from '../../components/ai-assistant/ChatPanel';
import EmptyState from '../../components/common/EmptyState';
import { PageHeader } from '../../components/common/ui';
import { useData } from '../../context/DataContext';

const features = [
  { icon: BookOpen, title: 'Simple explanations', text: 'Understand procedures like root canals, implants and veneers in plain language.' },
  { icon: Calculator, title: 'Cost guidance', text: 'See starting prices and jump to the Smart Cost Estimator.' },
  { icon: CalendarCheck, title: 'Booking help', text: 'Find the right service and book your appointment.' },
  { icon: Siren, title: 'Emergency awareness', text: 'Urgent symptoms are flagged with our 24/7 emergency contact.' },
];

export default function AIAssistantPage() {
  const { assistantSettings } = useData();
  return (
    <>
      <PageHeader eyebrow="AI Dental Assistant" title="Ask our dental assistant" subtitle="General dental information, any time. This demo uses simulated responses and never diagnoses or prescribes." />
      <section className="section pt-10">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-5">
            {features.map(({ icon: I, ...f }) => (
              <div key={f.title} className="flex gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><I className="h-5 w-5" /></span><div><h3 className="font-bold">{f.title}</h3><p className="text-sm text-navy-500">{f.text}</p></div></div>
            ))}
          </div>
          {assistantSettings.enabled ? (
            <ChatPanel className="h-[640px] rounded-2xl border border-navy-100 shadow-lift" />
          ) : (
            <EmptyState icon={Bot} title="Assistant temporarily unavailable" message="Our AI assistant is currently turned off. Please contact the clinic directly." actionLabel="Contact us" actionTo="/contact" />
          )}
        </div>
      </section>
    </>
  );
}
