import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, UserCheck } from 'lucide-react';
import { Link, useParams, useSearchParams } from 'react-router-dom';

// Components
import { Button } from '@/components/ui/button';
import Searchbar from '@/components/ui/searchbar';
import FollowerCard from '@/components/profile/FollowerCard';

// Utilities
import routes from '@/utilities/routes';
import { useFollowingInfiniteQuery } from '@/utilities/api/user';

export default function UserFollowingPage() {
  // Hooks
  const { t } = useTranslation();
  const { username } = useParams();
  const [searchParams] = useSearchParams();
  const followings = useFollowingInfiniteQuery(username);
  const followingsList = useMemo(
    () => followings.data?.pages?.flatMap?.((page) => page.docs) || [],
    [followings.data?.pages]
  );

  // Render
  return (
    <main className='flex-1 container py-8'>
      <Link to={routes.users.details(username || '')}>
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
              {t('user.followingsOf', { name: username })}
            </span>
          </h1>
          <p className='text-muted-foreground mt-2'>
            {t('user.peopleFollowedBy', { name: username })}
          </p>
        </div>

        {/* Search */}
        <Searchbar />

        {/* Following List */}
        <div className='space-y-4'>
          {followingsList.length === 0 ? (
            <div className='text-center py-12'>
              <UserCheck className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
              <h3 className='text-lg font-semibold mb-2'>
                {searchParams.has('search')
                  ? t('user.noSearchResults')
                  : t('user.notFollowingAnyone')}
              </h3>
              <p className='text-muted-foreground'>
                {searchParams.has('search')
                  ? t('user.tryDifferentSearch')
                  : t('user.notFollowingAnyoneDescription')}
              </p>
            </div>
          ) : (
            followingsList.map((user) => (
              <FollowerCard key={user.id} follower={user} showActions={false} />
            ))
          )}
        </div>
      </div>
    </main>
  );
}
