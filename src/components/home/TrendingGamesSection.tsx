import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Types
import { GameProps } from '@/types/client/blog';

interface TrendingGamesSectionProps {
  games: GameProps[];
}

export default function TrendingGamesSection({
  games,
}: TrendingGamesSectionProps) {
  // Custom Hooks
  const { t } = useTranslation();

  return (
    <section className='py-16 bg-accent/30'>
      <div className='container'>
        <div className='flex items-center justify-between mb-10'>
          <div>
            <h2 className='text-2xl md:text-4xl font-black mb-2'>
              <span className='gradient-gaming-text'>
                {t('home.trendingGames')}
              </span>
            </h2>
            <p className='text-muted-foreground'>
              {t('home.mostPopularTitles')}
            </p>
          </div>
          <Link to='/games'>
            <Button variant='ghost' className='group'>
              {t('common.viewAll')}
              <ArrowRight className='h-4 w-4 group-hover:translate-x-1 transition-transform rtl:rotate-180' />
            </Button>
          </Link>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {games.map((game, index) => (
            <Link key={game.id} to={`/game/${game.slug}`}>
              <div className='group relative aspect-[3/4] rounded-xl overflow-hidden border border-primary/20 hover:border-primary/50 transition-all glow-effect hover:glow-effect-strong'>
                <img
                  src={game.coverImage?.url || '/placeholder.svg'}
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
  );
}
