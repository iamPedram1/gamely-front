import { useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, UserCheck } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

// Hooks
import useAuth from '@/hooks/useAuth';

// Components
import { Button } from '@/components/ui/button';
import Searchbar from '@/components/ui/searchbar';
import FollowerCard from '@/components/profile/FollowerCard';

// Utilites
import routes from '@/utilities/routes';
import {
  useBlockUserMutation,
  useFollowingInfiniteQuery,
  useUnblockUserMutation,
  useUnfollowUserMutation,
} from '@/utilities/api/user';

export default function ProfileFollowingPage() {
  // Hooks
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { isAuthorized, isAuthLoading } = useAuth();
  const block = useBlockUserMutation();
  const unblock = useUnblockUserMutation();
  const unfollow = useUnfollowUserMutation();
  const followings = useFollowingInfiniteQuery();
  const allFollowings = useMemo(
    () => followings.data?.pages?.flatMap?.((page) => page.docs) || [],
    [followings.data?.pages]
  );
  console.log(allFollowings);

  // Utilities
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;
    const isEndOfScroll = scrollHeight - scrollTop - clientHeight < 100;
    if (
      followings.hasNextPage &&
      !followings.isFetchingNextPage &&
      isEndOfScroll
    ) {
      followings.fetchNextPage();
    }
  }, [followings]);

  // Loading state
  if (isAuthLoading || !followings.isFetched) {
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
        <h1 className='text-9xl font-bold mb-4 text-center'>401</h1>
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
          <ArrowLeft className='h-4 w-4 rtl:rotate-180' />
          {t('common.back')}
        </Button>
      </Link>

      <div className='max-w-3xl mx-auto space-y-6'>
        {/* Page Header */}
        <div>
          <h1 className='text-4xl font-black flex items-center gap-3'>
            <UserCheck className='h-8 w-8' />
            <span className='gradient-gaming-text'>
              {t('profile.followings')}
            </span>
          </h1>
          <p className='text-muted-foreground mt-2'>
            {t('profile.manageFollowings')}
          </p>
        </div>

        {/* Search */}
        <Searchbar />

        {/* Following List */}
        <div
          className='space-y-4 max-h-[600px] overflow-y-auto pr-1'
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          {allFollowings.length === 0 ? (
            <div className='text-center py-12'>
              <UserCheck className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
              <h3 className='text-lg font-semibold mb-2'>
                {searchParams.get('search')
                  ? t('profile.noSearchResults')
                  : t('profile.notFollowingAnyone')}
              </h3>
              <p className='text-muted-foreground'>
                {searchParams.get('search')
                  ? t('profile.tryDifferentSearch')
                  : t('profile.notFollowingAnyoneDescription', {
                      name: t('common.you').toLowerCase(),
                    })}
              </p>
            </div>
          ) : (
            allFollowings.map((user) => (
              <FollowerCard
                key={user.id}
                follower={user}
                onBlock={block.mutate}
                onUnfollow={unfollow.mutate}
                onUnblock={unblock.mutate}
                showActions
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}
