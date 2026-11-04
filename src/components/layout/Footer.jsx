import { MapPin, Phone, Mail, Clock, Siren } from 'lucide-react';
import { Logo } from './Navbar';
import { useData } from '../../context/DataContext';
import { clinicInfo } from '../../data/clinic';

// lucide-react no longer ships brand icons, so the logos are inlined here.
const socialIcons = {
  facebook: <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />,
  instagram: (
    <g fill="none" stroke="currentColor" strokeWidth="2.2">
      <rect x="1.5" y="1.5" width="21" height="21" rx="6" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="18" cy="6" r="0.6" fill="currentColor" />
    </g>
  ),
  linkedin: <path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />,
};

export default function Footer() {
  const { siteSettings } = useData();
  return (
    <footer className="bg-navy-900 text-navy-200">
      <div className="container-x grid gap-8 py-10 sm:grid-cols-2">
        <div>
          <Logo light className="w-fit" />
          <p className="mt-4 text-sm leading-relaxed text-navy-200/80">Modern, gentle and transparent dental care for the whole family in the heart of Dhaka.</p>
          <div className="mt-5 flex gap-3 text-sm">
            {Object.entries(clinicInfo.socials).map(([platform, url]) => (
              <a key={platform} href={url} target="_blank" rel="noreferrer" aria-label={platform} className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 hover:text-white">
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">{socialIcons[platform]}</svg>
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-3"><MapPin className="h-4 w-4 shrink-0 text-teal-500" />{siteSettings.address}</li>
            <li className="flex gap-3"><Phone className="h-4 w-4 shrink-0 text-teal-500" /><a href={`tel:${siteSettings.phone}`} className="hover:text-white">{siteSettings.phone}</a></li>
            <li className="flex gap-3"><Mail className="h-4 w-4 shrink-0 text-teal-500" /><a href={`mailto:${siteSettings.email}`} className="hover:text-white">{siteSettings.email}</a></li>
            <li className="flex gap-3"><Clock className="h-4 w-4 shrink-0 text-teal-500" /><span>{clinicInfo.hours.map((entry) => <span key={entry.day} className="block">{entry.day}: {entry.time}</span>)}</span></li>
            <li className="flex gap-3 font-semibold text-white"><Siren className="h-4 w-4 shrink-0 text-red-400" />Emergency: {siteSettings.emergencyPhone}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-4 text-xs text-navy-200/60 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {siteSettings.clinicName}. All rights reserved.</p>
          <p>Demo frontend — all data is mock data.</p>
        </div>
      </div>
    </footer>
  );
}
