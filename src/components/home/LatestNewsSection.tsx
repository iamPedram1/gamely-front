import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import PostCard from '@/components/blog/PostCard';

// Types
import { PostProps } from '@/types/client/blog';
import { usePostsQuery } from '@/utilities/api/post';

interface LatestNewsSectionProps {}

export default function LatestNewsSection() {
  // Custom Hooks
  const { t } = useTranslation();
  const posts = usePostsQuery();

  // Render
  return (
    <section className='py-16'>
      <div className='container'>
        <div className='flex items-center justify-between mb-10'>
          <div>
            <h2 className='text-2xl md:text-4xl font-black mb-2'>
              <span className='gradient-gaming-text'>
                {t('home.latestNews')}
              </span>
            </h2>
            <p className='text-muted-foreground'>{t('home.stayUpdated')}</p>
          </div>
          <Link to='/posts'>
            <Button variant='ghost' className='group'>
              {t('common.viewAll')}
              <ArrowRight className='h-4 w-4 group-hover:translate-x-1 transition-transform rtl:rotate-180' />
            </Button>
          </Link>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {posts.data.docs.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
