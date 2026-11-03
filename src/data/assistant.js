// Default (admin-editable) settings for the AI Dental Assistant.
export const defaultAssistantSettings = {
  enabled: true,
  name: 'SmileCare Assistant',
  welcomeMessage:
    'Hi! I’m the SmileCare Assistant 👋 I can share general dental information, explain treatments, help you find a service, estimate costs, or book an appointment. How can I help today?',
  suggestedQuestions: [
    'How can I book an appointment?',
    'What is a root canal treatment?',
    'How much does teeth whitening cost?',
    'How can I take care of my teeth?',
    'What should I do if I have a toothache?',
    'What dental services do you offer?',
  ],
  categories: {
    booking: true,
    procedures: true,
    pricing: true,
    oralCare: true,
    emergency: true,
    contact: true,
    services: true,
  },
};

export const DISCLAIMER =
  'This assistant provides general dental information and does not replace professional dental advice. Please consult a qualified dentist for diagnosis and treatment.';

export const categoryLabels = {
  booking: 'Appointment booking',
  procedures: 'Procedure explanations',
  pricing: 'Pricing & cost estimator',
  oralCare: 'Oral hygiene tips',
  emergency: 'Emergency guidance',
  contact: 'Clinic contact info',
  services: 'Service finder',
};
