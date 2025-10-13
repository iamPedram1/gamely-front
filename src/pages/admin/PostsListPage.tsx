import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Utilities
import routes from '@/utilities/routes';
import { useDeletePost, usePostsQuery } from '@/utilities/api/post';
import useLoadingStore from '@/store/loading';

export default function PostsListPage() {
  // Context
  const { loading } = useLoadingStore();

  // Hooks
  const posts = usePostsQuery({ staleTime: 60000, gcTime: 60000 });
  const deletePost = useDeletePost();

  const disabled = loading || deletePost.isPending;

  // Render
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-4xl font-black'>
            <span className='gradient-gaming-text'>Posts</span> Management
          </h1>
          <p className='text-muted-foreground mt-2'>Manage all blog posts</p>
        </div>
        <Link to={routes.dashboard.posts.add}>
          <Button
            disabled={disabled}
            className='gradient-gaming glow-effect hover:glow-effect-strong font-semibold uppercase'
          >
            <Plus className='h-4 w-4 mr-2' />
            Add Post
          </Button>
        </Link>
      </div>

      <Card className='border-primary/20'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-bold'>
              All Posts ({posts.data.pagination.totalDocs})
            </h2>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Game</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.data.docs.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className='font-medium max-w-md'>
                    <div className='flex items-center gap-3'>
                      {post.coverImage && (
                        <img
                          src={post.coverImage.url}
                          alt={post.title}
                          className='w-16 h-10 object-cover rounded'
                        />
                      )}
                      <span className='line-clamp-1'>{post.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant='secondary'
                      className='bg-primary/10 text-primary'
                    >
                      {post.category.title}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant='outline'>{post.game?.title}</Badge>
                  </TableCell>
                  <TableCell>{post.creator?.name}</TableCell>
                  <TableCell className='text-muted-foreground'>
                    {dayjs(post.createdAt).format('MMMM D, YYYY')}
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex items-center justify-end gap-2'>
                      <Link to={routes.dashboard.posts.edit(post.id)}>
                        <Button disabled={disabled} variant='ghost' size='icon'>
                          <Eye className='h-4 w-4' />
                        </Button>
                      </Link>
                      <Button disabled={disabled} variant='ghost' size='icon'>
                        <Edit className='h-4 w-4' />
                      </Button>
                      <Button
                        disabled={disabled}
                        onClick={() => deletePost.mutate(post.id)}
                        variant='ghost'
                        size='icon'
                        className='text-destructive'
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
