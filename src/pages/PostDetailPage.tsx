import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';

// Components
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Utilities
import routes from '@/utilities/routes';
import { mockPosts } from '@/data/mockData';

export default function PostDetailPage() {
  const { slug } = useParams();
  const post = mockPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className='min-h-screen flex flex-col bg-background'>
        <Header />
        <main className='flex-1 container py-8'>
          <div className='text-center'>
            <h1 className='text-4xl font-bold mb-4'>Post Not Found</h1>
            <Link to={routes.posts.index}>
              <Button>Back to Posts</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const readingTime = Math.ceil(post.content.split(' ').length / 200);

  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <Header />

      <main className='flex-1 container py-8'>
        <Link to={routes.posts.index}>
          <Button variant='ghost' className='mb-6'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to Posts
          </Button>
        </Link>

        <article className='max-w-4xl mx-auto'>
          <div className='mb-6'>
            <div className='flex items-center gap-2 mb-4'>
              <Badge variant='secondary'>{post.category.title}</Badge>
              <Badge variant='outline'>{post.game.title}</Badge>
            </div>

            <h1 className='text-4xl md:text-5xl font-bold mb-4'>
              {post.title}
            </h1>

            <div className='flex items-center gap-4 text-sm text-muted-foreground mb-6'>
              <div className='flex items-center gap-2'>
                <Avatar className='h-10 w-10'>
                  <AvatarImage
                    src={post.creator.avatar.url}
                    alt={post.creator.name}
                  />
                  <AvatarFallback>{post.creator.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className='font-medium text-foreground'>
                    {post.creator.name}
                  </p>
                  <p className='text-xs'>{post.creator.bio}</p>
                </div>
              </div>

              <Separator orientation='vertical' className='h-10' />

              <div className='flex items-center gap-3'>
                <div className='flex items-center gap-1'>
                  <Calendar className='h-4 w-4' />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
                <div className='flex items-center gap-1'>
                  <Clock className='h-4 w-4' />
                  <span>{readingTime} min read</span>
                </div>
              </div>
            </div>
          </div>

          <div className='aspect-video overflow-hidden rounded-lg mb-8'>
            <img
              src={post.coverImage.url}
              alt={post.title}
              className='w-full h-full object-cover'
            />
          </div>

          <div className='prose prose-lg dark:prose-invert max-w-none mb-8'>
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index} className='mb-4 whitespace-pre-wrap'>
                {paragraph}
              </p>
            ))}
          </div>

          <div className='flex flex-wrap gap-2 mb-8'>
            {post.tags.map((tag) => (
              <Link key={tag.id} to={`/tag/${tag.slug}`}>
                <Badge variant='outline' className='hover:bg-accent'>
                  #{tag.title}
                </Badge>
              </Link>
            ))}
          </div>

          <Separator className='my-8' />

          <div className='mb-8'>
            <h2 className='text-2xl font-bold mb-4'>
              Comments ({post.comments.length})
            </h2>

            {post.comments.length === 0 ? (
              <p className='text-muted-foreground'>
                No comments yet. Be the first to comment!
              </p>
            ) : (
              <div className='space-y-4'>
                {post.comments.map((comment) => (
                  <Card key={comment.id}>
                    <CardHeader>
                      <div className='flex items-center gap-3'>
                        <Avatar>
                          <AvatarImage
                            src={comment.avatar.url}
                            alt={comment.author}
                          />
                          <AvatarFallback>{comment.author[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className='font-semibold'>{comment.author}</p>
                          <p className='text-xs text-muted-foreground'>
                            {formatDate(comment.createdAt)}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className='text-sm'>{comment.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
