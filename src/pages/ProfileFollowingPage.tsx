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
    <div className='text-center py-12'>
      <UserCheck className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
      <h3 className='text-lg font-semibold mb-2'>
        {searchParams.get('search')
          ? t('user.noSearchResults')
          : t('profile.notFollowingAnyone')}
      </h3>
      <p className='text-muted-foreground'>
        {searchParams.get('search')
          ? t('user.tryDifferentSearch')
          : t('profile.notFollowingAnyoneDescription')}
      </p>
    </div>
  );

  if (isAuthLoading || !following.isFetched) return <LoadingState />;
  if (!isAuthorized) return <UnauthorizedState />;
  return (
    <PageLayout backTo={routes.profile.index}>
      <div className='max-w-3xl mx-auto space-y-6'>
        <PageHeader
          title={t('profile.followings')}
          icon={<UserCheck className='h-8 w-8' />}
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
