import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

// Components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Searchbar from '@/components/ui/searchbar';
import PaginationControls from '@/components/ui/pagination-controls';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MultiSelect } from '@/components/ui/multi-select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Context
import useLoadingStore from '@/store/loading';

// Utilities
import routes from '@/utilities/routes';
import { getDate } from '@/utilities';
import { useDeletePost, usePostsQuery } from '@/utilities/api/management/post';
import { useCategoriesSummariesQuery } from '@/utilities/api/management/category';
import { debounce } from '@/utilities/helperPack';
import { useGamesSummariesQuery } from '@/utilities/api/management/game';

interface FormProps {
  game: string[];
  category: string[];
}

export default function PostsListPage() {
  // Context
  const { t, i18n } = useTranslation();
  const { loading } = useLoadingStore();

  // Hooks
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.getAll('category') ?? [];
  const game = searchParams.getAll('game') ?? [];
  const posts = usePostsQuery({ refetchOnQueryChange: true });
  const deletePost = useDeletePost();
  const games = useGamesSummariesQuery({ placeholderData: [] });
  const categories = useCategoriesSummariesQuery({ placeholderData: [] });
  const disabled = loading || deletePost.isPending;

  const { control } = useForm<FormProps>({
    values: { category, game },
  });

  const categoryOptions = useMemo(
    () =>
      categories.data.map((ctg) => ({
        label: ctg.translations[i18n.language].title,
        value: ctg.id,
      })),
    [categories.data]
  );
  const gameOptions = useMemo(
    () =>
      games.data.map((ctg) => ({
        label: ctg.translations[i18n.language].title,
        value: ctg.id,
      })),
    [games.data]
  );

  const filterByCategory = debounce((ids: string[]) => {
    setSearchParams((sp) => {
      const newSP = new URLSearchParams(sp);
      newSP.delete('page');
      newSP.delete('category');
      ids.forEach((id) => newSP.append('category', id));
      return newSP;
    });
  }, 500);
  const filterByGame = debounce((ids: string[]) => {
    setSearchParams((sp) => {
      const newSP = new URLSearchParams(sp);
      newSP.delete('game');
      newSP.delete('page');
      ids.forEach((id) => newSP.append('game', id));
      return newSP;
    });
  }, 500);

  // Render
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-4xl font-black rtl:flex rtl:flex-row-reverse rtl:gap-2'>
            <span className='gradient-gaming-text'>{t('dashboard.posts')}</span>{' '}
            {t('dashboard.management')}
          </h1>
          <p className='text-muted-foreground mt-2'>
            {t('dashboard.manageAllPosts')}
          </p>
        </div>
        <Link to={routes.dashboard.posts.add}>
          <Button
            disabled={disabled}
            className='gradient-gaming glow-effect hover:glow-effect-strong font-semibold uppercase rtl:flex-row-reverse'
          >
            <Plus className='h-4 w-4 ltr:me-2 rtl:ms-2' />
            {t('dashboard.addPost')}
          </Button>
        </Link>
      </div>

      <Card className='border-primary/20'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-bold'>
              {t('common.allPosts')} ({posts?.data?.pagination?.totalDocs || 0})
            </h2>
            <div className='flex items-center gap-3'>
              <Searchbar placeholder={t('common.searchInPosts')} />
              <Controller
                control={control}
                name='category'
                rules={{ onChange: (e) => filterByCategory(e.target.value) }}
                render={({ field }) => (
                  <MultiSelect
                    selected={field.value}
                    onChange={(value) => field.onChange(value)}
                    options={categoryOptions}
                    className='w-[200px] h-auto'
                    placeholder={t('common.filterByCategory')}
                  />
                )}
              />
              <Controller
                control={control}
                name='game'
                rules={{ onChange: (e) => filterByGame(e.target.value) }}
                render={({ field }) => (
                  <MultiSelect
                    selected={field.value}
                    onChange={(value) => field.onChange(value)}
                    options={gameOptions}
                    className='w-[200px] h-auto'
                    placeholder={t('common.filterByGame')}
                  />
                )}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('post.title')}</TableHead>
                <TableHead className='text-center'>
                  {t('post.category')}
                </TableHead>
                <TableHead className='text-center'>{t('post.game')}</TableHead>
                <TableHead className='text-center'>
                  {t('post.author')}
                </TableHead>
                <TableHead className='text-center'>
                  {t('post.publishedAt')}
                </TableHead>
                <TableHead className='ltr:text-end rtl:text-end'>
                  {t('common.actions')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts?.data?.docs?.map?.((post) => (
                <TableRow key={post.id}>
                  <TableCell className='font-medium max-w-md'>
                    <span className='max-w-80 line-clamp-1'>
                      {post.translations[i18n.language].title}
                    </span>
                  </TableCell>
                  <TableCell className='text-center'>
                    <Link to={routes.dashboard.categories.index}>
                      <Badge
                        variant='secondary'
                        className='bg-primary/10 text-primary'
                      >
                        {post.category.translations[i18n.language].title}
                      </Badge>
                    </Link>
                  </TableCell>
                  <TableCell className='text-center'>
                    {post.game ? (
                      <Link to={routes.dashboard.games.edit(post.game.id)}>
                        <Badge variant='outline'>
                          {post?.game?.translations?.[i18n.language]?.title}
                        </Badge>
                      </Link>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell className='text-center'>
                    {post.author.name}
                  </TableCell>
                  <TableCell className='text-center text-muted-foreground'>
                    {getDate(post.createDate, i18n.language)}
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex items-center justify-end gap-2'>
                      <Button disabled={disabled} variant='ghost' size='icon'>
                        <Eye className='h-4 w-4' />
                      </Button>
                      <Link to={routes.dashboard.posts.edit(post.id)}>
                        <Button disabled={disabled} variant='ghost' size='icon'>
                          <Edit className='h-4 w-4' />
                        </Button>
                      </Link>
                      <Button
                        disabled={disabled}
                        onClick={() => deletePost.mutate(post.id)}
                        variant='ghost'
                        size='icon'
                        className='text-destructive'
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {posts?.data?.pagination && (
            <PaginationControls pagination={posts.data.pagination} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
