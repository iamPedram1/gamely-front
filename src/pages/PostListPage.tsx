import { useTranslation } from 'react-i18next';

// Components
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PostCard from '@/components/blog/PostCard';
import PaginationControls from '@/components/ui/pagination-controls';
import { PostCardSkeleton } from '@/components/ui/loading-skeleton';

// Utilities
import { usePostsQuery } from '@/utilities/api/post';

export default function PostListPage() {
  // Hooks
  const { t, i18n } = useTranslation();
  const posts = usePostsQuery({ refetchOnQueryChange: true });

  // Render
  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <Header />
      <main className='flex-1 container py-8'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold mb-2'>{t('post.latestPosts')}</h1>
          <p className='text-muted-foreground'>{t('post.discoverLatest')}</p>
        </div>

        {posts.isLoading || posts.isFetching ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {Array.from({ length: 6 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {posts.data.docs.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            {posts.data.pagination && (
              <PaginationControls pagination={posts.data.pagination} />
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
