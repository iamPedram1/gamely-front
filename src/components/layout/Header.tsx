import { Link } from 'react-router-dom';
import { Moon, Sun, Gamepad2, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';
import { getCookie } from '@/utilities/cookie';
import routes from '@/utilities/routes';
import useAuth from '@/hooks/useAuth';

export default function Header() {
  // States
  const [searchQuery, setSearchQuery] = useState('');

  // Hooks
  const { theme, setTheme } = useTheme();
  const { isAuthorized, isAuthLoading } = useAuth();

  // Utilities
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search:', searchQuery);
  };
  console.log(isAuthorized, isAuthLoading);

  return (
    <header className='sticky top-0 z-50 w-full border-b border-primary/20 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-20 items-center justify-between'>
        <div className='flex items-center gap-8'>
          <Link
            to='/'
            className='flex items-center gap-3 font-bold text-2xl group'
          >
            <div className='p-2 rounded-xl bg-gradient-gaming glow-effect group-hover:glow-effect-strong transition-all'>
              <Gamepad2 className='h-7 w-7 text-white' />
            </div>
            <span className='gradient-gaming-text'>GameLy</span>
          </Link>

          <nav className='hidden md:flex items-center gap-8 text-sm font-medium'>
            <Link
              to={routes.posts.index}
              className='transition-all hover:text-primary hover:scale-105 text-foreground/80 uppercase tracking-wide'
            >
              News
            </Link>
            <Link
              to={routes.games.index}
              className='transition-all hover:text-primary hover:scale-105 text-foreground/80 uppercase tracking-wide'
            >
              Games
            </Link>
            <Link
              to={routes.tags.index}
              className='transition-all hover:text-primary hover:scale-105 text-foreground/80 uppercase tracking-wide'
            >
              Tags
            </Link>
          </nav>
        </div>

        <div className='flex items-center gap-4'>
          <form
            onSubmit={handleSearch}
            className='hidden sm:flex items-center gap-2'
          >
            <div className='relative'>
              <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
              <Input
                type='search'
                placeholder='Search games...'
                className='pl-10 w-[200px] lg:w-[300px] bg-accent/50 border-primary/20 focus:border-primary'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          <Button
            variant='ghost'
            size='icon'
            className='hover:bg-primary/10'
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className='h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
            <Moon className='absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
            <span className='sr-only'>Toggle theme</span>
          </Button>

          {isAuthLoading ? (
            <Button
              disabled
              className='gradient-gaming font-semibold uppercase tracking-wide glow-effect hover:glow-effect-strong transition-all'
            >
              Loading
            </Button>
          ) : isAuthorized ? (
            <Link to={routes.profile.index}>
              <Button className='gradient-gaming font-semibold uppercase tracking-wide glow-effect hover:glow-effect-strong transition-all'>
                Profile
              </Button>
            </Link>
          ) : (
            <Link to={routes.login}>
              <Button className='gradient-gaming font-semibold uppercase tracking-wide glow-effect hover:glow-effect-strong transition-all'>
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
