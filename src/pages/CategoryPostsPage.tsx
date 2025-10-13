import { useParams, Link } from 'react-router-dom';
import { mockPosts } from '@/data/mockData';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PostCard from '@/components/blog/PostCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function CategoryPostsPage() {
  const { slug } = useParams();
  const posts = mockPosts.filter((post) => post.category.slug === slug);
  const categoryName = posts[0]?.category.title || slug;

  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <Header />

      <main className='flex-1 container py-8'>
        <Link to='/posts'>
          <Button variant='ghost' className='mb-6'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to Posts
          </Button>
        </Link>

        <div className='mb-8'>
          <h1 className='text-4xl font-bold mb-2 capitalize'>{categoryName}</h1>
          <p className='text-muted-foreground'>
            {posts.length} {posts.length === 1 ? 'post' : 'posts'} in this
            category
          </p>
        </div>

        {posts.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-muted-foreground'>
              No posts found in this category.
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
