import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import type { CommentProps } from '@/types/blog';

interface CommentComponentProps {
  comment: CommentProps;
  onReply: (comment: CommentProps) => void;
  depth?: number;
}

export default function Comment({
  comment,
  onReply,
  depth = 0,
}: CommentComponentProps) {
  const { t } = useTranslation();
  const maxDepth = 4;
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div className='flex gap-3'>
      <div className='flex-shrink-0'>
        <div className='w-0.5 h-full bg-border' />
      </div>
      <div className='flex-1 space-y-3'>
        <Card className='transition-all hover:shadow-md'>
          <CardHeader className='pb-3'>
            <div className='flex items-center gap-3'>
              <Avatar className='h-9 w-9'>
                <AvatarImage
                  src={comment.avatar?.url || '/placeholder.svg'}
                  alt={comment.username}
                />
                <AvatarFallback className='text-sm'>
                  {comment.username[0]}
                </AvatarFallback>
              </Avatar>
              <div className='flex-1'>
                <p className='font-semibold text-sm'>{comment.username}</p>
                <p className='text-xs text-muted-foreground'>
                  {dayjs(comment.createDate).format('YYYY/MM/DD HH:mm')}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className='flex flex-col gap-3 pt-0'>
            <p className='text-sm leading-relaxed'>{comment.content}</p>
            {depth < maxDepth && (
              <Button
                onClick={() => onReply(comment)}
                size='sm'
                variant='ghost'
                className='w-fit text-xs h-8'
              >
                {t('comment.reply')}
              </Button>
            )}
          </CardContent>
        </Card>

        {hasReplies && (
          <div className='space-y-3 ps-4 md:ps-6'>
            {comment.replies!.map((reply) => (
              <Comment
                key={reply.id}
                comment={reply}
                onReply={onReply}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
