import { Link } from 'react-router-dom';
import { mockPosts } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { usePostsQuery } from '@/utilities/api/post';

export default function PostsListPage() {
  const posts = usePostsQuery();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-4xl font-black'>
            <span className='gradient-gaming-text'>Posts</span> Management
          </h1>
          <p className='text-muted-foreground mt-2'>Manage all blog posts</p>
        </div>
        <Link to='/dashboard/posts/add'>
          <Button className='gradient-gaming glow-effect hover:glow-effect-strong font-semibold uppercase'>
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
                    {formatDate(post.createdAt)}
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex items-center justify-end gap-2'>
                      <Link to={`/post/${post.slug}`}>
                        <Button variant='ghost' size='icon'>
                          <Eye className='h-4 w-4' />
                        </Button>
                      </Link>
                      <Button variant='ghost' size='icon'>
                        <Edit className='h-4 w-4' />
                      </Button>
                      <Button
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
