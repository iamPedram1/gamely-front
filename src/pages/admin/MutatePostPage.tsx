import { object } from 'zod';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Save } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { CrossCircledIcon } from '@radix-ui/react-icons';

// Components
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Context
import useLoadingStore, { setLoadingState } from '@/store/loading';

// Utilities
import routes from '@/utilities/routes';
import { uploadFile } from '@/utilities/api/uploader';
import { MultiSelect } from '@/components/ui/multi-select';
import { supportedLanguages } from '@/utilities/helperPack';
import {
  createOnErrorHandler,
  getChangedFields,
} from '@/utilities/reactHookForm';
import { useTagsSummariesQuery } from '@/utilities/api/management/tag';
import { useGamesSummariesQuery } from '@/utilities/api/management/game';
import { useCategoriesSummariesQuery } from '@/utilities/api/management/category';
import {
  useCreatePost,
  useUpdatePost,
  usePostQuery,
} from '@/utilities/api/management/post';
import {
  generateFileSchema,
  generateNumberSchema,
  generateRegexStringSchema,
  generateStringSchema,
  generateStringArraySchema,
} from '@/validations/common';

const createPostSchema = () =>
  object({
    slug: generateRegexStringSchema('slug', /^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    category: generateStringSchema('category'),
    game: generateStringSchema('game'),
    tags: generateStringArraySchema('tags'),
    translations: object({
      en: object({
        title: generateStringSchema('title', 3, 255),
        abstract: generateStringSchema('abstract', 1, 150),
        content: generateStringSchema('content', 1),
      }),
      fa: object({
        title: generateStringSchema('title', 3, 255),
        abstract: generateStringSchema('abstract', 1, 150),
        content: generateStringSchema('content', 1),
      }),
    }),
    readingTime: generateNumberSchema('reading time', 1),
    coverImage: generateFileSchema('cover image'),
  });

type FormSchema = Zod.infer<ReturnType<typeof createPostSchema>>;

export default function MutatePostPage() {
  // Context
  const { loading } = useLoadingStore();
  const { t, i18n } = useTranslation();

  // Hooks
  const params = useParams();
  const isEditMode = 'id' in params;
  const tags = useTagsSummariesQuery();
  const games = useGamesSummariesQuery();
  const categories = useCategoriesSummariesQuery();
  const schema = useMemo(createPostSchema, [i18n.language]);
  const { control, handleSubmit, reset } = useForm<FormSchema>({
    mode: 'onTouched',
    resolver: zodResolver(schema),
  });

  const post = usePostQuery({
    initialParams: params?.id,
    enabled: isEditMode,
    onFetch: (doc) =>
      reset({
        ...doc,
        game: doc.game?.id || undefined,
        category: doc?.category?.id,
        tags: doc?.tags?.map?.((tag) => tag.id),
      }),
  });

  const createPost = useCreatePost({
    stayOnLoadingAfterSuccessMutate: true,
    redirectAfterSuccessTo: routes.dashboard.posts.index,
    autoAlert: { mode: 'add', name: 'Post' },
  });
  const updatePost = useUpdatePost({
    autoAlert: { mode: 'update', name: 'Post' },
  });

  const onSubmit = async (data: FormSchema) => {
    const payload: any = { ...data };

    setLoadingState(true);
    if (data.coverImage && data.coverImage instanceof File) {
      const res = await uploadFile([data.coverImage], 'post');
      if (res.data) payload.coverImage = res.data[0].id;
    } else if ('id' in data.coverImage) {
      payload.coverImage = data.coverImage.id;
    }

    if (isEditMode)
      updatePost.mutate({
        id: params.id,
        data: getChangedFields(post.data, data as any),
      });
    else createPost.mutate(payload);
  };

  const disabled =
    loading ||
    (isEditMode
      ? updatePost.isPending || !post.isFetched
      : createPost.isPending);

  // Render
  return (
    <div className='space-y-6 max-w-4xl'>
      <div className='flex items-center gap-4'>
        <Link to={routes.dashboard.posts.index}>
          <Button variant='ghost' size='icon'>
            <ArrowLeft className='h-5 w-5 rtl:rotate-180' />
          </Button>
        </Link>
        <div>
          <h1 className='text-4xl font-black'>
            <span className='gradient-gaming-text'>
              {isEditMode ? t('common.update') : t('common.create')}
            </span>{' '}
            {t('common.post')}
          </h1>
          <p className='text-muted-foreground mt-2'>
            {isEditMode ? t('post.updatePostInDb') : t('post.addNewPost')}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit, createOnErrorHandler)}>
        <Card className='border-primary/20'>
          <CardHeader>
            <CardTitle>{t('dashboard.postDetails')}</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='grid grid-cols-2 gap-4'>
              {supportedLanguages.map((lng) => (
                <div className='space-y-2'>
                  <Label htmlFor={`${lng}-title`}>
                    {t('post.title')} {`(${t(`common.${lng}`)}) `}
                    {t('form.required')}
                  </Label>
                  <Controller
                    defaultValue=''
                    control={control}
                    name={`translations.${lng}.title`}
                    render={({ field }) => (
                      <Input
                        id={`${lng}-title`}
                        placeholder={t('post.enterPostTitle')}
                        required
                        {...field}
                      />
                    )}
                  />
                </div>
              ))}
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='slug'>
                  {t('common.slug')} {t('form.required')}
                </Label>
                <Controller
                  defaultValue=''
                  control={control}
                  name='slug'
                  render={({ field }) => (
                    <Input
                      id='slug'
                      placeholder={t('post.postUrlSlug')}
                      {...field}
                    />
                  )}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='readingTime'>
                  {t('post.readingTime')} {t('form.required')}
                </Label>
                <Controller
                  defaultValue={1}
                  control={control}
                  name='readingTime'
                  render={({ field }) => (
                    <Input
                      id='readingTime'
                      type='number'
                      placeholder={t('post.readingTimeMinutes')}
                      value={field.value}
                      onChange={(v) => field.onChange(v.target.valueAsNumber)}
                    />
                  )}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='coverImage'>
                {t('post.coverImageUrl')} {t('form.required')}
              </Label>
              <Controller
                defaultValue={null}
                control={control}
                name='coverImage'
                render={({ field }) =>
                  field.value ? (
                    <div className='flex flex-row gap-4 items-center'>
                      <img
                        className='w-20 h-20 object-cover rounded-md'
                        src={
                          field.value instanceof File
                            ? URL.createObjectURL(field.value)
                            : field.value.url
                        }
                      />
                      <div className='flex flex-row gap-4 items-center justify-center align-middle'>
                        <p className='text-muted-foreground mt-2'>
                          {field.value instanceof File
                            ? field.value.name
                            : field.value.filename}
                        </p>
                        <CrossCircledIcon
                          onClick={() => !disabled && field.onChange(null)}
                          className={`size-8 relative top-1.5 cursor-pointer ${
                            disabled ? 'text-muted' : 'text-red-700'
                          }`}
                        />
                      </div>
                    </div>
                  ) : (
                    <Input
                      accept='image/*'
                      type='file'
                      disabled={disabled}
                      id='coverImage'
                      placeholder={t('form.placeholder.imageUrl')}
                      onChange={(e) => field.onChange(e.target.files[0])}
                    />
                  )
                }
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='category'>
                  {t('post.category')} {t('form.required')}
                </Label>
                <Controller
                  defaultValue=''
                  control={control}
                  name='category'
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('post.selectCategory')} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.data?.map?.((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.translations[i18n.language].title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <Controller
                defaultValue={[]}
                control={control}
                name='tags'
                render={({ field }) => (
                  <div className='space-y-2'>
                    <Label htmlFor='tag'>
                      {t('common.tags')} {t('form.required')}
                    </Label>
                    <MultiSelect
                      placeholder={t('post.selectTag')}
                      selected={field.value}
                      onChange={field.onChange}
                      options={tags?.data?.map?.((tag) => ({
                        value: tag.id,
                        label: tag.translations[i18n.language].title,
                      }))}
                    />
                  </div>
                )}
              />
              <div className='space-y-2'>
                <Label htmlFor='game'>
                  {t('post.game')} {t('form.required')}
                </Label>
                <Controller
                  defaultValue=''
                  control={control}
                  name='game'
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('post.selectGame')} />
                      </SelectTrigger>
                      <SelectContent>
                        {games.data?.map?.((game) => (
                          <SelectItem key={game.id} value={game.id}>
                            {game.translations[i18n.language].title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              {supportedLanguages.map((lng) => (
                <div key={`abstract-${lng}`} className='space-y-2'>
                  <Label htmlFor={`${lng}-abstract`}>
                    {t('post.abstract')} {`(${t(`common.${lng}`)}) `}
                    {t('form.required')}
                  </Label>
                  <Controller
                    defaultValue=''
                    control={control}
                    name={`translations.${lng}.abstract`}
                    render={({ field }) => (
                      <Textarea
                        id={`${lng}-abstract`}
                        placeholder={t('post.briefDescription')}
                        rows={3}
                        {...field}
                      />
                    )}
                  />
                </div>
              ))}
              {supportedLanguages.map((lng) => (
                <div key={`content-${lng}`} className='space-y-2'>
                  <Label htmlFor={`${lng}-content`}>
                    {t('post.content')} {`(${t(`common.${lng}`)}) `}
                    {t('form.required')}
                  </Label>
                  <Controller
                    defaultValue=''
                    control={control}
                    name={`translations.${lng}.content`}
                    render={({ field }) => (
                      <Textarea
                        id={`${lng}-content`}
                        placeholder={t('post.writeContent')}
                        rows={12}
                        {...field}
                      />
                    )}
                  />
                </div>
              ))}
            </div>

            <div className='flex gap-4 pt-4'>
              <Button
                type='submit'
                className='gradient-gaming glow-effect hover:glow-effect-strong font-semibold uppercase rtl:flex-row-reverse'
              >
                <Save className='h-4 w-4 ms-2' />
                {isEditMode ? t('post.updatePost') : t('post.createPost')}
              </Button>
              <Link to={routes.dashboard.posts.index}>
                <Button type='button' variant='outline'>
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
