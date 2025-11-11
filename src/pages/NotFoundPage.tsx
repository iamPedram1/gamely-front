import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, ArrowLeft, Gamepad2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function NotFoundPage() {
  // Hooks
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Render
  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4'>
      <div className='max-w-2xl w-full'>
        <Card className='relative overflow-hidden bg-gradient-to-br from-background to-primary/5 border-primary/20 p-8 md:p-12'>
          {/* Decorative Elements */}
          <div className='absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2' />
          <div className='absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2' />

          <div className='relative z-10 text-center space-y-8'>
            {/* 404 Animation */}
            <div className='relative'>
              <div className='flex items-center justify-center gap-4'>
                <Gamepad2 className='h-16 w-16 md:h-20 md:w-20 text-primary animate-bounce' />
                <div className='text-8xl md:text-9xl font-black gradient-gaming-text'>
                  404
                </div>
                <Gamepad2
                  className='h-16 w-16 md:h-20 md:w-20 text-secondary animate-bounce'
                  style={{ animationDelay: '0.2s' }}
                />
              </div>
              <div className='absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl -z-10' />
            </div>

            {/* Message */}
            <div className='space-y-4'>
              <h1 className='text-3xl md:text-4xl font-bold'>
                {t('notFound.title', 'Game Over!')}
              </h1>
              <p className='text-lg text-muted-foreground max-w-md mx-auto'>
                {t(
                  'notFound.description',
                  "Oops! The page you're looking for has respawned somewhere else or doesn't exist."
                )}
              </p>
            </div>

            {/* Search Suggestions */}
            <div className='bg-muted/30 rounded-lg p-6 space-y-3'>
              <div className='flex flex-wrap items-center justify-center gap-2 text-sm'>
                <span className='px-3 py-1 bg-background rounded-full border border-primary/20'>
                  {t('notFound.checkUrl', 'Check the URL')}
                </span>
                <Link to='/'>
                  <span className='px-3 py-1 bg-background rounded-full border border-primary/20'>
                    {t('notFound.goHome', 'Go to homepage')}
                  </span>
                </Link>
                <span
                  onClick={() => navigate(-1)}
                  className='cursor-pointer px-3 py-1 bg-background rounded-full border border-primary/20'
                >
                  {t('notFound.goBack', 'Go back')}
                </span>
                <div className='flex items-center justify-center gap-2 text-sm text-muted-foreground'>
                  <Search className='h-4 w-4' />
                  <span>{t('notFound.suggestions', 'You might want to:')}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex flex-col sm:flex-row items-center justify-center gap-4 pt-4'>
              <Button
                size='lg'
                onClick={() => navigate(-1)}
                variant='outline'
                className='w-full sm:w-auto flex items-center gap-2'
              >
                <ArrowLeft className='h-4 w-4 rtl:rotate-180' />
                {t('notFound.goBackButton', 'Go Back')}
              </Button>
              <Button
                size='lg'
                onClick={() => navigate('/')}
                className='w-full sm:w-auto gradient-gaming glow-effect hover:glow-effect-strong flex items-center gap-2'
              >
                <Home className='h-4 w-4' />
                {t('notFound.homeButton', 'Back to Home')}
              </Button>
            </div>

            {/* Fun Message */}
            <div className='pt-8 border-t border-primary/10'>
              <p className='text-sm text-muted-foreground italic'>
                {t(
                  'notFound.funMessage',
                  '💡 Pro tip: This page is harder to find than a legendary loot drop!'
                )}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
