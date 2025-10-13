import dayjs from 'dayjs';
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
import { usePostQuery } from '@/utilities/api/post';
import { useCommentsQuery } from '@/utilities/api/comment';
import initialPagination from '@/utilities/pagination';
import { useState } from 'react';
import { CommentProps } from '@/types/blog';
import MutateCommentDialog from '@/components/admin/MutateCommentDialog';
import useAuth from '@/hooks/useAuth';

export default function PostDetailPage() {
  // States
  const [commentToEdit, setCommentToEdit] = useState<CommentProps | null>(null);
  const [commentToReply, setCommentToReply] = useState<CommentProps | null>(
    null
  );

  // Hooks
  const { slug } = useParams();
  const post = usePostQuery({ id: slug });
  const comments = useCommentsQuery({
    id: slug,
    enabled: post.isSuccess,
    initialData: { docs: [], pagination: initialPagination },
  });

  // Utilities
  const handleCloseDialog = () => {
    setCommentToEdit(null);
    setCommentToReply(null);
  };

  // Render
  if (!post.data) {
    return (
      <div className='min-h-screen flex flex-col bg-background'>
        <Header />
        <main className='flex-1 container py-8'>
          {post.isFetching && !post.isFetched ? (
            <h1 className='text-center text-4xl font-bold mb-4'>Loading...</h1>
          ) : (
            <>
              <h1 className='text-4xl font-bold mb-4'>Post Not Found</h1>
              <Link to={routes.posts.index}>
                <Button>Back to Posts</Button>
              </Link>
            </>
          )}
        </main>
        <Footer />
      </div>
    );
  }

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
              <Badge variant='secondary'>{post.data.category.title}</Badge>
              {post.data.game && (
                <Badge variant='outline'>{post.data.game.title}</Badge>
              )}
            </div>

            <h1 className='text-4xl md:text-5xl font-bold mb-4'>
              {post.data.title}
            </h1>

            <div className='flex items-center gap-4 text-sm text-muted-foreground mb-6'>
              <div className='flex items-center gap-2'>
                <Avatar className='h-10 w-10'>
                  <AvatarImage
                    src={post.data.author.avatar?.url}
                    alt={post.data.author.name}
                  />
                  <AvatarFallback>{post.data.author.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className='font-medium text-foreground'>
                    {post.data.author.name}
                  </p>
                  <p className='text-xs'>{post.data.author.bio}</p>
                </div>
              </div>
              <Separator orientation='vertical' className='h-10' />
              <div className='flex items-center gap-3'>
                <div className='flex items-center gap-1'>
                  <Calendar className='h-4 w-4' />
                  <span>
                    {dayjs(post.data.createdAt).format('MMMM DD, YYYY')}
                  </span>
                </div>
                <div className='flex items-center gap-1'>
                  <Clock className='h-4 w-4' />
                  <span>{post.data.readingTime} min read</span>
                </div>
              </div>
            </div>
          </div>

          <div className='aspect-video overflow-hidden rounded-lg mb-8'>
            <img
              src={post.data.coverImage.url}
              alt={post.data.title}
              className='w-full h-full object-cover'
            />
          </div>

          <div className='prose prose-lg dark:prose-invert max-w-none mb-8'>
            {post.data.content.split('\n').map((paragraph, index) => (
              <p key={index} className='mb-4 whitespace-pre-wrap'>
                {paragraph}
              </p>
            ))}
          </div>

          <div className='flex flex-wrap gap-2 mb-8'>
            {post.data.tags.map((tag) => (
              <Link key={tag.id} to={`/tag/${tag.slug}`}>
                <Badge variant='outline' className='hover:bg-accent'>
                  #{tag.title}
                </Badge>
              </Link>
            ))}
          </div>

          <Separator className='my-8' />

          <div className='mb-8'>
            <div className='flex justify-between'>
              <h2 className='text-2xl font-bold mb-4'>
                Comments (
                {comments.isSuccess
                  ? comments?.data?.pagination?.totalDocs
                  : 'Loading'}
                )
              </h2>
              <Button className='gradient-gaming'>Add</Button>
            </div>
            {comments.data.docs.length === 0 ? (
              <p className='text-muted-foreground'>
                No comments yet. Be the first to comment!
              </p>
            ) : (
              <div className='space-y-4'>
                {comments.data.docs.map((comment) => (
                  <Card key={comment.id}>
                    <CardHeader>
                      <div className='flex items-center gap-3'>
                        <Avatar>
                          <AvatarImage
                            src={comment.avatar?.url}
                            alt={comment.username}
                          />
                          <AvatarFallback>{comment.username[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className='font-semibold'>{comment.username}</p>
                          <p className='text-xs text-muted-foreground'>
                            {dayjs(comment.createdAt).format(
                              'YYYY/MM/DDD-HH:MM'
                            )}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className='flex flex-col gap-4'>
                      <p className='text-sm'>{comment.content}</p>
                      <Button
                        onClick={() => setCommentToReply(comment)}
                        className='w-fit'
                        variant='secondary'
                      >
                        Reply
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </article>
        {post.data.id && (commentToEdit || commentToReply) && (
          <MutateCommentDialog
            commentToEdit={commentToEdit}
            replyToComment={commentToReply}
            onClose={handleCloseDialog}
            postId={post.data.id}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
