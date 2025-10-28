import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Utilities
import routes from '@/utilities/routes';

export default function MainNavigation() {
  // Hooks
  const { t } = useTranslation();

  // Render
  return (
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
  );
}
