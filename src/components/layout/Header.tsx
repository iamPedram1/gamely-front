import type React from 'react';

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Gamepad2,
  Search,
  LogOut,
  LayoutDashboard,
  UserCircle,
  ChevronDown,
} from 'lucide-react';

// Custom Hooks
import useAuth from '@/hooks/useAuth';

// Components
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import routes from '@/utilities/routes';
import DarkModeToggle from '@/components/DarkModeToggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Header() {
  // States
  const [searchQuery, setSearchQuery] = useState('');

  // Hooks
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { isAuthorized, isAuthLoading, profile, logout } = useAuth();

  // Utilities
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search:', searchQuery);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getUserInitials = (name: string = '') => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleLabel = (role: string) => {
    return t(`user.${role}`);
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
              <Search className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
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
          {isAuthorized && profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  className='flex items-center gap-2 hover:bg-primary/10 transition-all h-10'
                  disabled={isAuthLoading}
                >
                  <Avatar className='h-8 w-8 border-2 border-primary/20'>
                    <AvatarImage
                      src={profile.avatar?.url || '/placeholder.svg'}
                      alt={profile.name}
                    />
                    <AvatarFallback className='bg-gradient-gaming text-xs font-semibold'>
                      {getUserInitials(profile.name)}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className='h-4 w-4 text-muted-foreground rtl:rotate-180' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='center'
                className='w-56 bg-background/95 backdrop-blur-xl border-primary/20'
              >
                <DropdownMenuLabel className='font-normal'>
                  <div className='flex flex-col space-y-1'>
                    <p className='text-sm font-semibold leading-none gradient-gaming-text'>
                      {profile.name}
                    </p>
                    <p className='text-xs leading-none text-muted-foreground mt-1'>
                      {getRoleLabel(profile.role)}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className='bg-primary/20' />
                <DropdownMenuItem
                  asChild
                  className='cursor-pointer hover:bg-primary/10 transition-colors'
                >
                  <Link
                    to={routes.profile.index}
                    className='flex items-center gap-2'
                  >
                    <UserCircle className='h-4 w-4' />
                    <span>{t('nav.profile')}</span>
                  </Link>
                </DropdownMenuItem>
                {(profile.role === 'admin' || profile.role === 'author') && (
                  <DropdownMenuItem
                    asChild
                    className='cursor-pointer hover:bg-primary/10 transition-colors'
                  >
                    <Link to={'/dashboard'} className='flex items-center gap-2'>
                      <LayoutDashboard className='h-4 w-4' />
                      <span>{t('nav.dashboard')}</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className='bg-primary/20' />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className='cursor-pointer w-full hover:bg-destructive/10 text-destructive focus:text-destructive transition-colors gap-2'
                >
                  <LogOut className='h-4 w-4 rtl:rotate-180' />
                  <span>{t('auth.logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
