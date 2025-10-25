import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

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

// Icon Components
import { Search, CheckCircle, XCircle, Trash2 } from 'lucide-react';

// Utilities
import { mockPosts } from '@/data/mockData';
import { useCommentsQuery } from '@/utilities/api/management/comment';

// Types
interface CommentWithMeta {
  id: string;
  content: string;
  username: string;
  avatar: string;
  createdDate: string;
  postId: string;
  postTitle: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function CommentsListPage() {
  const { t, i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [searchQuery, setSearchQuery] = useState('');
  const [postFilter, setPostFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const isDialogOpen = useBoolean(false);
  const [selectedComment, setSelectedComment] =
    useState<CommentWithMeta | null>(null);

  // Flatten comments from all posts
  const comments = useCommentsQuery();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleOpenDialog = (comment: CommentWithMeta) => {
    setSelectedComment(comment);
    isDialogOpen.setTrue();
  };

  const handleApprove = () => {
    console.log('Approve comment:', selectedComment?.id);
    // TODO: Implement approve API call
    isDialogOpen.setFalse();
  };

  const handleReject = () => {
    console.log('Reject comment:', selectedComment?.id);
    // TODO: Implement reject API call
    isDialogOpen.setFalse();
  };

  const handleDelete = () => {
    console.log('Delete comment:', selectedComment?.id);
    // TODO: Implement delete API call
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
              {t('dashboard.allComments')} ({comments.data.pagination.totalDocs}
              )
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
                  {mockPosts.map((post) => (
                    <SelectItem key={post.id} value={post.id}>
                      {post.title.substring(0, 30)}...
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
                <TableHead>{t('user.name')}</TableHead>
                <TableHead>{t('comment.comment')}</TableHead>
                <TableHead>{t('common.post')}</TableHead>
                <TableHead>{t('user.status')}</TableHead>
                <TableHead>{t('common.date')}</TableHead>
                <TableHead className='text-right'>
                  {t('common.actions')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comments.data.docs.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell className='font-medium'>
                    <div className='flex items-center gap-3'>
                      <Avatar className='h-8 w-8 border-2 border-primary/20'>
                        <AvatarImage
                          src={comment?.avatar?.url || '/placeholder.svg'}
                          alt={comment.username}
                        />
                        <AvatarFallback className='bg-primary/10 text-primary font-bold text-xs'>
                          {comment.username[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className='text-sm'>{comment.username}</span>
                    </div>
                  </TableCell>
                  <TableCell className='max-w-md'>
                    <p className='text-sm line-clamp-2'>{comment.content}</p>
                  </TableCell>
                  <TableCell className='max-w-xs'>
                    <p className='text-sm text-muted-foreground line-clamp-1'>
                      {'postTitle'}
                    </p>
                  </TableCell>
                  <TableCell>
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
                  <TableCell className='text-muted-foreground text-sm'>
                    {formatDate(comment.createdDate)}
                  </TableCell>
                  <TableCell className='text-right'>
                    <Button
                      variant='ghost'
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

          <PaginationControls pagination={comments.data.pagination} />
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
                    src={selectedComment.avatar || '/placeholder.svg'}
                    alt={selectedComment.username}
                  />
                  <AvatarFallback>{selectedComment.username[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className='font-semibold'>{selectedComment.username}</p>
                  <p className='text-xs text-muted-foreground'>
                    {formatDate(selectedComment.createdDate)}
                  </p>
                </div>
              </div>

              <div className='p-4 rounded-lg bg-accent/50 border border-primary/10'>
                <p className='text-sm'>{selectedComment.content}</p>
              </div>

              <div className='text-sm text-muted-foreground'>
                <strong>{t('common.post')}:</strong> {selectedComment.postTitle}
              </div>
            </div>
          )}

          <DialogFooter className='flex gap-2'>
            <Button
              variant='outline'
              className='border-green-500/50 text-green-500 hover:bg-green-500/10'
              onClick={handleApprove}
            >
              <CheckCircle className='h-4 w-4 me-2' />
              {t('comment.approve')}
            </Button>
            <Button
              variant='outline'
              className='border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10'
              onClick={handleReject}
            >
              <XCircle className='h-4 w-4 me-2' />
              {t('comment.reject')}
            </Button>
            <Button variant='destructive' onClick={handleDelete}>
              <Trash2 className='h-4 w-4 me-2' />
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
