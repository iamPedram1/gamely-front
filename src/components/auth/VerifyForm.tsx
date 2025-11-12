import { object } from 'zod';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, CheckCircle } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Components
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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
import {
  useVerifyEmailMutation,
  useResendVerificationEmailMutation,
} from '@/utilities/api/auth';

const createVerificationSchema = () =>
  object({
    code: generateStringSchema('verification code', 6, 6),
  });

type FormSchema = Zod.infer<ReturnType<typeof createVerificationSchema>>;

interface VerifyFormProps {
  email: string;
  onBackToLogin: () => void;
  onBackToRegister: () => void;
}

export default function VerifyForm(props: VerifyFormProps) {
  // Props
  const { email, onBackToLogin, onBackToRegister } = props;

  // Context
  const { loading } = useLoadingStore();

  // Hooks
  const { t, i18n } = useTranslation();
  const verificationSchema = useMemo(createVerificationSchema, [i18n.language]);
  const { mutate: resendCode } = useResendVerificationEmailMutation();
  const { mutate: verifyEmail } = useVerifyEmailMutation({
    onSuccess: onBackToLogin,
  });

  const { control, handleSubmit } = useForm<FormSchema>({
    defaultValues: { code: '' },
    resolver: zodResolver(verificationSchema),
  });

  // Utilities
  const handleResendCode = () => resendCode(email);
  const handleVerification = async (data: FormSchema) => {
    verifyEmail({ email, code: data.code });
  };

  // Render
  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-3 mb-2'>
          <div className='p-2 rounded-lg bg-primary/10'>
            <Mail className='h-6 w-6 text-primary' />
          </div>
          <div>
            <CardTitle>{t('auth.verifyEmail')}</CardTitle>
            <CardDescription>{t('auth.verificationCodeSent')}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit(handleVerification, createOnErrorHandler)}>
        <CardContent className='space-y-4'>
          <div className='p-4 bg-muted/50 rounded-lg'>
            <p className='text-sm text-muted-foreground text-center'>
              {t('auth.verificationSentTo')}
            </p>
            <p className='text-sm font-medium text-center mt-1'>{email}</p>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='verification-code'>
              {t('auth.verificationCode')}
            </Label>
            <Controller
              control={control}
              name='code'
              render={({ field }) => (
                <Input
                  type='text'
                  placeholder='000000'
                  className='text-center text-2xl tracking-widest'
                  {...field}
                />
              )}
            />
            <p className='text-xs text-muted-foreground text-center'>
              {t('auth.enter6DigitCode')}
            </p>
          </div>
        </CardContent>
        <CardFooter className='flex flex-col gap-3'>
          <Button disabled={loading} type='submit' className='w-full'>
            <CheckCircle className='h-4 w-4 mr-2' />
            {t('auth.verifyAndRegister')}
          </Button>
          <Button
            type='button'
            variant='ghost'
            onClick={handleResendCode}
            disabled={loading}
            className='w-full'
          >
            {t('auth.resendCode')}
          </Button>
          <Button
            type='button'
            variant='outline'
            onClick={onBackToRegister}
            disabled={loading}
            className='w-full'
          >
            {t('common.back')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
