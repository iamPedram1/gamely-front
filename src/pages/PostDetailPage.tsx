import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Hooks
import useAuth from '@/hooks/useAuth';
import { useBoolean } from '@/hooks/state';

// Components
import { Separator } from '@/components/ui/separator';
import PostHeader from '@/components/blog/PostHeader';
import PostContent from '@/components/blog/PostContent';
import CommentsSection from '@/components/blog/CommentsSection';
import MutateCommentDialog from '@/components/admin/MutateCommentDialog';
import {
  PageLayout,
  LoadingState,
  NotFoundState,
} from '@/components/layout/PageLayout';

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

  // Loading state
  if (post.isFetching && !post.isFetched) {
    return <LoadingState />;
  }

  // Not found state
  if (!post.data && post.isFetched) {
    return (
      <NotFoundState
        title={t('post.postNotFound')}
        description={t('post.postNotFoundDescription')}
        backTo={routes.posts.index}
        backLabel={t('common.backToPosts')}
      />
    );
  }

  // Render post detail
  return (
    <PageLayout
      backTo={routes.posts.index}
      backLabel={t('common.backToPosts')}
      className='min-h-screen flex flex-col bg-background flex-1 container py-8'
    >
      {post.data && (
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
      )}

      {/* Comment Dialog */}
      {post.data?.id &&
        (commentToEdit || commentToReply || addComment.state) && (
          <MutateCommentDialog
            commentToEdit={commentToEdit}
            replyToComment={commentToReply}
            onClose={handleCloseDialog}
            postId={post.data.id}
          />
        )}
    </PageLayout>
  );
}
