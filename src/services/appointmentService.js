import { USE_MOCK, mockDelay, request } from './apiClient';
import { uid } from '../utils/format';

export const appointmentService = {
  async create(payload) {
    if (!USE_MOCK) return request('/appointments', { method: 'POST', body: payload });
    await mockDelay(null, 1000);
    return { ...payload, id: uid('APT').toUpperCase(), status: 'Pending', createdAt: new Date().toISOString() };
  },
  async updateStatus(id, status) {
    if (!USE_MOCK) return request(`/appointments/${id}`, { method: 'PATCH', body: { status } });
    return mockDelay({ id, status }, 300);
  },
};

export const contactService = {
  async send(payload) {
    if (!USE_MOCK) return request('/contact', { method: 'POST', body: payload });
    await mockDelay(null, 900);
    return { ...payload, id: uid('m'), date: new Date().toISOString().slice(0, 10), read: false };
  },
};
