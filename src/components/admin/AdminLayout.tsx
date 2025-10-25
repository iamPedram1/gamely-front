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
import useAuth from '@/hooks/useAuth';
import { useBoolean } from '@/hooks/state';

// Components
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

// Utilities
import routes from '@/utilities/routes';
import DarkModeToggle from '@/components/DarkModeToggle';

export default function AdminLayout() {
  // States
  const sidebarOpen = useBoolean();

  // Custom Hooks
  const { profile } = useAuth();
  const { t, i18n } = useTranslation();
  const location = useLocation();

  // Utilities
  const isActive = (path: string) => location.pathname.startsWith(path);
  const navItems = [
    {
      path: '/dashboard/posts',
      roles: ['author', 'admin', 'superAdmin'],
      icon: FileText,
      label: t('dashboard.posts'),
    },
    {
      path: '/dashboard/games',
      roles: ['author', 'admin', 'superAdmin'],
      icon: Gamepad2,
      label: t('dashboard.games'),
    },
    {
      path: '/dashboard/categories',
      icon: FolderOpen,
      roles: ['author', 'admin', 'superAdmin'],
      label: t('dashboard.categories'),
    },
    {
      path: '/dashboard/tags',
      roles: ['author', 'admin', 'superAdmin'],
      icon: Tag,
      label: t('dashboard.tags'),
    },
    {
      path: '/dashboard/users',
      roles: ['admin', 'superAdmin'],
      icon: Users,
      label: t('dashboard.users'),
    },
    {
      path: '/dashboard/comments',
      roles: ['author', 'admin', 'superAdmin'],
      icon: MessageSquare,
      label: t('dashboard.comments'),
    },
  ];

  // Render
  if (!profile) return <p>Loading</p>;
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
              <span className='gradient-gaming-text text-nowrap'>
                {t('dashboard.admin')}
              </span>
            )}
          </Link>
        </div>
        <nav className='flex flex-col p-4 gap-2'>
          {navItems.map((item) =>
            item.roles.includes(profile.role) ? (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? 'default' : 'ghost'}
                  className={`w-full justify-start gap-3 ${
                    isActive(item.path)
                      ? 'gradient-gaming glow-effect'
                      : 'hover:bg-primary/10'
                  }`}
                >
                  <item.icon className='min-h-5 min-w-5' />
                  {sidebarOpen.state && (
                    <span className='font-semibold text-nowrap'>
                      {item.label}
                    </span>
                  )}
                </Button>
              </Link>
            ) : null
          )}
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
