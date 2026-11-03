// Mock records used by patient & admin dashboards. Dates are relative to "today" so the demo always looks current.
const day = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

export const demoUsers = [
  { id: 'p1', role: 'patient', name: 'Nadia Sultana', email: 'patient@demo.com', password: 'demo1234', phone: '+880 1712-555010', dob: '1994-03-18', gender: 'Female', bloodGroup: 'B+', address: 'Banani, Dhaka', allergies: 'Penicillin', joined: day(-420) },
  { id: 'u-doc1', role: 'doctor', status: 'approved', dentistId: 'd2', name: 'Dr. Rafiq Hasan', email: 'doctor@demo.com', password: 'doctor1234', phone: '+880 1711-445500', specialization: 'Implantology & Oral Surgery', qualifications: 'BDS, FCPS (Oral & Maxillofacial Surgery)', regNo: 'BMDC A-10234', experience: 18, joined: day(-800) },
  { id: 'u-doc2', role: 'doctor', status: 'pending', name: 'Dr. Nusrat Hossain', email: 'nusrat.doc@example.com', password: 'doctor1234', phone: '+880 1819-667711', specialization: 'Periodontics', qualifications: 'BDS, MS Periodontology', regNo: 'BMDC A-22871', experience: 6, joined: day(-1) },
  { id: 'a1', role: 'admin', name: 'Admin User', email: 'admin@demo.com', password: 'admin1234', phone: '+880 1711-000000', joined: day(-900) },
];

export const defaultAppointments = [
  { id: 'APT-1042', patientId: 'p1', patientName: 'Nadia Sultana', phone: '+880 1712-555010', service: 'teeth-cleaning', dentistId: 'd4', date: day(3), time: '10:30 AM', status: 'Confirmed', notes: '' },
  { id: 'APT-1051', patientId: 'p1', patientName: 'Nadia Sultana', phone: '+880 1712-555010', service: 'teeth-whitening', dentistId: 'd1', date: day(17), time: '04:15 PM', status: 'Pending', notes: 'Prefers evening' },
  { id: 'APT-0987', patientId: 'p1', patientName: 'Nadia Sultana', phone: '+880 1712-555010', service: 'root-canal-treatment', dentistId: 'd4', date: day(-40), time: '11:15 AM', status: 'Completed', notes: '' },
  { id: 'APT-0921', patientId: 'p1', patientName: 'Nadia Sultana', phone: '+880 1712-555010', service: 'general-dentistry', dentistId: 'd6', date: day(-95), time: '09:45 AM', status: 'Completed', notes: '' },
  { id: 'APT-0890', patientId: 'p1', patientName: 'Nadia Sultana', phone: '+880 1712-555010', service: 'teeth-cleaning', dentistId: 'd6', date: day(-180), time: '02:00 PM', status: 'Cancelled', notes: '' },
  { id: 'APT-1059', patientId: 'p1', patientName: 'Nadia Sultana', phone: '+880 1712-555010', service: 'general-dentistry', dentistId: 'd2', date: day(0), time: '04:15 PM', status: 'Confirmed', notes: 'Wisdom tooth discomfort, lower right' },
  { id: 'APT-1060', patientId: 'p2', patientName: 'Arif Mahmud', phone: '+880 1819-223344', service: 'dental-implants', dentistId: 'd2', date: day(0), time: '09:00 AM', status: 'Confirmed', notes: '' },
  { id: 'APT-1061', patientId: 'p3', patientName: 'Sharmin Akter', phone: '+880 1552-889900', service: 'braces-orthodontics', dentistId: 'd3', date: day(0), time: '11:15 AM', status: 'Confirmed', notes: 'Adjustment visit' },
  { id: 'APT-1062', patientId: 'p4', patientName: 'Rakib Hasan', phone: '+880 1611-445566', service: 'tooth-extraction', dentistId: 'd2', date: day(0), time: '02:45 PM', status: 'Pending', notes: '' },
  { id: 'APT-1063', patientId: 'p5', patientName: 'Mitu Begum', phone: '+880 1711-778899', service: 'pediatric-dentistry', dentistId: 'd5', date: day(0), time: '05:00 PM', status: 'Confirmed', notes: 'Child: 6 yrs' },
  { id: 'APT-1064', patientId: 'p6', patientName: 'Sajid Karim', phone: '+880 1912-112233', service: 'dental-veneers', dentistId: 'd1', date: day(1), time: '03:30 PM', status: 'Pending', notes: '' },
  { id: 'APT-1065', patientId: 'p7', patientName: 'Lamia Hoque', phone: '+880 1815-667788', service: 'teeth-whitening', dentistId: 'd6', date: day(2), time: '06:30 PM', status: 'Confirmed', notes: '' },
  { id: 'APT-1039', patientId: 'p8', patientName: 'Fahim Uddin', phone: '+880 1715-990011', service: 'root-canal-treatment', dentistId: 'd4', date: day(-2), time: '12:00 PM', status: 'Completed', notes: '' },
];

