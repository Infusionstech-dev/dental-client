import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Siren } from 'lucide-react';
import { Logo, publicLinks } from './Navbar';
import { useData } from '../../context/DataContext';
import { clinicInfo } from '../../data/clinic';

export default function Footer() {
  const { services, siteSettings: s } = useData();
  return (
    <footer className="bg-navy-900 text-navy-200">
      <div className="container-x grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-4 text-sm leading-relaxed text-navy-200/80">Modern, gentle and transparent dental care for the whole family in the heart of Dhaka.</p>
          <div className="mt-5 flex gap-3 text-sm">
            {Object.entries(clinicInfo.socials).map(([k, url]) => (
              <a key={k} href={url} target="_blank" rel="noreferrer" className="rounded-lg bg-white/5 px-3 py-1.5 capitalize hover:bg-white/10">{k}</a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Explore</h4>
          <ul className="space-y-2.5 text-sm">
            {publicLinks.map((l) => <li key={l.to}><Link to={l.to} className="hover:text-white">{l.label}</Link></li>)}
            <li><Link to="/appointment" className="hover:text-white">Book Appointment</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Services</h4>
          <ul className="space-y-2.5 text-sm">
            {services.filter((x) => x.active).slice(0, 7).map((x) => <li key={x.slug}><Link to={`/services/${x.slug}`} className="hover:text-white">{x.name}</Link></li>)}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3"><MapPin className="h-4 w-4 shrink-0 text-teal-500" />{s.address}</li>
            <li className="flex gap-3"><Phone className="h-4 w-4 shrink-0 text-teal-500" /><a href={`tel:${s.phone}`} className="hover:text-white">{s.phone}</a></li>
            <li className="flex gap-3"><Mail className="h-4 w-4 shrink-0 text-teal-500" /><a href={`mailto:${s.email}`} className="hover:text-white">{s.email}</a></li>
            <li className="flex gap-3"><Clock className="h-4 w-4 shrink-0 text-teal-500" /><span>{clinicInfo.hours.map((h) => <span key={h.day} className="block">{h.day}: {h.time}</span>)}</span></li>
            <li className="flex gap-3 font-semibold text-white"><Siren className="h-4 w-4 shrink-0 text-red-400" />Emergency: {s.emergencyPhone}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-navy-200/60 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {s.clinicName}. All rights reserved.</p>
          <p>Demo frontend — all data is mock data.</p>
        </div>
      </div>
    </footer>
  );
}
