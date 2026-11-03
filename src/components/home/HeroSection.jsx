import { motion } from 'framer-motion';
import { CalendarCheck, ShieldCheck, Star, Sparkles, ArrowRight } from 'lucide-react';
import Button from '../common/Button';
import Img from '../common/Img';
import { images } from '../../data/clinic';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/80 via-white to-white">
      <div className="absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-teal-100/40 blur-3xl" />
      <div className="container-x relative grid items-center gap-12 py-14 md:py-20 lg:grid-cols-2 lg:py-24">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="eyebrow"><Sparkles className="h-3.5 w-3.5" />Trusted by 15,000+ patients in Dhaka</span>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl">
            Your Smile, <span className="text-brand-600">Our Priority.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-500">
            SmileCare Dental combines gentle, experienced dentists with modern digital technology — so every visit is comfortable, transparent and focused on your long-term oral health.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/appointment" size="lg"><CalendarCheck className="h-5 w-5" />Book Appointment</Button>
            <Button to="/services" variant="outline" size="lg">Explore Services<ArrowRight className="h-4 w-4" /></Button>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-navy-500">
            <div className="flex items-center gap-2"><div className="flex -space-x-2">{[47, 12, 45].map((i) => <img key={i} src={`https://i.pravatar.cc/80?img=${i}`} alt="" className="h-8 w-8 rounded-full border-2 border-white" />)}</div><span><strong className="text-navy-900">4.9/5</strong> from 1,300+ reviews</span></div>
            <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-teal-500" />Hospital-grade sterilization</div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }} className="relative">
          <div className="overflow-hidden rounded-[2rem] shadow-lift">
            <Img src={images.hero} alt="Dentist treating a smiling patient" className="aspect-[4/4.2] w-full sm:aspect-[4/3.4] lg:aspect-[4/4.4]" />
          </div>
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 5 }} className="absolute -left-4 bottom-10 hidden rounded-2xl bg-white p-4 shadow-lift sm:block">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600"><CalendarCheck className="h-5 w-5" /></span>
              <div><p className="text-sm font-bold text-navy-900">Same-day slots</p><p className="text-xs text-navy-500">Open 7 days a week</p></div>
            </div>
          </motion.div>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 6 }} className="absolute -right-3 top-8 hidden rounded-2xl bg-white p-4 shadow-lift sm:block">
            <div className="flex items-center gap-1">{[1, 2, 3, 4, 5].map((i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</div>
            <p className="mt-1 text-xs text-navy-500">“Painless and professional!”</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