export const defaultPatients = [
  { id: 'p1', name: 'Nadia Sultana', email: 'patient@demo.com', phone: '+880 1712-555010', gender: 'Female', age: 32, lastVisit: day(-40), status: 'Active', joined: day(-420) },
  { id: 'p2', name: 'Arif Mahmud', email: 'arif.m@example.com', phone: '+880 1819-223344', gender: 'Male', age: 45, lastVisit: day(-14), status: 'Active', joined: day(-2) },
  { id: 'p3', name: 'Sharmin Akter', email: 'sharmin@example.com', phone: '+880 1552-889900', gender: 'Female', age: 19, lastVisit: day(-30), status: 'Active', joined: day(-310) },
  { id: 'p4', name: 'Rakib Hasan', email: 'rakib.h@example.com', phone: '+880 1611-445566', gender: 'Male', age: 28, lastVisit: day(-5), status: 'Active', joined: day(-5) },
  { id: 'p5', name: 'Mitu Begum', email: 'mitu.b@example.com', phone: '+880 1711-778899', gender: 'Female', age: 36, lastVisit: day(-60), status: 'Active', joined: day(-200) },
  { id: 'p6', name: 'Sajid Karim', email: 'sajid.k@example.com', phone: '+880 1912-112233', gender: 'Male', age: 31, lastVisit: day(-1), status: 'Active', joined: day(-1) },
  { id: 'p7', name: 'Lamia Hoque', email: 'lamia.h@example.com', phone: '+880 1815-667788', gender: 'Female', age: 27, lastVisit: day(-90), status: 'Inactive', joined: day(-3) },
  { id: 'p8', name: 'Fahim Uddin', email: 'fahim.u@example.com', phone: '+880 1715-990011', gender: 'Male', age: 52, lastVisit: day(-2), status: 'Active', joined: day(-640) },
];

export const defaultTreatments = [
  { id: 't1', patientId: 'p1', dentistId: 'd4', date: day(-40), treatment: 'Root Canal Treatment — Lower left molar (#36)', dentist: 'Dr. Mahmud Chowdhury', status: 'Completed', notes: 'Two-visit RCT completed. Zirconia crown recommended.' },
  { id: 't2', patientId: 'p1', dentistId: 'd6', date: day(-95), treatment: 'Comprehensive Check-up & X-ray', dentist: 'Dr. Kamrul Alam', status: 'Completed', notes: 'Early decay detected on #36. Referred for endodontic evaluation.' },
  { id: 't3', patientId: 'p1', dentistId: 'd6', date: day(-420), treatment: 'Scaling & Polishing', dentist: 'Dr. Kamrul Alam', status: 'Completed', notes: 'Mild gingivitis. Advised flossing daily.' },
];

export const defaultPrescriptions = [
  { id: 'rx1', patientId: 'p1', patientName: 'Nadia Sultana', dentistId: 'd4', diagnosis: 'Irreversible pulpitis #36 — post-RCT care', date: day(-40), dentist: 'Dr. Mahmud Chowdhury', items: [{ name: 'Chlorhexidine mouthwash 0.2%', dosage: 'Rinse 10 ml twice daily', duration: '7 days' }], notes: 'Medication as prescribed by your dentist during the visit.' },
  { id: 'rx2', patientId: 'p1', patientName: 'Nadia Sultana', dentistId: 'd6', diagnosis: 'Early enamel caries', date: day(-95), dentist: 'Dr. Kamrul Alam', items: [{ name: 'Fluoride toothpaste 5000 ppm', dosage: 'Brush twice daily', duration: '3 months' }], notes: 'Preventive care.' },
];

