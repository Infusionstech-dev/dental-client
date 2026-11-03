import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { LayoutDashboard, User, CalendarDays, ClipboardList, Pill, Bell, Users, CalendarCheck, Stethoscope, Sparkles, Bot, Star, Mail, BarChart3, Settings, UserCheck } from 'lucide-react';
import { authService } from '../services/authService';
import PublicLayout from '../layouts/PublicLayout';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import { PageLoader } from '../components/common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import Home from '../pages/public/Home';
import { homeFor } from '../utils/format';

const lazyNamed = (loader, name) => lazy(() => loader().then((m) => ({ default: m[name] })));

const About = lazy(() => import('../pages/public/About'));
const Services = lazy(() => import('../pages/public/Services'));
const ServiceDetail = lazy(() => import('../pages/public/ServiceDetail'));
const Dentists = lazy(() => import('../pages/public/Dentists'));
const DentistProfile = lazy(() => import('../pages/public/DentistProfile'));
const Appointment = lazy(() => import('../pages/public/Appointment'));
const CostEstimatorPage = lazy(() => import('../pages/public/CostEstimatorPage'));
const AIAssistantPage = lazy(() => import('../pages/public/AIAssistantPage'));
const Contact = lazy(() => import('../pages/public/Contact'));
const NotFound = lazy(() => import('../pages/public/NotFound'));

const auth = () => import('../pages/auth/AuthPages');
const Login = lazyNamed(auth, 'Login');
const Register = lazyNamed(auth, 'Register');
const ForgotPassword = lazyNamed(auth, 'ForgotPassword');
const ResetPassword = lazyNamed(auth, 'ResetPassword');

const patient = () => import('../pages/patient/PatientPages');
const PatientDashboard = lazyNamed(patient, 'PatientDashboard');
const PatientProfile = lazyNamed(patient, 'PatientProfile');
const PatientAppointments = lazyNamed(patient, 'PatientAppointments');
const TreatmentHistory = lazyNamed(patient, 'TreatmentHistory');
const Prescriptions = lazyNamed(patient, 'Prescriptions');
const Notifications = lazyNamed(patient, 'Notifications');

const overview = () => import('../pages/admin/AdminOverview');
const modules = () => import('../pages/admin/AdminModules');
const AdminDashboard = lazyNamed(overview, 'AdminDashboard');
const Reports = lazyNamed(overview, 'Reports');
const AdminPatients = lazyNamed(modules, 'AdminPatients');
const AdminAppointments = lazyNamed(modules, 'AdminAppointments');
const AdminDentists = lazyNamed(modules, 'AdminDentists');
const AdminServicesPricing = lazyNamed(modules, 'AdminServicesPricing');
const AdminAssistant = lazyNamed(modules, 'AdminAssistant');
const AdminReviews = lazyNamed(modules, 'AdminReviews');
const AdminMessages = lazyNamed(modules, 'AdminMessages');
const AdminSettings = lazyNamed(modules, 'AdminSettings');
const AdminDoctorApprovals = lazyNamed(modules, 'AdminDoctorApprovals');

const doctor = () => import('../pages/doctor/DoctorPages');
const DoctorDashboard = lazyNamed(doctor, 'DoctorDashboard');
const DoctorAppointments = lazyNamed(doctor, 'DoctorAppointments');
const DoctorPatients = lazyNamed(doctor, 'DoctorPatients');
const DoctorPatientHistory = lazyNamed(doctor, 'DoctorPatientHistory');
const DoctorPrescriptions = lazyNamed(doctor, 'DoctorPrescriptions');
const DoctorProfile = lazyNamed(doctor, 'DoctorProfile');

