import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, CheckCircle, XCircle, Trash2 } from 'lucide-react';

// Custom Hooks
import { useBoolean } from '@/hooks/state';

// Components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Searchbar from '@/components/ui/searchbar';
import PaginationControls from '@/components/ui/pagination-controls';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Utilities
import routes from '@/utilities/routes';
import { getDate } from '@/utilities';
import { truncateText } from '@/utilities/helperPack';
import { usePostsQuery } from '@/utilities/api/management/post';
import {
  useCommentsQuery,
  useDeleteComment,
  useUpdateComment,
} from '@/utilities/api/management/comment';

// Types
import type { CommentProps, CommentStatusType } from '@/types/management/blog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface FormProps {
  comment: CommentProps | null;
}

export default function CommentsListPage() {
  // States
  const isDialogOpen = useBoolean();

  // Hooks
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const posts = usePostsQuery();
  const comments = useCommentsQuery({ refetchOnQueryChange: true });
  const updateComment = useUpdateComment();
  const deleteComment = useDeleteComment({ onSuccess: isDialogOpen.setFalse });
  const { control, setValue, getValues } = useForm<FormProps>({});
  const selectedCommentId = useWatch({ control, name: 'comment.id' });

  // Utilities
  const handleChangeStatusFilter = (status: CommentStatusType | 'all') => {
    setSearchParams((sp) => {
      if (!status || status === 'all') sp.delete('status');
      else sp.set('status', status);
      sp.set('page', '1');

      return sp;
    });
  };
  const handleChangePostFilter = (post: string) => {
    setSearchParams((sp) => {
      if (!post || post === 'all') sp.delete('post');
      else sp.set('post', post);
      sp.set('page', '1');

      return sp;
    });
  };

  const handleOpenDialog = (comment: CommentProps) => {
    setValue('comment', comment);
    isDialogOpen.setTrue();
  };

  const handleUpdateStatus = (status: CommentStatusType) => {
    updateComment.mutate({
      commentId: selectedCommentId,
      data: { status, message: getValues('comment.message') },
    });
    isDialogOpen.setFalse();
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-4xl font-black'>
            <span className='gradient-gaming-text'>
              {t('dashboard.comments')}
            </span>{' '}
            {t('dashboard.management')}
          </h1>
          <p className='text-muted-foreground mt-2'>
            {t('dashboard.allComments')}
          </p>
        </div>
      </div>

      <Card className='border-primary/20'>
        <CardHeader>
          <div className='flex items-center justify-between gap-4 flex-wrap'>
            <h2 className='text-xl font-bold'>
              {t('dashboard.allComments')} (
              {comments.data?.pagination?.totalDocs})
            </h2>
            <div className='flex items-center gap-3 flex-wrap'>
              <div className='relative'>
                <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                <Searchbar />
              </div>
              <Select
                value={searchParams.get('post') ?? 'all'}
                onValueChange={(value) => handleChangePostFilter(value)}
              >
                <SelectTrigger className='w-[200px]'>
                  <SelectValue placeholder={t('comment.filterByPost')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>{t('dashboard.allPosts')}</SelectItem>
                  {posts.data.docs?.map?.((post) => (
                    <SelectItem key={post.id} value={post.id}>
                      {post.translations[i18n.language].title.substring(0, 30)}
                      ...
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={searchParams.get('status') ?? 'all'}
                onValueChange={(value) =>
                  handleChangeStatusFilter(value as CommentStatusType)
                }
              >
                <SelectTrigger className='w-[150px]'>
                  <SelectValue placeholder={t('user.status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>{t('common.allStatus')}</SelectItem>
                  <SelectItem value='pending'>
                    {t('comment.pending')}
                  </SelectItem>
                  <SelectItem value='approved'>
                    {t('comment.approved')}
                  </SelectItem>
                  <SelectItem value='rejected'>
                    {t('comment.rejected')}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='text-start'>{t('user.name')}</TableHead>
                <TableHead className='text-start'>
                  {t('comment.comment')}
                </TableHead>
                <TableHead className='text-center'>
                  {t('common.post')}
                </TableHead>
                <TableHead className='text-center'>
                  {t('user.status')}
                </TableHead>
                <TableHead className='text-center'>
                  {t('common.date')}
                </TableHead>
                <TableHead className='text-center'>
                  {t('common.actions')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comments?.data?.docs?.map?.((comment) => (
                <TableRow key={comment.id}>
                  <TableCell className='font-medium'>
                    <div className='flex items-center gap-3'>
                      <Avatar className='h-8 w-8 border-2 border-primary/20'>
                        <AvatarImage
                          alt={comment.creator.name}
                          src={
                            comment?.creator.avatar?.url || '/placeholder.svg'
                          }
                        />
                        <AvatarFallback className='bg-primary/10 text-primary font-bold text-xs'>
                          {comment.creator.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <Link
                        to={routes.dashboard.users.edit(comment.creator.id)}
                        className='text-sm underline'
                      >
                        {comment.creator.name}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell className='max-w-md'>
                    <p className='text-sm line-clamp-2'>
                      {truncateText(comment.message, 25)}
                    </p>
                  </TableCell>
                  <TableCell className='text-center max-w-xs'>
                    <Link
                      to={routes.dashboard.posts.edit(comment.post.id)}
                      className='underline text-sm text-muted-foreground line-clamp-1'
                    >
                      {comment.post.translations[i18n.language].title}
                    </Link>
                  </TableCell>
                  <TableCell className='text-center'>
                    <Badge
                      variant={
                        comment.status === 'approved'
                          ? 'default'
                          : comment.status === 'rejected'
                          ? 'destructive'
                          : 'secondary'
                      }
                      className={
                        comment.status === 'approved'
                          ? 'bg-green-500/10 text-green-500 border-green-500/20'
                          : ''
                      }
                    >
                      {t(`comment.${comment.status}`)}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-center text-muted-foreground text-sm'>
                    {getDate(
                      comment.createDate,
                      i18n.language,
                      'YYYY/MM/DD - HH:MM'
                    )}
                  </TableCell>
                  <TableCell className='text-center'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleOpenDialog(comment)}
                    >
                      {t('common.actions')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <PaginationControls pagination={comments.data?.pagination} />
        </CardContent>
      </Card>

      {/* Comment Actions Dialog */}
      <Dialog
        open={isDialogOpen.state}
        onOpenChange={(open) => !open && isDialogOpen.setFalse()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('comment.commentActions')}</DialogTitle>
            <DialogDescription>{t('comment.manageComment')}</DialogDescription>
          </DialogHeader>

          {selectedCommentId && (
            <div className='space-y-4 py-4'>
              <div className='flex items-center gap-3'>
                <Avatar className='h-10 w-10'>
                  <AvatarImage
                    src={
                      getValues('comment.creator.avatar.url') ||
                      '/placeholder.svg'
                    }
                    alt={getValues('comment.creator.name')}
                  />
                  <AvatarFallback>
                    {getValues('comment.creator.name')[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className='font-semibold'>
                    {getValues('comment.creator.name')}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    {getDate(getValues('comment.createDate'), i18n.language)}
                  </p>
                </div>
              </div>

              <div className='p-4 rounded-lg bg-accent/50 border border-primary/10'>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='title'>
                      {t('common.comment')} {t('form.required')}
                    </Label>
                    <Controller
                      control={control}
                      name='comment.message'
                      render={({ field }) => (
                        <Textarea
                          id='comment'
                          required
                          rows={10}
                          disabled={
                            updateComment.isPending || deleteComment.isPending
                          }
                          {...field}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className='text-sm text-muted-foreground'>
                <strong>{t('common.post')}:</strong>{' '}
                {getValues(
                  `comment.post.translations.${
                    i18n.language as 'en' | 'fa'
                  }.title`
                )}
              </div>
            </div>
          )}

          <DialogFooter className='flex gap-2'>
            <Button
              disabled={updateComment.isPending || deleteComment.isPending}
              variant='outline'
              className='border-green-500/50 text-green-500 hover:bg-green-500/10'
              onClick={() => handleUpdateStatus('approved')}
            >
              <CheckCircle className='h-4 w-4 me-2' />
              {t('comment.approve')}
            </Button>
            <Button
              disabled={updateComment.isPending || deleteComment.isPending}
              variant='outline'
              className='border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10'
              onClick={() => handleUpdateStatus('rejected')}
            >
              <XCircle className='h-4 w-4 me-2' />
              {t('comment.reject')}
            </Button>
            <Button
              disabled={updateComment.isPending || deleteComment.isPending}
              variant='destructive'
              onClick={() => deleteComment.mutate(selectedCommentId)}
            >
              <Trash2 className='h-4 w-4 me-2' />
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
