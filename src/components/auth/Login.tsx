import { object } from 'zod';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Components
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Utilities
import routes from '@/utilities/routes';
import { generateStringSchema } from '@/validations/common';
import { createOnErrorHandler } from '@/utilities/reactHookForm';

// Hooks
import useAuth from '@/hooks/useAuth';
import { useLoadingStore } from '@/store/loading';
import { useLoginMutation } from '@/utilities/api/auth';

type LoginFormProps = {
  email: string;
  password: string;
};

const createLoginFormSchema = () =>
  object({
    email: generateStringSchema('email'),
    password: generateStringSchema('password'),
  });

export default function LoginForm() {
  // Hooks
  const { signin } = useAuth();
  const { t, i18n } = useTranslation();
  const { loading } = useLoadingStore();
  const loginSchema = useMemo(createLoginFormSchema, [i18n.language]);
  const { control, handleSubmit } = useForm<LoginFormProps>({
    resolver: zodResolver(loginSchema),
  });
  const { mutate: login } = useLoginMutation({
    redirectAfterSuccessTo: '/',
    stayOnLoadingAfterSuccessMutate: true,
    onSuccess: ({ data }) => signin(data.accessToken, data.refreshToken),
  });

  // Utilities
  const handleLogin = async (data: Required<LoginFormProps>) => {
    login(data);
  };

  // Render
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('auth.login')}</CardTitle>
        <CardDescription>{t('auth.loginDescription')}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(handleLogin, createOnErrorHandler)}>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='login-email'>{t('common.email')}</Label>
            <Controller
              control={control}
              name='email'
              render={({ field }) => (
                <Input
                  disabled={loading}
                  id='login-email'
                  type='email'
                  placeholder={t('auth.emailPlaceholder')}
                  {...field}
                />
              )}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='login-password'>{t('common.password')}</Label>
            <Controller
              control={control}
              name='password'
              render={({ field }) => (
                <Input
                  disabled={loading}
                  id='login-password'
                  type='password'
                  placeholder={t('auth.passwordPlaceholder')}
                  {...field}
                />
              )}
            />
          </div>
        </CardContent>
        <CardFooter className='flex flex-col gap-4'>
          <Button disabled={loading} type='submit' className='w-full'>
            {t('auth.login')}
          </Button>
          <p className='text-sm text-muted-foreground text-center'>
            <Link
              to={routes.passwordRecovery}
              className='hover:text-foreground transition-colors'
            >
              {t('auth.forgotPassword')}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
