import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';

// Components
import PostCard from '@/components/blog/PostCard';
import { Button } from '@/components/ui/button';

// Utilities
import routes from '@/utilities/routes';
import { mockPosts } from '@/data/mockData';

export default function CategoryPostsPage() {
  // Hooks
  const { t, i18n } = useTranslation();
  const { slug } = useParams();
  const posts = mockPosts.filter((post) => post.category.slug === slug);
  const categoryName = posts[0]?.category.title || slug;

  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <main className='flex-1 container py-8'>
        <Link to={routes.posts.index}>
          <Button variant='ghost' className='mb-6 rtl:flex-row-reverse'>
            <ArrowLeft className='h-4 w-4 rtl:rotate-180' />
            {t('common.backToPosts')}
          </Button>
        </Link>

        <div className='mb-8'>
          <h1 className='text-4xl font-bold mb-2 capitalize'>{categoryName}</h1>
          <p className='text-muted-foreground'>
            {posts.length}{' '}
            {posts.length === 1 ? t('common.post') : t('common.posts')}{' '}
            {t('common.inThisCategory')}
          </p>
        </div>

        {posts.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-muted-foreground'>
              {t('common.noPostsInCategory')}
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
    </div>
  );
}
