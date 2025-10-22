import { object } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

// Components
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
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
import { createOnErrorHandler } from '@/utilities';
import {
  useCategoryQuery,
  useCreateCategory,
  useUpdateCategory,
} from '@/utilities/api/category';
import {
  generateRegexStringSchema,
  generateStringSchema,
} from '@/validations/common';

interface MutateCategoryDialogProps {
  onClose: () => void;
  categoryId: string;
}

const categorySchema = object({
  title: generateStringSchema('title', 3, 255),
  parentId: generateStringSchema(
    'parentId',
    undefined,
    undefined,
    false
  ).nullable(),
  slug: generateRegexStringSchema('slug', /^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});

type FormSchema = Zod.infer<typeof categorySchema>;

const MutateCategoryDialog = (props: MutateCategoryDialogProps) => {
  // Props
  const { onClose, categoryId } = props;

  // States
  const isEditMode = Boolean(categoryId);

  // Context
  const { loading } = useLoadingStore();

  // Hooks
  const category = useCategoryQuery({
    initialParams: categoryId,
    enabled: Boolean(isEditMode && categoryId),
    onFetch: (doc) => reset(doc),
  });

  const { control, reset, handleSubmit } = useForm<FormSchema>({
    mode: 'onTouched',
    resolver: zodResolver(categorySchema),
    defaultValues: category.data ? category.data : undefined,
  });

  const createCategory = useCreateCategory({
    onSuccess: onClose,
    autoAlert: { mode: 'add', name: 'Category' },
  });
  const updateCategory = useUpdateCategory({
    onSuccess: onClose,
    autoAlert: { mode: 'update', name: 'Category' },
  });

  // Utilities
  const onSubmit = (data: Required<FormSchema>) => {
    if (isEditMode) updateCategory.mutate({ id: categoryId, ...data });
    else createCategory.mutate(data);
  };

  const disabled =
    loading ||
    (isEditMode
      ? updateCategory.isPending || !category.isFetched
      : createCategory.isPending);

  // Render
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Update category' : 'Add New Category'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update category in the database'
              : 'Create a new category for organizing posts'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit, createOnErrorHandler)}>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='title'>Category Title *</Label>
              <Controller
                control={control}
                name='title'
                render={({ field }) => (
                  <Input
                    id='title'
                    placeholder='e.g., Reviews'
                    required
                    disabled={disabled}
                    {...field}
                  />
                )}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='slug'>Slug *</Label>
              <Controller
                control={control}
                name='slug'
                render={({ field }) => (
                  <Input
                    id='slug'
                    placeholder='e.g., reviews'
                    required
                    disabled={disabled}
                    {...field}
                  />
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              disabled={disabled}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              disabled={disabled}
              type='submit'
              className='gradient-gaming'
            >
              {isEditMode ? 'Update Category' : 'Create Category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MutateCategoryDialog;
