import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';

// Hooks
import useAuth from '@/hooks/useAuth';
import { useBoolean } from '@/hooks/state';

// Components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Comment from '@/components/blog/Comment';
import MutateCommentDialog from '@/components/admin/MutateCommentDialog';

// Utilities
import routes from '@/utilities/routes';
import { getDate } from '@/utilities';
import { setAlertState } from '@/store/alert';
import { usePostQuery } from '@/utilities/api/post';
import { useCommentsQuery } from '@/utilities/api/comment';

// Types
import type { CommentProps } from '@/types/blog';

export default function PostDetailPage() {
  // States
  const addComment = useBoolean();
  const [commentToEdit, setCommentToEdit] = useState<CommentProps | null>(null);
  const [commentToReply, setCommentToReply] = useState<CommentProps | null>(
    null
  );

  // Hooks
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const { isAuthorized } = useAuth();
  const post = usePostQuery({
    initialParams: slug,
    onFetch: (data) => comments.onChangeParams(data.id),
  });
  const comments = useCommentsQuery({
    enabled: false,
    initialParams: null,
  });

  // Utilities
  const handleOpenAddCommentDialog = () => {
    if (!isAuthorized) return setAlertState(t('common.loginForAction'));
    addComment.setTrue();
  };

  const handleCloseDialog = () => {
    setCommentToEdit(null);
    setCommentToReply(null);
    addComment.setFalse();
  };

  // Render
  if (!post.data) {
    return (
      <main className='min-h-screen flex flex-col bg-background flex-1 container py-8'>
        {post.isFetching && !post.isFetched ? (
          <h1 className='text-center text-4xl font-bold mb-4'>
            {t('common.loading')}
          </h1>
        ) : (
          <>
            <h1 className='text-4xl font-bold mb-4'>
              {t('post.postNotFound')}
            </h1>
            <Link to={routes.posts.index}>
              <Button>{t('common.backToPosts')}</Button>
            </Link>
          </>
        )}
      </main>
    );
  }

  return (
    <main className='min-h-screen flex flex-col bg-background flex-1 container py-8'>
      <Link to={routes.posts.index}>
        <Button variant='ghost' className='mb-6'>
          <ArrowLeft className='h-4 w-4 me-2 rtl:rotate-180' />
          {t('common.backToPosts')}
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

          <h1 className='text-xl md:text-5xl font-bold mb-4'>
            {post.data.title}
          </h1>

          <div className='flex items-center gap-2 md:gap-4 text-sm text-muted-foreground mb-6'>
            <div className='flex items-center gap-2'>
              <Avatar className='h-10 w-10'>
                <AvatarImage
                  src={post.data.author.avatar?.url || '/placeholder.svg'}
                  alt={post.data.author.name}
                />
                <AvatarFallback>{post.data.author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className='text-xs md:text-sm font-medium text-foreground'>
                  {post.data.author.name}
                </p>
                <p className='text-xs'>{post.data.author.bio}</p>
              </div>
            </div>
            <Separator orientation='vertical' className='h-10' />
            <div className='flex items-center gap-1'>
              <Calendar className='h-4 w-4' />
              <span className='text-xs md:text-sm text-nowrap'>
                {getDate(post.data.createDate, i18n.language)}
              </span>
            </div>
            <Separator orientation='vertical' className='h-10' />
            <div className='flex items-center gap-1'>
              <Clock className='h-4 w-4' />
              <span className='text-xs md:text-sm text-nowrap'>
                {post.data.readingTime} {t('post.minRead')}
              </span>
            </div>
          </div>
        </div>
        <div className='aspect-video overflow-hidden rounded-lg mb-8'>
          <img
            src={post.data.coverImage?.url || '/placeholder.svg'}
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
              {t('comment.comments')} (
              {comments.isSuccess
                ? comments?.data?.pagination?.totalDocs
                : t('common.loading')}
              )
            </h2>
            <Button
              onClick={handleOpenAddCommentDialog}
              className='gradient-gaming'
            >
              {t('comment.add')}
            </Button>
          </div>
          {comments.data.docs.length === 0 ? (
            <p className='text-muted-foreground'>{t('comment.noComments')}</p>
          ) : (
            <div className='space-y-6'>
              {comments.data.docs.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  onReply={setCommentToReply}
                />
              ))}
            </div>
          )}
        </div>
      </article>
      {post.data.id &&
        (commentToEdit || commentToReply || addComment.state) && (
          <MutateCommentDialog
            commentToEdit={commentToEdit}
            replyToComment={commentToReply}
            onClose={handleCloseDialog}
            postId={post.data.id}
          />
        )}
    </main>
  );
}
