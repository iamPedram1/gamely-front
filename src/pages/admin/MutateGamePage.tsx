import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { CrossCircledIcon } from '@radix-ui/react-icons';
import { Controller, useForm } from 'react-hook-form';

// Components
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  useCreateGame,
  useGameQuery,
  useUpdateGame,
} from '@/utilities/api/game';

// Context
import useLoadingStore from '@/store/loading';

// Utilities
import { uploadFile } from '@/utilities/uploader';

// Types
import { instanceof as instanceof_, number, object, string } from 'zod';

const gameSchema = object({
  title: string().min(3).max(255),
  slug: string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug is not valid'),
  description: string().min(10).max(500),
  releaseDate: string(),
  coverImage: instanceof_(File, {
    message: 'Please upload the cover image',
  }).or(
    object({
      id: string(),
      location: string(),
      filename: string(),
      size: number(),
      mimetype: string(),
      url: string(),
      createdAt: string(),
      updatedAt: string(),
    })
  ),
});

type FormSchema = Zod.infer<typeof gameSchema>;

export default function AddGamePage() {
  // Context
  const { loading } = useLoadingStore();

  const params = useParams();
  const isEditMode = 'id' in params;

  // Hooks
  const { control, handleSubmit, reset } = useForm<FormSchema>({});

  const game = useGameQuery({
    enabled: isEditMode,
    onFetch: (doc) => reset({ ...doc }),
  });

  const createGame = useCreateGame({
    redirectAfterSuccessTo: '/dashboard/games',
    autoAlert: { mode: 'add', name: 'Game' },
  });
  const updateGame = useUpdateGame({
    redirectAfterSuccessTo: '/dashboard/games',
    autoAlert: { mode: 'add', name: 'Game' },
  });

  // Utilities
  const onSubmit = async (data: FormSchema) => {
    const payload: any = { ...data };

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
        <Link to='/dashboard/games'>
          <Button disabled={disabled} variant='ghost' size='icon'>
            <ArrowLeft className='h-5 w-5' />
          </Button>
        </Link>
        <div>
          <h1 className='text-4xl font-black'>
            <span className='gradient-gaming-text'>Add</span> Game
          </h1>
          <p className='text-muted-foreground mt-2'>
            Add a new game to the database
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className='border-primary/20'>
          <CardHeader>
            <CardTitle>Game Details</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='title'>Game Title *</Label>
              <Controller
                defaultValue=''
                control={control}
                name='title'
                render={({ field }) => (
                  <Input
                    disabled={disabled}
                    id='title'
                    placeholder='Enter game title'
                    {...field}
                  />
                )}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='slug'>Slug *</Label>
              <Controller
                defaultValue=''
                control={control}
                name='slug'
                render={({ field }) => (
                  <Input
                    disabled={disabled}
                    id='slug'
                    placeholder='game-url-slug'
                    {...field}
                  />
                )}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='coverImage'>Cover Image URL *</Label>
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
                      placeholder='https://example.com/image.jpg'
                      onChange={(e) => field.onChange(e.target.files[0])}
                    />
                  )
                }
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='releaseDate'>Release Date *</Label>
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
              <Label htmlFor='description'>Description *</Label>
              <Controller
                defaultValue=''
                control={control}
                name='description'
                render={({ field }) => (
                  <Textarea
                    id='description'
                    placeholder='Brief description of the game'
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
                <Save className='h-4 w-4 mr-2' />
                {isEditMode ? 'Update Game' : 'Create Game'}
              </Button>
              <Link to='/dashboard/games'>
                <Button disabled={disabled} type='button' variant='outline'>
                  Cancel
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
