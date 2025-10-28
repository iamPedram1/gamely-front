import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Trash2, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { getDate } from '@/utilities';

interface BlockedUser {
  id: string;
  username: string;
  avatar?: { url: string };
  blockedAt: string;
  reason?: string;
}

export default function BlockListPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock blocked users data
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([
    {
      id: '1',
      username: 'spammer123',
      avatar: {
        url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=spammer123',
      },
      blockedAt: '2024-01-15T10:30:00Z',
      reason: 'Spam comments',
    },
    {
      id: '2',
      username: 'toxic_gamer',
      avatar: {
        url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=toxic_gamer',
      },
      blockedAt: '2024-01-10T14:20:00Z',
      reason: 'Harassment',
    },
    {
      id: '3',
      username: 'annoying_user',
      blockedAt: '2024-01-05T09:15:00Z',
    },
  ]);

  const handleUnblock = (userId: string) => {
    setBlockedUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  const filteredUsers = blockedUsers.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render
  return (
    <div className='min-h-screen bg-background'>
      <div className='container py-8 max-w-4xl mx-auto'>
        <div className='mb-8'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='p-2 rounded-lg bg-orange-100 dark:bg-orange-900'>
              <Shield className='h-6 w-6 text-orange-600' />
            </div>
            <div>
              <h1 className='text-3xl font-bold'>
                {t('profile.blockedUsers')}
              </h1>
              <p className='text-muted-foreground'>
                {t('profile.blockedUsersDescription')}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className='relative max-w-md'>
            <Search className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              type='search'
              placeholder={t('common.searchUsers')}
              className='pl-10'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <Card>
            <CardContent className='flex flex-col items-center justify-center py-12'>
              <Shield className='h-12 w-12 text-muted-foreground mb-4' />
              <h3 className='text-lg font-semibold mb-2'>
                {searchQuery
                  ? t('common.noResults')
                  : t('profile.noBlockedUsers')}
              </h3>
              <p className='text-muted-foreground text-center'>
                {searchQuery
                  ? t('common.tryDifferentSearch')
                  : t('profile.noBlockedUsersDescription')}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className='space-y-4'>
            {filteredUsers.map((user) => (
              <Card key={user.id} className='hover:shadow-md transition-shadow'>
                <CardContent className='p-6'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                      <Avatar className='h-12 w-12'>
                        <AvatarImage
                          src={
                            user.avatar?.url ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`
                          }
                          alt={user.username}
                        />
                        <AvatarFallback>
                          {user.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className='font-semibold text-lg'>
                          {user.username}
                        </h3>
                        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                          <span>
                            {t('profile.blockedOn')}{' '}
                            {getDate(user.blockedAt, 'YYYY/MM/DD')}
                          </span>
                          {user.reason && (
                            <>
                              <span>•</span>
                              <Badge variant='outline' className='text-xs'>
                                {user.reason}
                              </Badge>
                            </>
                          )}
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
                          <Trash2 className='h-4 w-4 mr-2' />
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
                              username: user.username,
                            })}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className='flex gap-2'>
                          <AlertDialogCancel>
                            {t('common.cancel')}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleUnblock(user.id)}
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

        {filteredUsers.length > 0 && (
          <div className='mt-8 text-center'>
            <p className='text-sm text-muted-foreground'>
              {t('profile.blockedUsersCount', { count: filteredUsers.length })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
