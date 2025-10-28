// Components
import Logo from '@/components/layout/Logo';
import Searchbar from '@/components/ui/searchbar';
import UserMenu from '@/components/layout/UserMenu';
import MobileMenu from '@/components/layout/MobileMenu';
import DarkModeToggle from '@/components/DarkModeToggle';
import MainNavigation from '@/components/layout/MainNavigation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import NotificationsMenu from '@/components/layout/NotificationsMenu';

// Custom Hooks
import useAuth from '@/hooks/useAuth';

export default function Header() {
  // Hooks
  const { isAuthorized } = useAuth();

  // Render
  return (
    <header className='sticky top-0 z-50 w-full border-b border-primary/20 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-20 items-center justify-between'>
        <div className='flex items-center gap-8'>
          <Logo />
          <MainNavigation />
        </div>

        <div className='flex items-center gap-2'>
          <Searchbar className='hidden sm:flex' />

          {/* Notifications */}
          {isAuthorized && <NotificationsMenu />}

          <div className='hidden md:flex items-center gap-2'>
            <LanguageSwitcher />
            <DarkModeToggle />
          </div>

          <UserMenu />

          {/* Mobile Menu */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
