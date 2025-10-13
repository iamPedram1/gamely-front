import { Link } from 'react-router-dom';
import { Github, Twitter, Youtube, Gamepad2 } from 'lucide-react';
import routes from '@/utilities/routes';

export default function Footer() {
  return (
    <footer className='border-t border-primary/20 bg-accent/30 backdrop-blur'>
      <div className='container py-16'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-12'>
          <div className='space-y-4'>
            <Link
              to='/'
              className='flex items-center gap-3 font-bold text-xl group'
            >
              <div className='p-2 rounded-xl bg-gradient-gaming glow-effect'>
                <Gamepad2 className='h-6 w-6 text-white' />
              </div>
              <span className='gradient-gaming-text'>GameLy</span>
            </Link>
            <p className='text-sm text-muted-foreground leading-relaxed'>
              Your ultimate destination for gaming news, reviews, and guides.
              Level up your gaming experience.
            </p>
          </div>

          <div className='space-y-4'>
            <h4 className='font-bold text-lg uppercase tracking-wide'>
              Content
            </h4>
            <ul className='space-y-3 text-sm'>
              <li>
                <Link
                  to={routes.posts.index}
                  className='text-muted-foreground hover:text-primary transition-colors flex items-center gap-2'
                >
                  <span className='w-1 h-1 rounded-full bg-primary' />
                  All Posts
                </Link>
              </li>
              <li>
                <Link
                  to={routes.games.index}
                  className='text-muted-foreground hover:text-primary transition-colors flex items-center gap-2'
                >
                  <span className='w-1 h-1 rounded-full bg-primary' />
                  Games
                </Link>
              </li>
              <li>
                <Link
                  to={routes.tags.index}
                  className='text-muted-foreground hover:text-primary transition-colors flex items-center gap-2'
                >
                  <span className='w-1 h-1 rounded-full bg-primary' />
                  Tags
                </Link>
              </li>
            </ul>
          </div>

          <div className='space-y-4'>
            <h4 className='font-bold text-lg uppercase tracking-wide'>
              Categories
            </h4>
            <ul className='space-y-3 text-sm'>
              <li>
                <Link
                  to='/category/reviews'
                  className='text-muted-foreground hover:text-primary transition-colors flex items-center gap-2'
                >
                  <span className='w-1 h-1 rounded-full bg-primary' />
                  Reviews
                </Link>
              </li>
              <li>
                <Link
                  to='/category/news'
                  className='text-muted-foreground hover:text-primary transition-colors flex items-center gap-2'
                >
                  <span className='w-1 h-1 rounded-full bg-primary' />
                  News
                </Link>
              </li>
              <li>
                <Link
                  to='/category/guides'
                  className='text-muted-foreground hover:text-primary transition-colors flex items-center gap-2'
                >
                  <span className='w-1 h-1 rounded-full bg-primary' />
                  Guides
                </Link>
              </li>
            </ul>
          </div>

          <div className='space-y-4'>
            <h4 className='font-bold text-lg uppercase tracking-wide'>
              Follow Us
            </h4>
            <div className='flex gap-3'>
              <a
                href='#'
                className='p-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all hover:scale-110 glow-effect'
              >
                <Twitter className='h-5 w-5' />
              </a>
              <a
                href='#'
                className='p-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all hover:scale-110 glow-effect'
              >
                <Youtube className='h-5 w-5' />
              </a>
              <a
                href='#'
                className='p-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all hover:scale-110 glow-effect'
              >
                <Github className='h-5 w-5' />
              </a>
            </div>
          </div>
        </div>

        <div className='mt-12 pt-8 border-t border-primary/10 text-center'>
          <p className='text-sm text-muted-foreground'>
            &copy; {new Date().getFullYear()}{' '}
            <span className='gradient-gaming-text font-semibold'>GameLy</span>.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
