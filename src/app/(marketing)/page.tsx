
import HeroSection from '@/components/sections/hero-section';
import HighlightsSection from '@/components/sections/highlights-section';
import AnimatedStats from '@/components/sections/animated-stats';
import ProductsPreview from '@/components/sections/products-preview';

export default function HomePage() {
  return (
    <div className="space-y-12 md:space-y-20 lg:space-y-24">
      <HeroSection />
      <HighlightsSection />
      <AnimatedStats />
      <ProductsPreview />
    </div>
  );
}
