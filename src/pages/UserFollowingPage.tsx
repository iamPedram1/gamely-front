import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserCheck } from 'lucide-react';
import { useMemo } from 'react';

// Components
import Searchbar from '@/components/ui/searchbar';
import FollowerCard from '@/components/profile/FollowerCard';
import { PageLayout, PageHeader } from '@/components/layout/PageLayout';
import InfiniteScrollList from '@/components/ui/infinite-scroll';

// Utilities
import routes from '@/utilities/routes';
import { useFollowingInfiniteQuery } from '@/utilities/api/user';

export default function UserFollowingPage() {
  // Hooks
  const { t } = useTranslation();
  const { username } = useParams();
  const following = useFollowingInfiniteQuery(username);
  const allFollowing = useMemo(
    () => following.data?.pages.flatMap((page) => page.docs) || [],
    [following.data?.pages]
  );

  const emptyState = (
    <div className='text-center py-12'>
      <UserCheck className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
      <h3 className='text-lg font-semibold mb-2'>
        {t('user.notFollowingAnyone', { username })}
      </h3>
      <p className='text-muted-foreground'>
        {t('user.notFollowingAnyoneDescription')}
      </p>
    </div>
  );

  return (
    <PageLayout backTo={routes.users.details(username || '')}>
      <div className='max-w-3xl mx-auto space-y-6'>
        <PageHeader
          title={t('user.followingsOf', { name: username })}
          description={t('user.peopleFollowedBy', { name: username })}
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
            <FollowerCard follower={user} showActions={false} />
          )}
          emptyState={emptyState}
        />
      </div>
    </PageLayout>
  );
}
