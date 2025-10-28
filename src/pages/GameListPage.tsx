import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Components
import { Badge } from '@/components/ui/badge';
import PaginationControls from '@/components/ui/pagination-controls';
import { GameCardSkeleton } from '@/components/ui/loading-skeleton';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';

// Utilities
import routes from '@/utilities/routes';
import { getDate } from '@/utilities';
import { useGamesQuery } from '@/utilities/api/game';

export default function GameListPage() {
  // Hooks
  const games = useGamesQuery();
  const { t } = useTranslation();

  // Render
  return (
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
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {games.data.docs.map((game) => (
              <Card
                key={game.id}
                className='w-[300px] flex flex-col gap-2 overflow-hidden hover:shadow-lg transition-all'
              >
                <Link
                  to={`${routes.posts.index}?game=${game.slug}`}
                  className='block relative group'
                >
                  <div className='relative w-[300px] h-[285px] overflow-hidden bg-muted group'>
                    {game.coverImage ? (
                      <img
                        alt={game.title}
                        src={game.coverImage.url || '/placeholder.svg'}
                        className='w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105'
                      />
                    ) : (
                      <div className='flex items-center justify-center h-full text-muted-foreground text-sm'>
                        No image available
                      </div>
                    )}
                  </div>
                </Link>

                <CardHeader className='!py-0'>
                  <Link to={`/game/${game.slug}`}>
                    <h3 className='text-xl font-bold hover:text-primary transition-colors line-clamp-1'>
                      {game.title}
                    </h3>
                  </Link>
                </CardHeader>

                <CardContent className='!py-0'>
                  <p className='text-muted-foreground line-clamp-3'>
                    {game.description}
                  </p>
                </CardContent>

                <CardFooter className='flex items-center justify-between'>
                  <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                    <Calendar className='h-4 w-4' />
                    <span>{getDate(game.releaseDate, 'YYYY/MM/DD')}</span>
                  </div>
                  <Link to={`${routes.posts.index}?game=${game.slug}`}>
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
  );
}
