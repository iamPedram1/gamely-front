import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Components
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import PaginationControls from '@/components/ui/pagination-controls';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { GameCardSkeleton } from '@/components/ui/loading-skeleton';

// Icon Components
import { Calendar } from 'lucide-react';

// Utilities
import { useGamesQuery } from '@/utilities/api/game';
import { getDate } from '@/utilities';

export default function GameListPage() {
  // Hooks
  const { t, i18n } = useTranslation();
  const games = useGamesQuery();

  // Render
  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <Header />
      <main className='flex-1 container py-8'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold mb-2'>{t('common.games')}</h1>
          <p className='text-muted-foreground'>{t('game.browseAllGames')}</p>
        </div>

        {games.isFetching ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {Array.from({ length: 6 }).map((_, i) => (
              <GameCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {games.data.docs.map((game) => (
                <Card
                  key={game.id}
                  className='overflow-hidden hover:shadow-lg transition-shadow'
                >
                  <Link to={`/game/${game.slug}`}>
                    <div className='aspect-video overflow-hidden'>
                      {game.coverImage && (
                        <img
                          alt={game.title}
                          src={game.coverImage.url || '/placeholder.svg'}
                          className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
                        />
                      )}
                    </div>
                  </Link>

                  <CardHeader>
                    <Link to={`/game/${game.slug}`}>
                      <h3 className='text-xl font-bold hover:text-primary transition-colors'>
                        {game.title}
                      </h3>
                    </Link>
                  </CardHeader>

                  <CardContent>
                    <p className='text-muted-foreground'>{game.description}</p>
                  </CardContent>

                  <CardFooter className='flex items-center justify-between'>
                    <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                      <Calendar className='h-4 w-4' />
                      <span>
                        {getDate(game.releaseDate, i18n.language, 'YYYY/MM/DD')}
                      </span>
                    </div>
                    <Link to={`/game/${game.slug}`}>
                      <Badge
                        variant='outline'
                        className='hover:bg-accent cursor-pointer'
                      >
                        {t('game.viewPosts')}
                      </Badge>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
            {games.data.pagination && (
              <PaginationControls pagination={games.data.pagination} />
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
