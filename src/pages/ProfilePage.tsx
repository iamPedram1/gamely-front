import { useEffect, useMemo } from 'react';
import { object } from 'zod';
import { Link } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

// Custom Hooks
import useAuth from '@/hooks/useAuth';

// Components
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Icon Components
import { Save, ArrowLeft } from 'lucide-react';

// Context
import useLoadingStore, { setLoadingState } from '@/store/loading';
import { useUpdateProfileMutation } from '@/utilities/api/auth';

// Custom Utilities
import routes from '@/utilities/routes';
import { uploadFile } from '@/utilities/uploader';
import { createOnErrorHandler } from '@/utilities';
import {
  generateEmailSchema,
  generateFileSchema,
  generateStringSchema,
} from '@/validations/common';

const createProfileSchema = () =>
  object({
    name: generateStringSchema('name', 3, 255),
    email: generateEmailSchema(),
    bio: generateStringSchema('bio', 1, 255).optional(),
    password: generateStringSchema('password', 1, 255).optional(),
    avatar: generateFileSchema('coverImage').optional(),
  });

type FormSchema = Zod.infer<ReturnType<typeof createProfileSchema>>;

export default function ProfilePage() {
  // Context
  const { loading } = useLoadingStore();
  const { t, i18n } = useTranslation();

  // Hooks
  const schema = useMemo(createProfileSchema, [i18n.language]);
  const { isAuthorized, profile, logout, isAuthLoading } = useAuth();
  const { control, handleSubmit, reset } = useForm<FormSchema>({
    mode: 'onTouched',
    resolver: zodResolver(schema),
  });
  const updateProfile = useUpdateProfileMutation({
    onSuccess: (_, vars) => {
      if (
        'password' in vars &&
        typeof vars.password === 'string' &&
        vars.password.length > 0
      )
        logout(routes.login);
    },
  });

  useEffect(() => {
    reset({ ...profile });
  }, [isAuthorized]);

  // Utilities
  const handleUpdate = async (data: FormSchema) => {
    const payload = structuredClone(data);

    setLoadingState(true);
    if (data.avatar && data.avatar instanceof File) {
      const res = await uploadFile([data.avatar], 'user');
      if (res.data) payload.avatar = res.data[0].id;
    } else if ('id' in data.avatar) {
      payload.avatar = data.avatar.id;
    }

    updateProfile.mutate(payload);
  };

  const disabled = updateProfile.isPending || loading;

  // Render
  if (isAuthLoading)
    return (
      <div className='min-h-screen flex flex-col bg-background'>
        <Header />
        <main className='flex-1 container py-40 items-center justify-center'>
          <h1 className='text-9xl font-bold mb-4 text-center'>
            {t('common.loading')}
          </h1>
        </main>
        <Footer />
      </div>
    );
  else if (!isAuthorized)
    return (
      <div className='min-h-screen flex flex-col bg-background'>
        <Header />
        <main className='flex-1 container py-40 items-center justify-center'>
          <h1 className='text-9xl font-bold mb-4 text-center'>401</h1>
          <h2 className='text-4xl font-normal mb-4 text-center'>
            {t('user.unauthorized')}
          </h2>
          <Link to={routes.login} className='flex items-center justify-center'>
            <Button variant='default' className='w-48 mb-6'>
              {t('auth.login')}
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  else
    return (
      <div className='min-h-screen flex flex-col bg-background'>
        <Header />

        <main className='flex-1 container py-8'>
          <Link to='/'>
            <Button variant='ghost' className='mb-6 flex items-center gap-2'>
              <ArrowLeft className='h-4 w-4 me-2 rtl:rotate-180 rtl:rotate-180' />
              {t('common.back')}
            </Button>
          </Link>

          <div className='max-w-3xl mx-auto space-y-6'>
            <div>
              <h1 className='text-4xl font-black'>
                <span className='gradient-gaming-text'>
                  {t('profile.myProfile')}
                </span>
              </h1>
              <p className='text-muted-foreground mt-2'>
                {t('profile.manageAccount')}
              </p>
            </div>

            <form onSubmit={handleSubmit(handleUpdate, createOnErrorHandler)}>
              <Card className='border-primary/20'>
                <CardHeader>
                  <CardTitle>{t('profile.profileInformation')}</CardTitle>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='flex items-center gap-6'>
                    <Controller
                      control={control}
                      name='avatar'
                      render={({ field }) => (
                        <Avatar className='h-24 w-24 border-4 border-primary/20'>
                          <AvatarImage
                            src={
                              field.value instanceof File
                                ? URL.createObjectURL(field.value)
                                : field.value?.url
                            }
                          />
                          <AvatarFallback className='bg-primary/10 text-primary text-2xl font-bold'>
                            {profile.name?.[0] || ''}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    />
                    <div className='space-y-2'>
                      <Label htmlFor='avatar'>{t('user.avatar')}</Label>
                      <div className='flex gap-2'>
                        <Controller
                          control={control}
                          name='avatar'
                          render={({ field }) => (
                            <Input
                              accept='image/*'
                              type='file'
                              disabled={disabled}
                              id='avatar'
                              className='text-center cursor-pointer'
                              placeholder={t('form.placeholder.imageUrl')}
                              onChange={(e) =>
                                field.onChange(e.target.files[0])
                              }
                            />
                          )}
                        />
                      </div>
                      <p className='text-xs text-muted-foreground'>
                        {t('profile.avatarRecommendation')}
                      </p>
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='name'>{t('user.name')} *</Label>
                    <Controller
                      control={control}
                      name='name'
                      render={({ field }) => (
                        <Input
                          id='name'
                          placeholder={t('user.enterName')}
                          required
                          {...field}
                        />
                      )}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='email'>{t('user.email')} *</Label>
                    <Controller
                      control={control}
                      name='email'
                      render={({ field }) => (
                        <Input
                          id='email'
                          type='email'
                          placeholder={t('user.enterEmail')}
                          required
                          {...field}
                        />
                      )}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='password'>{t('common.password')}</Label>
                    <Controller
                      control={control}
                      name='password'
                      render={({ field }) => (
                        <Input
                          id='password'
                          type='password'
                          placeholder='********'
                          {...field}
                        />
                      )}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='bio'>{t('user.bio')}</Label>
                    <Controller
                      control={control}
                      name='bio'
                      render={({ field }) => (
                        <Textarea
                          id='bio'
                          placeholder={t('user.userBio')}
                          rows={5}
                          {...field}
                        />
                      )}
                    />

                    <p className='text-xs text-muted-foreground'>
                      {t('profile.bioDescription')}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className='flex gap-4 pt-4'>
                    <Button
                      type='submit'
                      className='gradient-gaming glow-effect hover:glow-effect-strong font-semibold uppercase'
                    >
                      <Save className='h-4 w-4 me-2' />
                      {t('profile.updateProfile')}
                    </Button>
                    <Button type='button' variant='outline'>
                      {t('common.cancel')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    );
}
