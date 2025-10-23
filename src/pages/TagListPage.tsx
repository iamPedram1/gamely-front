import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Components
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import PaginationControls from '@/components/ui/pagination-controls';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TagCardSkeleton } from '@/components/ui/loading-skeleton';

// Utilities
import { useTagsQuery } from '@/utilities/api/tag';

export default function TagListPage() {
  const { t } = useTranslation();
  const tags = useTagsQuery();

  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <Header />

      <main className='flex-1 container py-8'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold mb-2'>{t('common.tags')}</h1>
          <p className='text-muted-foreground'>{t('tag.browseByTags')}</p>
        </div>

        {tags.isLoading || tags.isFetching ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {Array.from({ length: 8 }).map((_, i) => (
              <TagCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {tags.data.docs.map((tag) => {
                return (
                  <Link key={tag.id} to={`/tag/${tag.slug}`}>
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
                          {tag.postsCount === 1
                            ? t('common.post')
                            : t('common.posts')}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
            {tags.data.pagination && (
              <PaginationControls pagination={tags.data.pagination} />
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}