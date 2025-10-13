import { object } from 'zod';
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
import useLoadingStore from '@/store/loading';

// Utilities
import routes from '@/utilities/routes';
import { uploadFile } from '@/utilities/uploader';
import { useTagsSummariesQuery } from '@/utilities/api/tag';
import { useGamesSummariesQuery } from '@/utilities/api/game';
import { createOnErrorHandler } from '@/utilities/reactHookForm';
import { useCategoriesSummariesQuery } from '@/utilities/api/category';
import {
  generateFileSchema,
  generateNumberSchema,
  generateRegexStringSchema,
  generateStringSchema,
  generateStringArraySchema,
} from '@/validations/common';
import {
  useCreatePost,
  usePostQuery,
  useUpdatePost,
} from '@/utilities/api/post';

const postSchema = object({
  title: generateStringSchema('title', 3, 255),
  abstract: generateStringSchema('abstract', 1, 150),
  slug: generateRegexStringSchema('slug', /^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  content: generateStringSchema('content', 1),
  category: generateStringSchema('category'),
  game: generateStringSchema('game'),
  tags: generateStringArraySchema('tags'),
  readingTime: generateNumberSchema('reading time', 1),
  coverImage: generateFileSchema('cover image'),
});

type FormSchema = Zod.infer<typeof postSchema>;

export default function MutatePostPage() {
  // Context
  const { loading } = useLoadingStore();

  const params = useParams();
  const isEditMode = 'id' in params;

  // Hooks
  const { control, setValue, getValues, handleSubmit, reset } =
    useForm<FormSchema>({
      mode: 'onTouched',
      resolver: zodResolver(postSchema),
    });

  const tags = useTagsSummariesQuery();
  const games = useGamesSummariesQuery();
  const categories = useCategoriesSummariesQuery();

  const post = usePostQuery({
    enabled: isEditMode,
    onFetch: (doc) =>
      reset({
        ...doc,
        game: doc.game.id,
        category: doc.category.id,
        tags: doc.tags.map((tag) => tag.id),
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

    if (data.coverImage && data.coverImage instanceof File) {
      const res = await uploadFile([data.coverImage], 'post');
      if (res.data) payload.coverImage = res.data[0].id;
    } else if ('id' in data.coverImage) {
      payload.coverImage = data.coverImage.id;
    }

    if (isEditMode) updatePost.mutate(payload);
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
            <ArrowLeft className='h-5 w-5' />
          </Button>
        </Link>
        <div>
          <h1 className='text-4xl font-black'>
            <span className='gradient-gaming-text'>Create</span> Post
          </h1>
          <p className='text-muted-foreground mt-2'>Add a new blog post</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit, createOnErrorHandler)}>
        <Card className='border-primary/20'>
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='title'>Title *</Label>
              <Controller
                defaultValue=''
                control={control}
                name='title'
                render={({ field }) => (
                  <Input
                    id='title'
                    placeholder='Enter post title'
                    required
                    {...field}
                  />
                )}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='slug'>Slug *</Label>
                <Controller
                  defaultValue=''
                  control={control}
                  name='slug'
                  render={({ field }) => (
                    <Input id='slug' placeholder='post-url-slug' {...field} />
                  )}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='readingTime'>Reading Time *</Label>
                <Controller
                  defaultValue={1}
                  control={control}
                  name='readingTime'
                  render={({ field }) => (
                    <Input
                      id='readingTime'
                      type='number'
                      placeholder='Reading Time (Minuets)'
                      value={field.value}
                      onChange={(v) => field.onChange(v.target.valueAsNumber)}
                    />
                  )}
                />
              </div>
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
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='category'>Category *</Label>
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
                        <SelectValue placeholder='Select category' />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.data?.map?.((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='game'>Game *</Label>
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
                        <SelectValue placeholder='Select game' />
                      </SelectTrigger>
                      <SelectContent>
                        {games.data?.map?.((game) => (
                          <SelectItem key={game.id} value={game.id}>
                            {game.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='excerpt'>Abstract *</Label>
              <Controller
                defaultValue=''
                control={control}
                name='abstract'
                render={({ field }) => (
                  <Textarea
                    id='abstract'
                    placeholder='Brief description of the post'
                    rows={3}
                    {...field}
                  />
                )}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='content'>Content *</Label>
              <Controller
                defaultValue=''
                control={control}
                name='content'
                render={({ field }) => (
                  <Textarea
                    id='content'
                    placeholder='Write your post content here...'
                    rows={12}
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
                Create Post
              </Button>
              <Link to={routes.dashboard.posts.index}>
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
