import dayjs from 'dayjs';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  UserPlus,
  UserMinus,
  Gamepad2,
  FileText,
  Clock,
  Shield,
  Crown,
  Star,
  Users,
  UserCheck,
} from 'lucide-react';

// Hooks
import useAuth from '@/hooks/useAuth';

// Components
import PostCard from '@/components/blog/PostCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Utilities
import routes from '@/utilities/routes';
import { getDate } from '@/utilities';
import { useBoolean } from '@/hooks/state';
import { debounce } from '@/utilities/helperPack';
import { usePostsQuery } from '@/utilities/api/post';
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
  useUserQuery,
} from '@/utilities/api/user';

export default function UserPage() {
  // States
  const isFollowing = useBoolean(false);

  // Hooks
  const { t } = useTranslation();
  const { profile } = useAuth();
  const { username } = useParams();
  const user = useUserQuery({
    initialParams: username,
    onFetch: (obj) => isFollowing.set(obj.isFollowing),
  });
  const userRecentPosts = usePostsQuery({
    enabled: user.isFetched,
    queries: { creator: user.data?.id },
  });

  const follow = useFollowUserMutation();
  const unfollow = useUnfollowUserMutation();

  // Mock recent posts
  const handleFollow = useCallback(
    debounce((value: boolean) => {
      if (value) follow.mutate(user.data.id);
      else unfollow.mutate(user.data.id);
    }, 1000),
    [user.data?.id]
  );
  const toggleFollow = () => {
    const newValue = !isFollowing.state;
    isFollowing.toggle();
    handleFollow(newValue);
  };

  const formatLastSeen = (dateString: string) => {
    let prefix = t('user.lastSeen') + ' ';
    if (!dateString) return prefix + t('user.a_long_timeAgo');
    const diffInMinutes = dayjs().diff(dateString, 'minutes');
    const diffInHour = dayjs().diff(dateString, 'hours');
    const diffInDays = dayjs().diff(dateString, 'days');
    if (diffInMinutes < 5) return t('user.onlineNow');
    if (diffInMinutes < 60)
      return prefix + t('user.minutesAgo', { minutes: diffInMinutes });
    if (diffInHour < 24)
      return prefix + t('user.hoursAgo', { hours: diffInMinutes });
    return prefix + t('user.daysAgo', { days: diffInDays });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'superAdmin':
        return <Crown className='h-4 w-4 text-yellow-500' />;
      case 'admin':
        return <Shield className='h-4 w-4 text-red-500' />;
      case 'author':
        return <Star className='h-4 w-4 text-blue-500' />;
      default:
        return null;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'superAdmin':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'admin':
        return 'bg-red-500 hover:bg-red-600';
      case 'author':
        return 'bg-blue-500 hover:bg-blue-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  // Render
  if (!user.isFetched) return <p>loading</p>;
  return (
    <div className='min-h-screen bg-background'>
      <div className='container py-8 max-w-6xl mx-auto'>
        {/* Profile Header */}
        <Card className='mb-8'>
          <CardContent className='p-8'>
            <div className='flex flex-col md:flex-row gap-6'>
              <Avatar className='h-32 w-32 mx-auto md:mx-0 border-4 border-primary/20'>
                <AvatarImage
                  src={user.data?.avatar?.url}
                  alt={user.data?.username}
                />
                <AvatarFallback className='text-4xl bg-gradient-gaming text-white'>
                  {user.data?.username?.[0]}
                </AvatarFallback>
              </Avatar>

              <div className='flex-1 text-center md:text-left'>
                <div className='flex flex-col md:flex-row md:items-center gap-4 mb-4'>
                  <div className='flex flex-col'>
                    <div className='flex items-center justify-center md:justify-start gap-2 mb-2'>
                      <h1 className='text-3xl font-bold'>@{username}</h1>
                      {user.data?.id !== profile?.id && (
                        <Button
                          disabled={user.data.id === profile?.id}
                          onClick={toggleFollow}
                          className={
                            isFollowing.state
                              ? 'flex flex-row gap-2 w-full sm:w-fit bg-gray-500 hover:bg-gray-600'
                              : 'flex flex-row gap-2 w-full sm:w-fit gradient-gaming glow-effect hover:glow-effect-strong'
                          }
                        >
                          {isFollowing.state ? (
                            <>
                              <UserMinus className='h-4 w-4' />
                              {t('user.unfollow')}
                            </>
                          ) : (
                            <>
                              <UserPlus className='h-4 w-4' />
                              {t('user.follow')}
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                    <Badge
                      className={`w-fit ${getRoleBadgeColor(
                        username
                      )} text-white`}
                    >
                      <div className='flex items-center gap-1'>
                        {getRoleIcon(user.data?.role)}
                        {t(`user.${user.data?.role}`)}
                      </div>
                    </Badge>
                  </div>
                </div>

                <p className='text-muted-foreground mb-4 max-w-2xl'>
                  {user.data?.bio}
                </p>

                <div className='flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground'>
                  <div className='flex items-center gap-1'>
                    <Calendar className='h-4 w-4' />
                    <span>
                      {t('user.joinedOn')} {getDate(user.data?.createDate)}
                    </span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Clock className='h-4 w-4' />
                    <span>{formatLastSeen(user.data?.lastSeen || '')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <Separator className='my-6' />
            <div className='grid grid-cols-3 gap-4 text-center'>
              <Link
                to={routes.users.followers(user.data?.username)}
                className='group'
              >
                <div className='text-2xl font-bold gradient-gaming-text flex items-center justify-center gap-2'>
                  <Users className='h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity' />
                  {user.data.followersCount}
                </div>
                <div className='text-sm text-muted-foreground group-hover:text-foreground transition-colors'>
                  {t('user.followers')}
                </div>
              </Link>

              <Link
                to={routes.users.followings(user.data.username)}
                className='group'
              >
                <div className='text-2xl font-bold gradient-gaming-text flex items-center justify-center gap-2'>
                  <UserCheck className='h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity' />
                  {user.data.followingsCount}
                </div>
                <div className='text-sm text-muted-foreground group-hover:text-foreground transition-colors'>
                  {t('user.following')}
                </div>
              </Link>

              <Link
                to={`${routes.posts.index}?creator=${user.data.id}`}
                className='group'
              >
                <div className='text-2xl font-bold gradient-gaming-text'>
                  {user?.data.postsCount}
                </div>
                <div className='text-sm text-muted-foreground'>
                  {t('user.posts')}
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue='posts' className='space-y-6'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='posts' className='flex items-center gap-2'>
              <FileText className='h-4 w-4' />
              {t('user.recentPosts')}
            </TabsTrigger>
            <TabsTrigger value='games' className='flex items-center gap-2'>
              <Gamepad2 className='h-4 w-4' />
              {t('user.favoriteGames')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value='posts' className='space-y-6'>
            {userRecentPosts.data.docs.length === 0 ? (
              <Card>
                <CardContent className='flex flex-col items-center justify-center py-12'>
                  <FileText className='h-12 w-12 text-muted-foreground mb-4' />
                  <h3 className='text-lg font-semibold mb-2'>
                    {t('user.noPosts')}
                  </h3>
                  <p className='text-muted-foreground text-center'>
                    {t('user.noPostsDescription')}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {userRecentPosts.data.docs.map((post) => (
                  <PostCard key={post.id} author={user.data} post={post} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value='games' className='space-y-6'>
            {user.data?.favoriteGames &&
            user.data?.favoriteGames.length === 0 ? (
              <Card>
                <CardContent className='flex flex-col items-center justify-center py-12'>
                  <Gamepad2 className='h-12 w-12 text-muted-foreground mb-4' />
                  <h3 className='text-lg font-semibold mb-2'>
                    {t('user.noFavoriteGames')}
                  </h3>
                  <p className='text-muted-foreground text-center'>
                    {t('user.noFavoriteGamesDescription')}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                {user.data?.favoriteGames &&
                  user.data?.favoriteGames?.map?.((game) => (
                    <Card
                      key={game.id}
                      className='group hover:shadow-lg transition-all duration-300 hover:-translate-y-1'
                    >
                      <CardContent className='p-4'>
                        <div className='aspect-square rounded-lg overflow-hidden mb-3'>
                          <img
                            src={
                              game.image ||
                              `https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80`
                            }
                            alt={game.title}
                            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                          />
                        </div>
                        <h3 className='font-semibold text-center group-hover:gradient-gaming-text transition-all'>
                          {game.title}
                        </h3>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
