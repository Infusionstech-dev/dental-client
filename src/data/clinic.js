export const clinicInfo = {
  name: 'SmileCare Dental',
  tagline: 'Modern, gentle dental care',
  address: 'House 42, Road 11, Gulshan-2, Dhaka 1212, Bangladesh',
  phone: '+880 1711-234567',
  emergencyPhone: '+880 1999-911911',
  email: 'hello@smilecaredental.com.bd',
  hours: [
    { day: 'Saturday – Thursday', time: '9:00 AM – 9:00 PM' },
    { day: 'Friday', time: '3:00 PM – 9:00 PM' },
  ],
  emergencyNote: '24/7 emergency line for severe pain, trauma, swelling or bleeding.',
  socials: { facebook: 'https://facebook.com', instagram: 'https://instagram.com', linkedin: 'https://linkedin.com' },
};

const u = (id, w = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

export const images = {
  hero: u('1629909613654-28e377c37b09'),
  clinic: u('1606811971618-4486d14f3f99'),
  equipment: u('1588776814546-1ffcf47267a5'),
  team: u('1598256989800-fe5f95da9787'),
  smile: u('1609840114035-3c981b782dfe'),
};
export const unsplash = u;

export const stats = [
  { value: 15000, suffix: '+', label: 'Happy patients' },
  { value: 12, suffix: '', label: 'Expert dentists' },
  { value: 18, suffix: ' yrs', label: 'Of experience' },
  { value: 98, suffix: '%', label: 'Satisfaction rate' },
];

export const whyChooseUs = [
  { icon: 'ShieldCheck', title: 'Sterilization first', text: 'Hospital-grade, class-B autoclave sterilization for every instrument, every time.' },
  { icon: 'Cpu', title: 'Digital dentistry', text: '3D CBCT imaging, intraoral scanners and digital smile design for precise results.' },
  { icon: 'HeartHandshake', title: 'Gentle, painless care', text: 'Anxiety-friendly approach with modern anaesthesia and calm, private suites.' },
  { icon: 'Wallet', title: 'Transparent pricing', text: 'Clear estimates before treatment and flexible payment plans. No surprises.' },
];

export const facilities = [
  { icon: 'Armchair', title: '8 private treatment suites', text: 'Ergonomic chairs, ceiling TVs and noise-reducing design.' },
  { icon: 'Baby', title: 'Kids’ dental corner', text: 'A playful space that makes visits fun for little ones.' },
  { icon: 'Accessibility', title: 'Fully accessible', text: 'Step-free access, lift and wheelchair-friendly suites.' },
  { icon: 'Car', title: 'On-site parking', text: 'Free, secure parking for all patients.' },
];

export const technology = [
  { icon: 'ScanLine', title: '3D CBCT Imaging', text: 'Low-radiation 3D scans for implant planning and complex diagnosis.' },
  { icon: 'Scan', title: 'Intraoral Scanner', text: 'No messy impressions — digital models in minutes.' },
  { icon: 'Zap', title: 'Dental Laser', text: 'Minimally invasive gum and soft-tissue treatment with faster healing.' },
  { icon: 'Microscope', title: 'Endodontic Microscope', text: 'Magnified precision for root canal treatment.' },
];

export const testimonials = [
  { id: 1, name: 'Farhana Rahman', role: 'Teeth Whitening', rating: 5, text: 'The whole team was so warm and professional. My smile is several shades brighter and there was zero sensitivity afterwards!', avatar: 'https://i.pravatar.cc/120?img=47' },
  { id: 2, name: 'Tanvir Ahmed', role: 'Dental Implants', rating: 5, text: 'I was nervous about implants, but Dr. Rafiq explained every step. The result looks and feels completely natural.', avatar: 'https://i.pravatar.cc/120?img=12' },
  { id: 3, name: 'Nusrat Jahan', role: 'Braces', rating: 5, text: 'Eighteen months of orthodontic care and I finally love my smile. Appointments were always on time.', avatar: 'https://i.pravatar.cc/120?img=45' },
  { id: 4, name: 'Imran Hossain', role: 'Root Canal', rating: 4, text: 'Honestly painless. The clinic is spotless and the cost estimate matched the final bill.', avatar: 'https://i.pravatar.cc/120?img=15' },
];

export const beforeAfter = [
  { id: 1, title: 'Teeth Whitening', before: u('1606265752439-1f18756aa5fc', 600), after: u('1609840114035-3c981b782dfe', 600), note: '1 in-clinic session' },
  { id: 2, title: 'Porcelain Veneers', before: u('1588776814546-1ffcf47267a5', 600), after: u('1629909613654-28e377c37b09', 600), note: '8 upper veneers' },
  { id: 3, title: 'Orthodontic Alignment', before: u('1598256989800-fe5f95da9787', 600), after: u('1606811971618-4486d14f3f99', 600), note: '14 months clear aligners' },
];

export const homeFaqs = [
  { q: 'Do you accept walk-in patients?', a: 'Yes, but we recommend booking online so we can reserve a dentist and time slot for you and minimise waiting.' },
  { q: 'Is treatment painful?', a: 'We use modern local anaesthesia and gentle techniques. Most patients report little to no discomfort during treatment.' },
  { q: 'Do you offer payment plans?', a: 'Yes. Treatments above ৳20,000 can be split into 0% interest instalments with selected bank cards.' },
  { q: 'How often should I visit the dentist?', a: 'For most people, a check-up and cleaning every six months is recommended. Your dentist may suggest a different interval.' },
  { q: 'What should I do in a dental emergency?', a: 'Call our 24/7 emergency line immediately. For severe facial swelling, difficulty breathing or uncontrolled bleeding, go to the nearest hospital emergency department.' },
];
