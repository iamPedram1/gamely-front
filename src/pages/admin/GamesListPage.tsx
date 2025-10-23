import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2 } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import PaginationControls from '@/components/ui/pagination-controls';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Searchbar from '@/components/ui/searchbar';

// Context
import useLoadingStore from '@/store/loading';

// Custom Utilities
import routes from '@/utilities/routes';
import { useDeleteGame, useGamesQuery } from '@/utilities/api/game';

export default function GamesListPage() {
  // Context
  const { loading } = useLoadingStore();

  // Hooks
  const { t } = useTranslation();
  const games = useGamesQuery();
  const deleteGame = useDeleteGame();
  const disabled = loading || deleteGame.isPending;
  console.log(games);

  // Render
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-4xl font-black rtl:flex rtl:flex-row-reverse rtl:gap-2'>
            <span className='gradient-gaming-text'>{t('dashboard.games')}</span>{' '}
            {t('dashboard.management')}
          </h1>
          <p className='text-muted-foreground mt-2'>
            {t('dashboard.manageAllGames')}
          </p>
        </div>
        <Link to={routes.dashboard.games.add}>
          <Button
            disabled={disabled}
            className='gradient-gaming glow-effect hover:glow-effect-strong font-semibold uppercase rtl:flex-row-reverse'
          >
            <Plus className='h-4 w-4 me-2' />
            {t('dashboard.addGame')}
          </Button>
        </Link>
      </div>

      <Card className='border-primary/20'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-bold'>
              {t('dashboard.allGames')} (
              {games?.data?.pagination?.totalDocs || 0})
            </h2>
            <div className='flex items-center gap-3'>
              <Searchbar placeholder={t('common.searchInGames')} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('game.gameTitle')}</TableHead>
                <TableHead>{t('common.description')}</TableHead>
                <TableHead>{t('common.releaseDate')}</TableHead>
                <TableHead className='text-right'>
                  {t('common.actions')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {games.data.docs.map((game) => (
                <TableRow key={game.id}>
                  <TableCell className='font-medium'>
                    <div className='flex items-center gap-3'>
                      {game.coverImage && (
                        <img
                          src={game.coverImage.url || '/placeholder.svg'}
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
                    {dayjs(game.releaseDate).format('MMMM DD, YYYY')}
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex items-center justify-end gap-2'>
                      <Link to={routes.dashboard.games.edit(game.id)}>
                        <Button disabled={disabled} variant='ghost' size='icon'>
                          <Edit className='h-4 w-4' />
                        </Button>
                      </Link>
                      <Button
                        disabled={disabled}
                        variant='ghost'
                        size='icon'
                        className='text-destructive'
                        onClick={() => deleteGame.mutate(game.id)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {games.data.pagination && (
            <PaginationControls pagination={games.data.pagination} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
