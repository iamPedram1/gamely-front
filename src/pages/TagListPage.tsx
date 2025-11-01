import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Hash } from 'lucide-react';

// Components
import { Badge } from '@/components/ui/badge';
import { TagCardSkeleton } from '@/components/ui/loading-skeleton';
import { InfiniteScrollGrid } from '@/components/ui/infinite-scroll';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  PageLayout,
  PageHeader,
  LoadingState,
} from '@/components/layout/PageLayout';

// Utilities
import routes from '@/utilities/routes';
import { useTagsInfiniteQuery } from '@/utilities/api/tag';

export default function TagListPage() {
  const { t } = useTranslation();
  const tags = useTagsInfiniteQuery();

  const allTags = useMemo(
    () => tags.data?.pages.flatMap((page) => page.docs) || [],
    [tags.data?.pages]
  );

  const emptyState = (
    <div className='text-center py-12'>
      <Hash className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
      <h3 className='text-lg font-semibold mb-2'>{t('tag.noTags')}</h3>
      <p className='text-muted-foreground'>{t('tag.noTagsDescription')}</p>
    </div>
  );

  const loadingState = (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
      {Array.from({ length: 8 }).map((_, i) => (
        <TagCardSkeleton key={i} />
      ))}
    </div>
  );

  if (tags.isLoading) return <LoadingState />;
  return (
    <PageLayout showBack={false}>
      <PageHeader
        title={t('common.tags')}
        description={t('tag.browseByTags')}
        icon={<Hash className='h-8 w-8' />}
      />

      <InfiniteScrollGrid
        data={allTags}
        hasNextPage={tags.hasNextPage || false}
        isFetchingNextPage={tags.isFetchingNextPage}
        fetchNextPage={tags.fetchNextPage}
        renderItem={(tag) => (
          <Link to={`${routes.posts.index}?tag=${tag.slug}`}>
            <Card className='hover:shadow-lg transition-shadow cursor-pointer'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <h3 className='text-lg font-bold'>#{tag.title}</h3>
                  <Badge variant='secondary'>{tag.postsCount}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-muted-foreground'>
                  {tag.postsCount}{' '}
                  {tag.postsCount === 1 ? t('common.post') : t('common.posts')}
                </p>
              </CardContent>
            </Card>
          </Link>
        )}
        emptyState={emptyState}
        loadingState={loadingState}
        columns={{ default: 1, sm: 2, md: 3, lg: 4 }}
      />
    </PageLayout>
  );
}
