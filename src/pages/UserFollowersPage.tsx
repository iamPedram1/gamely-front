import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Users } from 'lucide-react';
import { Link, useParams, useSearchParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import FollowerCard from '@/components/profile/FollowerCard';
import Searchbar from '@/components/ui/searchbar';

// Utilities
import routes from '@/utilities/routes';
import { useFollowersInfiniteQuery } from '@/utilities/api/user';

export default function UserFollowersPage() {
  // Hooks
  const { t } = useTranslation();
  const { username } = useParams();
  const [searchParams] = useSearchParams();
  const followers = useFollowersInfiniteQuery(username);

  const allFollowers = useMemo(
    () => followers.data?.pages?.flatMap?.((page) => page.docs) || [],
    [followers.data?.pages]
  );

  // Render
  return (
    <main className='flex-1 container py-8'>
      <Link to={routes.users.details(username || '')}>
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
              {t('user.followersOf', { name: username })}
            </span>
          </h1>
          <p className='text-muted-foreground mt-2'>
            {t('user.peopleFollowings', { name: username })}
          </p>
        </div>

        {/* Search */}
        <Searchbar />

        {/* Followers List */}
        <div className='space-y-4'>
          {allFollowers.length === 0 ? (
            <div className='text-center py-12'>
              <Users className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
              <h3 className='text-lg font-semibold mb-2'>
                {searchParams.get('search')
                  ? t('user.noSearchResults')
                  : t('user.noFollowers')}
              </h3>
              <p className='text-muted-foreground'>
                {searchParams.get('search')
                  ? t('user.tryDifferentSearch')
                  : t('user.noFollowersDescription')}
              </p>
            </div>
          ) : (
            allFollowers.map((follower) => (
              <FollowerCard
                key={follower.id}
                follower={follower}
                showActions={true}
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}
