'use client';
import { ArrowLeft, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';

// Components
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

// Utilities
import routes from '@/utilities/routes';
import { createOnErrorHandler } from '@/utilities';
import { generatePasswordConfirmSchema } from '@/validations/common';
import { usePasswordChangeMutation } from '@/utilities/api/auth';

// Types
const resetPasswordSchema = generatePasswordConfirmSchema();

type FormSchema = Zod.infer<typeof resetPasswordSchema>;

export default function ChangePasswordPage() {
  // Hooks
  const params = useParams();
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm<FormSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });
  const changePassword = usePasswordChangeMutation({
    redirectMethod: 'replace',
    redirectAfterSuccessTo: routes.login,
  });

  // Utilities
  const onSubmit: SubmitHandler<FormSchema> = ({ password }) => {
    changePassword.mutate({ password, recoveryKey: params.id });
  };

  // Render
  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <Header />
      <main className='flex-1 container py-16 flex items-center justify-center'>
        <div className='w-full max-w-md'>
          <Link to={routes.login}>
            <Button
              disabled={changePassword.isPending}
              variant='ghost'
              className='mb-6'
            >
              <ArrowLeft className='h-4 w-4 mr-2' />
              {t('auth.backToLogin')}
            </Button>
          </Link>

          <Card className='border-primary/20'>
            <CardHeader>
              <CardTitle className='text-3xl font-black'>
                <span className='gradient-gaming-text'>
                  {t('auth.resetPassword')}
                </span>
              </CardTitle>
              <CardDescription>Enter your new password</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit(onSubmit, createOnErrorHandler)}
                className='space-y-6'
              >
                <div className='space-y-2'>
                  <Label htmlFor='password'>{t('auth.newPassword')} *</Label>
                  <div className='relative'>
                    <Lock className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                    <Controller
                      control={control}
                      name='password'
                      render={({ field }) => (
                        <Input
                          disabled={changePassword.isPending}
                          id='password'
                          type='password'
                          placeholder='Enter new password'
                          className='pl-10'
                          {...field}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='confirmPassword'>
                    {t('auth.confirmPassword')} *
                  </Label>
                  <div className='relative'>
                    <Lock className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                    <Controller
                      control={control}
                      name='confirmPassword'
                      render={({ field }) => (
                        <Input
                          disabled={changePassword.isPending}
                          id='confirmPassword'
                          type='password'
                          placeholder='Confirm new password'
                          className='pl-10'
                          {...field}
                        />
                      )}
                    />
                  </div>
                </div>
                <Button
                  disabled={changePassword.isPending}
                  type='submit'
                  className='w-full gradient-gaming glow-effect hover:glow-effect-strong font-semibold uppercase'
                >
                  {t('auth.resetPassword')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
