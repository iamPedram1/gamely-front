import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, X } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import LoadingWrapper from '@/components/ui/loading-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FormWrapperProps {
  title: string;
  description?: string;
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  isSubmitting?: boolean;
  submitText?: string;
  cancelText?: string;
  className?: string;
}

export function FormWrapper({
  title,
  children,
  onSubmit,
  onCancel,
  isLoading = false,
  isSubmitting = false,
  submitText,
  cancelText,
  className = '',
}: FormWrapperProps) {
  // Hooks
  const { t } = useTranslation();

  // Render
  return (
    <div className={`max-w-4xl mx-auto p-6 ${className}`}>
      <Card className='bg-background/95 backdrop-blur-xl border-primary/20'>
        <CardHeader>
          <CardTitle className='text-2xl gradient-gaming-text'>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingWrapper isLoading={isLoading}>
            <form onSubmit={onSubmit} className='space-y-6'>
              {children}

              <div className='flex items-center gap-4'>
                <Button
                  type='submit'
                  disabled={isSubmitting}
                  className='flex items-center gap-2'
                >
                  <Save className='h-4 w-4' />
                  {isSubmitting
                    ? t('common.saving')
                    : submitText || t('common.save')}
                </Button>

                {onCancel && (
                  <Button
                    type='button'
                    variant='outline'
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className='flex items-center gap-2'
                  >
                    <X className='h-4 w-4' />
                    {cancelText || t('common.cancel')}
                  </Button>
                )}
              </div>
            </form>
          </LoadingWrapper>
        </CardContent>
      </Card>
    </div>
  );
}

export default FormWrapper;
