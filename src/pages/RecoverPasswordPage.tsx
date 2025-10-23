import { object } from 'zod';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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

// Custom Utilities
import routes from '@/utilities/routes';
import { createOnErrorHandler } from '@/utilities';
import { generateEmailSchema } from '@/validations/common';
import { usePasswordRecoveryMutation } from '@/utilities/api/auth';

const createRecoverPasswordSchema = () =>
  object({
    email: generateEmailSchema(),
  });

type FormSchema = Zod.infer<ReturnType<typeof createRecoverPasswordSchema>>;

export default function RecoverPasswordPage() {
  // Hooks
  const { t, i18n } = useTranslation();
  const schema = useMemo(createRecoverPasswordSchema, [i18n.language]);
  const recoverPassword = usePasswordRecoveryMutation();
  const { control, handleSubmit } = useForm<FormSchema>({
    resolver: zodResolver(schema),
  });

  // Utilities
  const onSubmit: SubmitHandler<FormSchema> = ({ email }) => {
    recoverPassword.mutate({ email });
  };

  // Render
  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <Header />
      <main className='flex-1 container py-16 flex items-center justify-center'>
        <div className='w-full max-w-md'>
          <Link to={routes.login}>
            <Button
              disabled={recoverPassword.isPending}
              variant='ghost'
              className='mb-6'
            >
              <ArrowLeft className='h-4 w-4 me-2 rtl:rotate-180' />
              {t('auth.backToLogin')}
            </Button>
          </Link>
          <Card className='border-primary/20'>
            <CardHeader>
              <CardTitle className='text-3xl font-black'>
                <span className='gradient-gaming-text'>
                  {t('auth.passwordRecovery')}
                </span>
              </CardTitle>
              <CardDescription>
                {t('auth.enterEmailForRecovery')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recoverPassword.status !== 'success' ? (
                <form
                  onSubmit={handleSubmit(onSubmit, createOnErrorHandler)}
                  className='space-y-6'
                >
                  <div className='space-y-2'>
                    <Label htmlFor='email'>{t('common.email')} *</Label>
                    <div className='relative'>
                      <Mail className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                      <Controller
                        control={control}
                        name='email'
                        render={({ field }) => (
                          <Input
                            id='email'
                            type='email'
                            placeholder={t('auth.emailPlaceholder')}
                            className='pl-10'
                            disabled={recoverPassword.isPending}
                            {...field}
                          />
                        )}
                      />
                    </div>
                  </div>

                  <Button
                    type='submit'
                    className='w-full gradient-gaming glow-effect hover:glow-effect-strong font-semibold uppercase'
                  >
                    {t('auth.sendResetLink')}
                  </Button>
                </form>
              ) : (
                <div className='text-center space-y-4 py-6'>
                  <div className='w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center'>
                    <Mail className='h-8 w-8 text-primary' />
                  </div>
                  <div>
                    <h3 className='text-xl font-bold mb-2'>
                      {t('auth.checkEmail')}
                    </h3>
                    <p className='text-sm text-muted-foreground'>
                      {t('auth.resetLinkSent')}{' '}
                      <strong>{recoverPassword.variables.email}</strong>
                    </p>
                  </div>
                  <Link to='/login'>
                    <Button
                      disabled={recoverPassword.isPending}
                      variant='outline'
                      className='mt-4'
                    >
                      {t('auth.backToLogin')}
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
