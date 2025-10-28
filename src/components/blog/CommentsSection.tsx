import { useTranslation } from 'react-i18next';

// Components
import { Button } from '@/components/ui/button';
import Comment from '@/components/blog/Comment';

// Types
import type { CommentProps } from '@/types/blog';

interface CommentsSectionProps {
  comments: {
    docs: CommentProps[];
    pagination?: {
      totalDocs: number;
    };
  };
  isSuccess: boolean;
  onAddComment: () => void;
  onReply: (comment: CommentProps) => void;
}

export default function CommentsSection({
  comments,
  isSuccess,
  onAddComment,
  onReply
}: CommentsSectionProps) {
  // Hooks
  const { t } = useTranslation();

  return (
    <div className='mb-8'>
      <div className='flex justify-between'>
        <h2 className='text-2xl font-bold mb-4'>
          {t('comment.comments')} (
          {isSuccess
            ? comments?.pagination?.totalDocs
            : t('common.loading')}
          )
        </h2>
        <Button
          onClick={onAddComment}
          className='gradient-gaming'
        >
          {t('comment.add')}
        </Button>
      </div>
      {comments.docs.length === 0 ? (
        <p className='text-muted-foreground'>{t('comment.noComments')}</p>
      ) : (
        <div className='space-y-6'>
          {comments.docs.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}