import { useCallback, useState } from 'react';
import useLocalStorage from './useLocalStorage';
import { assistantService } from '../services/assistantService';
import { useData } from '../context/DataContext';

const welcome = (text) => ({ id: 'welcome', role: 'assistant', text, time: Date.now() });

export default function useChat() {
  const { pricing, assistantSettings } = useData();
  const [messages, setMessages] = useLocalStorage('chat', [welcome(assistantSettings.welcomeMessage)]);
  const [typing, setTyping] = useState(false);

  const send = useCallback(
    async (text) => {
      const msg = text.trim();
      if (!msg || typing) return;
      const userMsg = { id: `u${Date.now()}`, role: 'user', text: msg, time: Date.now() };
      setMessages((m) => [...m, userMsg]);
      setTyping(true);
      try {
        const reply = await assistantService.sendMessage(msg, messages, { pricing, settings: assistantSettings });
        setMessages((m) => [...m, { id: `a${Date.now()}`, role: 'assistant', time: Date.now(), ...reply }]);
      } catch {
        setMessages((m) => [...m, { id: `e${Date.now()}`, role: 'assistant', text: 'Sorry, something went wrong. Please try again.', error: true, time: Date.now() }]);
      } finally {
        setTyping(false);
      }
    },
    [typing, messages, pricing, assistantSettings, setMessages]
  );

  const clear = () => setMessages([welcome(assistantSettings.welcomeMessage)]);

  return { messages, typing, send, clear, settings: assistantSettings };
}
