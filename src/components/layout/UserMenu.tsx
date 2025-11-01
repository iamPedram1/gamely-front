import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogOut, LayoutDashboard, UserCircle, ChevronDown } from 'lucide-react';

// Custom Hooks
import useAuth from '@/hooks/useAuth';

// Components
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Utilities
import routes from '@/utilities/routes';

export default function UserMenu() {
  // Hooks
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthorized, isAuthLoading, profile, logout } = useAuth();

  // Handlers
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleLabel = (role: string) => {
    return t(`user.${role}`);
  };

  // If not authorized, show login button
  if (!isAuthorized || !profile) {
    return (
      <Link to={routes.login}>
        <Button
          disabled={isAuthLoading}
          className='gradient-gaming font-semibold uppercase tracking-wide glow-effect hover:glow-effect-strong transition-all'
        >
          {t('auth.login')}
        </Button>
      </Link>
    );
  }

  // If authorized, show user menu
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='p-0.5 h-fit w-fit rounded-full transition-all'
          disabled={isAuthLoading}
        >
          <Avatar className='h-8 w-8 border-2 border-primary/20'>
            <AvatarImage
              src={profile.avatar?.url || '/placeholder.svg'}
              alt={profile.username}
            />
            <AvatarFallback className='bg-gradient-gaming text-xs font-semibold'>
              {profile.username[0]}
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
            <p className='text-sm font-semibold gradient-gaming-text'>
              {profile.username}
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
          <Link to={routes.profile.index} className='flex items-center gap-2'>
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
          onClick={handleLogout}
          className='cursor-pointer w-full hover:bg-destructive/10 text-destructive focus:text-destructive transition-colors gap-2'
        >
          <LogOut className='h-4 w-4 rtl:rotate-180' />
          <span>{t('auth.logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
