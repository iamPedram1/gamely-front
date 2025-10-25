import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, CheckCircle, XCircle, Trash2 } from 'lucide-react';

// Custom Hooks
import { useBoolean } from '@/hooks/state';

// Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
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
import PaginationControls from '@/components/ui/pagination-controls';

// Utilities
import routes from '@/utilities/routes';
import { getDate } from '@/utilities';
import { truncateText } from '@/utilities/helperPack';
import { usePostsQuery } from '@/utilities/api/management/post';
import {
  useCommentsQuery,
  useUpdateComment,
} from '@/utilities/api/management/comment';

// Types
import { CommentProps, CommentStatusType } from '@/types/management/blog';

export default function CommentsListPage() {
  const { t, i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [postFilter, setPostFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const isDialogOpen = useBoolean(false);
  const [selectedComment, setSelectedComment] = useState<CommentProps | null>(
    null
  );

  const posts = usePostsQuery();
  const comments = useCommentsQuery();
  const updateComment = useUpdateComment();

  const handleOpenDialog = (comment: CommentProps) => {
    setSelectedComment(comment);
    isDialogOpen.setTrue();
  };

  const handleUpdateStatus = (status: CommentStatusType) => {
    console.log('Approve comment:', selectedComment?.id);

    updateComment.mutate({ commentId: selectedComment.id, data: { status } });
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
                <Input
                  placeholder={t('common.search') + '...'}
                  className='pl-10 w-[250px]'
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <Select
                value={postFilter}
                onValueChange={(value) => {
                  setPostFilter(value);
                  setCurrentPage(1);
                }}
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
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
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
                      {truncateText(comment.content, 25)}
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

          {selectedComment && (
            <div className='space-y-4 py-4'>
              <div className='flex items-center gap-3'>
                <Avatar className='h-10 w-10'>
                  <AvatarImage
                    src={
                      selectedComment.creator?.avatar?.url || '/placeholder.svg'
                    }
                    alt={selectedComment.creator.name}
                  />
                  <AvatarFallback>
                    {selectedComment.creator.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className='font-semibold'>
                    {selectedComment.creator.name}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    {getDate(selectedComment.createDate, i18n.language)}
                  </p>
                </div>
              </div>

              <div className='p-4 rounded-lg bg-accent/50 border border-primary/10'>
                <p className='text-sm'>{selectedComment.content}</p>
              </div>

              <div className='text-sm text-muted-foreground'>
                <strong>{t('common.post')}:</strong>{' '}
                {selectedComment.post.translations[i18n.language].title}
              </div>
            </div>
          )}

          <DialogFooter className='flex gap-2'>
            <Button
              disabled={updateComment.isPending}
              variant='outline'
              className='border-green-500/50 text-green-500 hover:bg-green-500/10'
              onClick={() => handleUpdateStatus('approved')}
            >
              <CheckCircle className='h-4 w-4 me-2' />
              {t('comment.approve')}
            </Button>
            <Button
              disabled={updateComment.isPending}
              variant='outline'
              className='border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10'
              onClick={() => handleUpdateStatus('rejected')}
            >
              <XCircle className='h-4 w-4 me-2' />
              {t('comment.reject')}
            </Button>
            <Button
              disabled={updateComment.isPending}
              variant='destructive'
              onClick={() => handleUpdateStatus('rejected')}
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
