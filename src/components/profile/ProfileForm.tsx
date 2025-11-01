import { Controller, useFormContext } from 'react-hook-form';
import { Save } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AvatarUpload from '@/components/profile/AvatarUpload';
import { UserProps } from '@/types/client/blog';
import { createOnErrorHandler } from '@/utilities';
import { useTranslation } from 'react-i18next';

// Types

interface ProfileFormProps {
  onSubmit: (data: any) => void;
  profile: UserProps;
  disabled: boolean;
}

export default function ProfileForm({
  onSubmit,
  profile,
  disabled,
}: ProfileFormProps) {
  const { control, handleSubmit } = useFormContext();
  const { t } = useTranslation();

  // Render
  return (
    <form onSubmit={handleSubmit(onSubmit, createOnErrorHandler)}>
      <Card className='border-primary/20'>
        <CardHeader>
          <CardTitle>{t('profile.profileInformation')}</CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Avatar Upload */}
          <AvatarUpload
            control={control}
            profile={profile}
            disabled={disabled}
            t={t}
          />

          {/* Name Field */}
          <div className='space-y-2'>
            <Label htmlFor='username'>{t('user.username')} *</Label>
            <Controller
              control={control}
              name='username'
              render={({ field }) => (
                <Input
                  id='username'
                  placeholder={t('user.enterUserName')}
                  required
                  {...field}
                />
              )}
            />
          </div>

          {/* Email Field */}
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

          {/* Password Field */}
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

          {/* Bio Field */}
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

          {/* Form Actions */}
          <div className='flex gap-4 pt-4'>
            <Button
              type='submit'
              className='gradient-gaming glow-effect hover:glow-effect-strong font-semibold uppercase'
              disabled={disabled}
            >
              <Save className='h-4 w-4' />
              {t('profile.updateProfile')}
            </Button>
            <Button type='button' variant='outline'>
              {t('common.cancel')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
