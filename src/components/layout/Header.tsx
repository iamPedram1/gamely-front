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
  Bell,
  Menu,
} from 'lucide-react';

// Custom Hooks
import useAuth from '@/hooks/useAuth';

// Components
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import DarkModeToggle from '@/components/DarkModeToggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import routes from '@/utilities/routes';
import {
  useNotificationsQuery,
  useSeenNotificationMutation,
} from '@/utilities/api/notification';
import Searchbar from '@/components/ui/searchbar';

export default function Header() {
  // States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hooks
  const { t } = useTranslation();
  const { isAuthorized, isAuthLoading, profile, logout } = useAuth();

  // Mock notifications data
  const notifications = useNotificationsQuery();
  const seenNotification = useSeenNotificationMutation({
    disableAutoAlert: true,
  });
  const unreadCount = notifications.data.docs.filter((n) => !n.seen).length;

  // Utilities
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

          <nav className='hidden lg:flex items-center gap-8 text-sm font-medium'>
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

        <div className='flex items-center gap-3'>
          <Searchbar />

          {/* Notifications */}
          {isAuthorized && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  size='sm'
                  className='relative h-9 w-9 p-0'
                >
                  <Bell className='h-5 w-5' />
                  {unreadCount > 0 && (
                    <Badge
                      variant='destructive'
                      className='absolute -top-0 -right-0 h-4 w-4 p-0 text-xs flex items-center justify-center'
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='end'
                className='w-80 bg-background/95 backdrop-blur-xl border-primary/20'
              >
                <DropdownMenuLabel className='font-semibold'>
                  {t('notifications.title')}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ScrollArea className='h-[17rem]'>
                  {notifications.data.docs.length === 0 ? (
                    <div className='p-4 text-center text-muted-foreground text-sm'>
                      {t('notifications.empty')}
                    </div>
                  ) : (
                    notifications.data.docs.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className='flex flex-col items-start p-3 cursor-pointer hover:bg-accent/50'
                        onClick={() => seenNotification.mutate(notification.id)}
                      >
                        <div className='flex items-start gap-2 w-full'>
                          <div
                            className={`w-2 h-2 rounded-full mt-2 ${
                              notification.seen ? 'bg-muted' : 'bg-primary'
                            }`}
                          />
                          <div className='flex-1'>
                            <p className='text-sm leading-relaxed'>
                              {notification.message}
                            </p>
                            <p className='text-xs text-muted-foreground mt-1'>
                              {notification.createDate}
                            </p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <div className='hidden md:flex items-center gap-3'>
            <LanguageSwitcher />
            <DarkModeToggle />
          </div>

          {isAuthorized && profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  className='p-0.5 h-fit w-fit rounded-full transition-all'
                  disabled={isAuthLoading}
                >
                  <Avatar className='w-10 h-10 border-2 border-primary/20'>
                    <AvatarImage
                      src={profile.avatar?.url || '/placeholder.svg'}
                      alt={profile.name}
                    />
                    <AvatarFallback className='bg-gradient-gaming text-xs font-semibold'>
                      {profile.name[0]}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='end'
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
                {['author', 'admin', 'superAdmin'].includes(profile.role) && (
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
                  onClick={() => logout()}
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

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant='ghost'
                size='sm'
                className='lg:hidden h-10 w-10 p-0'
              >
                <Menu className='h-5 w-5' />
              </Button>
            </SheetTrigger>
            <SheetContent side='right' className='w-80'>
              <SheetHeader>
                <SheetTitle className='gradient-gaming-text'>
                  {t('nav.menu')}
                </SheetTitle>
              </SheetHeader>
              <div className='flex flex-col gap-4 mt-6'>
                <div className='flex items-center gap-4 pb-4 border-b'>
                  <LanguageSwitcher />
                  <DarkModeToggle />
                </div>
                <nav className='flex flex-col gap-4'>
                  <Link
                    to={routes.posts.index}
                    className='text-lg font-medium hover:text-primary transition-colors'
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.news')}
                  </Link>
                  <Link
                    to={routes.games.index}
                    className='text-lg font-medium hover:text-primary transition-colors'
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.games')}
                  </Link>
                  <Link
                    to={routes.tags.index}
                    className='text-lg font-medium hover:text-primary transition-colors'
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.tags')}
                  </Link>
                </nav>
                <div className='sm:hidden mt-4'>
                  <Searchbar />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
