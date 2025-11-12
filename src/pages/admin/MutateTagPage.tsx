import { boolean, object } from 'zod';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Switch } from '@/components/ui/switch';

// Components
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FormWrapper from '@/components/ui/form-wrapper';
import LoadingWrapper from '@/components/ui/loading-wrapper';

// Utilities
import routes from '@/utilities/routes';
import { useSelectLoading } from '@/store/loading';
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

const createTagSchema = () =>
  object({
    slug: generateRegexStringSchema('slug', /^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    isFeatured: boolean().optional(),
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
  const navigate = useNavigate();

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
    <FormWrapper
      title={isEditMode ? t('tag.updateTag') : t('tag.createTag')}
      onSubmit={handleSubmit(onSubmit)}
      onCancel={() => navigate('/dashboard/tags')}
      isLoading={isEditMode ? tag.isFetching : false}
      isSubmitting={createTag.isPending || updateTag.isPending}
      submitText={isEditMode ? t('tag.updateTag') : t('tag.createTag')}
    >
      <LoadingWrapper
        isLoading={isEditMode ? tag.isFetching : false}
        type='skeleton'
      >
        {supportedLanguages.map((lng) => (
          <div className='space-y-2' key={`title-${lng}`}>
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

        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label htmlFor='isFeatured'>{t('tag.featuredTag')}</Label>
              <p className='text-sm text-muted-foreground'>
                {t('tag.featuredTagDescription')}
              </p>
            </div>
            <Controller
              defaultValue={false}
              control={control}
              name='isFeatured'
              render={({ field }) => (
                <Switch
                  id='isFeatured'
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={disabled}
                />
              )}
            />
          </div>
        </div>
      </LoadingWrapper>
    </FormWrapper>
  );
}
