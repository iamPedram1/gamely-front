import { useMemo } from 'react';
import { Shield, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

// Components
import Searchbar from '@/components/ui/searchbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// Utilities
import { getDate } from '@/utilities';
import {
  useBlockListInfiniteQuery,
  useUnblockUserMutation,
} from '@/utilities/api/user';

export default function BlockListPage() {
  // Hooks
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const blocks = useBlockListInfiniteQuery({ refetchOnQueryChange: true });
  const unblock = useUnblockUserMutation();

  const allBlocks = useMemo(
    () => blocks.data?.pages.flatMap((page) => page.docs) || [],
    [blocks.data?.pages]
  );

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target;
    const { scrollTop, scrollHeight, clientHeight } = target as HTMLElement;
    const { hasNextPage, isFetchingNextPage, fetchNextPage } = blocks;
    const isEndOfScroll = scrollHeight - scrollTop - clientHeight < 100;

    if (hasNextPage && !isFetchingNextPage && isEndOfScroll) fetchNextPage();
  };

  // Render
  return (
    <div className='container py-8 max-w-4xl mx-auto'>
      <div className='mb-8'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='p-2 rounded-lg bg-orange-100 dark:bg-orange-900'>
            <Shield className='h-6 w-6 text-orange-600' />
          </div>
          <div>
            <h1 className='text-3xl font-bold'>{t('profile.blockedUsers')}</h1>
            <p className='text-muted-foreground'>
              {t('profile.blockedUsersDescription')}
            </p>
          </div>
        </div>

        {/* Search */}
        <Searchbar />
      </div>

      {allBlocks.length === 0 ? (
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <Shield className='h-12 w-12 text-muted-foreground mb-4' />
            <h3 className='text-lg font-semibold mb-2'>
              {searchParams.get('search')
                ? t('common.noResults')
                : t('profile.noBlockedUsers')}
            </h3>
            <p className='text-muted-foreground text-center'>
              {searchParams.get('search')
                ? t('common.tryDifferentSearch')
                : t('profile.noBlockedUsersDescription')}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div onScroll={handleScroll} className='space-y-4'>
          {allBlocks.map((block) => (
            <Card key={block.id} className='hover:shadow-md transition-shadow'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-4'>
                    <Avatar className='h-12 w-12'>
                      <AvatarImage
                        src={
                          block.avatar?.url ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${block.username}`
                        }
                        alt={block.username}
                      />
                      <AvatarFallback>
                        {block.username?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className='font-semibold text-lg'>
                        {block.username}
                      </h3>
                      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                        <span>
                          {t('profile.blockedOn')}{' '}
                          <span dir='ltr'>
                            {getDate(block.blockedAt, 'YYYY/MM/DD - HH:mm')}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant='outline'
                        size='sm'
                        className='text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950'
                      >
                        <Trash2 className='h-4 w-4' />
                        {t('user.unblock')}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {t('user.unblockUser')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {t('profile.unblockUserConfirmation', {
                            username: block.username,
                          })}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className='flex gap-2'>
                        <AlertDialogCancel>
                          {t('common.cancel')}
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => unblock.mutate(block.userId)}
                          className='bg-green-600 hover:bg-green-700'
                        >
                          {t('user.unblock')}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {allBlocks.length > 0 && (
        <div className='mt-8 text-center'>
          <p className='text-sm text-muted-foreground'>
            {t('profile.blockedUsersCount', {
              count: blocks.data.pages[0].pagination.totalDocs,
            })}
          </p>
        </div>
      )}
    </div>
  );
}
