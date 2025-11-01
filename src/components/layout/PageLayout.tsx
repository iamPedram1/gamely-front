import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import routes from '@/utilities/routes';

interface PageLayoutProps {
  children: ReactNode;
  backTo?: string;
  backLabel?: string;
  showBack?: boolean;
  className?: string;
}

interface LoadingStateProps {
  message?: string;
  className?: string;
}

interface NotFoundStateProps {
  title: string;
  description?: string;
  backTo?: string;
  backLabel?: string;
  className?: string;
}

interface UnauthorizedStateProps {
  className?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
}

export function PageLayout({
  children,
  backTo,
  backLabel,
  showBack = true,
  className = 'flex-1 container py-4 pb-12',
}: PageLayoutProps) {
  const { t } = useTranslation();

  return (
    <main className={className}>
      {showBack && backTo && (
        <Link to={backTo}>
          <Button variant='ghost' className='mb-4'>
            <ArrowLeft className='h-4 w-4 rtl:rotate-180' />
            {backLabel || t('common.back')}
          </Button>
        </Link>
      )}
      {children}
    </main>
  );
}

export function LoadingState({
  message,
  className = 'flex-1 container py-40 items-center justify-center',
}: LoadingStateProps) {
  const { t } = useTranslation();

  return (
    <main className={className}>
      <div className='flex flex-col items-center justify-center space-y-4'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
        <h1 className='text-2xl md:text-4xl font-bold text-center'>
          {message || t('common.loading')}
        </h1>
      </div>
    </main>
  );
}

export function NotFoundState({
  title,
  description,
  backTo,
  backLabel,
  className = 'flex flex-col container py-40 w-fit m-auto items-center justify-center',
}: NotFoundStateProps) {
  const { t } = useTranslation();

  return (
    <main className={className}>
      <h1 className='text-6xl md:text-9xl font-bold mb-4'>404</h1>
      <h2 className='text-2xl md:text-4xl font-bold mb-4'>{title}</h2>
      {description && (
        <p className='text-muted-foreground mb-6'>{description}</p>
      )}
      {backTo && (
        <Link to={backTo}>
          <Button variant='default' className='w-48 m-auto'>
            {backLabel || t('common.back')}
          </Button>
        </Link>
      )}
    </main>
  );
}

export function UnauthorizedState({
  className = 'flex-1 container py-40 items-center justify-center',
}: UnauthorizedStateProps) {
  const { t } = useTranslation();

  return (
    <main className={className}>
      <div className='text-center space-y-4'>
        <h1 className='text-6xl md:text-9xl font-bold mb-4'>401</h1>
        <h2 className='text-2xl md:text-4xl font-normal mb-4'>
          {t('user.unauthorized')}
        </h2>
        <Link to={routes.login} className='flex items-center justify-center'>
          <Button variant='default' className='w-48 mb-6'>
            {t('auth.login')}
          </Button>
        </Link>
      </div>
    </main>
  );
}

export function PageHeader({
  title,
  description,
  icon,
  className = 'mb-8',
}: PageHeaderProps) {
  return (
    <div className={className}>
      <h1 className='text-2xl md:text-4xl font-black flex items-center gap-3'>
        {icon}
        <span className='gradient-gaming-text'>{title}</span>
      </h1>
      {description && (
        <p className='text-muted-foreground mt-2'>{description}</p>
      )}
    </div>
  );
}
