import { USE_MOCK, mockDelay, request } from './apiClient';
import { demoUsers } from '../data/mockRecords';
import { readStorage, writeStorage } from '../hooks/useLocalStorage';
import { uid } from '../utils/format';

// Stored users plus any seeded demo users missing from storage (e.g. added in a later version).
const getUsers = () => {
  const stored = readStorage('users', []);
  return [...stored, ...demoUsers.filter((d) => !stored.some((u) => u.id === d.id))];
};
const saveUsers = (users) => writeStorage('users', users);
const safe = ({ password, ...u }) => u; // never keep passwords in session state

export const DOCTOR_STATUS_MESSAGES = {
  pending: 'Your doctor account is awaiting admin verification. You’ll be able to log in once it is approved.',
  rejected: 'Your doctor account application was not approved. Please contact the clinic for details.',
};

export const authService = {
  async login({ email, password }) {
    if (!USE_MOCK) return request('/auth/login', { method: 'POST', body: { email, password } });
    await mockDelay(null, 700);
    const user = getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) throw new Error('Invalid email or password.');
    if (user.role === 'doctor' && user.status !== 'approved') throw new Error(DOCTOR_STATUS_MESSAGES[user.status] || DOCTOR_STATUS_MESSAGES.pending);
    return { user: safe(user), token: `mock-${user.id}` };
  },

  // Patients are signed in immediately; doctors are created as "pending" and must be approved by an admin.
  async register(data) {
    if (!USE_MOCK) return request('/auth/register', { method: 'POST', body: data });
    await mockDelay(null, 800);
    const users = getUsers();
    if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) throw new Error('An account with this email already exists.');
    const isDoctor = data.role === 'doctor';
    const user = {
      id: uid(isDoctor ? 'doc' : 'p'),
      role: isDoctor ? 'doctor' : 'patient',
      joined: new Date().toISOString().slice(0, 10),
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      ...(isDoctor && { status: 'pending', specialization: data.specialization, qualifications: data.qualifications, regNo: data.regNo, experience: Number(data.experience) || 0 }),
    };
    saveUsers([...users, user]);
    return isDoctor ? { user: safe(user), pending: true } : { user: safe(user), token: `mock-${user.id}` };
  },

  listUsers(role) {
    return getUsers().filter((u) => !role || u.role === role).map(safe);
  },

  async setDoctorStatus(id, status, patch = {}) {
    if (!USE_MOCK) return request(`/admin/doctors/${id}`, { method: 'PATCH', body: { status, ...patch } });
    await mockDelay(null, 400);
    const users = getUsers().map((u) => (u.id === id ? { ...u, status, ...patch } : u));
    saveUsers(users);
    return safe(users.find((u) => u.id === id));
  },

  async forgotPassword(email) {
    if (!USE_MOCK) return request('/auth/forgot-password', { method: 'POST', body: { email } });
    await mockDelay(null, 800);
    return { message: `If ${email} is registered, a reset link has been sent.`, token: 'demo-reset-token' };
  },

  async resetPassword({ token, email, password }) {
    if (!USE_MOCK) return request('/auth/reset-password', { method: 'POST', body: { token, password } });
    await mockDelay(null, 800);
    if (!token) throw new Error('Reset link is invalid or expired.');
    saveUsers(getUsers().map((u) => (u.email.toLowerCase() === (email || '').toLowerCase() ? { ...u, password } : u)));
    return { message: 'Password updated.' };
  },

  async updateProfile(id, patch) {
    if (!USE_MOCK) return request(`/users/${id}`, { method: 'PATCH', body: patch });
    await mockDelay(null, 500);
    const users = getUsers().map((u) => (u.id === id ? { ...u, ...patch } : u));
    saveUsers(users);
    return { user: safe(users.find((u) => u.id === id) || { id, ...patch }) };
  },
};
