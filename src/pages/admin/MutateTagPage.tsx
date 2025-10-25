import { object } from 'zod';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Save } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Components
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Utilities
import routes from '@/utilities/routes';
import { createOnErrorHandler } from '@/utilities';
import { supportedLanguages } from '@/utilities/helperPack';
import {
  useCreateTag,
  useTagQuery,
  useUpdateTag,
} from '@/utilities/api/management/tag';
import {
  generateRegexStringSchema,
  generateStringSchema,
} from '@/validations/common';
import { useSelectLoading } from '@/store/loading';

const createTagSchema = () =>
  object({
    slug: generateRegexStringSchema('slug', /^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    translations: object({
      en: object({ title: generateStringSchema('title', 3, 255) }),
      fa: object({ title: generateStringSchema('title', 3, 255) }),
    }).required(),
  });

type FormSchema = Zod.infer<ReturnType<typeof createTagSchema>>;

export default function MutateTagPage() {
  // Context
  const { t, i18n } = useTranslation();
  const loading = useSelectLoading();

  // Hooks
  const params = useParams();
  const isEditMode = 'id' in params;
  const schema = useMemo(createTagSchema, [i18n.language]);
  const { control, handleSubmit, reset } = useForm<FormSchema>({
    mode: 'onTouched',
    resolver: zodResolver(schema),
  });

  const tag = useTagQuery({ enabled: isEditMode, onFetch: reset });
  const createTag = useCreateTag({
    stayOnLoadingAfterSuccessMutate: true,
    redirectAfterSuccessTo: routes.dashboard.tags.index,
    autoAlert: { mode: 'add', name: 'Tag' },
  });
  const updateTag = useUpdateTag();

  // Utilities
  const onSubmit = async (data: Required<FormSchema>) => {
    if (isEditMode) updateTag.mutate({ id: params.id, data: data as any });
    else createTag.mutate(data as any);
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
            <ArrowLeft className='h-5 w-5 rtl:rotate-180' />
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
            {supportedLanguages.map((lng) => (
              <div className='space-y-2'>
                <Label htmlFor={`title-${lng}`}>
                  {t('common.title')} {t(`common.${lng}`)} {t('form.required')}
                </Label>
                <Controller
                  control={control}
                  name={`translations.${lng}.title`}
                  render={({ field }) => (
                    <Input
                      id={`title-${lng}`}
                      placeholder={t(`tag.tagTitlePlaceholder.${lng}`)}
                      disabled={disabled}
                      {...field}
                    />
                  )}
                />
              </div>
            ))}
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
                    placeholder={t('tag.tagSlugPlaceholder')}
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
                <Save className='h-4 w-4 me-2' />
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
