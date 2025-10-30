import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, TrendingUp, Zap, Trophy } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Utilities
import routes from '@/utilities/routes';
import { mockPosts, mockGames } from '@/data/mockData';

interface HeroSectionProps {
  featuredPost: any; // Replace with proper type
}

export default function HeroSection({ featuredPost }: HeroSectionProps) {
  // Custom Hooks
  const { t } = useTranslation();

  return (
    <section className='relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background'>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&q=80')] opacity-5 bg-cover bg-center" />
      <div className='container relative py-20 md:py-32'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
          <div className='space-y-8'>
            <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20'>
              <Zap className='h-4 w-4 text-primary' />
              <span className='text-sm font-semibold text-primary uppercase tracking-wide'>
                {t('home.latestGamingNews')}
              </span>
            </div>

            <h1 className='text-5xl flex flex-col rtl:flex-col-reverse md:text-7xl font-black leading-tight'>
              {t('home.levelUpYour')}
              <span className='block gradient-gaming-text text-glow'>
                {t('home.gamingExperience')}
              </span>
            </h1>

            <p className='text-xl text-muted-foreground leading-relaxed'>
              {t('home.heroDescription')}
            </p>

            <div className='flex flex-wrap gap-4'>
              <Link to={routes.posts.index}>
                <Button
                  size='lg'
                  className='gradient-gaming flex font-bold uppercase tracking-wide glow-effect hover:glow-effect-strong text-lg px-8 py-6'
                >
                  {t('home.exploreNews')}
                  <ArrowRight className='h-5 w-5 rtl:rotate-180' />
                </Button>
              </Link>
              <Link to={routes.games.index}>
                <Button
                  size='lg'
                  variant='outline'
                  className='border-2 border-primary/50 hover:bg-primary/10 font-bold uppercase tracking-wide text-lg px-8 py-6'
                >
                  {t('home.browseGames')}
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
                    {t('home.articles')}
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
                    {t('home.games')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className='relative'>
            <div className='absolute -inset-4 bg-gradient-gaming opacity-20 blur-3xl rounded-3xl' />
            <Link to={`/posts/${featuredPost.slug}`}>
              <div className='relative aspect-[4/5] rounded-2xl overflow-hidden border-2 border-primary/20 glow-effect hover:glow-effect-strong transition-all group'>
                <img
                  src={featuredPost.coverImage?.url || '/placeholder.svg'}
                  alt={featuredPost.title}
                  className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />
                <div className='absolute bottom-0 left-0 right-0 p-6 space-y-3'>
                  <Badge className='gradient-gaming font-semibold'>
                    {t('home.featured')}
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
  );
}
