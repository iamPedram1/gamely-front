import { useState } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

import type { CommentProps } from '@/types/blog';

interface CommentComponentProps {
  comment: CommentProps;
  onReply: (comment: CommentProps) => void;
  isReply?: boolean;
  showThreadLine?: boolean;
}

export default function Comment({
  comment,
  onReply,
  isReply = false,
  showThreadLine = false,
}: CommentComponentProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div className='relative space-y-3'>
      {/* Reddit-style thread line */}
      {showThreadLine && (
        <div className='absolute left-4 top-6 bottom-0 w-[2px] bg-border/60 rounded-full' />
      )}

      <Card className='transition-all hover:shadow-md relative z-10'>
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
          <p className='text-sm leading-relaxed'>{comment.message}</p>

          <div className='flex gap-3 flex-wrap'>
            <Button
              onClick={() => onReply(comment)}
              size='sm'
              variant='outline'
              className='w-fit text-xs h-8'
            >
              {t('comment.reply')}
            </Button>

            {hasReplies && (
              <Collapsible open={open} onOpenChange={setOpen} className='w-fit'>
                <CollapsibleTrigger asChild>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-xs h-8 flex items-center gap-1'
                  >
                    <MessageSquare className='w-4 h-4' />
                    {open
                      ? `${comment.replies?.length} ${t('common.comment')}`
                      : `${comment.replies?.length} ${t('common.comment')}`}
                    {open ? (
                      <ChevronUp className='w-4 h-4' />
                    ) : (
                      <ChevronDown className='w-4 h-4' />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </Collapsible>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Flat replies connected with stretched thread line */}
      {hasReplies && (
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleContent className='relative space-y-3'>
            <div className='absolute left-4 top-0 bottom-0 w-[2px] bg-border/40 rounded-full' />
            {comment.replies!.map((reply, index) => (
              <Comment
                key={reply.id}
                comment={reply}
                onReply={onReply}
                isReply
                showThreadLine={index < comment.replies!.length - 1}
              />
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
