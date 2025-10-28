import { useTranslation } from 'react-i18next';

// Components
import Logo from './Logo';
import FooterColumn from './FooterColumn';
import SocialLinks from './SocialLinks';

// Utilities
import routes from '@/utilities/routes';

export default function Footer() {
  // Custom Hooks
  const { t } = useTranslation();

  // Content links
  const contentLinks = [
    { to: routes.posts.index, label: t('dashboard.allPosts') },
    { to: routes.games.index, label: t('nav.games') },
    { to: routes.tags.index, label: t('nav.tags') }
  ];

  // Category links
  const categoryLinks = [
    { to: '/category/reviews', label: t('footer.reviews') },
    { to: '/category/news', label: t('footer.news') },
    { to: '/category/guides', label: t('footer.guides') }
  ];

  // Render
  return (
    <footer className='border-t border-primary/20 bg-accent/30 backdrop-blur'>
      <div className='container py-16'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-12'>
          {/* Logo and Description */}
          <div className='space-y-4'>
            <Logo />
            <p className='text-sm text-muted-foreground leading-relaxed'>
              {t('footer.description')}
            </p>
          </div>

          {/* Content Links */}
          <FooterColumn 
            title={t('post.content')}
            links={contentLinks}
          />

          {/* Category Links */}
          <FooterColumn 
            title={t('nav.categories')}
            links={categoryLinks}
          />

          {/* Social Links */}
          <div className='space-y-4'>
            <h4 className='font-bold text-lg uppercase tracking-wide'>
              {t('nav.followUs')} ❤️
            </h4>
            <SocialLinks />
          </div>
        </div>

        {/* Copyright */}
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