function ProtectedRoute({ role, children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (role && user.role !== role) return <Navigate to={homeFor(user.role)} replace />;
  return children;
}

function GuestOnly({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to={homeFor(user.role)} replace /> : children;
}

function PatientArea() {
  const { notifications } = useData();
  const unread = notifications.filter((n) => !n.read).length;
  const items = [
    { to: '/patient/appointments', label: 'My Appointments', icon: CalendarDays },
    { to: '/patient/profile', label: 'My Profile', icon: User },
    { to: '/patient/treatments', label: 'Treatment History', icon: ClipboardList },
    { to: '/patient/prescriptions', label: 'Prescriptions', icon: Pill },
    { to: '/patient/notifications', label: 'Notifications', icon: Bell, badge: unread },
  ];
  return <DashboardLayout items={items} label="Patient portal" roleLabel="Patient" notifTo="/patient/notifications" unread={unread} />;
}

function AdminArea() {
  const { messages } = useData();
  const items = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/patients', label: 'Patients', icon: Users },
    { to: '/admin/dentists', label: 'Dentists', icon: Stethoscope },
    { to: '/admin/doctor-approvals', label: 'Doctor Approvals', icon: UserCheck, badge: authService.listUsers('doctor').filter((d) => d.status === 'pending').length },
    { to: '/admin/services', label: 'Services & Pricing', icon: Sparkles },
    { to: '/admin/assistant', label: 'AI Assistant', icon: Bot },
    { to: '/admin/reviews', label: 'Reviews', icon: Star },
    { to: '/admin/messages', label: 'Messages', icon: Mail, badge: messages.filter((m) => !m.read).length },
    { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ];
  return <DashboardLayout items={items} label="Administration" roleLabel="Administrator" notifTo="/admin/messages" unread={messages.filter((m) => !m.read).length} />;
}

function DoctorArea() {
  const { appointments } = useData();
  const { user } = useAuth();
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = appointments.filter((a) => a.dentistId === user?.dentistId && a.date === today && a.status !== 'Cancelled' && a.status !== 'Completed').length;
  const items = [
    { to: '/doctor', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/doctor/profile', label: 'My Profile', icon: User },
    { to: '/doctor/appointments', label: 'Appointments', icon: CalendarCheck, badge: todayCount },
    { to: '/doctor/patients', label: 'My Patients', icon: Users },
    { to: '/doctor/prescriptions', label: 'Prescriptions', icon: Pill },
  ];
  return <DashboardLayout items={items} label="Doctor portal" roleLabel={user?.specialization || 'Doctor'} />;
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:slug" element={<ServiceDetail />} />
          <Route path="dentists" element={<Dentists />} />
          <Route path="dentists/:id" element={<DentistProfile />} />
          <Route path="appointment" element={<Appointment />} />
          <Route path="cost-estimator" element={<CostEstimatorPage />} />
          <Route path="ai-assistant" element={<AIAssistantPage />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route element={<GuestOnly><AuthLayout /></GuestOnly>}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>

        <Route path="patient" element={<ProtectedRoute role="patient"><PatientArea /></ProtectedRoute>}>
          <Route index element={<PatientDashboard />} />
          <Route path="profile" element={<PatientProfile />} />
          <Route path="appointments" element={<PatientAppointments />} />
          <Route path="treatments" element={<TreatmentHistory />} />
          <Route path="prescriptions" element={<Prescriptions />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        <Route path="doctor" element={<ProtectedRoute role="doctor"><DoctorArea /></ProtectedRoute>}>
          <Route index element={<DoctorDashboard />} />
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="patients" element={<DoctorPatients />} />
          <Route path="patients/:key" element={<DoctorPatientHistory />} />
          <Route path="prescriptions" element={<DoctorPrescriptions />} />
          <Route path="profile" element={<DoctorProfile />} />
        </Route>

        <Route path="admin" element={<ProtectedRoute role="admin"><AdminArea /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="patients" element={<AdminPatients />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="dentists" element={<AdminDentists />} />
          <Route path="services" element={<AdminServicesPricing />} />
          <Route path="pricing" element={<Navigate to="/admin/services?tab=pricing" replace />} />
          <Route path="assistant" element={<AdminAssistant />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="doctor-approvals" element={<AdminDoctorApprovals />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
