import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users } from 'lucide-react';
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
  useFollowersInfiniteQuery,
  useUnfollowUserMutation,
} from '@/utilities/api/user';

export default function ProfileFollowersPage() {
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

  const emptyState = (
    <div className='text-center py-12'>
      <Users className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
      <h3 className='text-lg font-semibold mb-2'>
        {searchParams.get('search')
          ? t('user.noSearchResults')
          : t('profile.noFollowers')}
      </h3>
      <p className='text-muted-foreground'>
        {searchParams.get('search')
          ? t('user.tryDifferentSearch')
          : t('profile.noFollowersDescription')}
      </p>
    </div>
  );

  if (isAuthLoading || !followers.isFetched) return <LoadingState />;
  if (!isAuthorized) return <UnauthorizedState />;
  return (
    <PageLayout backTo={routes.profile.index}>
      <div className='max-w-3xl mx-auto space-y-6'>
        <PageHeader
          title={t('profile.followers')}
          icon={<Users className='h-8 w-8' />}
        />

        {/* Search */}
        <Searchbar />

        {/* Followers List with Infinite Scroll */}
        <InfiniteScrollList
          data={allFollowers}
          hasNextPage={followers.hasNextPage || false}
          isFetchingNextPage={followers.isFetchingNextPage}
          fetchNextPage={followers.fetchNextPage}
          renderItem={(follower) => (
            <FollowerCard
              showActions
              follower={follower}
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
