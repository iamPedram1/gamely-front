import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Github, Twitter, Youtube, Gamepad2 } from 'lucide-react';

// Custom Utilities
import routes from '@/utilities/routes';

export default function Footer() {
  // Custom Hooks
  const { t } = useTranslation();

  // Render
  return (
    <footer className='border-t border-primary/20 bg-accent/30 backdrop-blur'>
      <div className='container py-16'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-12'>
          <div className='space-y-4'>
            <Link
              to='/'
              className='flex items-center gap-3 font-bold text-xl group'
            >
              <div className='p-2 rounded-xl bg-white dark:bg-gradient-gaming glow-effect group-hover:glow-effect-strong transition-all'>
                <Gamepad2 className='h-6 w-6 dark:text-white' />
              </div>
              <span className='gradient-gaming-text'>{t('appName')}</span>
            </Link>
            <p className='text-sm text-muted-foreground leading-relaxed'>
              {t('footer.description')}
            </p>
          </div>

          <div className='space-y-4'>
            <h4 className='font-bold text-lg uppercase tracking-wide'>
              {t('post.content')}
            </h4>
            <ul className='space-y-3 text-sm'>
              <li>
                <Link
                  to={routes.posts.index}
                  className='text-muted-foreground hover:text-primary transition-colors flex items-center gap-2'
                >
                  <span className='w-1 h-1 rounded-full bg-primary' />
                  {t('dashboard.allPosts')}
                </Link>
              </li>
              <li>
                <Link
                  to={routes.games.index}
                  className='text-muted-foreground hover:text-primary transition-colors flex items-center gap-2'
                >
                  <span className='w-1 h-1 rounded-full bg-primary' />
                  {t('nav.games')}
                </Link>
              </li>
              <li>
                <Link
                  to={routes.tags.index}
                  className='text-muted-foreground hover:text-primary transition-colors flex items-center gap-2'
                >
                  <span className='w-1 h-1 rounded-full bg-primary' />
                  {t('nav.tags')}
                </Link>
              </li>
            </ul>
          </div>

          <div className='space-y-4'>
            <h4 className='font-bold text-lg uppercase tracking-wide'>
              {t('nav.categories')}
            </h4>
            <ul className='space-y-3 text-sm'>
              <li>
                <Link
                  to='/category/reviews'
                  className='text-muted-foreground hover:text-primary transition-colors flex items-center gap-2'
                >
                  <span className='w-1 h-1 rounded-full bg-primary' />
                  {t('footer.reviews')}
                </Link>
              </li>
              <li>
                <Link
                  to='/category/news'
                  className='text-muted-foreground hover:text-primary transition-colors flex items-center gap-2'
                >
                  <span className='w-1 h-1 rounded-full bg-primary' />
                  {t('footer.news')}
                </Link>
              </li>
              <li>
                <Link
                  to='/category/guides'
                  className='text-muted-foreground hover:text-primary transition-colors flex items-center gap-2'
                >
                  <span className='w-1 h-1 rounded-full bg-primary' />
                  {t('footer.guides')}
                </Link>
              </li>
            </ul>
          </div>

          <div className='space-y-4'>
            <h4 className='font-bold text-lg uppercase tracking-wide'>
              {t('nav.followUs')} ❤️
            </h4>
            <div className='flex gap-3'>
              <a
                href='#'
                className='p-3 rounded-lg bg-primary/20 hover:bg-primary/35 text-primary transition-all hover:scale-110 glow-effect'
              >
                <Twitter className='h-5 w-5' />
              </a>
              <a
                href='#'
                className='p-3 rounded-lg bg-primary/20 hover:bg-primary/35 text-primary transition-all hover:scale-110 glow-effect'
              >
                <Youtube className='h-5 w-5' />
              </a>
              <a
                href='#'
                className='p-3 rounded-lg bg-primary/20 hover:bg-primary/35 text-primary transition-all hover:scale-110 glow-effect'
              >
                <Github className='h-5 w-5' />
              </a>
            </div>
          </div>
        </div>

        <div className='mt-12 pt-8 border-t border-primary/10 text-center'>
          <p className='text-sm text-muted-foreground'>
            &copy; {new Date().getFullYear()}{' '}
            <span className='gradient-gaming-text font-semibold'>
              {t('appName')}
            </span>
            {t('footer.allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
}
