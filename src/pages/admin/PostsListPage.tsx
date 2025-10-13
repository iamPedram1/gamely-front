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
import useLoadingStore from '@/store/loading';
import initialPagination from '@/utilities/pagination';
import { useDeletePost, usePostsQuery } from '@/utilities/api/post';

export default function PostsListPage() {
  // Context
  const { loading } = useLoadingStore();

  // Hooks
  const posts = usePostsQuery({
    initialData: { docs: [], pagination: initialPagination },
  });
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
              All Posts ({posts?.data?.pagination?.totalDocs || 0})
            </h2>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className='text-center'>Category</TableHead>
                <TableHead className='text-center'>Game</TableHead>
                <TableHead className='text-center'>Author</TableHead>
                <TableHead className='text-center'>Date</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.data.docs.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className='font-medium max-w-md'>
                    <span className='max-w-80 line-clamp-1'>{post.title}</span>
                  </TableCell>
                  <TableCell className='text-center'>
                    <Link to={routes.dashboard.categories.index}>
                      <Badge
                        variant='secondary'
                        className='bg-primary/10 text-primary'
                      >
                        {post.category.title}
                      </Badge>
                    </Link>
                  </TableCell>
                  <TableCell className='text-center'>
                    {post.game ? (
                      <Link to={routes.dashboard.games.edit(post.game.id)}>
                        <Badge variant='outline'>{post.game.title}</Badge>
                      </Link>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell className='text-center'>
                    {post.author.name}
                  </TableCell>
                  <TableCell className='text-center text-muted-foreground'>
                    {dayjs(post.createdAt).format('MMMM D, YYYY')}
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex items-center justify-end gap-2'>
                      <Button disabled={disabled} variant='ghost' size='icon'>
                        <Eye className='h-4 w-4' />
                      </Button>
                      <Link to={routes.dashboard.posts.edit(post.id)}>
                        <Button disabled={disabled} variant='ghost' size='icon'>
                          <Edit className='h-4 w-4' />
                        </Button>
                      </Link>
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
