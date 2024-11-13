import { AnimatedListDemo } from '@/components/AnimatedNotifs';
import FeatureSection from '@/components/Home/FeatureSection/feature-section';
import HeroSection from '@/components/Home/HeroSection/hero-section';

export default function HomePage() {
  return (
    <div className="relative flex h-full flex-col">
      <HeroSection />
      <div className="absolute right-0 top-0 z-50 hidden xl:block">
        <AnimatedListDemo />
      </div>
      <FeatureSection />
    </div>
  );
}
