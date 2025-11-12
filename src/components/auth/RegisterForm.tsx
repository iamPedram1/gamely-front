import { object } from 'zod';
import { useMemo } from 'react';
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
import { generateStringSchema } from '@/validations/common';
import { createOnErrorHandler } from '@/utilities/reactHookForm';

// Hooks
import { useLoadingStore } from '@/store/loading';
import { useRegisterMutation } from '@/utilities/api/auth';

const createRegisterFormSchema = () =>
  object({
    name: generateStringSchema('name', 3, 30),
    username: generateStringSchema('username', 3, 30),
    email: generateStringSchema('email'),
    password: generateStringSchema('password', 8),
    confirmPassword: generateStringSchema('confirm password', 8),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type FormSchema = Zod.infer<ReturnType<typeof createRegisterFormSchema>>;

interface RegisterFormProps {
  onNext: (email: string) => void;
}

export default function RegisterForm(props: RegisterFormProps) {
  // Props
  const { onNext } = props;

  // Context
  const { loading } = useLoadingStore();

  // Hooks
  const { t, i18n } = useTranslation();
  const registerSchema = useMemo(createRegisterFormSchema, [i18n.language]);
  const { mutate: register } = useRegisterMutation({
    alertOnlyOnError: true,
    onSuccess: () => onNext(registerForm.getValues('email')),
  });

  const registerForm = useForm<FormSchema>({
    resolver: zodResolver(registerSchema),
  });

  // Utilities
  const handleRegisterSubmit = (data: Required<FormSchema>) => {
    register(data);
  };

  // Render
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('auth.createAccount')}</CardTitle>
        <CardDescription>{t('auth.registerDescription')}</CardDescription>
      </CardHeader>
      <form
        onSubmit={registerForm.handleSubmit(
          handleRegisterSubmit,
          createOnErrorHandler
        )}
      >
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='register-name'>{t('auth.name')}</Label>
            <Controller
              control={registerForm.control}
              name='name'
              render={({ field }) => (
                <Input
                  disabled={loading}
                  id='register-name'
                  type='text'
                  placeholder={t('auth.namePlaceholder')}
                  {...field}
                />
              )}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='register-username'>{t('auth.username')}</Label>
            <Controller
              control={registerForm.control}
              name='username'
              render={({ field }) => (
                <Input
                  disabled={loading}
                  id='register-username'
                  type='text'
                  placeholder={t('auth.usernamePlaceholder')}
                  {...field}
                />
              )}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='register-email'>{t('common.email')}</Label>
            <Controller
              control={registerForm.control}
              name='email'
              render={({ field }) => (
                <Input
                  disabled={loading}
                  id='register-email'
                  type='email'
                  placeholder={t('auth.emailPlaceholder')}
                  {...field}
                />
              )}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='register-password'>{t('common.password')}</Label>
            <Controller
              control={registerForm.control}
              name='password'
              render={({ field }) => (
                <Input
                  disabled={loading}
                  id='register-password'
                  type='password'
                  placeholder={t('auth.passwordPlaceholder')}
                  {...field}
                />
              )}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='register-confirm-password'>
              {t('auth.confirmPassword')}
            </Label>
            <Controller
              control={registerForm.control}
              name='confirmPassword'
              render={({ field }) => (
                <Input
                  disabled={loading}
                  id='register-confirm-password'
                  type='password'
                  placeholder={t('auth.passwordPlaceholder')}
                  {...field}
                />
              )}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button disabled={loading} type='submit' className='w-full'>
            {t('auth.continue')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
