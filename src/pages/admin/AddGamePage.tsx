import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { GameProps } from '@/types/blog';
import { useCreateGame } from '@/utilities/api/game';
import useLoadingStore from '@/store/loading';
import { FileProps } from '@/types/api';
import { CrossCircledIcon } from '@radix-ui/react-icons';
import { uploadFile } from '@/utilities/uploader';

interface FormProps
  extends Omit<GameProps, 'id' | 'createdAt' | 'updatedAt' | 'coverImage'> {
  coverImage: FileProps | File | null;
}

export default function AddGamePage() {
  // Context
  const { loading } = useLoadingStore();

  // Hooks
  const { control, getValues, handleSubmit } = useForm<FormProps>({});
  const { mutate: createGame } = useCreateGame({
    redirectAfterSuccessTo: '/dashboard/games',
    autoAlert: { mode: 'add', name: 'Game' },
  });

  // Utilities
  const onSubmit = async (data: FormProps) => {
    const payload: any = { ...data };

    if (data.coverImage && data.coverImage instanceof File) {
      const res = await uploadFile([data.coverImage], 'game');
      if (res.data) payload.coverImage = res.data[0].id;
    }

    createGame(payload);
  };

  // Render
  return (
    <div className='space-y-6 max-w-4xl'>
      <div className='flex items-center gap-4'>
        <Link to='/dashboard/games'>
          <Button variant='ghost' size='icon'>
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
                    disabled={loading}
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
                    disabled={loading}
                    id='slug'
                    placeholder='game-url-slug'
                    {...field}
                  />
                )}
              />
            </div>
            <button type='button' onClick={() => console.log(getValues())}>
              Logger
            </button>
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
                            : field.value.filename || ''}
                        </p>
                        <CrossCircledIcon
                          onClick={() => field.onChange(null)}
                          className='size-8 relative top-1.5 cursor-pointer text-red-700'
                        />
                      </div>
                    </div>
                  ) : (
                    <Input
                      accept='image/*'
                      type='file'
                      disabled={loading}
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
                  <Input
                    disabled={loading}
                    id='releaseDate'
                    type='date'
                    {...field}
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
                    {...field}
                  />
                )}
              />
            </div>

            <div className='flex gap-4 pt-4'>
              <Button
                type='submit'
                className='gradient-gaming glow-effect hover:glow-effect-strong font-semibold uppercase'
              >
                <Save className='h-4 w-4 mr-2' />
                Create Game
              </Button>
              <Link to='/dashboard/games'>
                <Button type='button' variant='outline'>
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
