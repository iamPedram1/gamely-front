'use client';

import type React from 'react';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Gamepad2, Search, User } from 'lucide-react';

// Custom Hooks
import useAuth from '@/hooks/useAuth';

// Components
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

import routes from '@/utilities/routes';
import DarkModeToggle from '@/components/DarkModeToggle';

export default function Header() {
  // States
  const [searchQuery, setSearchQuery] = useState('');

  // Hooks
  const { t } = useTranslation();
  const { isAuthorized, isAuthLoading } = useAuth();

  // Utilities
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search:', searchQuery);
  };

  // Render
  return (
    <header className='sticky top-0 z-50 w-full border-b border-primary/20 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-20 items-center justify-between'>
        <div className='flex items-center gap-8'>
          <Link
            to='/'
            className='flex items-center gap-3 font-bold text-2xl group'
          >
            <div className='p-2 rounded-xl bg-gradient-gaming glow-effect group-hover:glow-effect-strong transition-all'>
              <Gamepad2 className='h-7 w-7 gradient-gaming-text dark:text-white' />
            </div>
            <span className='gradient-gaming-text'>{t('appName')}</span>
          </Link>

          <nav className='hidden md:flex items-center gap-8 text-sm font-medium'>
            <Link
              to={routes.posts.index}
              className='transition-all hover:text-primary hover:scale-105 text-foreground/80 uppercase tracking-wide'
            >
              {t('nav.news')}
            </Link>
            <Link
              to={routes.games.index}
              className='transition-all hover:text-primary hover:scale-105 text-foreground/80 uppercase tracking-wide'
            >
              {t('nav.games')}
            </Link>
            <Link
              to={routes.tags.index}
              className='transition-all hover:text-primary hover:scale-105 text-foreground/80 uppercase tracking-wide'
            >
              {t('nav.tags')}
            </Link>
          </nav>
        </div>

        <div className='flex items-center gap-4'>
          <form
            onSubmit={handleSearch}
            className='hidden sm:flex items-center gap-2'
          >
            <div className='relative'>
              <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
              <Input
                type='search'
                placeholder={t('common.search') + '...'}
                className='pl-10 w-[200px] lg:w-[300px] bg-accent/25 dark:bg-accent/50 border-primary/20 focus:border-primary'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
          <LanguageSwitcher />
          <DarkModeToggle />
          {isAuthorized ? (
            <Link to={routes.profile.index}>
              <Button
                variant='ghost'
                size='icon'
                className='hover:bg-primary/10'
              >
                <User className='h-5 w-5' />
              </Button>
            </Link>
          ) : (
            <Link to={routes.login}>
              <Button
                disabled={isAuthLoading}
                className='gradient-gaming font-semibold uppercase tracking-wide glow-effect hover:glow-effect-strong transition-all'
              >
                {t('auth.login')}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
