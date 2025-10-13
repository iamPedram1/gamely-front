import { Link } from 'react-router-dom';
import { mockTags } from '@/data/mockData';
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

export default function TagsListPage() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-4xl font-black'>
            <span className='gradient-gaming-text'>Tags</span> Management
          </h1>
          <p className='text-muted-foreground mt-2'>Manage post tags</p>
        </div>
        <Link to='/dashboard/tags/add'>
          <Button className='gradient-gaming glow-effect hover:glow-effect-strong font-semibold uppercase'>
            <Plus className='h-4 w-4 mr-2' />
            Add Tag
          </Button>
        </Link>
      </div>

      <Card className='border-primary/20'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-bold'>All Tags ({mockTags.length})</h2>
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
              {mockTags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell className='font-medium'>#{tag.title}</TableCell>
                  <TableCell className='text-muted-foreground'>
                    {tag.slug}
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
    </div>
  );
}
