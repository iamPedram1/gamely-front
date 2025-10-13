import { Link } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';

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
import { useLoginMutation, useRegisterMutation } from '@/utilities/api/auth';
import useLoadingStore from '@/store/loading';
import { setToken } from '@/utilities/cookie/token';

interface FormProps {
  loginEmail: string;
  loginPassword: string;
  registerName: string;
  registerEmail: string;
  registerPassword: string;
  registerConfirmPassword: string;
}

export default function LoginPage() {
  // Context
  const { loading } = useLoadingStore();

  // Hooks
  const { control, handleSubmit } = useForm<FormProps>();
  const { mutate: login } = useLoginMutation({
    redirectAfterSuccessTo: '/',
    onSuccess: ({ data }) => setToken(data.token),
  });
  const { mutate: register } = useRegisterMutation({
    redirectAfterSuccessTo: '/',
    onSuccess: ({ data }) => setToken(data.token),
  });

  // Utilities
  const handleLogin = async (data: FormProps) => {
    login({ email: data.loginEmail, password: data.loginPassword });
  };

  const handleRegister = async (data: FormProps) => {
    register({
      email: data.registerEmail,
      name: data.registerName,
      password: data.registerPassword,
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
                <form onSubmit={handleSubmit(handleLogin)}>
                  <CardContent className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='login-email'>Email</Label>
                      <Controller
                        control={control}
                        name='loginEmail'
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
                        control={control}
                        name='loginPassword'
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
                        to='/forgot-password'
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
                <form onSubmit={handleSubmit(handleRegister)}>
                  <CardContent className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='register-name'>Name</Label>
                      <Controller
                        control={control}
                        name='registerName'
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
                        control={control}
                        name='registerEmail'
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
                        control={control}
                        name='registerPassword'
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
                        control={control}
                        name='registerConfirmPassword'
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