export const invoices = [
  { id: 'INV-2291', date: day(-40), description: 'Root Canal Treatment (Molar)', items: [{ label: 'Root canal — molar', amount: 9000 }, { label: 'Digital X-ray', amount: 500 }], paid: true },
  { id: 'INV-2187', date: day(-95), description: 'Check-up & X-ray', items: [{ label: 'Consultation', amount: 800 }, { label: 'Digital X-ray (OPG)', amount: 1200 }], paid: true },
  { id: 'INV-1702', date: day(-420), description: 'Scaling & Polishing', items: [{ label: 'Teeth cleaning', amount: 1500 }], paid: true },
];

export const documents = [
  { id: 'doc1', name: 'OPG X-ray — full mouth', type: 'X-ray', date: day(-95), size: '2.4 MB' },
  { id: 'doc2', name: 'Periapical X-ray — tooth #36', type: 'X-ray', date: day(-40), size: '640 KB' },
  { id: 'doc3', name: 'Treatment consent form', type: 'Form', date: day(-41), size: '180 KB' },
  { id: 'doc4', name: 'Treatment plan summary', type: 'Report', date: day(-40), size: '310 KB' },
];

export const defaultNotifications = [
  { id: 'n1', title: 'Appointment reminder', text: 'Your teeth cleaning is scheduled in 3 days at 10:30 AM.', date: day(0), read: false, type: 'appointment' },
  { id: 'n2', title: 'Whitening request received', text: 'We received your teeth whitening request and will confirm shortly.', date: day(-1), read: false, type: 'info' },
  { id: 'n3', title: 'Invoice paid', text: 'Payment for INV-2291 has been received. Thank you!', date: day(-40), read: true, type: 'billing' },
  { id: 'n4', title: 'Six-month check-up due', text: 'It’s been a while — schedule your routine check-up.', date: day(-60), read: true, type: 'reminder' },
];

export const defaultReviews = [
  { id: 'r1', name: 'Farhana Rahman', rating: 5, service: 'Teeth Whitening', text: 'Amazing results, very friendly staff!', date: day(-3), status: 'Approved' },
  { id: 'r2', name: 'Tanvir Ahmed', rating: 5, service: 'Dental Implants', text: 'Professional and painless. Highly recommend.', date: day(-8), status: 'Approved' },
  { id: 'r3', name: 'Rubel Mia', rating: 3, service: 'General Dentistry', text: 'Good treatment but waited 20 minutes.', date: day(-1), status: 'Pending' },
  { id: 'r4', name: 'Shila Das', rating: 4, service: 'Braces', text: 'Dr. Sadia is very patient and explains everything.', date: day(-2), status: 'Pending' },
];

export const defaultMessages = [
  { id: 'm1', name: 'Hasan Ali', email: 'hasan.ali@example.com', phone: '+880 1711-121212', subject: 'Implant consultation', message: 'Do you offer free consultation for dental implants? I have two missing teeth.', date: day(0), read: false },
  { id: 'm2', name: 'Priya Saha', email: 'priya@example.com', phone: '+880 1811-343434', subject: 'Child appointment', message: 'Can I bring my 4-year-old daughter for a first visit on Friday?', date: day(-1), read: false },
  { id: 'm3', name: 'Jamal Uddin', email: 'jamal@example.com', phone: '', subject: 'Payment plan', message: 'Is EMI available for braces treatment?', date: day(-4), read: true },
];

export const monthlyAnalytics = [
  { month: 'Jun', appointments: 312, revenue: 1180000, newPatients: 84 },
  { month: 'Jul', appointments: 345, revenue: 1295000, newPatients: 91 },
  { month: 'Aug', appointments: 330, revenue: 1240000, newPatients: 77 },
  { month: 'Sep', appointments: 378, revenue: 1420000, newPatients: 102 },
  { month: 'Oct', appointments: 402, revenue: 1535000, newPatients: 118 },
  { month: 'Nov', appointments: 389, revenue: 1490000, newPatients: 96 },
];

export const serviceShare = [
  { name: 'Cleaning', value: 32 },
  { name: 'Root Canal', value: 18 },
  { name: 'Orthodontics', value: 15 },
  { name: 'Whitening', value: 12 },
  { name: 'Implants', value: 9 },
  { name: 'Other', value: 14 },
];
