import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { object, enum as zodEnum } from 'zod';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { ArrowLeft, Save, Ban, CheckCircle } from 'lucide-react';

// Hooks
import useAuth from '@/hooks/useAuth';
import { useBoolean } from '@/hooks/state';

// Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import BanUserDialog from '@/components/admin/BanUserDialog';

// Utilities
import routes from '@/utilities/routes';
import { createOnErrorHandler, getChangedFields, getDate } from '@/utilities';
import {
  unbanUser,
  useBanUserMutation,
  useUnbanUserMutation,
} from '@/utilities/api/management/ban';
import { useUpdateUser, useUserQuery } from '@/utilities/api/management/user';
import {
  generateEmailSchema,
  generateStringSchema,
} from '@/validations/common';

const createUserSchema = () =>
  object({
    username: generateStringSchema('username', 3, 255, false),
    email: generateEmailSchema(),
    role: zodEnum(['user', 'author', 'admin', 'superAdmin']).optional(),
    bio: generateStringSchema('bio', 10, 500, false),
    createDate: generateStringSchema(
      'create date',
      undefined,
      undefined,
      false
    ),
  });

type FormSchema = Zod.infer<ReturnType<typeof createUserSchema>>;

export default function UserDetailPage() {
  // Translations
  const { t, i18n } = useTranslation();

  // Hooks
  const { profile } = useAuth();
  const blockDialog = useBoolean();
  const updateUser = useUpdateUser();
  const banUser = useBanUserMutation();
  const unbanUser = useUnbanUserMutation();
  const schema = useMemo(createUserSchema, [i18n.language]);
  const formMethods = useForm<FormSchema>({ resolver: zodResolver(schema) });
  const user = useUserQuery({ onFetch: formMethods.reset });
  const isUpdatingSelf = user?.data?.id === profile?.id;
  const isLoading = updateUser.isPending || !user.isFetched;
  const disabled =
    isLoading ||
    (profile.role !== 'superAdmin' &&
      ['admin', 'superAdmin'].includes(user.data.role) &&
      !isUpdatingSelf);

  // Utilities
  const handleUpdate = (data: FormSchema) => {
    updateUser.mutate({
      userId: user.data.id,
      data: getChangedFields(user.data, data),
    });
  };

  const handleUnblock = () => {
    unbanUser.mutate(user.data.id);
  };

  const handleBlock = (blockData: {
    type: 'permanent' | 'temporary';
    startAt: string;
    endAt: string | null;
  }) => {
    banUser.mutate({ userId: user.data.id, data: blockData });
  };

  // Render
  if (user.isFetching) {
    return (
      <div className='space-y-6 min-h-screen'>
        <div className='text-center py-12'>
          <h1 className='text-2xl font-bold mb-4'>{t('common.loading')}</h1>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className='space-y-6'>
        <div className='text-center py-12'>
          <h1 className='text-2xl font-bold mb-4'>{t('user.userNotFound')}</h1>
          <Link to={routes.dashboard.users.index}>
            <Button>{t('user.backToUsers')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6 max-w-4xl'>
      <div className='flex items-center gap-4'>
        <Link to={routes.dashboard.users.index}>
          <Button variant='ghost' size='icon'>
            <ArrowLeft className='h-5 w-5 rtl:rotate-180' />
          </Button>
        </Link>
        <div>
          <h1 className='text-2xl md:text-4xl font-black'>
            <span className='gradient-gaming-text'>
              {t('user.userDetails')}
            </span>
          </h1>
          <p className='text-muted-foreground mt-2'>
            {t('user.manageUserInfo')}
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* User Info Card */}
        <Card className='border-primary/20 lg:col-span-1'>
          <CardHeader>
            <CardTitle>{t('user.userInformation')}</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex flex-col items-center text-center space-y-4'>
              <Avatar className='h-24 w-24 border-4 border-primary/20'>
                <AvatarImage
                  src={user?.data?.avatar?.url}
                  alt={user?.data?.username}
                />
                <AvatarFallback className='bg-primary/10 text-primary text-2xl font-bold'>
                  {user?.data?.username[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className='text-xl font-bold'>{user?.data?.username}</h3>
                <p className='text-sm text-muted-foreground'>
                  {user?.data?.email}
                </p>
              </div>
              <div className='flex gap-2'>
                <Badge
                  variant={
                    user?.data?.role === 'admin' ? 'default' : 'secondary'
                  }
                  className={
                    user.data?.role === 'admin'
                      ? 'gradient-gaming'
                      : 'bg-primary/10 text-primary'
                  }
                >
                  {t(`user.${user.data?.role}`)}
                </Badge>

                <Badge
                  variant={user.data.isBanned ? 'destructive' : 'default'}
                  className={
                    user.data.isBanned
                      ? ''
                      : 'bg-green-500/10 text-green-500 border-green-500/20'
                  }
                >
                  {t(user.data.isBanned ? `user.banned` : 'user.active')}
                </Badge>
              </div>
              <p className='text-xs text-muted-foreground'>
                {t('user.joined')} {getDate(user.data?.createDate)}
              </p>
            </div>

            {!user.data?.isBanned ? (
              <Button
                disabled={disabled || user.data.id === profile.id}
                variant='destructive'
                className='w-full'
                onClick={blockDialog.setTrue}
              >
                <Ban className='h-4 w-4' />
                {t('user.block')}
              </Button>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    disabled={disabled || user.data.id === profile.id}
                    variant='default'
                    className='w-full'
                  >
                    <CheckCircle className='h-4 w-4' />
                    {t('user.unblock')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('user.unblockUser')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('user.unblockUserDescription')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className='gap-2'>
                    <AlertDialogCancel className='w-24'>
                      {t('common.cancel')}
                    </AlertDialogCancel>
                    <AlertDialogAction className='w-24' onClick={handleUnblock}>
                      {t('common.confirm')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className='border-primary/20 lg:col-span-2'>
          <CardHeader>
            <CardTitle>{t('user.editUserDetails')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={formMethods.handleSubmit(
                handleUpdate,
                createOnErrorHandler
              )}
              className='space-y-6'
            >
              <div className='space-y-2'>
                <Label htmlFor='username'>
                  {t('user.name')} {t('form.required')}
                </Label>
                <Controller
                  control={formMethods.control}
                  name='username'
                  render={({ field }) => (
                    <Input
                      id='username'
                      placeholder={t('user.enterUserName')}
                      disabled={disabled}
                      {...field}
                    />
                  )}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='email'>
                  {t('user.email')} {t('form.required')}
                </Label>
                <Controller
                  control={formMethods.control}
                  name='email'
                  defaultValue=''
                  render={({ field }) => (
                    <Input
                      id='email'
                      type='email'
                      placeholder={t('user.enterEmail')}
                      disabled={disabled}
                      {...field}
                    />
                  )}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='role'>
                  {t('user.role')} {t('form.required')}
                </Label>
                <Controller
                  control={formMethods.control}
                  name='role'
                  defaultValue='user'
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                      disabled={disabled || user.data.role !== 'superAdmin'}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='user'>{t('user.user')}</SelectItem>
                        <SelectItem value='author'>
                          {t('user.author')}
                        </SelectItem>
                        <SelectItem value='admin'>{t('user.admin')}</SelectItem>
                        <SelectItem disabled value='superAdmin'>
                          {t('user.superAdmin')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='bio'>{t('user.bio')}</Label>
                <Controller
                  control={formMethods.control}
                  name='bio'
                  defaultValue=''
                  render={({ field }) => (
                    <Textarea
                      id='bio'
                      placeholder={t('user.userBio')}
                      rows={4}
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
                  <Save className='h-4 w-4' />
                  {t('common.save')}
                </Button>
                <Link to={routes.dashboard.users.index}>
                  <Button disabled={disabled} type='button' variant='outline'>
                    {t('common.cancel')}
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Block User Dialog */}
      <BanUserDialog
        open={blockDialog.state}
        onClose={blockDialog.setFalse}
        onConfirm={handleBlock}
        userName={user.data?.username || ''}
        isLoading={updateUser.isPending}
      />
    </div>
  );
}
