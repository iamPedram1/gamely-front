import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

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

// Utilities
import { useGamesQuery } from '@/utilities/api/game';

export default function GameListPage() {
  // Hooks
  const games = useGamesQuery();

  // Render
  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <Header />
      <main className='flex-1 container py-8'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold mb-2'>Games</h1>
          <p className='text-muted-foreground'>
            Browse all games featured on our blog
          </p>
        </div>

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
                      src={game.coverImage.url}
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
                    {dayjs(game.releaseDate).format('YYYY/MM/DDD-HH:MM')}
                  </span>
                </div>
                <Link to={`/game/${game.slug}`}>
                  <Badge
                    variant='outline'
                    className='hover:bg-accent cursor-pointer'
                  >
                    View Posts
                  </Badge>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        {games.data.pagination && (
          <PaginationControls pagination={games.data.pagination} />
        )}
      </main>

      <Footer />
    </div>
  );
}
