import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.documentElement.lang = lng;
    document.documentElement.dir = lng === 'fa' ? 'rtl' : 'ltr';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='hover:bg-primary/10'>
          <Languages className='h-5 w-5' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => changeLanguage('en')}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('fa')}>
          فارسی
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
