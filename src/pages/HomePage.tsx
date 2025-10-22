import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Zap, Trophy } from 'lucide-react';
import { mockPosts, mockGames } from '@/data/mockData';

// Components
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PostCard from '@/components/blog/PostCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Utilities
import routes from '@/utilities/routes';

export default function HomePage() {
  const featuredPost = mockPosts[0];
  const recentPosts = mockPosts.slice(1);

  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <Header />

      <main className='flex-1'>
        {/* Hero Section */}
        <section className='relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background'>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&q=80')] opacity-5 bg-cover bg-center" />
          <div className='container relative py-20 md:py-32'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
              <div className='space-y-8'>
                <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20'>
                  <Zap className='h-4 w-4 text-primary' />
                  <span className='text-sm font-semibold text-primary uppercase tracking-wide'>
                    Latest Gaming News
                  </span>
                </div>

                <h1 className='text-5xl md:text-7xl font-black leading-tight'>
                  Level Up Your
                  <span className='block gradient-gaming-text text-glow'>
                    Gaming Experience
                  </span>
                </h1>

                <p className='text-xl text-muted-foreground leading-relaxed'>
                  Dive into the ultimate gaming hub with exclusive reviews,
                  breaking news, and expert guides for the hottest titles.
                </p>

                <div className='flex flex-wrap gap-4'>
                  <Link to={routes.posts.index}>
                    <Button
                      size='lg'
                      className='gradient-gaming font-bold uppercase tracking-wide glow-effect hover:glow-effect-strong text-lg px-8 py-6'
                    >
                      Explore News
                      <ArrowRight className='ml-2 h-5 w-5' />
                    </Button>
                  </Link>
                  <Link to={routes.games.index}>
                    <Button
                      size='lg'
                      variant='outline'
                      className='border-2 border-primary/50 hover:bg-primary/10 font-bold uppercase tracking-wide text-lg px-8 py-6'
                    >
                      Browse Games
                    </Button>
                  </Link>
                </div>

                <div className='flex items-center gap-8 pt-4'>
                  <div className='flex items-center gap-2'>
                    <div className='p-2 rounded-lg bg-primary/10'>
                      <TrendingUp className='h-5 w-5 text-primary' />
                    </div>
                    <div>
                      <p className='text-2xl font-bold'>{mockPosts.length}+</p>
                      <p className='text-xs text-muted-foreground uppercase'>
                        Articles
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='p-2 rounded-lg bg-primary/10'>
                      <Trophy className='h-5 w-5 text-primary' />
                    </div>
                    <div>
                      <p className='text-2xl font-bold'>{mockGames.length}+</p>
                      <p className='text-xs text-muted-foreground uppercase'>
                        Games
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className='relative'>
                <div className='absolute -inset-4 bg-gradient-gaming opacity-20 blur-3xl rounded-3xl' />
                <Link to={`/post/${featuredPost.slug}`}>
                  <div className='relative aspect-[4/5] rounded-2xl overflow-hidden border-2 border-primary/20 glow-effect hover:glow-effect-strong transition-all group'>
                    <img
                      src={featuredPost.coverImage.url}
                      alt={featuredPost.title}
                      className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />
                    <div className='absolute bottom-0 left-0 right-0 p-6 space-y-3'>
                      <Badge className='gradient-gaming font-semibold'>
                        Featured
                      </Badge>
                      <h3 className='text-2xl font-bold text-white line-clamp-2'>
                        {featuredPost.title}
                      </h3>
                      <p className='text-sm text-gray-300 line-clamp-2'>
                        {featuredPost.abstract}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Trending Games */}
        <section className='py-16 bg-accent/30'>
          <div className='container'>
            <div className='flex items-center justify-between mb-10'>
              <div>
                <h2 className='text-4xl font-black mb-2'>
                  <span className='gradient-gaming-text'>Trending</span> Games
                </h2>
                <p className='text-muted-foreground'>
                  Most popular titles right now
                </p>
              </div>
              <Link to='/games'>
                <Button variant='ghost' className='group'>
                  View All
                  <ArrowRight className='ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform' />
                </Button>
              </Link>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {mockGames.map((game, index) => (
                <Link key={game.id} to={`/game/${game.slug}`}>
                  <div className='group relative aspect-[3/4] rounded-xl overflow-hidden border border-primary/20 hover:border-primary/50 transition-all glow-effect hover:glow-effect-strong'>
                    <img
                      src={game.coverImage.url}
                      alt={game.title}
                      className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity' />
                    <div className='absolute top-4 left-4'>
                      <Badge className='gradient-gaming font-bold text-lg px-3 py-1'>
                        #{index + 1}
                      </Badge>
                    </div>
                    <div className='absolute bottom-0 left-0 right-0 p-6 space-y-2'>
                      <h3 className='text-2xl font-bold text-white'>
                        {game.title}
                      </h3>
                      <p className='text-sm text-gray-300 line-clamp-2'>
                        {game.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Latest News */}
        <section className='py-16'>
          <div className='container'>
            <div className='flex items-center justify-between mb-10'>
              <div>
                <h2 className='text-4xl font-black mb-2'>
                  Latest <span className='gradient-gaming-text'>News</span>
                </h2>
                <p className='text-muted-foreground'>
                  Stay updated with the gaming world
                </p>
              </div>
              <Link to='/posts'>
                <Button variant='ghost' className='group'>
                  View All
                  <ArrowRight className='ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform' />
                </Button>
              </Link>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              {recentPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
