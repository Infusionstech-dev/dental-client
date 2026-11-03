// AI Dental Assistant service.
// Frontend-only version: replies come from a local, rule-based mock engine (clearly labeled as such in the UI).
// To connect a real AI API later, set VITE_USE_MOCK=false and implement POST /assistant/chat on the backend,
// which should return { text, actions?, category?, emergency? } — the same shape produced below.
import { USE_MOCK, mockDelay, request } from './apiClient';
import { clinicInfo } from '../data/clinic';
import { startingPriceFor } from '../utils/pricingCalculator';
import { formatBDT } from '../utils/format';

const has = (msg, words) => words.some((w) => msg.includes(w));

const EMERGENCY_WORDS = ['emergency', 'severe pain', 'unbearable', 'swelling', 'swollen', 'bleeding', "won't stop", 'knocked out', 'broke', 'broken tooth', 'cracked', 'fever', 'pus', 'abscess', 'trauma', 'accident', 'cant open', "can't open", 'difficulty breathing', 'difficulty swallowing'];

function buildRules(ctx) {
  const price = (key) => {
    const p = startingPriceFor(ctx.pricing, key);
    return p ? formatBDT(p) : 'available on request';
  };

  return [
    {
      category: 'emergency',
      test: (m) => has(m, EMERGENCY_WORDS),
      reply: () => ({
        emergency: true,
        text:
          `⚠️ **This may need urgent professional care.**\n\nIf you have severe or worsening pain, facial swelling, a knocked-out or broken tooth, bleeding that won’t stop, or fever, please contact a dentist as soon as possible.\n\n• Call our 24/7 emergency line: **${clinicInfo.emergencyPhone}**\n• If you have difficulty breathing or swallowing, or swelling spreading to the eye or neck, go to the nearest hospital emergency department immediately.\n\nI can’t assess or diagnose your condition — a dentist needs to examine you.`,
        actions: [{ label: `Call ${clinicInfo.emergencyPhone}`, href: `tel:${clinicInfo.emergencyPhone.replace(/[^+\d]/g, '')}` }, { label: 'Contact clinic', to: '/contact' }],
      }),
    },
    {
      category: 'emergency',
      test: (m) => has(m, ['toothache', 'tooth ache', 'tooth pain', 'teeth hurt', 'tooth hurts', 'pain']),
      reply: () => ({
        text:
          `I’m sorry you’re in discomfort. Here’s some general, non-diagnostic guidance while you arrange to see a dentist:\n\n• Rinse gently with warm salt water.\n• Floss carefully to remove any trapped food.\n• A cold compress on the cheek may help with discomfort.\n• Avoid very hot, cold or sugary foods on that side.\n\nI can’t recommend medication — please ask a dentist or pharmacist. Toothache usually has a cause that needs treatment, so book a visit soon. **If pain is severe or you have swelling or fever, call our emergency line: ${clinicInfo.emergencyPhone}.**`,
        actions: [{ label: 'Book an appointment', to: '/appointment' }, { label: 'Emergency contact', to: '/contact' }],
      }),
    },
    {
      category: 'booking',
      test: (m) => has(m, ['book', 'appointment', 'schedule', 'reserve', 'visit']),
      reply: () => ({
        text:
          'Booking takes about a minute:\n\n• **1.** Choose a service\n• **2.** Pick your dentist\n• **3.** Select a date and time slot\n• **4.** Enter your details and confirm\n\nYou’ll see a confirmation instantly, and our team will contact you to confirm.',
        actions: [{ label: 'Book appointment', to: '/appointment' }, { label: 'Meet our dentists', to: '/dentists' }],
      }),
    },
    {
      category: 'procedures',
      test: (m) => has(m, ['root canal', 'rct', 'endodont']),
      reply: () => ({
        text:
          `**Root canal treatment, in simple terms:** inside each tooth is soft tissue called the pulp. If it becomes infected or inflamed, a root canal removes it, cleans the inside of the tooth, and seals it — saving your natural tooth.\n\n• Done under local anaesthesia, so it usually feels like a filling\n• Typically 1–2 visits\n• Back teeth usually need a crown afterwards\n\nStarting from **${price('rootCanal')}** per tooth (preliminary estimate). Only a dentist can tell whether you need one.`,
        actions: [{ label: 'Root canal details', to: '/services/root-canal-treatment' }, { label: 'Estimate cost', to: '/cost-estimator' }],
      }),
    },
    {
      category: 'procedures',
      test: (m) => has(m, ['implant']),
      reply: () => ({
        text: `**Dental implants** replace missing teeth with a small titanium post that acts like a root, topped with a natural-looking crown. Treatment usually spans 3–6 months to allow healing.\n\nStarting from **${price('implants')}** per implant (preliminary estimate).`,
        actions: [{ label: 'Implant details', to: '/services/dental-implants' }, { label: 'Estimate cost', to: '/cost-estimator' }],
      }),
    },
    {
      category: 'procedures',
      test: (m) => has(m, ['brace', 'aligner', 'orthodont', 'crooked', 'straight']),
      reply: () => ({
        text: `We offer **metal braces, ceramic braces and clear aligners** for children, teens and adults. Treatment typically takes 12–24 months.\n\nStarting from **${price('braces')}** (preliminary estimate).`,
        actions: [{ label: 'Orthodontics details', to: '/services/braces-orthodontics' }, { label: 'Estimate cost', to: '/cost-estimator' }],
      }),
    },
    {
      category: 'procedures',
      test: (m) => has(m, ['veneer']),
      reply: () => ({
        text: `**Veneers** are thin custom shells bonded to the front of teeth to improve colour, shape and small gaps. Usually 2–3 visits.\n\nStarting from **${price('veneers')}** per tooth (preliminary estimate).`,
        actions: [{ label: 'Veneer details', to: '/services/dental-veneers' }, { label: 'Estimate cost', to: '/cost-estimator' }],
      }),
    },
    {
      category: 'pricing',
      test: (m) => has(m, ['whiten', 'bleach', 'yellow']),
      reply: () => ({
        text: `**Teeth whitening** at SmileCare starts from **${price('whitening')}** (preliminary estimate). Options include in-clinic LED whitening, a custom take-home kit, or a combination.\n\nFinal cost depends on an examination. Use the Cost Estimator for a personalised breakdown.`,
        actions: [{ label: 'Open Cost Estimator', to: '/cost-estimator' }, { label: 'Whitening details', to: '/services/teeth-whitening' }],
      }),
    },
    {
      category: 'pricing',
      test: (m) => has(m, ['cost', 'price', 'how much', 'fee', 'charge', 'expensive', 'cheap', 'taka', 'bdt', 'estimate']),
      reply: () => ({
        text: `Here are preliminary starting prices:\n\n• Teeth Cleaning — ${price('cleaning')}\n• Dental Filling — ${price('filling')}\n• Root Canal — ${price('rootCanal')}\n• Teeth Whitening — ${price('whitening')}\n• Veneers — ${price('veneers')} / tooth\n• Implants — ${price('implants')} / implant\n• Braces — ${price('braces')}\n\nActual costs depend on a clinical examination. Try our **Smart Cost Estimator** for a detailed breakdown.`,
        actions: [{ label: 'Open Cost Estimator', to: '/cost-estimator' }],
      }),
    },
    {
      category: 'oralCare',
      test: (m) => has(m, ['care', 'brush', 'floss', 'hygiene', 'healthy', 'clean my', 'tips', 'prevent', 'bad breath']),
      reply: () => ({
        text:
          '**Everyday tips for healthy teeth:**\n\n• Brush twice a day for 2 minutes with fluoride toothpaste\n• Clean between teeth daily with floss or interdental brushes\n• Limit sugary snacks and drinks, especially between meals\n• Drink water after tea or coffee\n• Replace your toothbrush every 3 months\n• Don’t smoke or chew tobacco/betel nut\n• Visit your dentist for a check-up and cleaning every 6 months',
        actions: [{ label: 'Book a check-up', to: '/appointment' }, { label: 'Teeth cleaning', to: '/services/teeth-cleaning' }],
      }),
    },
    {
      category: 'contact',
      test: (m) => has(m, ['contact', 'phone', 'call', 'address', 'location', 'where', 'email', 'hour', 'open', 'timing']),
      reply: () => ({
        text: `**${clinicInfo.name}**\n\n• 📍 ${clinicInfo.address}\n• 📞 ${clinicInfo.phone}\n• ✉️ ${clinicInfo.email}\n• 🕘 ${clinicInfo.hours.map((h) => `${h.day}: ${h.time}`).join(' · ')}\n• 🚨 Emergency: ${clinicInfo.emergencyPhone}`,
        actions: [{ label: 'Contact page', to: '/contact' }],
      }),
    },
    {
      category: 'services',
      test: (m) => has(m, ['service', 'offer', 'treatment', 'what do you', 'kids', 'child', 'cleaning', 'extraction', 'wisdom', 'filling', 'cavity', 'cosmetic']),
      reply: () => ({
        text:
          'We offer a full range of dental care:\n\n• General Dentistry & Check-ups\n• Teeth Cleaning\n• Teeth Whitening\n• Dental Implants\n• Root Canal Treatment\n• Braces & Orthodontics\n• Cosmetic Dentistry\n• Tooth Extraction\n• Pediatric Dentistry\n• Dental Veneers\n\nTell me what you’re looking for and I’ll point you to the right service.',
        actions: [{ label: 'Browse services', to: '/services' }, { label: 'Book appointment', to: '/appointment' }],
      }),
    },
    {
      category: 'greeting',
      test: (m) => /\b(hello|hi|hey|salam|assalam\w*|good (morning|evening|afternoon))\b/.test(m),
      reply: () => ({ text: 'Hello! 😊 How can I help you today? You can ask about treatments, prices, booking, or oral care tips.' }),
    },
    {
      category: 'greeting',
      test: (m) => /\b(thank\w*|great|ok|okay)\b/.test(m),
      reply: () => ({ text: 'You’re welcome! Is there anything else I can help you with?' }),
    },
  ];
}

