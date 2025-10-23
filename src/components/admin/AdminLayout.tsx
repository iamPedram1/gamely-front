'use client';

import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  FileText,
  Gamepad2,
  Tag,
  FolderOpen,
  LogOut,
  Menu,
  Users,
  MessageSquare,
} from 'lucide-react';

// Custom Hooks
import { useBoolean } from '@/hooks/state';

// Components
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

// Custom Utilities
import routes from '@/utilities/routes';
import DarkModeToggle from '@/components/DarkModeToggle';

export default function AdminLayout() {
  // Custom Hooks
  const sidebarOpen = useBoolean();
  const { t } = useTranslation();
  const location = useLocation();

  // Custom Utilities
  const isActive = (path: string) => location.pathname.startsWith(path);
  const navItems = [
    { path: '/dashboard/posts', icon: FileText, label: t('dashboard.posts') },
    { path: '/dashboard/games', icon: Gamepad2, label: t('dashboard.games') },
    {
      path: '/dashboard/categories',
      icon: FolderOpen,
      label: t('dashboard.categories'),
    },
    { path: '/dashboard/tags', icon: Tag, label: t('dashboard.tags') },
    { path: '/dashboard/users', icon: Users, label: t('dashboard.users') },
    {
      path: '/dashboard/comments',
      icon: MessageSquare,
      label: t('dashboard.comments'),
    },
  ];

  // Render
  return (
    <div className='min-h-screen bg-background flex'>
      <aside
        className={`${
          sidebarOpen.state ? 'w-64' : 'w-20'
        } border-r border-primary/20 bg-accent/30 transition-all duration-300 flex flex-col`}
      >
        <div className='p-6 border-b border-primary/20'>
          <Link
            to={routes.dashboard.posts.index}
            className='flex items-center gap-3 font-bold text-xl'
          >
            <div className='p-2 rounded-xl bg-gradient-gaming glow-effect'>
              <LayoutDashboard className='h-6 w-6 text-white' />
            </div>
            {sidebarOpen.state && (
              <span className='gradient-gaming-text'>
                {t('dashboard.admin')}
              </span>
            )}
          </Link>
        </div>
        <nav className='flex flex-col p-4 gap-2'>
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant={isActive(item.path) ? 'default' : 'ghost'}
                className={`w-full justify-start gap-3 ${
                  isActive(item.path)
                    ? 'gradient-gaming glow-effect'
                    : 'hover:bg-primary/10'
                }`}
              >
                <item.icon className='h-5 w-5' />
                {sidebarOpen.state && (
                  <span className='font-semibold'>{item.label}</span>
                )}
              </Button>
            </Link>
          ))}
        </nav>
        <div className='p-4 border-t border-primary/20'>
          <Link to='/'>
            <Button
              variant='ghost'
              className='w-full justify-start gap-3 hover:bg-primary/10'
            >
              <LogOut className='h-5 w-5' />
              {sidebarOpen.state && <span>{t('dashboard.backToSite')}</span>}
            </Button>
          </Link>
        </div>
      </aside>
      <div className='flex-1 flex flex-col'>
        <header className='h-16 border-b border-primary/20 bg-background/80 backdrop-blur-xl flex items-center justify-between px-6'>
          <div className='flex flex-row gap-2'>
            <Button variant='ghost' size='icon' onClick={sidebarOpen.toggle}>
              <Menu className='h-5 w-5' />
            </Button>
            <LanguageSwitcher />
            <DarkModeToggle />
          </div>
          <div className='flex items-center gap-4'>
            <span className='text-sm text-muted-foreground'>
              {t('nav.dashboard')}
            </span>
          </div>
        </header>
        <main className='flex-1 p-6 overflow-auto'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
