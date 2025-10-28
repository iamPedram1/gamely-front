import { useTranslation } from 'react-i18next';

// Components
import HeroSection from '@/components/home/HeroSection';
import LatestNewsSection from '@/components/home/LatestNewsSection';
import TrendingGamesSection from '@/components/home/TrendingGamesSection';

// Utilities
import { mockPosts, mockGames } from '@/data/mockData';

export default function HomePage() {
  // Data preparation
  const featuredPost = mockPosts[0];
  const recentPosts = mockPosts.slice(1);

  // Render
  return (
    <main className='min-h-screen flex flex-col bg-background flex-1'>
      {/* Hero Section */}
      <HeroSection featuredPost={featuredPost} />

      {/* Trending Games */}
      <TrendingGamesSection games={mockGames} />

      {/* Latest News */}
      <LatestNewsSection posts={recentPosts} />
    </main>
  );
}
