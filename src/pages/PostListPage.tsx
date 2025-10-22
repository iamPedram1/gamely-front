// Components
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PostCard from '@/components/blog/PostCard';
import PaginationControls from '@/components/ui/pagination-controls';

// Utilities
import { usePostsQuery } from '@/utilities/api/post';

export default function PostListPage() {
  // Hooks
  const posts = usePostsQuery({ refetchOnQueryChange: true });

  // Render
  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <Header />
      <main className='flex-1 container py-8'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold mb-2'>Latest Posts</h1>
          <p className='text-muted-foreground'>
            Discover the latest gaming news, reviews, and guides
          </p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {posts.data.docs.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        {posts.data.pagination && (
          <PaginationControls pagination={posts.data.pagination} />
        )}
      </main>
      <Footer />
    </div>
  );
}