const DIAGNOSE_WORDS = ['diagnose', 'do i have', 'what medicine', 'which medicine', 'antibiotic', 'painkiller', 'prescribe', 'what tablet', 'dose'];

export function getMockReply(message, ctx) {
  const m = ` ${message.toLowerCase().trim()} `;
  const { categories } = ctx.settings;

  if (has(m, DIAGNOSE_WORDS)) {
    return {
      category: 'safety',
      text: 'I’m not able to diagnose conditions or recommend medications. A qualified dentist needs to examine you to give a diagnosis and, if needed, prescribe treatment. I can help you book an appointment.',
      actions: [{ label: 'Book appointment', to: '/appointment' }],
    };
  }

  for (const rule of buildRules(ctx)) {
    // Emergency guidance is always on for safety; other categories respect admin toggles.
    const allowed = rule.category === 'greeting' || rule.category === 'emergency' || categories[rule.category] !== false;
    if (allowed && rule.test(m)) return { category: rule.category, ...rule.reply() };
  }

  return {
    category: 'fallback',
    text: 'I’m not sure I understood that. I can help with:\n\n• Explaining dental treatments\n• Treatment prices and the Cost Estimator\n• Booking an appointment\n• Oral care tips\n• Clinic contact details\n\nFor anything specific to your mouth, please speak with one of our dentists.',
    actions: [{ label: 'Contact us', to: '/contact' }],
  };
}

export const assistantService = {
  async sendMessage(message, history, ctx) {
    if (!USE_MOCK) return request('/assistant/chat', { method: 'POST', body: { message, history } });
    const reply = getMockReply(message, ctx);
    return mockDelay({ ...reply, mock: true }, 700 + Math.min(message.length * 15, 900));
  },
};
