import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2 } from 'lucide-react';

// Hooks
import { useBoolean, useString } from '@/hooks/state';

// Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import MutateCategoryDialog from '@/components/admin/MutateCategoryDialog';
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
import {
  useCategoriesQuery,
  useDeleteCategory,
} from '@/utilities/api/category';

export default function CategoriesPage() {
  // States
  const [selectedEditId, setSelectedEditId] = useString();
  const isMutateDialogOpen = useBoolean(false, {
    onBeforeSetFalse: () => setSelectedEditId(''),
  });

  // Context
  const { t } = useTranslation();
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
          {t('dashboard.addCategory')}
        </Button>
      </div>
      <Card className='border-primary/20'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-bold'>
              {t('dashboard.allCategories')} (
              {categories.data?.pagination?.totalDocs || 0})
            </h2>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('common.name')}</TableHead>
                <TableHead>{t('common.slug')}</TableHead>
                <TableHead className='text-right'>
                  {t('common.actions')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories?.data?.docs?.map?.((category) => (
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
