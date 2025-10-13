import { Link } from 'react-router-dom';
import { mockGames } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus, Edit, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useDeleteGame, useGamesQuery } from '@/utilities/api/game';

export default function GamesListPage() {
  // Hooks
  const games = useGamesQuery();
  const { mutate: deleteGame } = useDeleteGame();

  // Utilities
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Render
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-4xl font-black'>
            <span className='gradient-gaming-text'>Games</span> Management
          </h1>
          <p className='text-muted-foreground mt-2'>Manage all games</p>
        </div>
        <Link to='/dashboard/games/add'>
          <Button className='gradient-gaming glow-effect hover:glow-effect-strong font-semibold uppercase'>
            <Plus className='h-4 w-4 mr-2' />
            Add Game
          </Button>
        </Link>
      </div>

      <Card className='border-primary/20'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-bold'>
              All Games ({games.data.pagination.totalDocs})
            </h2>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Game</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Release Date</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {games.data.docs.map((game) => (
                <TableRow key={game.id}>
                  <TableCell className='font-medium'>
                    <div className='flex items-center gap-3'>
                      {game.coverImage && (
                        <img
                          src={game.coverImage.url}
                          alt={game.title}
                          className='w-16 h-16 object-cover rounded'
                        />
                      )}
                      <span>{game.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className='max-w-md'>
                    <span className='line-clamp-2 text-muted-foreground'>
                      {game.description}
                    </span>
                  </TableCell>
                  <TableCell className='text-muted-foreground'>
                    {formatDate(game.releaseDate)}
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex items-center justify-end gap-2'>
                      <Link to={`/dashboard/games/${game.id}`}>
                        <Button variant='ghost' size='icon'>
                          <Edit className='h-4 w-4' />
                        </Button>
                      </Link>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='text-destructive'
                        onClick={() => deleteGame(game.id)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
