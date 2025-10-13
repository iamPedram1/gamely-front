import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Utilities
import { useLoginMutation, useRegisterMutation } from '@/utilities/api/auth';

export default function LoginPage() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

  const { mutate: login } = useLoginMutation({
    redirectAfterSuccessTo: '/',
    onSuccess: (data) => {
      console.log('Success', data);
    },
    onError: (data) => {
      console.log('Error', data);
    },
  });
  const { mutate: register } = useRegisterMutation({
    redirectAfterSuccessTo: '/',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    login({ email: loginEmail, password: loginPassword });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    register({
      email: registerEmail,
      name: registerName,
      password: registerPassword,
    });
  };

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
                <form onSubmit={handleLogin}>
                  <CardContent className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='login-email'>Email</Label>
                      <Input
                        id='login-email'
                        type='email'
                        placeholder='you@example.com'
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='login-password'>Password</Label>
                      <Input
                        id='login-password'
                        type='password'
                        placeholder='••••••••'
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter className='flex flex-col gap-4'>
                    <Button type='submit' className='w-full'>
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
                <form onSubmit={handleRegister}>
                  <CardContent className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='register-name'>Name</Label>
                      <Input
                        id='register-name'
                        type='text'
                        placeholder='John Doe'
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        required
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='register-email'>Email</Label>
                      <Input
                        id='register-email'
                        type='email'
                        placeholder='you@example.com'
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='register-password'>Password</Label>
                      <Input
                        id='register-password'
                        type='password'
                        placeholder='••••••••'
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='register-confirm-password'>
                        Confirm Password
                      </Label>
                      <Input
                        id='register-confirm-password'
                        type='password'
                        placeholder='••••••••'
                        value={registerConfirmPassword}
                        onChange={(e) =>
                          setRegisterConfirmPassword(e.target.value)
                        }
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type='submit' className='w-full'>
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
