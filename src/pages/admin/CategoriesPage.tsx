import { useState } from 'react';
import { mockCategories } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus, Edit, Trash2 } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CategoriesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Create category:', formData);
    // TODO: Implement category creation
    setIsDialogOpen(false);
    setFormData({ name: '', slug: '' });
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-4xl font-black'>
            <span className='gradient-gaming-text'>Categories</span> Management
          </h1>
          <p className='text-muted-foreground mt-2'>Manage post categories</p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className='gradient-gaming glow-effect hover:glow-effect-strong font-semibold uppercase'
        >
          <Plus className='h-4 w-4 mr-2' />
          Add Category
        </Button>
      </div>

      <Card className='border-primary/20'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-bold'>
              All Categories ({mockCategories.length})
            </h2>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className='font-medium'>
                    {category.title}
                  </TableCell>
                  <TableCell className='text-muted-foreground'>
                    {category.slug}
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex items-center justify-end gap-2'>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new category for organizing posts
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className='space-y-4 py-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Category Name *</Label>
                <Input
                  id='name'
                  placeholder='e.g., Reviews'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='slug'>Slug *</Label>
                <Input
                  id='slug'
                  placeholder='e.g., reviews'
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type='submit' className='gradient-gaming'>
                Create Category
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
