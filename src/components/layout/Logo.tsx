import { Gamepad2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Logo() {
  // Hooks
  const { t } = useTranslation();

  // Render
  return (
    <Link to='/' className='flex items-center gap-3 font-bold text-2xl group'>
      <div className='p-2 rounded-xl bg-gradient-gaming glow-effect group-hover:glow-effect-strong transition-all'>
        <Gamepad2 className='h-7 w-7 gradient-gaming-text dark:text-white' />
      </div>
      <span className='gradient-gaming-text'>{t('appName')}</span>
    </Link>
  );
}
