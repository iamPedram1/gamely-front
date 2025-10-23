import { Link, useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { CrossCircledIcon } from '@radix-ui/react-icons';
import { object } from 'zod';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Save } from 'lucide-react';

// Components
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Context
import useLoadingStore, { setLoadingState } from '@/store/loading';

// Custom Utilities
import routes from '@/utilities/routes';
import { uploadFile } from '@/utilities/uploader';
import { createOnErrorHandler } from '@/utilities';
import {
  useCreateGame,
  useGameQuery,
  useUpdateGame,
} from '@/utilities/api/game';
import {
  generateFileSchema,
  generateRegexStringSchema,
  generateStringSchema,
} from '@/validations/common';
import { useMemo } from 'react';

// Types
const createGameSchema = () =>
  object({
    title: generateStringSchema('title', 3, 255),
    slug: generateRegexStringSchema('slug', /^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    description: generateStringSchema('description', 10, 500),
    releaseDate: generateStringSchema('release date'),
    coverImage: generateFileSchema('cover image'),
  });

type FormSchema = Zod.infer<ReturnType<typeof createGameSchema>>;

export default function MutateGamePage() {
  // Context
  const { loading } = useLoadingStore();
  const { t, i18n } = useTranslation();

  // Hooks
  const params = useParams();
  const isEditMode = 'id' in params;
  const schema = useMemo(createGameSchema, [i18n.language]);
  const { control, handleSubmit, reset } = useForm<FormSchema>({
    mode: 'onTouched',
    resolver: zodResolver(schema),
  });
  const game = useGameQuery({
    enabled: isEditMode,
    onFetch: (doc) => reset({ ...doc }),
  });
  const createGame = useCreateGame({
    stayOnLoadingAfterSuccessMutate: true,
    redirectAfterSuccessTo: routes.dashboard.games.index,
    autoAlert: { mode: 'add', name: 'Game' },
  });
  const updateGame = useUpdateGame({
    autoAlert: { mode: 'update', name: 'Game' },
  });

  // Utilities
  const onSubmit = async (data: FormSchema) => {
    const payload: any = { ...data };

    setLoadingState(true);
    if (data.coverImage && data.coverImage instanceof File) {
      const res = await uploadFile([data.coverImage], 'game');
      if (res.data) payload.coverImage = res.data[0].id;
    } else if ('id' in data.coverImage) {
      payload.coverImage = data.coverImage.id;
    }

    if (isEditMode) updateGame.mutate(payload);
    else createGame.mutate(payload);
  };

  const disabled =
    loading ||
    (isEditMode
      ? updateGame.isPending || !game.isFetched
      : createGame.isPending);

  // Render
  return (
    <div className='space-y-6 max-w-4xl'>
      <div className='flex items-center gap-4'>
        <Link to={routes.dashboard.games.index}>
          <Button disabled={disabled} variant='ghost' size='icon'>
            <ArrowLeft className='h-5 w-5 rtl:rotate-180' />
          </Button>
        </Link>
        <div>
          <h1 className='text-4xl font-black'>
            <span className='gradient-gaming-text'>
              {isEditMode ? t('common.update') : t('common.add')}
            </span>{' '}
            {t('common.game')}
          </h1>
          <p className='text-muted-foreground mt-2'>
            {isEditMode ? t('game.updateGameInDb') : t('game.addNewGame')}
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit, createOnErrorHandler)}>
        <Card className='border-primary/20'>
          <CardHeader>
            <CardTitle>{t('game.gameDetails')}</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='title'>
                {t('game.gameTitle')} {t('form.required')}
              </Label>
              <Controller
                defaultValue=''
                control={control}
                name='title'
                render={({ field }) => (
                  <Input
                    disabled={disabled}
                    id='title'
                    placeholder={t('game.enterGameTitle')}
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
                defaultValue=''
                control={control}
                name='slug'
                render={({ field }) => (
                  <Input
                    disabled={disabled}
                    id='slug'
                    placeholder={t('game.gameUrlSlug')}
                    {...field}
                  />
                )}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='coverImage'>
                {t('game.coverImageUrl')} {t('form.required')}
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
            <div className='space-y-2'>
              <Label htmlFor='releaseDate'>
                {t('game.releaseDate')} {t('form.required')}
              </Label>
              <Controller
                defaultValue=''
                control={control}
                name='releaseDate'
                render={({ field }) => (
                  <DatePicker
                    disabled={disabled}
                    value={field.value}
                    onChange={(date) => field.onChange(date.toISOString())}
                  />
                )}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='description'>
                {t('game.description')} {t('form.required')}
              </Label>
              <Controller
                defaultValue=''
                control={control}
                name='description'
                render={({ field }) => (
                  <Textarea
                    id='description'
                    placeholder={t('game.briefGameDescription')}
                    rows={5}
                    disabled={disabled}
                    {...field}
                  />
                )}
              />
            </div>

            <div className='flex gap-4 pt-4'>
              <Button
                disabled={disabled}
                type='submit'
                className='gradient-gaming glow-effect hover:glow-effect-strong font-semibold uppercase'
              >
                <Save className='h-4 w-4 me-2' />
                {isEditMode ? t('game.updateGame') : t('game.createGame')}
              </Button>
              <Link to={routes.dashboard.games.index}>
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
