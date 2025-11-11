import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';

// Components
import PostCard from '@/components/blog/PostCard';
import { Button } from '@/components/ui/button';

// Utilities
import routes from '@/utilities/routes';
import { usePostsQuery } from '@/utilities/api/post';
import { useCategoryQuery } from '@/utilities/api/category';
import { LoadingState } from '@/components/layout/PageLayout';

export default function CategoryPostsPage() {
  // Hooks
  const { t } = useTranslation();
  const { slug } = useParams();
  const category = useCategoryQuery({ initialParams: slug });
  const posts = usePostsQuery({ queries: { category: category.data.id } });

  if (!category.isFetched || !posts.isFetched) return <LoadingState />;
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
          <h1 className='text-2xl md:text-4xl font-bold mb-2 capitalize'>
            {category.data.title}
          </h1>
          <p className='text-muted-foreground'>
            {posts.data.pagination.totalDocs}{' '}
            {posts.data.pagination.totalDocs === 1
              ? t('common.post')
              : t('common.posts')}{' '}
            {t('common.inThisCategory')}
          </p>
        </div>

        {posts.data.docs.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-muted-foreground'>
              {t('common.noPostsInCategory')}
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {posts.data.docs.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
