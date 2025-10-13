import { object } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Plus, Edit, Trash2 } from 'lucide-react';

// Hooks
import { useBoolean, useString } from '@/hooks/state';

// Components
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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

// Context
import useLoadingStore from '@/store/loading';

// Utilities
import { mockCategories } from '@/data/mockData';
import {
  useCategoriesQuery,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '@/utilities/api/category';
import {
  generateRegexStringSchema,
  generateStringSchema,
} from '@/validations/common';
import MutateCategoryDialog from '@/components/admin/MutateCategoryDialog';

export default function CategoriesPage() {
  // States
  const [selectedEditId, setSelectedEditId] = useString();
  const isMutateDialogOpen = useBoolean(false, {
    onBeforeSetFalse: () => setSelectedEditId(''),
  });

  // Context
  const { loading } = useLoadingStore();

  // Hooks
  const categories = useCategoriesQuery();
  const deleteCategory = useDeleteCategory();

  const disabled = loading || deleteCategory.isPending;

  // Render
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
          disabled={disabled}
          onClick={isMutateDialogOpen.setTrue}
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
              {categories.data.docs.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className='font-medium'>
                    {category.title}
                  </TableCell>
                  <TableCell className='text-muted-foreground'>
                    {category.slug}
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex items-center justify-end gap-2'>
                      <Button
                        size='icon'
                        variant='ghost'
                        disabled={disabled}
                        onClick={() => {
                          setSelectedEditId(category.id);
                          isMutateDialogOpen.setTrue();
                        }}
                      >
                        <Edit className='h-4 w-4' />
                      </Button>
                      <Button
                        disabled={disabled}
                        onClick={() => deleteCategory.mutate(category.id)}
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
      {isMutateDialogOpen.state && (
        <MutateCategoryDialog
          categoryId={selectedEditId}
          onClose={isMutateDialogOpen.setFalse}
        />
      )}
    </div>
  );
}
