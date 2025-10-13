import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import Searchbar from '@/components/ui/searchbar';
import PaginationControls from '@/components/ui/pagination-controls';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Context
import useLoadingStore from '@/store/loading';

// Utilities
import routes from '@/utilities/routes';
import initialPagination from '@/utilities/pagination';
import { useDeleteTag, useTagsQuery } from '@/utilities/api/tag';

export default function TagsListPage() {
  // Context
  const { loading } = useLoadingStore();

  // Hooks
  const deleteTag = useDeleteTag();
  const tags = useTagsQuery({
    initialData: { docs: [], pagination: initialPagination },
  });

  const disabled = loading || deleteTag.isPending;

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-4xl font-black'>
            <span className='gradient-gaming-text'>Tags</span> Management
          </h1>
          <p className='text-muted-foreground mt-2'>Manage post tags</p>
        </div>
        <Link to={routes.dashboard.tags.add}>
          <Button
            disabled={disabled}
            className='gradient-gaming glow-effect hover:glow-effect-strong font-semibold uppercase'
          >
            <Plus className='h-4 w-4 mr-2' />
            Add Tag
          </Button>
        </Link>
      </div>
      <Card className='border-primary/20'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-bold'>
              All Tags ({tags?.data?.pagination?.totalDocs || 0})
            </h2>
            <div className='flex items-center gap-3'>
              <Searchbar placeholder='Search in tags...' />
            </div>
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
              {tags?.data?.docs?.map?.((tag) => (
                <TableRow key={tag.id}>
                  <TableCell className='font-medium'>#{tag.title}</TableCell>
                  <TableCell className='text-muted-foreground'>
                    {tag.slug}
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex items-center justify-end gap-2'>
                      <Link to={routes.dashboard.tags.edit(tag.id)}>
                        <Button disabled={disabled} variant='ghost' size='icon'>
                          <Edit className='h-4 w-4' />
                        </Button>
                      </Link>
                      <Button
                        disabled={disabled}
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
          {tags?.data?.pagination && (
            <PaginationControls pagination={tags.data.pagination} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
