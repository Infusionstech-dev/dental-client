import { createContext, useCallback, useContext, useMemo } from 'react';
import useLocalStorage, { clearAppStorage } from '../hooks/useLocalStorage';
import { defaultServices } from '../data/services';
import { defaultDentists } from '../data/dentists';
import { defaultPricing } from '../data/pricing';
import { defaultAssistantSettings } from '../data/assistant';
import { clinicInfo } from '../data/clinic';
import { defaultAppointments, defaultMessages, defaultNotifications, defaultPatients, defaultPrescriptions, defaultReviews, defaultTreatments } from '../data/mockRecords';
import { startingPriceFor } from '../utils/pricingCalculator';
import { uid } from '../utils/format';

const DataContext = createContext(null);

const defaultSiteSettings = {
  clinicName: clinicInfo.name,
  phone: clinicInfo.phone,
  emergencyPhone: clinicInfo.emergencyPhone,
  email: clinicInfo.email,
  address: clinicInfo.address,
  announcement: 'Free dental check-up for children under 12 this month!',
  showAnnouncement: true,
};

// Single source of mock app data, persisted in localStorage. Swap these setters for API calls later.
export function DataProvider({ children }) {
  const [services, setServices] = useLocalStorage('services', defaultServices);
  const [dentists, setDentists] = useLocalStorage('dentists', defaultDentists);
  const [pricing, setPricing] = useLocalStorage('pricing', defaultPricing);
  const [appointments, setAppointments] = useLocalStorage('appointments', defaultAppointments);
  const [patients, setPatients] = useLocalStorage('patients', defaultPatients);
  const [reviews, setReviews] = useLocalStorage('reviews', defaultReviews);
  const [messages, setMessages] = useLocalStorage('messages', defaultMessages);
  const [notifications, setNotifications] = useLocalStorage('notifications', defaultNotifications);
  const [assistantSettings, setAssistantSettings] = useLocalStorage('assistant', defaultAssistantSettings);
  const [siteSettings, setSiteSettings] = useLocalStorage('site', defaultSiteSettings);
  const [prescriptions, setPrescriptions] = useLocalStorage('prescriptions', defaultPrescriptions);
  const [treatments, setTreatments] = useLocalStorage('treatments', defaultTreatments);

  const getService = useCallback((slug) => services.find((s) => s.slug === slug), [services]);
  const getDentist = useCallback((id) => dentists.find((d) => d.id === id), [dentists]);

  // Displayed "starting from" price always comes from pricing config when linked.
  const servicePrice = useCallback(
    (service) => (service?.pricingKey ? startingPriceFor(pricing, service.pricingKey) ?? service.startingPrice : service?.startingPrice),
    [pricing]
  );

  const addAppointment = useCallback((apt) => {
    setAppointments((list) => [apt, ...list]);
    setPatients((list) =>
      list.some((p) => p.email === apt.email || p.id === apt.patientId)
        ? list
        : [{ id: apt.patientId || uid('p'), name: apt.patientName, email: apt.email, phone: apt.phone, gender: apt.gender || '—', age: apt.age || '—', lastVisit: apt.date, status: 'Active', joined: new Date().toISOString().slice(0, 10) }, ...list]
    );
  }, [setAppointments, setPatients]);

  const updateAppointment = useCallback((id, patch) => setAppointments((l) => l.map((a) => (a.id === id ? { ...a, ...patch } : a))), [setAppointments]);

  const resetDemoData = () => {
    clearAppStorage();
    window.location.reload();
  };

  const value = useMemo(
    () => ({
      services, setServices, getService, servicePrice,
      dentists, setDentists, getDentist,
      pricing, setPricing, resetPricing: () => setPricing(defaultPricing),
      appointments, setAppointments, addAppointment, updateAppointment,
      patients, setPatients,
      reviews, setReviews,
      messages, setMessages,
      notifications, setNotifications,
      assistantSettings, setAssistantSettings, resetAssistant: () => setAssistantSettings(defaultAssistantSettings),
      siteSettings, setSiteSettings,
      prescriptions, setPrescriptions,
      treatments, setTreatments,
      resetDemoData,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [services, dentists, pricing, appointments, patients, reviews, messages, notifications, assistantSettings, siteSettings, prescriptions, treatments, getService, getDentist, servicePrice, addAppointment, updateAppointment]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => useContext(DataContext);
