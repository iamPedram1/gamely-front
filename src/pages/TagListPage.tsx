import { Link } from 'react-router-dom';

// Components
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// Utilities
import { useTagsSummariesQuery } from '@/utilities/api/tag';

export default function TagListPage() {
  const tags = useTagsSummariesQuery();

  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <Header />

      <main className='flex-1 container py-8'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold mb-2'>Tags</h1>
          <p className='text-muted-foreground'>Browse posts by tags</p>
        </div>

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
                      {tag.postsCount} {tag.postsCount === 1 ? 'post' : 'posts'}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
