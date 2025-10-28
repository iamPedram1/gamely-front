import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PostCard from '@/components/blog/PostCard';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getDate } from '@/utilities';

interface User {
  id: string;
  username: string;
  name: string;
  bio: string;
  avatar?: { url: string };
  role: 'user' | 'author' | 'admin' | 'superAdmin';
  joinDate: string;
  lastSeen: string;
  location?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing: boolean;
  favoriteGames: Array<{
    id: string;
    title: string;
    image?: string;
  }>;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: { url: string };
  createDate: string;
  readingTime: number;
  category: { title: string };
  tags: Array<{ title: string; slug: string }>;
}

export default function UserPage() {
  // States
  const [isFollowing, setIsFollowing] = useState(false);

  // Hooks
  const { t } = useTranslation();
  const { username } = useParams();

  // Mock user data
  const user: User = {
    id: '1',
    username: username || 'johndoe',
    name: 'John Doe',
    bio: 'Passionate gamer and content creator. Love RPGs, strategy games, and indie titles. Always looking for the next great gaming experience!',
    avatar: {
      url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    },
    role: 'author',
    joinDate: '2023-06-15T10:30:00Z',
    lastSeen: '2024-01-20T14:30:00Z',
    location: 'San Francisco, CA',
    followersCount: 1234,
    followingCount: 567,
    postsCount: 89,
    isFollowing: isFollowing,
    favoriteGames: [
      {
        id: '1',
        title: 'The Witcher 3',
        image:
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80',
      },
      {
        id: '2',
        title: 'Cyberpunk 2077',
        image:
          'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&q=80',
      },
      {
        id: '3',
        title: 'Elden Ring',
        image:
          'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=80',
      },
      {
        id: '4',
        title: 'Hades',
        image:
          'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&q=80',
      },
    ],
  };

  // Mock recent posts
  const recentPosts: Post[] = [
    {
      id: '1',
      title: 'The Best RPG Games of 2024',
      slug: 'best-rpg-games-2024',
      excerpt:
        'Discover the most amazing role-playing games that defined this year...',
      coverImage: {
        url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
      },
      createDate: '2024-01-18T10:30:00Z',
      readingTime: 8,
      category: { title: 'RPG' },
      tags: [
        { title: 'RPG', slug: 'rpg' },
        { title: '2024', slug: '2024' },
      ],
    },
    {
      id: '2',
      title: 'Indie Games Worth Playing',
      slug: 'indie-games-worth-playing',
      excerpt:
        'Hidden gems in the indie gaming world that deserve your attention...',
      coverImage: {
        url: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&q=80',
      },
      createDate: '2024-01-15T14:20:00Z',
      readingTime: 6,
      category: { title: 'Indie' },
      tags: [
        { title: 'Indie', slug: 'indie' },
        { title: 'Review', slug: 'review' },
      ],
    },
  ];

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const formatLastSeen = (dateString: string) => {
    const now = new Date();
    const lastSeen = new Date(dateString);
    const diffInHours = Math.floor(
      (now.getTime() - lastSeen.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return t('user.onlineNow');
    if (diffInHours < 24) return t('user.hoursAgo', { hours: diffInHours });
    return t('user.daysAgo', { days: Math.floor(diffInHours / 24) });
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

  return (
    <div className='min-h-screen bg-background'>
      <div className='container py-8 max-w-6xl mx-auto'>
        {/* Profile Header */}
        <Card className='mb-8'>
          <CardContent className='p-8'>
            <div className='flex flex-col md:flex-row gap-6'>
              <Avatar className='h-32 w-32 mx-auto md:mx-0 border-4 border-primary/20'>
                <AvatarImage src={user.avatar?.url} alt={user.name} />
                <AvatarFallback className='text-4xl bg-gradient-gaming text-white'>
                  {user.name[0]}
                </AvatarFallback>
              </Avatar>

              <div className='flex-1 text-center md:text-left'>
                <div className='flex flex-col md:flex-row md:items-center gap-4 mb-4'>
                  <div>
                    <h1 className='text-3xl font-bold mb-2'>{user.name}</h1>
                    <div className='flex items-center justify-center md:justify-start gap-2 mb-2'>
                      <span className='text-muted-foreground'>
                        @{user.username}
                      </span>
                      <Badge
                        className={`${getRoleBadgeColor(user.role)} text-white`}
                      >
                        <div className='flex items-center gap-1'>
                          {getRoleIcon(user.role)}
                          {t(`user.${user.role}`)}
                        </div>
                      </Badge>
                    </div>
                  </div>

                  <div className='flex gap-2'>
                    <Button
                      onClick={handleFollow}
                      className={
                        isFollowing
                          ? 'w-full sm:w-fit bg-gray-500 hover:bg-gray-600'
                          : 'w-full sm:w-fit gradient-gaming glow-effect hover:glow-effect-strong'
                      }
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
                  </div>
                </div>

                <p className='text-muted-foreground mb-4 max-w-2xl'>
                  {user.bio}
                </p>

                <div className='flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground'>
                  <div className='flex items-center gap-1'>
                    <Calendar className='h-4 w-4' />
                    <span>
                      {t('user.joinedOn')} {getDate(user.joinDate)}
                    </span>
                  </div>
                  {user.location && (
                    <div className='flex items-center gap-1'>
                      <MapPin className='h-4 w-4' />
                      <span>{user.location}</span>
                    </div>
                  )}
                  <div className='flex items-center gap-1'>
                    <Clock className='h-4 w-4' />
                    <span>
                      {t('user.lastSeen')} {formatLastSeen(user.lastSeen)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <Separator className='my-6' />
            <div className='grid grid-cols-3 gap-4 text-center'>
              <div>
                <div className='text-2xl font-bold gradient-gaming-text'>
                  {user.followersCount.toLocaleString()}
                </div>
                <div className='text-sm text-muted-foreground'>
                  {t('user.followers')}
                </div>
              </div>
              <div>
                <div className='text-2xl font-bold gradient-gaming-text'>
                  {user.followingCount.toLocaleString()}
                </div>
                <div className='text-sm text-muted-foreground'>
                  {t('user.following')}
                </div>
              </div>
              <div>
                <div className='text-2xl font-bold gradient-gaming-text'>
                  {user.postsCount}
                </div>
                <div className='text-sm text-muted-foreground'>
                  {t('user.posts')}
                </div>
              </div>
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
            {recentPosts.length === 0 ? (
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
                {recentPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value='games' className='space-y-6'>
            {user.favoriteGames.length === 0 ? (
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
                {user.favoriteGames.map((game) => (
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
