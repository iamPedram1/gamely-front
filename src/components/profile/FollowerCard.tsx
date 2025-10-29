import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserMinus, UserPlus, Shield, Clock, Ban } from 'lucide-react';

// Components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Utilities
import routes from '@/utilities/routes';
import { getDate } from '@/utilities';

// Types
import type { FollowerProps, UserRole } from '@/types/client/blog';

interface FollowerCardProps {
  follower: FollowerProps;
  showActions?: boolean;
  showFollowDate?: boolean;
  onFollow?: (id: string) => void;
  onUnfollow?: (id: string) => void;
  onBlock?: (id: string) => void;
}

export default function FollowerCard({
  follower,
  showActions = true,
  showFollowDate = true,
  onUnfollow,
  onFollow,
  onBlock,
}: FollowerCardProps) {
  // States
  const [isFollowing, setIsFollowing] = useState(follower.isFollowing || false);
  const [isBlocked, setIsBlocked] = useState(follower.isBlocked || false);

  // Hooks
  const { t } = useTranslation();

  const handleFollow = () => {
    if (onFollow) onFollow(follower.userId);
    setIsFollowing(!isFollowing);
  };
  const handleBlock = () => {
    if (onBlock) onBlock(follower.userId);
    setIsBlocked(true);
  };

  const handleUnfollow = () => {
    if (onUnfollow) onUnfollow(follower.userId);
    setIsFollowing(false);
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'superAdmin':
        return <Shield className='h-4 w-4 text-yellow-500' />;
      case 'admin':
        return <Shield className='h-4 w-4 text-red-500' />;
      case 'author':
        return <Shield className='h-4 w-4 text-blue-500' />;
      default:
        return null;
    }
  };

  return (
    <Card className='overflow-hidden transition-all duration-300 hover:shadow-lg'>
      <CardContent className='p-4'>
        <div className='flex items-center gap-4'>
          <Link to={routes.users.details(follower.username)}>
            <Avatar className='h-16 w-16 border-2 border-primary/20'>
              <AvatarImage src={follower.avatar?.url} alt={follower.username} />
              <AvatarFallback className='text-xl bg-gradient-gaming text-white'>
                {follower.username[0]}
              </AvatarFallback>
            </Avatar>
          </Link>

          <div className='flex-1'>
            <Link
              to={routes.users.details(follower.username)}
              className='hover:underline'
            >
              <h3 className='font-bold text-lg'>{follower.username}</h3>
            </Link>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-muted-foreground'>
                @{follower.username}
              </span>
              {follower.role !== 'user' && (
                <Badge
                  variant='outline'
                  className='text-xs flex items-center gap-1'
                >
                  {getRoleIcon(follower.role)}
                  {t(`user.${follower.role}`)}
                </Badge>
              )}
            </div>
            {showFollowDate && (
              <div className='text-xs text-muted-foreground flex items-center gap-1 mt-1'>
                <Clock className='h-3 w-3' />
                {t('user.followingSince', {
                  date: getDate(follower.since),
                })}
              </div>
            )}
          </div>

          {showActions && (
            <div className='flex flex-col gap-2'>
              {!isBlocked ? (
                <>
                  <Button
                    size='sm'
                    variant={isFollowing ? 'outline' : 'default'}
                    className={
                      isFollowing
                        ? ''
                        : 'gradient-gaming glow-effect hover:glow-effect-strong'
                    }
                    onClick={isFollowing ? handleUnfollow : handleFollow}
                  >
                    {isFollowing ? (
                      <>
                        <UserMinus className='h-4 w-4 mr-2' />
                        {t('user.unfollow')}
                      </>
                    ) : (
                      <>
                        <UserPlus className='h-4 w-4 mr-2' />
                        {t('user.follow')}
                      </>
                    )}
                  </Button>
                  <Button
                    size='sm'
                    variant='outline'
                    className='text-red-500 hover:text-red-700 hover:bg-red-50'
                    onClick={handleBlock}
                  >
                    <Ban className='h-4 w-4 mr-2' />
                    {t('user.block')}
                  </Button>
                </>
              ) : (
                <Badge variant='destructive'>{t('user.blocked')}</Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
