import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserCheck } from 'lucide-react';
import { useMemo } from 'react';

// Hooks
import useAuth from '@/hooks/useAuth';

// Components
import Searchbar from '@/components/ui/searchbar';
import FollowerCard from '@/components/profile/FollowerCard';
import {
  PageLayout,
  PageHeader,
  LoadingState,
  UnauthorizedState,
} from '@/components/layout/PageLayout';
import InfiniteScrollList from '@/components/ui/infinite-scroll';

// Utilities
import routes from '@/utilities/routes';
import {
  useBlockUserMutation,
  useFollowingInfiniteQuery,
  useUnfollowUserMutation,
} from '@/utilities/api/user';

export default function ProfileFollowingPage() {
  // Hooks
  const { t } = useTranslation();
  const block = useBlockUserMutation();
  const [searchParams] = useSearchParams();
  const unfollow = useUnfollowUserMutation();
  const following = useFollowingInfiniteQuery();
  const { isAuthorized, isAuthLoading } = useAuth();

  const allFollowing = useMemo(
    () => following.data?.pages.flatMap((page) => page.docs) || [],
    [following.data?.pages]
  );

  const emptyState = (
    <div className='text-center py-12 px-4'>
      <UserCheck className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
      <h3 className='text-base md:text-lg font-semibold mb-2'>
        {searchParams.get('search')
          ? t('profile.noSearchResults')
          : t('profile.notFollowingAnyone')}
      </h3>
      <p className='text-sm md:text-base text-muted-foreground'>
        {searchParams.get('search')
          ? t('profile.tryDifferentSearch')
          : t('profile.notFollowingAnyoneDescription')}
      </p>
    </div>
  );

  // Loading state
  if (isAuthLoading || !following.isFetched) {
    return <LoadingState />;
  }

  // Unauthorized state
  if (!isAuthorized) {
    return <UnauthorizedState />;
  }

  return (
    <PageLayout
      backTo={routes.profile.index}
      className='flex-1 container py-4 md:py-8 px-4'
    >
      <div className='max-w-3xl mx-auto space-y-4 md:space-y-6'>
        <PageHeader
          title={t('profile.followings')}
          description={t('profile.manageFollowings')}
          icon={<UserCheck className='h-6 w-6 md:h-8 md:w-8' />}
          className='mb-4 md:mb-6'
        />

        {/* Search */}
        <Searchbar />

        {/* Following List with Infinite Scroll */}
        <InfiniteScrollList
          data={allFollowing}
          hasNextPage={following.hasNextPage || false}
          isFetchingNextPage={following.isFetchingNextPage}
          fetchNextPage={following.fetchNextPage}
          renderItem={(user) => (
            <FollowerCard
              follower={user}
              onBlock={block.mutate}
              onUnfollow={unfollow.mutate}
            />
          )}
          emptyState={emptyState}
        />
      </div>
    </PageLayout>
  );
}
