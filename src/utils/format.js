export const formatBDT = (n) => `৳${Math.round(Number(n) || 0).toLocaleString('en-IN')}`;

export const formatDate = (iso, opts = { day: 'numeric', month: 'short', year: 'numeric' }) => {
  if (!iso) return '—';
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso);
  return d.toLocaleDateString('en-GB', opts);
};

export const todayISO = () => new Date().toISOString().slice(0, 10);

export const uid = (prefix = 'id') => `${prefix}-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-3)}`;

export const cn = (...classes) => classes.filter(Boolean).join(' ');

export const initials = (name = '') =>
  name.replace(/^Dr\.\s*/, '').split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();

export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const homeFor = (role) => ({ admin: '/admin', doctor: '/doctor' }[role] || '/patient');
