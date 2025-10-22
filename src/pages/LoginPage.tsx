import { object } from 'zod';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Custom Hooks
import useAuth from '@/hooks/useAuth';

// Components
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import useLoadingStore from '@/store/loading';
import { createOnErrorHandler } from '@/utilities';
import { useLoginMutation, useRegisterMutation } from '@/utilities/api/auth';
import {
  generateEmailSchema,
  generateStringSchema,
} from '@/validations/common';

const registerFormSchema = object({
  email: generateEmailSchema(),
  name: generateStringSchema('name'),
  password: generateStringSchema('password', 8, 255),
  confirmPassword: generateStringSchema('confirm password'),
});
const loginFormSchema = object({
  email: generateEmailSchema(),
  password: generateStringSchema('password', 8, 255),
});

type LoginFormProps = Zod.infer<typeof loginFormSchema>;
type RegisterFormProps = Zod.infer<typeof registerFormSchema>;

export default function LoginPage() {
  // Context
  const { loading } = useLoadingStore();

  // Hooks
  const { signin } = useAuth();
  const { t } = useTranslation();
  const loginForm = useForm<LoginFormProps>({
    resolver: zodResolver(loginFormSchema),
  });
  const registerForm = useForm<RegisterFormProps>({
    resolver: zodResolver(registerFormSchema),
  });
  const { mutate: login } = useLoginMutation({
    redirectAfterSuccessTo: '/',
    stayOnLoadingAfterSuccessMutate: true,
    onSuccess: ({ data }) => signin(data.token, data.refreshToken),
  });
  const { mutate: register } = useRegisterMutation({
    redirectAfterSuccessTo: '/',
    stayOnLoadingAfterSuccessMutate: true,
    onSuccess: ({ data }) => signin(data.token, data.refreshToken),
  });

  // Utilities
  const handleLogin = async (data: Required<LoginFormProps>) => {
    login(data);
  };

  const handleRegister = async (data: Required<RegisterFormProps>) => {
    register({
      email: data.email,
      name: data.name,
      password: data.password,
    });
  };

  // Render
  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <Header />
      <main className='flex-1 container py-8 flex items-center justify-center'>
        <div className='w-full max-w-md'>
          <Tabs defaultValue='login' className='w-full'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='login'>Login</TabsTrigger>
              <TabsTrigger value='register'>Register</TabsTrigger>
            </TabsList>
            <TabsContent value='login'>
              <Card>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>
                    Enter your email and password to access your account
                  </CardDescription>
                </CardHeader>
                <form
                  onSubmit={loginForm.handleSubmit(
                    handleLogin,
                    createOnErrorHandler
                  )}
                >
                  <CardContent className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='login-email'>Email</Label>
                      <Controller
                        control={loginForm.control}
                        name='email'
                        render={({ field }) => (
                          <Input
                            disabled={loading}
                            id='login-email'
                            type='email'
                            placeholder='you@example.com'
                            {...field}
                          />
                        )}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='login-password'>Password</Label>
                      <Controller
                        control={loginForm.control}
                        name='password'
                        render={({ field }) => (
                          <Input
                            disabled={loading}
                            id='login-password'
                            type='password'
                            placeholder='••••••••'
                            {...field}
                          />
                        )}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className='flex flex-col gap-4'>
                    <Button disabled={loading} type='submit' className='w-full'>
                      Login
                    </Button>
                    <p className='text-sm text-muted-foreground text-center'>
                      <Link
                        to={routes.passwordRecovery}
                        className='hover:text-foreground transition-colors'
                      >
                        Forgot your password?
                      </Link>
                    </p>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            <TabsContent value='register'>
              <Card>
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>
                    Enter your details to create a new account
                  </CardDescription>
                </CardHeader>
                <form
                  onSubmit={registerForm.handleSubmit(
                    handleRegister,
                    createOnErrorHandler
                  )}
                >
                  <CardContent className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='register-name'>{t('common.name')}</Label>
                      <Controller
                        control={registerForm.control}
                        name='name'
                        render={({ field }) => (
                          <Input
                            disabled={loading}
                            id='register-name'
                            type='text'
                            placeholder='John Doe'
                            {...field}
                          />
                        )}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='register-email'>Email</Label>
                      <Controller
                        control={registerForm.control}
                        name='email'
                        render={({ field }) => (
                          <Input
                            disabled={loading}
                            id='register-email'
                            type='email'
                            placeholder='you@example.com'
                            {...field}
                          />
                        )}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='register-password'>Password</Label>
                      <Controller
                        control={registerForm.control}
                        name='password'
                        render={({ field }) => (
                          <Input
                            disabled={loading}
                            id='register-password'
                            type='password'
                            placeholder='••••••••'
                            {...field}
                          />
                        )}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='register-confirm-password'>
                        Confirm Password
                      </Label>
                      <Controller
                        control={registerForm.control}
                        name='confirmPassword'
                        render={({ field }) => (
                          <Input
                            disabled={loading}
                            id='register-confirm-password'
                            type='password'
                            placeholder='••••••••'
                            {...field}
                          />
                        )}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button disabled={loading} type='submit' className='w-full'>
                      Create Account
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
