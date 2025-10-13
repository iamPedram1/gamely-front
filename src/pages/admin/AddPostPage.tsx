import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { mockCategories, mockGames } from '@/data/mockData';

export default function AddPostPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    categoryId: '',
    gameId: '',
    tags: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Create post:', formData);
    // TODO: Implement post creation
    navigate('/dashboard/posts');
  };

  return (
    <div className='space-y-6 max-w-4xl'>
      <div className='flex items-center gap-4'>
        <Link to='/dashboard/posts'>
          <Button variant='ghost' size='icon'>
            <ArrowLeft className='h-5 w-5' />
          </Button>
        </Link>
        <div>
          <h1 className='text-4xl font-black'>
            <span className='gradient-gaming-text'>Create</span> Post
          </h1>
          <p className='text-muted-foreground mt-2'>Add a new blog post</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className='border-primary/20'>
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='title'>Title *</Label>
              <Input
                id='title'
                placeholder='Enter post title'
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='slug'>Slug *</Label>
              <Input
                id='slug'
                placeholder='post-url-slug'
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='coverImage'>Cover Image URL *</Label>
              <Input
                id='coverImage'
                placeholder='https://example.com/image.jpg'
                value={formData.coverImage}
                onChange={(e) =>
                  setFormData({ ...formData, coverImage: e.target.value })
                }
                required
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='category'>Category *</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, categoryId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select category' />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='game'>Game *</Label>
                <Select
                  value={formData.gameId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, gameId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select game' />
                  </SelectTrigger>
                  <SelectContent>
                    {mockGames.map((game) => (
                      <SelectItem key={game.id} value={game.id}>
                        {game.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='excerpt'>Excerpt *</Label>
              <Textarea
                id='excerpt'
                placeholder='Brief description of the post'
                rows={3}
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='content'>Content *</Label>
              <Textarea
                id='content'
                placeholder='Write your post content here...'
                rows={12}
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                required
              />
            </div>

            <div className='flex gap-4 pt-4'>
              <Button
                type='submit'
                className='gradient-gaming glow-effect hover:glow-effect-strong font-semibold uppercase'
              >
                <Save className='h-4 w-4 mr-2' />
                Create Post
              </Button>
              <Link to='/dashboard/posts'>
                <Button type='button' variant='outline'>
                  Cancel
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
