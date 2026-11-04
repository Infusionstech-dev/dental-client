import { motion } from 'framer-motion';
import { CalendarCheck, ShieldCheck, Star, Sparkles, ArrowRight } from 'lucide-react';
import Button from '../common/Button';
import Img from '../common/Img';
import heroPhoto from '../../assets/hero-dental.jpg';

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-navy-900">
      <Img src={heroPhoto} alt="" className="absolute inset-0 -z-20 h-full w-full" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-900/95 via-navy-900/75 to-navy-900/10" />
      <div className="container-x relative flex min-h-[560px] items-center py-16 lg:min-h-[640px]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur"><Sparkles className="h-3.5 w-3.5 text-teal-500" />Trusted by 15,000+ patients in Dhaka</span>
          <h1 className="mt-6 text-5xl font-extrabold leading-[1.08] text-white lg:text-7xl">
            Your Smile, <span className="block text-brand-500">Our Priority.</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/85">
            SmileCare Dental combines gentle, experienced dentists with modern digital technology — so every visit is comfortable, transparent and focused on your long-term oral health.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/appointment" variant="solid" size="lg"><CalendarCheck className="h-5 w-5" />Book Appointment</Button>
            <Button to="/services" variant="white" size="lg">Explore Services<ArrowRight className="h-4 w-4" /></Button>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-white/85">
            <div className="flex items-center gap-2"><div className="flex -space-x-2">{[47, 12, 45].map((avatarId) => <img key={avatarId} src={`https://i.pravatar.cc/80?img=${avatarId}`} alt="" className="h-8 w-8 rounded-full border-2 border-white" />)}</div><span><strong className="text-white">4.9/5</strong> from 1,300+ reviews</span></div>
            <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-teal-500" />Hospital-grade sterilization</div>
          </div>
        </motion.div>

        <div className="absolute bottom-16 right-8 hidden w-52 space-y-4 lg:block">
          <div className="rounded-2xl border border-white/20 bg-navy-900/50 p-4 text-white backdrop-blur-md">
            <CalendarCheck className="h-6 w-6" />
            <p className="mt-2 text-sm font-bold">Same-day slots</p>
            <p className="text-xs text-white/75">Open 7 days a week</p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-navy-900/50 p-4 text-white backdrop-blur-md">
            <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
            <p className="mt-2 text-sm font-bold">Painless and professional</p>
          </div>
        </div>
      </div>
    </section>
  );
}
