import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, Send, Trash2, X, Info, AlertTriangle } from 'lucide-react';
import useChat from '../../hooks/useChat';
import { DISCLAIMER } from '../../data/assistant';
import { cn } from '../../utils/format';

// Minimal formatter: **bold**, "• " bullet lines, blank-line paragraphs.
function RichText({ text }) {
  const renderInline = (line) => line.split(/(\*\*[^*]+\*\*)/g).map((part, i) => (part.startsWith('**') ? <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong> : part));
  return (
    <div className="space-y-2">
      {text.split('\n\n').map((block, i) => {
        const lines = block.split('\n');
        if (lines.every((l) => l.startsWith('• '))) {
          return <ul key={i} className="space-y-1">{lines.map((l, j) => <li key={j} className="flex gap-2"><span className="text-teal-500">•</span><span>{renderInline(l.slice(2))}</span></li>)}</ul>;
        }
        return <p key={i}>{lines.map((l, j) => <span key={j}>{renderInline(l)}{j < lines.length - 1 && <br />}</span>)}</p>;
      })}
    </div>
  );
}

export default function ChatPanel({ onClose, className, onNavigate }) {
  const { messages, typing, send, clear, settings } = useChat();
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, typing]);

  const submit = (e) => {
    e.preventDefault();
    send(input);
    setInput('');
  };

  const showSuggestions = messages.length <= 1;

  return (
    <div className={cn('flex flex-col overflow-hidden bg-white', className)}>
      <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-brand-600 to-teal-600 px-5 py-4 text-white">
        <div className="flex items-center gap-3">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/15"><Bot className="h-5 w-5" /><span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-300 ring-2 ring-teal-600" /></span>
          <div>
            <p className="font-display font-bold leading-tight">{settings.name}</p>
            <p className="text-xs text-white/80">Demo mode · simulated responses</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button onClick={clear} className="rounded-lg p-2 hover:bg-white/15" aria-label="Clear conversation" title="Clear conversation"><Trash2 className="h-4 w-4" /></button>
          {onClose && <button onClick={onClose} className="rounded-lg p-2 hover:bg-white/15" aria-label="Close chat"><X className="h-5 w-5" /></button>}
        </div>
      </div>

      <div className="flex items-start gap-2 border-b border-amber-100 bg-amber-50 px-4 py-2.5 text-[11px] leading-snug text-amber-800">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />{DISCLAIMER}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-navy-50/40 px-4 py-5" aria-live="polite">
        {messages.map((m) => (
          <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div className={cn('max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed', m.role === 'user' ? 'rounded-br-md bg-brand-600 text-white' : m.emergency ? 'rounded-bl-md border border-red-200 bg-red-50 text-red-900' : 'rounded-bl-md border border-navy-100 bg-white text-navy-800 shadow-sm')}>
              {m.emergency && <AlertTriangle className="mb-1 h-4 w-4 text-red-600" />}
              <RichText text={m.text} />
              {m.actions?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {m.actions.map((a) =>
                    a.href ? (
                      <a key={a.label} href={a.href} className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700">{a.label}</a>
                    ) : (
                      <Link key={a.label} to={a.to} onClick={onNavigate} className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-100">{a.label} →</Link>
                    )
                  )}
                </div>
              )}
              {m.mock && <p className="mt-2 text-[10px] uppercase tracking-wider text-navy-400">Mock response · general information</p>}
            </div>
          </motion.div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="flex gap-1.5 rounded-2xl rounded-bl-md border border-navy-100 bg-white px-4 py-3.5 shadow-sm" aria-label="Assistant is typing">
              {[0, 1, 2].map((i) => <motion.span key={i} className="h-2 w-2 rounded-full bg-navy-400" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} />)}
            </div>
          </div>
        )}
        {showSuggestions && (
          <div className="flex flex-wrap gap-2 pt-1">
            {settings.suggestedQuestions.map((q) => (
              <button key={q} onClick={() => send(q)} className="rounded-full border border-brand-200 bg-white px-3 py-1.5 text-left text-xs font-medium text-brand-700 transition hover:border-brand-500 hover:bg-brand-50">{q}</button>
            ))}
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={submit} className="flex items-center gap-2 border-t border-navy-100 bg-white p-3">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a dental question…" className="input flex-1 rounded-full" aria-label="Message" maxLength={500} />
        <button type="submit" disabled={!input.trim() || typing} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white transition hover:bg-brand-700 disabled:opacity-40" aria-label="Send">
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
