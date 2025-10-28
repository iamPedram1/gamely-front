import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Components
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import DarkModeToggle from '@/components/DarkModeToggle';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

// Utilities
import routes from '@/utilities/routes';
import Searchbar from '@/components/ui/searchbar';

export default function MobileMenu() {
  // States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hooks
  const { t } = useTranslation();

  // Render
  return (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant='ghost' size='sm' className='lg:hidden h-10 w-10 p-0'>
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
          <Searchbar className='sm:hidden mt-4' />
        </div>
      </SheetContent>
    </Sheet>
  );
}
