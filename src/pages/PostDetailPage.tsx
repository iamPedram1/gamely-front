import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';

// Hooks
import useAuth from '@/hooks/useAuth';
import { useBoolean } from '@/hooks/state';

// Components
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import PostHeader from '@/components/blog/PostHeader';
import PostContent from '@/components/blog/PostContent';
import CommentsSection from '@/components/blog/CommentsSection';
import MutateCommentDialog from '@/components/admin/MutateCommentDialog';

// Utilities
import routes from '@/utilities/routes';
import { setAlertState } from '@/store/alert';
import { usePostQuery } from '@/utilities/api/post';
import { useCommentsQuery } from '@/utilities/api/comment';

// Types
import type { CommentProps } from '@/types/client/blog';

export default function PostDetailPage() {
  // States
  const addComment = useBoolean();
  const [commentToEdit, setCommentToEdit] = useState<CommentProps | null>(null);
  const [commentToReply, setCommentToReply] = useState<CommentProps | null>(
    null
  );

  // Hooks
  const { slug } = useParams();
  const { t } = useTranslation();
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

  // Render loading or not found state
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

  // Render post detail
  return (
    <main className='min-h-screen flex flex-col bg-background flex-1 container py-8'>
      <Link to={routes.posts.index}>
        <Button variant='ghost' className='mb-6'>
          <ArrowLeft className='h-4 w-4 rtl:rotate-180' />
          {t('common.backToPosts')}
        </Button>
      </Link>

      <article className='max-w-4xl mx-auto'>
        {/* Post Header */}
        <PostHeader post={post.data} />

        {/* Post Content */}
        <PostContent post={post.data} />

        <Separator className='my-8' />

        {/* Comments Section */}
        <CommentsSection
          comments={comments.data}
          isSuccess={comments.isSuccess}
          onAddComment={handleOpenAddCommentDialog}
          onReply={setCommentToReply}
        />
      </article>

      {/* Comment Dialog */}
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
