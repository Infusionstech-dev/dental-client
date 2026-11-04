import HeroSection from '../../components/home/HeroSection';
import { BeforeAfterGallery, CtaBand, FaqSection, FeaturePromos, ServicesShowcase, StatsBand, TeamSection, TestimonialsMarquee, WhyChooseUs } from '../../components/home/HomeSections';

export default function Home() {
  return (
    <div className="bg-cream">
      <HeroSection />
      <StatsBand />
      <ServicesShowcase />
      <WhyChooseUs />
      <TeamSection />
      <FeaturePromos />
      <TestimonialsMarquee />
      <BeforeAfterGallery />
      <FaqSection />
      <CtaBand />
    </div>
  );
}
