import FeatureSection from '@/components/Home/FeatureSection/feature-section';
import HeroSection from '@/components/Home/HeroSection/hero-section';

export default function HomePage() {
  return (
    <div className="h-full flex-col">
      <HeroSection />
      <FeatureSection />
    </div>
  );
}
