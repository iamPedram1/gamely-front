import { Controller } from 'react-hook-form';

// Components
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

// Types
import type { UserProps } from '@/types/client/blog';

interface AvatarUploadProps {
  control: any;
  profile: UserProps;
  disabled: boolean;
  t: (key: string) => string;
}

export default function AvatarUpload({
  control,
  profile,
  disabled,
  t,
}: AvatarUploadProps) {
  return (
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
              {profile.username?.[0] || ''}
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
                onChange={(e) => field.onChange(e.target.files[0])}
              />
            )}
          />
        </div>
        <p className='text-xs text-muted-foreground'>
          {t('profile.avatarRecommendation')}
        </p>
      </div>
    </div>
  );
}
