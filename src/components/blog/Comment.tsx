import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ChevronDown,
  ChevronUp,
  MessageSquare,
  MoreHorizontal,
  Shield,
  Flag,
} from 'lucide-react';

// Types
import { Button } from '@/components/ui/button';
import BlockUserDialog from '@/components/blog/BlockUserDialog';
import ReportCommentDialog from '@/components/blog/ReportCommentDialog';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Utilities
import routes from '@/utilities/routes';
import { getDate } from '@/utilities';
import { useBoolean } from '@/hooks/state';
import {
  useBlockUserMutation,
  useUnblockUserMutation,
} from '@/utilities/api/user';

// Types
import type { CommentProps } from '@/types/client/blog';

interface CommentComponentProps {
  comment: CommentProps;
  onReply: (comment: CommentProps) => void;
  isReply?: boolean;
  showThreadLine?: boolean;
}

export default function Comment({
  comment,
  onReply,
  showThreadLine = false,
}: CommentComponentProps) {
  // States
  const isOpen = useBoolean();
  const isBlockDialogOpen = useBoolean();
  const isReportDialogOpen = useBoolean();

  // Hooks
  const { t } = useTranslation();
  const block = useBlockUserMutation();
  const unblock = useUnblockUserMutation();
  const hasReplies = comment.replies && comment.replies.length > 0;

  // Utilities
  const handleBlock = () => {
    isBlockDialogOpen.setTrue();
  };

  const handleBlockConfirm = () => {
    // TODO: Implement block functionality with API
    block.mutate(comment.username);
  };

  const handleReport = () => {
    isReportDialogOpen.setTrue();
  };

  // Render
  return (
    <>
      <div className='relative space-y-3'>
        {/* Reddit-style thread line */}
        {showThreadLine && (
          <div className='absolute left-4 top-6 bottom-0 w-[2px] bg-border/60 rounded-full' />
        )}

        <Card className='transition-all hover:shadow-md relative z-10'>
          <CardHeader className='pb-3'>
            <div className='flex items-center gap-3'>
              <Link to={routes.users.details(comment.username)}>
                <Avatar className='h-9 w-9'>
                  <AvatarImage
                    src={comment.avatar?.url || '/placeholder.svg'}
                    alt={comment.username}
                  />
                  <AvatarFallback className='text-sm'>
                    {comment.username[0]}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div className='flex-1'>
                <Link to={routes.users.details(comment.username)}>
                  <p className='font-semibold text-sm'>{comment.username}</p>
                </Link>
                <p className='text-xs text-muted-foreground'>
                  {getDate(comment.createDate, 'YYYY/MM/DD HH:mm')}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-8 w-8 p-0 hover:bg-accent'
                  >
                    <MoreHorizontal className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-48'>
                  <DropdownMenuItem
                    onClick={handleBlock}
                    className='cursor-pointer text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950'
                  >
                    <Shield className='h-4 w-4' />
                    {t('comment.block')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleReport}
                    className='cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950'
                  >
                    <Flag className='h-4 w-4' />
                    {t('comment.report')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                <Collapsible
                  open={isOpen.state}
                  onOpenChange={isOpen.set}
                  className='w-fit'
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='text-xs h-8 flex items-center gap-1'
                    >
                      <MessageSquare className='w-4 h-4' />
                      {isOpen.state
                        ? `${comment.replies?.length} ${t('common.comment')}`
                        : `${comment.replies?.length} ${t('common.comment')}`}
                      {isOpen.state ? (
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
          <Collapsible open={isOpen.state} onOpenChange={isOpen.set}>
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

      {/* Dialogs */}
      <BlockUserDialog
        open={isBlockDialogOpen.state}
        onOpenChange={isBlockDialogOpen.set}
        username={comment.username}
        onConfirm={handleBlockConfirm}
      />

      <ReportCommentDialog
        type='comment'
        targetId={comment.id}
        open={isReportDialogOpen.state}
        onOpenChange={isReportDialogOpen.set}
      />
    </>
  );
}
