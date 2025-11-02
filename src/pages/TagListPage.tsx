import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Hash } from 'lucide-react';

// Components
import { Badge } from '@/components/ui/badge';
import { TagCardSkeleton } from '@/components/ui/loading-skeleton';
import { PageLayout, PageHeader, LoadingState } from '@/components/layout/PageLayout';
import { InfiniteScrollGrid } from '@/components/ui/infinite-scroll';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

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
    <div className='text-center py-12 px-4'>
      <Hash className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
      <h3 className='text-base md:text-lg font-semibold mb-2'>{t('tag.noTags')}</h3>
      <p className='text-sm md:text-base text-muted-foreground'>{t('tag.noTagsDescription')}</p>
    </div>
  );

  const loadingState = (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
      {Array.from({ length: 8 }).map((_, i) => (
        <TagCardSkeleton key={i} />
      ))}
    </div>
  );

  if (tags.isLoading) {
    return <LoadingState />;
  }

  return (
    <PageLayout showBack={false} className='flex-1 container py-4 md:py-8 px-4'>
      <PageHeader
        title={t('common.tags')}
        description={t('tag.browseByTags')}
        icon={<Hash className='h-6 w-6 md:h-8 md:w-8' />}
        className='mb-6 md:mb-8'
      />

      <InfiniteScrollGrid
        data={allTags}
        hasNextPage={tags.hasNextPage || false}
        isFetchingNextPage={tags.isFetchingNextPage}
        fetchNextPage={tags.fetchNextPage}
        renderItem={(tag) => (
          <Link to={`${routes.posts.index}?tag=${tag.slug}`}>
            <Card className='hover:shadow-lg transition-shadow cursor-pointer h-full'>
              <CardHeader className='p-3 md:p-4'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-sm md:text-base lg:text-lg font-bold truncate'>#{tag.title}</h3>
                  <Badge variant='secondary' className='text-xs md:text-sm'>{tag.postsCount}</Badge>
                </div>
              </CardHeader>
              <CardContent className='p-3 md:p-4 pt-0'>
                <p className='text-xs md:text-sm text-muted-foreground'>
                  {tag.postsCount}{' '}
                  {tag.postsCount === 1
                    ? t('common.post')
                    : t('common.posts')}
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