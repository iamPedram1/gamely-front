import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Users, Loader2 } from 'lucide-react';
import { useMemo, useRef, useCallback } from 'react';

// Hooks
import useAuth from '@/hooks/useAuth';

// Components
import { Button } from '@/components/ui/button';
import Searchbar from '@/components/ui/searchbar';
import FollowerCard from '@/components/profile/FollowerCard';

// Utilities
import routes from '@/utilities/routes';
import {
  useBlockUserMutation,
  useFollowersInfiniteQuery,
  useUnfollowUserMutation,
} from '@/utilities/api/user';

export default function ProfileFollowersPage() {
  // States
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Hooks
  const { t } = useTranslation();
  const block = useBlockUserMutation();
  const [searchParams] = useSearchParams();
  const unfollow = useUnfollowUserMutation();
  const followers = useFollowersInfiniteQuery();
  const { isAuthorized, isAuthLoading } = useAuth();

  const allFollowers = useMemo(
    () => followers.data?.pages.flatMap((page) => page.docs) || [],
    [followers.data?.pages]
  );
  console.log(isAuthorized);

  // Utilities
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;
    const isEndOfScroll = scrollHeight - scrollTop - clientHeight < 100;
    if (
      followers.hasNextPage &&
      !followers.isFetchingNextPage &&
      isEndOfScroll
    ) {
      followers.fetchNextPage();
    }
  }, [followers]);

  // Loading state
  if (isAuthLoading || !followers.isFetched) {
    return (
      <main className='flex-1 container py-40 items-center justify-center'>
        <h1 className='text-xl md:text-4xl font-bold mb-4 text-center'>
          {t('common.loading')}
        </h1>
      </main>
    );
  }

  // Unauthorized state
  if (!isAuthorized) {
    return (
      <main className='flex-1 container py-40 items-center justify-center'>
        <h1 className='text-6xl md:text-9xl font-bold mb-4 text-center'>401</h1>
        <h2 className='text-xl md:text-4xl font-normal mb-4 text-center'>
          {t('user.unauthorized')}
        </h2>
        <Link to={routes.login} className='flex items-center justify-center'>
          <Button variant='default' className='w-48 mb-6'>
            {t('auth.login')}
          </Button>
        </Link>
      </main>
    );
  }

  return (
    <main className='flex-1 container py-8'>
      <Link to={routes.profile.index}>
        <Button variant='ghost' className='mb-6 flex items-center gap-2'>
          <ArrowLeft className='h-4 w-4 me-2 rtl:rotate-180' />
          {t('common.back')}
        </Button>
      </Link>

      <div className='max-w-3xl mx-auto space-y-6'>
        {/* Page Header */}
        <div>
          <h1 className='text-4xl font-black flex items-center gap-3'>
            <Users className='h-8 w-8' />
            <span className='gradient-gaming-text'>
              {t('profile.followers')}
            </span>
          </h1>
          <p className='text-muted-foreground mt-2'>
            {t('profile.manageFollowers')}
          </p>
        </div>

        {/* Search */}
        <Searchbar />

        {/* Followers List with Infinite Scroll */}
        <div
          className='space-y-4 max-h-[600px] overflow-y-auto pr-1'
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          {followers.isLoading ? (
            <div className='flex justify-center py-12'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
            </div>
          ) : allFollowers.length === 0 ? (
            <div className='text-center py-12'>
              <Users className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
              <h3 className='text-lg font-semibold mb-2'>
                {searchParams.get('search')
                  ? t('profile.noSearchResults')
                  : t('profile.noFollowers')}
              </h3>
              <p className='text-muted-foreground'>
                {searchParams.get('search')
                  ? t('profile.tryDifferentSearch')
                  : t('profile.noFollowersDescription')}
              </p>
            </div>
          ) : (
            <>
              {allFollowers.map((follower) => (
                <FollowerCard
                  showActions
                  key={follower.id}
                  follower={follower}
                  onBlock={block.mutate}
                  onUnfollow={unfollow.mutate}
                />
              ))}
              {followers.isFetchingNextPage && (
                <div className='flex justify-center py-4'>
                  <Loader2 className='h-5 w-5 animate-spin text-primary' />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
