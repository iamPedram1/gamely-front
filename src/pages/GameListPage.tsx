import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Gamepad2 } from 'lucide-react';

// Components
import { Badge } from '@/components/ui/badge';
import { GameCardSkeleton } from '@/components/ui/loading-skeleton';
import {
  PageLayout,
  PageHeader,
  LoadingState,
} from '@/components/layout/PageLayout';
import { InfiniteScrollGrid } from '@/components/ui/infinite-scroll';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';

// Utilities
import routes from '@/utilities/routes';
import { getDate } from '@/utilities';
import { useGamesInfiniteQuery } from '@/utilities/api/game';

export default function GameListPage() {
  // Hooks
  const { t } = useTranslation();
  const games = useGamesInfiniteQuery();

  const allGames = useMemo(
    () => games.data?.pages.flatMap((page) => page.docs) || [],
    [games.data?.pages]
  );

  const emptyState = (
    <div className='text-center py-12'>
      <Gamepad2 className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
      <h3 className='text-lg font-semibold mb-2'>{t('game.noGames')}</h3>
      <p className='text-muted-foreground'>{t('game.noGamesDescription')}</p>
    </div>
  );

  const loadingState = (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {Array.from({ length: 6 }).map((_, i) => (
        <GameCardSkeleton key={i} />
      ))}
    </div>
  );

  if (games.isLoading) return <LoadingState />;
  return (
    <PageLayout showBack={false}>
      <PageHeader
        title={t('common.games')}
        description={t('game.browseAllGames')}
        icon={<Gamepad2 className='h-8 w-8' />}
      />

      <InfiniteScrollGrid
        data={allGames}
        hasNextPage={games.hasNextPage || false}
        isFetchingNextPage={games.isFetchingNextPage}
        fetchNextPage={games.fetchNextPage}
        renderItem={(game) => (
          <Card className='w-full flex flex-col gap-2 overflow-hidden hover:shadow-lg transition-all'>
            <Link
              to={`${routes.posts.index}?game=${game.slug}`}
              className='block relative group'
            >
              <div className='relative w-full h-[285px] overflow-hidden bg-muted group'>
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
              <Link to={routes.games.details(game.slug)}>
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
        )}
        emptyState={emptyState}
        loadingState={loadingState}
        columns={{ default: 1, sm: 2, lg: 3 }}
      />
    </PageLayout>
  );
}
