import { object } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Save } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Icon Components

// Context
import useLoadingStore from '@/store/loading';

// Custom Utilities
import routes from '@/utilities/routes';
import { createOnErrorHandler } from '@/utilities';
import { useCreateTag, useTagQuery, useUpdateTag } from '@/utilities/api/tag';
import {
  generateRegexStringSchema,
  generateStringSchema,
} from '@/validations/common';

const tagSchema = object({
  title: generateStringSchema('title', 3, 255, true),
  slug: generateRegexStringSchema('slug', /^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});

type FormSchema = Zod.infer<typeof tagSchema>;

export default function MutateTagPage() {
  // Context
  const { loading } = useLoadingStore();

  const { t } = useTranslation();

  // Hooks
  const params = useParams();
  const isEditMode = 'id' in params;
  const { control, handleSubmit, reset } = useForm<FormSchema>({
    mode: 'onTouched',
    resolver: zodResolver(tagSchema),
  });

  const tag = useTagQuery({
    enabled: isEditMode,
    onFetch: (doc) => reset(doc),
  });

  const createTag = useCreateTag({
    stayOnLoadingAfterSuccessMutate: true,
    redirectAfterSuccessTo: routes.dashboard.tags.index,
    autoAlert: { mode: 'add', name: 'Tag' },
  });
  const updateTag = useUpdateTag({
    autoAlert: { mode: 'update', name: 'Tag' },
  });

  // Utilities
  const onSubmit = async (data: Required<FormSchema>) => {
    if (isEditMode) updateTag.mutate({ id: params.id, ...data });
    else createTag.mutate(data);
  };

  const disabled =
    loading ||
    (isEditMode ? updateTag.isPending || !tag.isFetched : createTag.isPending);

  // Render
  return (
    <div className='space-y-6 max-w-2xl'>
      <div className='flex items-center gap-4'>
        <Link to={routes.dashboard.tags.index}>
          <Button disabled={disabled} variant='ghost' size='icon'>
            <ArrowLeft className='h-5 w-5' />
          </Button>
        </Link>
        <div>
          <h1 className='text-4xl font-black'>
            <span className='gradient-gaming-text'>
              {isEditMode ? t('common.update') : t('common.add')}
            </span>{' '}
            {t('common.tag')}
          </h1>
          <p className='text-muted-foreground mt-2'>
            {isEditMode ? t('tag.updateTagInDb') : t('tag.addNewTag')}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit, createOnErrorHandler)}>
        <Card className='min-w-full border-primary/20'>
          <CardHeader>
            <CardTitle>{t('tag.tagDetails')}</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='title'>
                {t('tag.tagTitle')} {t('form.required')}
              </Label>
              <Controller
                control={control}
                name='title'
                render={({ field }) => (
                  <Input
                    id='title'
                    placeholder={t('tag.exampleRPG')}
                    required
                    disabled={disabled}
                    {...field}
                  />
                )}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='slug'>
                {t('common.slug')} {t('form.required')}
              </Label>
              <Controller
                control={control}
                name='slug'
                render={({ field }) => (
                  <Input
                    id='slug'
                    placeholder={t('tag.exampleRPG')}
                    required
                    disabled={disabled}
                    {...field}
                  />
                )}
              />
            </div>

            <div className='flex gap-4 pt-4'>
              <Button
                type='submit'
                className='gradient-gaming glow-effect hover:glow-effect-strong font-semibold uppercase'
                disabled={disabled}
              >
                <Save className='h-4 w-4 mr-2' />
                {isEditMode ? t('tag.updateTag') : t('tag.createTag')}
              </Button>
              <Link to={routes.dashboard.tags.index}>
                <Button disabled={disabled} type='button' variant='outline'>
                  {t('common.cancel')}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
