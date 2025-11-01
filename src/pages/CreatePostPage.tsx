import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ImagePlus, Upload } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import FormWrapper from '@/components/ui/form-wrapper';

// Hooks
import { useCategoriesQuery } from '@/utilities/api/category';
import { useGamesQuery } from '@/utilities/api/game';

// Types
import AvatarUpload from '@/components/profile/AvatarUpload';
import { useCreatePost } from '@/utilities/api/management/post';
import { uploadFile } from '@/utilities/api/uploader';

const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  abstract: z
    .string()
    .min(1, 'Abstract is required')
    .max(500, 'Abstract too long'),
  content: z.string().min(1, 'Content is required'),
  categoryId: z.string().min(1, 'Category is required'),
  gameId: z.string().optional(),
  tags: z.string().optional(),
});

type CreatePostForm = z.infer<typeof createPostSchema>;

export default function CreatePostPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [coverImage, setCoverImage] = useState<string>('');

  const form = useForm<CreatePostForm>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: '',
      abstract: '',
      content: '',
      categoryId: '',
      gameId: '',
      tags: '',
    },
  });

  const createPost = useCreatePost({
    onSuccess: () => {
      navigate('/my-posts');
    },
  });

  const categoriesQuery = useCategoriesQuery({ enabled: true });
  const gamesQuery = useGamesQuery({ enabled: true });

  const onSubmit = (data: CreatePostForm) => {
    const payload = {
      ...data,
      coverImage,
      tags: data.tags ? data.tags.split(',').map((tag) => tag.trim()) : [],
    };

    // createPost.mutate(payload);
  };

  const handleImageUpload = async (file: File) => {
    try {
      const result = await uploadFile([file], 'game');
      if (result.isSuccess) {
        setCoverImage(result.data[0].url);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <FormWrapper
      title={t('post.createNewPost')}
      onSubmit={form.handleSubmit(onSubmit)}
      onCancel={() => navigate('/my-posts')}
      isLoading={categoriesQuery.isFetching || gamesQuery.isFetching}
      isSubmitting={createPost.isPending}
      submitText={t('post.publish')}
    >
      <Form {...form}>
        <div className='space-y-6'>
          {/* Cover Image */}
          <div className='space-y-2'>
            <Label>{t('post.coverImage')}</Label>
            <div className='border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors'>
              {coverImage ? (
                <div className='space-y-4'>
                  <img
                    src={`/api/files/${coverImage}`}
                    alt='Cover'
                    className='max-h-48 mx-auto rounded-lg'
                  />
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setCoverImage('')}
                  >
                    {t('common.change')}
                  </Button>
                </div>
              ) : (
                <div className='space-y-4'>
                  <ImagePlus className='h-12 w-12 mx-auto text-muted-foreground' />
                  <div>
                    <p className='text-sm font-medium'>
                      {t('post.uploadCover')}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {t('post.uploadCoverDesc')}
                    </p>
                  </div>
                  {/* <AvatarUpload
                    onUpload={handleImageUpload}
                    isUploading={false}
                  >
                    <Button type='button' variant='outline'>
                      <Upload className='h-4 w-4 mr-2' />
                      {t('common.upload')}
                    </Button>
                  </AvatarUpload> */}
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('post.title')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('post.titlePlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Abstract */}
          <FormField
            control={form.control}
            name='abstract'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('post.abstract')}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t('post.abstractPlaceholder')}
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category & Game */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='categoryId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('common.category')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('post.selectCategory')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoriesQuery.data?.docs?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='gameId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('common.games')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('post.selectGame')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {gamesQuery.data?.docs?.map((game) => (
                        <SelectItem key={game.id} value={game.id}>
                          {game.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Tags */}
          <FormField
            control={form.control}
            name='tags'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('common.tags')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('post.tagsPlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Content */}
          <FormField
            control={form.control}
            name='content'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('post.content')}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t('post.contentPlaceholder')}
                    rows={12}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>
    </FormWrapper>
  );
}
