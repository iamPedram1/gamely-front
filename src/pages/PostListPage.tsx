import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText } from 'lucide-react';

// Components
import PostCard from '@/components/blog/PostCard';
import { PostCardSkeleton } from '@/components/ui/loading-skeleton';
import { PageLayout, PageHeader, LoadingState } from '@/components/layout/PageLayout';
import { InfiniteScrollGrid } from '@/components/ui/infinite-scroll';

// Utilities
import { usePostsInfiniteQuery } from '@/utilities/api/post';

export default function PostListPage() {
  // Hooks
  const { t } = useTranslation();
  const posts = usePostsInfiniteQuery();

  const allPosts = useMemo(
    () => posts.data?.pages.flatMap((page) => page.docs) || [],
    [posts.data?.pages]
  );

  const emptyState = (
    <div className='text-center py-12 px-4'>
      <FileText className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
      <h3 className='text-base md:text-lg font-semibold mb-2'>{t('post.noPosts')}</h3>
      <p className='text-sm md:text-base text-muted-foreground'>{t('post.noPostsDescription')}</p>
    </div>
  );

  const loadingState = (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
      {Array.from({ length: 6 }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );

  if (posts.isLoading) {
    return <LoadingState />;
  }

  return (
    <PageLayout showBack={false} className='flex-1 container py-4 md:py-8 px-4'>
      <PageHeader
        title={t('post.latestPosts')}
        description={t('post.discoverLatest')}
        icon={<FileText className='h-6 w-6 md:h-8 md:w-8' />}
        className='mb-6 md:mb-8'
      />

      <InfiniteScrollGrid
        data={allPosts}
        hasNextPage={posts.hasNextPage || false}
        isFetchingNextPage={posts.isFetchingNextPage}
        fetchNextPage={posts.fetchNextPage}
        renderItem={(post) => <PostCard post={post} />}
        emptyState={emptyState}
        loadingState={loadingState}
        columns={{ default: 1, md: 2, lg: 3 }}
      />
    </PageLayout>
  );
}