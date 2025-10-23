import { Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Components
import { Button } from '@/components/ui/button';

// Context
import { useTheme } from '@/contexts/ThemeContext';

const DarkModeToggle = () => {
  // Hooks
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();

  // Render
  return (
    <Button
      variant='ghost'
      size='icon'
      className='hover:bg-primary/10'
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className='h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
      <Moon className='absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
      <span className='sr-only'>{t('common.toggleTheme')}</span>
    </Button>
  );
};

export default DarkModeToggle;
