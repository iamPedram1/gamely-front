import { object } from 'zod';
import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

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
} from '@/utilities/api/management/category';
import {
  generateRegexStringSchema,
  generateStringSchema,
} from '@/validations/common';

interface MutateCategoryDialogProps {
  onClose: () => void;
  categoryId: string;
}

const createCategorySchema = () =>
  object({
    title: generateStringSchema('title', 3, 255),
    parentId: generateStringSchema(
      'parentId',
      undefined,
      undefined,
      false
    ).nullable(),
    slug: generateRegexStringSchema('slug', /^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  });

type FormSchema = Zod.infer<ReturnType<typeof createCategorySchema>>;

const MutateCategoryDialog = (props: MutateCategoryDialogProps) => {
  // Props
  const { onClose, categoryId } = props;

  // States
  const isEditMode = Boolean(categoryId);

  // Translation
  const { t, i18n } = useTranslation();

  // Context
  const { loading } = useLoadingStore();

  // Custom Hooks
  const schema = useMemo(createCategorySchema, [i18n.language]);
  const category = useCategoryQuery({
    initialParams: categoryId,
    enabled: Boolean(isEditMode && categoryId),
    onFetch: (doc) => reset(doc),
  });
  const { control, reset, handleSubmit } = useForm<FormSchema>({
    mode: 'onTouched',
    resolver: zodResolver(schema),
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
            {isEditMode
              ? t('category.updateCategory')
              : t('category.addNewCategory')}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? t('category.updateCategoryInDb')
              : t('category.createNewCategory')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit, createOnErrorHandler)}>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='title'>
                {t('category.categoryTitle')} {t('form.required')}
              </Label>
              <Controller
                control={control}
                name='title'
                render={({ field }) => (
                  <Input
                    id='title'
                    placeholder={t('category.exampleReviews')}
                    required
                    disabled={disabled}
                    {...field}
                  />
                )}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='slug'>
                {t('category.slug')} {t('form.required')}
              </Label>
              <Controller
                control={control}
                name='slug'
                render={({ field }) => (
                  <Input
                    id='slug'
                    placeholder={t('category.exampleReviewsSlug')}
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
              {t('common.cancel')}
            </Button>
            <Button
              disabled={disabled}
              type='submit'
              className='gradient-gaming'
            >
              {isEditMode
                ? t('category.updateCategory')
                : t('category.createCategory')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MutateCategoryDialog;
