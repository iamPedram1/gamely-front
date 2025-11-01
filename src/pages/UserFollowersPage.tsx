import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users } from 'lucide-react';
import { useMemo } from 'react';

// Components
import Searchbar from '@/components/ui/searchbar';
import FollowerCard from '@/components/profile/FollowerCard';
import { PageLayout, PageHeader } from '@/components/layout/PageLayout';
import InfiniteScrollList from '@/components/ui/infinite-scroll';

// Utilities
import routes from '@/utilities/routes';
import { useFollowersInfiniteQuery } from '@/utilities/api/user';

export default function UserFollowersPage() {
  // Hooks
  const { t } = useTranslation();
  const { username } = useParams();
  const followers = useFollowersInfiniteQuery(username);
  const allFollowers = useMemo(
    () => followers.data?.pages.flatMap((page) => page.docs) || [],
    [followers.data?.pages]
  );

  const emptyState = (
    <div className='text-center py-12'>
      <Users className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
      <h3 className='text-lg font-semibold mb-2'>{t('user.noFollowers')}</h3>
      <p className='text-muted-foreground'>
        {t('user.noFollowersDescription')}
      </p>
    </div>
  );

  return (
    <PageLayout backTo={routes.users.details(username || '')}>
      <div className='max-w-3xl mx-auto space-y-6'>
        <PageHeader
          title={t('user.followersOf', { name: username })}
          description={t('user.peopleFollowings', { name: username })}
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
            <FollowerCard follower={follower} showActions={false} />
          )}
          emptyState={emptyState}
        />
      </div>
    </PageLayout>
  );
}
