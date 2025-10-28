import { object } from 'zod';
import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Custom Hooks
import useAuth from '@/hooks/useAuth';

// Components
import { Button } from '@/components/ui/button';
import ProfileForm from '@/components/profile/ProfileForm';

// Context
import useLoadingStore, { setLoadingState } from '@/store/loading';
import { useUpdateProfileMutation } from '@/utilities/api/auth';

// Utilities
import routes from '@/utilities/routes';
import { uploadFile } from '@/utilities/api/uploader';
import { createOnErrorHandler } from '@/utilities';
import {
  generateEmailSchema,
  generateFileSchema,
  generateStringSchema,
} from '@/validations/common';

// Schema definition
const createProfileSchema = () =>
  object({
    name: generateStringSchema('name', 3, 255).optional(),
    email: generateEmailSchema().optional(),
    bio: generateStringSchema('bio', 1, 255).optional().nullable(),
    password: generateStringSchema('password', 1, 255).optional().nullable(),
    avatar: generateFileSchema('coverImage').optional().nullable(),
  });

type FormSchema = Zod.infer<ReturnType<typeof createProfileSchema>>;

export default function ProfilePage() {
  // Context
  const { loading } = useLoadingStore();
  // Hooks
  const { t, i18n } = useTranslation();
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
    reset(profile);
  }, [profile, reset]);

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
  if (isAuthLoading) {
    return (
      <main className='flex-1 container py-40 items-center justify-center'>
        <h1 className='text-4xl md:text-4xl font-bold mb-4 text-center'>
          {t('common.loading')}
        </h1>
      </main>
    );
  }

  if (!isAuthorized) {
    return (
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
    );
  }

  return (
    <main className='flex-1 container py-8'>
      <Link to='/'>
        <Button variant='ghost' className='mb-6 flex items-center gap-2'>
          <ArrowLeft className='h-4 w-4 me-2 rtl:rotate-180' />
          {t('common.back')}
        </Button>
      </Link>
      <div className='max-w-3xl mx-auto space-y-6'>
        {/* Page Header */}
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

        {/* Profile Form */}
        <ProfileForm
          control={control}
          handleSubmit={handleSubmit}
          onSubmit={handleUpdate}
          onError={createOnErrorHandler}
          profile={profile}
          disabled={disabled}
          t={t}
        />
      </div>
    </main>
  );
}
