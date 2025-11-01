import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Star,
  Heart,
  Calendar,
  Users,
  FileText,
  Share2,
  Play,
  Trophy,
  Gamepad2,
  ArrowLeft,
} from 'lucide-react';

// Components
import PostCard from '@/components/blog/PostCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import LoadingWrapper from '@/components/ui/loading-wrapper';
import { GamingLoader } from '@/components/ui/loading-skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Utilities
import useAuth from '@/hooks/useAuth';
import { getDate } from '@/utilities';
import { usePostsQuery } from '@/utilities/api/post';
import {
  useGameQuery,
  useRateGameMutation,
  useToggleFavoriteMutation,
  useGameRatingQuery,
  useGameFavoriteStatusQuery,
} from '@/utilities/api/game';
import {
  useAddGameToFavoriteMutation,
  useRemoveGameFromFavoriteMutation,
} from '@/utilities/api/favoriteGame';

interface RatingStarsProps {
  rating: number;
  onRate?: (rating: number) => void;
  readonly?: boolean;
}

function RatingStars({ rating, onRate, readonly = false }: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className='flex items-center gap-1'>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type='button'
          disabled={readonly}
          className={`transition-all duration-200 ${
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          }`}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
          onClick={() => !readonly && onRate?.(star)}
        >
          <Star
            className={`h-5 w-5 ${
              star <= (hoverRating || rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-muted-foreground'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function GameDetailPage() {
  // Hooks
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const { profile } = useAuth();
  const game = useGameQuery({ initialParams: slug });
  const posts = usePostsQuery({ queries: { game: slug } });
  const rating = useGameRatingQuery({
    initialParams: 'dasdsa',
    enabled: game.isFetched,
  });
  const rateGameMutation = useRateGameMutation();
  const addGameToFavorite = useAddGameToFavoriteMutation();
  const removeGameFromFavorite = useRemoveGameFromFavoriteMutation();
  const userRating = rating.data?.rating || 0;

  // Utilities
  const handleRate = (rating: number) => {
    if (game.data?.id) {
      rateGameMutation.mutate({ gameId: game.data.id, rating });
    }
  };

  const handleToggleFavorite = () => {
    if (game.data.isFavorite) removeGameFromFavorite.mutate(game.data.id);
    else addGameToFavorite.mutate(game.data.id);
  };

  // Render
  if (game.isFetching && !game.isFetched) return <GamingLoader />;
  if (!game.data) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold mb-2'>{t('game.notFound')}</h1>
          <p className='text-muted-foreground'>{t('game.notFoundDesc')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-background to-primary/5'>
      <div className='max-w-7xl mx-auto p-6 space-y-8'>
        {/* Back Button */}
        <Link to='/games'>
          <Button variant='ghost' className='mb-4'>
            <ArrowLeft className='h-4 w-4 rtl:rotate-180' />
            {t('common.back')}
          </Button>
        </Link>

        {/* Hero Section */}
        <div className='relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border border-primary/20'>
          <div className='absolute inset-0 bg-grid-pattern opacity-5' />
          <div className='relative p-8 lg:p-12'>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 items-center'>
              {/* Game Cover */}
              <div className='lg:col-span-1'>
                <div className='relative group'>
                  <div className='aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border-4 border-primary/20 group-hover:border-primary/40 transition-all duration-300'>
                    <img
                      src={
                        game.data.coverImage?.url ||
                        'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=80'
                      }
                      alt={game.data.title}
                      className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                    />
                  </div>
                  <div className='absolute -bottom-4 -right-4 bg-primary/90 backdrop-blur-xl rounded-full p-4 shadow-xl'>
                    <Gamepad2 className='h-8 w-8 text-primary-foreground' />
                  </div>
                </div>
              </div>

              {/* Game Info */}
              <div className='lg:col-span-2 space-y-6'>
                <div>
                  <h1 className='text-4xl lg:text-5xl font-bold gradient-gaming-text mb-4'>
                    {game.data.title}
                  </h1>
                  <p className='text-lg text-muted-foreground leading-relaxed'>
                    {game.data.description}
                  </p>
                </div>

                {/* Stats Grid */}
                <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
                  <Card className='bg-background/50 backdrop-blur border-primary/20'>
                    <CardContent className='p-4 text-center'>
                      <div className='flex items-center justify-center mb-2'>
                        <Star className='h-5 w-5 text-yellow-400 fill-yellow-400' />
                      </div>
                      <div className='text-2xl font-bold'>4.8</div>
                      <div className='text-xs text-muted-foreground'>
                        {t('game.ratings')}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className='bg-background/50 backdrop-blur border-primary/20'>
                    <CardContent className='p-4 text-center'>
                      <div className='flex items-center justify-center mb-2'>
                        <Users className='h-5 w-5 text-blue-400' />
                      </div>
                      <div className='text-2xl font-bold'>2.1K</div>
                      <div className='text-xs text-muted-foreground'>
                        {t('game.players')}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className='bg-background/50 backdrop-blur border-primary/20'>
                    <CardContent className='p-4 text-center'>
                      <div className='flex items-center justify-center mb-2'>
                        <FileText className='h-5 w-5 text-green-400' />
                      </div>
                      <div className='text-2xl font-bold'>
                        {posts.data.pagination.totalDocs}
                      </div>
                      <div className='text-xs text-muted-foreground'>
                        {t('common.posts')}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className='bg-background/50 backdrop-blur border-primary/20'>
                    <CardContent className='p-4 text-center'>
                      <div className='flex items-center justify-center mb-2'>
                        <Calendar className='h-5 w-5 text-purple-400' />
                      </div>
                      <div className='text-2xl font-bold'>
                        {new Date(game.data.releaseDate).getFullYear()}
                      </div>
                      <div className='text-xs text-muted-foreground'>
                        {t('game.releaseDate')}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Action Buttons */}
                <div className='flex flex-wrap gap-4'>
                  <Button
                    size='lg'
                    className='flex items-center gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90'
                  >
                    <Play className='h-5 w-5' />
                    {t('game.playNow')}
                  </Button>

                  <Button
                    size='lg'
                    variant='outline'
                    onClick={handleToggleFavorite}
                    className={`flex items-center gap-2 ${
                      game.data.isFavorite
                        ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-700 hover:border-red-700'
                        : 'hover:bg-primary/5'
                    }`}
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        game.data.isFavorite ? 'fill-red-500 text-red-500' : ''
                      }`}
                    />
                    {game.data.isFavorite
                      ? t('game.removeFromFavorites')
                      : t('game.addToFavorites')}
                  </Button>

                  <Button
                    size='lg'
                    variant='outline'
                    className='flex items-center gap-2'
                  >
                    <Share2 className='h-5 w-5' />
                    {t('common.share')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rating Section */}
        {profile && (
          <Card className='bg-gradient-to-r from-background to-primary/5 border-primary/20'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Trophy className='h-5 w-5 text-yellow-500' />
                {t('game.rateThisGame')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center gap-4'>
                <span className='text-sm font-medium'>
                  {t('game.yourRating')}:
                </span>
                <RatingStars rating={userRating} onRate={handleRate} />
                {userRating > 0 && (
                  <Badge variant='secondary' className='ml-2'>
                    {userRating}/5 {t('game.stars')}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content Tabs */}
        <Tabs defaultValue='posts' className='space-y-6'>
          <TabsList className='grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3'>
            <TabsTrigger value='posts' className='flex items-center gap-2'>
              <FileText className='h-4 w-4' />
              {t('common.posts')} ({posts.data.pagination.totalDocs})
            </TabsTrigger>
            <TabsTrigger value='details' className='flex items-center gap-2'>
              <Gamepad2 className='h-4 w-4' />
              {t('common.details')}
            </TabsTrigger>
            <TabsTrigger value='reviews' className='flex items-center gap-2'>
              <Star className='h-4 w-4' />
              {t('common.reviews')}
            </TabsTrigger>
          </TabsList>

          {/* Posts Tab */}
          <TabsContent value='posts' className='space-y-6'>
            <div className='flex items-center justify-between'>
              <h2 className='text-2xl font-bold'>{t('game.relatedPosts')}</h2>
              <Link to='/create-post'>
                <Button variant='outline'>
                  <FileText className='h-4 w-4 mr-2' />
                  {t('game.writePost')}
                </Button>
              </Link>
            </div>

            <LoadingWrapper isLoading={posts.isFetching}>
              {posts.data.docs.length === 0 ? (
                <Card className='p-12 text-center bg-muted/20'>
                  <FileText className='h-16 w-16 mx-auto mb-4 text-muted-foreground' />
                  <h3 className='text-xl font-semibold mb-2'>
                    {t('game.noPosts')}
                  </h3>
                  <p className='text-muted-foreground mb-6'>
                    {t('game.noPostsDesc')}
                  </p>
                  <Link to='/create-post'>
                    <Button>
                      <FileText className='h-4 w-4 mr-2' />
                      {t('game.writeFirstPost')}
                    </Button>
                  </Link>
                </Card>
              ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {posts.data.docs.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </LoadingWrapper>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value='details' className='space-y-6'>
            <Card className='bg-gradient-to-br from-background to-primary/5 border-primary/20'>
              <CardHeader>
                <CardTitle>{t('game.gameDetails')}</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <h4 className='font-semibold mb-2'>
                      {t('game.releaseDate')}
                    </h4>
                    <p className='text-muted-foreground'>
                      {getDate(game.data.releaseDate)}
                    </p>
                  </div>
                  <div>
                    <h4 className='font-semibold mb-2'>{t('game.genre')}</h4>
                    <div className='flex flex-wrap gap-2'>
                      <Badge variant='secondary'>Action</Badge>
                      <Badge variant='secondary'>Adventure</Badge>
                      <Badge variant='secondary'>RPG</Badge>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className='font-semibold mb-2'>
                    {t('game.description')}
                  </h4>
                  <p className='text-muted-foreground leading-relaxed'>
                    {game.data.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value='reviews' className='space-y-6'>
            <Card className='bg-gradient-to-br from-background to-primary/5 border-primary/20'>
              <CardHeader>
                <CardTitle>{t('game.playerReviews')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-6'>
                  {/* Sample Reviews */}
                  {[1, 2, 3].map((review) => (
                    <div
                      key={review}
                      className='border-b border-primary/10 pb-6 last:border-b-0'
                    >
                      <div className='flex items-start gap-4'>
                        <Avatar className='h-10 w-10 border-2 border-primary/20'>
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${review}`}
                          />
                          <AvatarFallback>U{review}</AvatarFallback>
                        </Avatar>
                        <div className='flex-1'>
                          <div className='flex items-center gap-2 mb-2'>
                            <span className='font-semibold'>
                              Player{review}
                            </span>
                            <RatingStars rating={5 - review + 3} readonly />
                            <span className='text-xs text-muted-foreground'>
                              2 days ago
                            </span>
                          </div>
                          <p className='text-muted-foreground'>
                            Amazing game! The graphics are stunning and the
                            gameplay is incredibly engaging. Highly recommend to
                            anyone who loves adventure games.
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
