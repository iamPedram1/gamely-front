// Components
// import HeroSection from '@/components/home/HeroSection';
import HeroSection from '@/components/home/HeroSection';
import LatestNewsSection from '@/components/home/LatestNewsSection';
import TrendingGamesSection from '@/components/home/TrendingGamesSection';

// Utilities

export default function HomePage() {
  // Render
  return (
    <main className='min-h-screen flex flex-col bg-background flex-1'>
      {/* Hero Section */}
      <HeroSection />

      {/* Trending Games */}
      <TrendingGamesSection />

      {/* Latest News */}
      <LatestNewsSection />
    </main>
  );
}
