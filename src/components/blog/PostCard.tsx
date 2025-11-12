import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock } from 'lucide-react';

// Components
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';

// Utilities
import { getDate } from '@/utilities';
import routes from '@/utilities/routes';

// Types
import type { PostProps, UserProps } from '@/types/client/blog';

interface PostCardProps {
  post: PostProps;
  author?: UserProps;
}

export default function PostCard(props: PostCardProps) {
  // Props
  const { post, author } = props;

  // Custom Hooks
  const { t, i18n } = useTranslation();

  // Render
  return (
    <Card className='flex flex-col overflow-hidden hover:shadow-2xl transition-all border-primary/20 hover:border-primary/50 bg-card/50 backdrop-blur group'>
      {post.coverImage && (
        <Link to={`${routes.posts.index}/${post.slug}`}>
          <div className='h-[30rem] overflow-hidden relative'>
            <img
              src={post.coverImage?.url || '/placeholder.svg'}
              alt={post.title}
              className='w-full h-full aspect-square object-cover group-hover:scale-110 transition-transform duration-500'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
          </div>
        </Link>
      )}

      <CardHeader className='space-y-3 !pb-0'>
        <div className='flex items-center gap-2'>
          <Badge
            variant='secondary'
            className='bg-primary/10 text-primary border-primary/20 font-semibold uppercase text-xs'
          >
            {post.category?.title}
          </Badge>
          {post.game && (
            <Badge
              variant='outline'
              className='border-primary/30 font-medium text-xs'
            >
              {post.game?.title || t('common.game')}
            </Badge>
          )}
        </div>
        <Link to={`${routes.posts.index}/${post.slug}`}>
          <h3 className='text-lg font-bold hover:text-primary transition-colors line-clamp-2 leading-tight h-12'>
            {post.title}
          </h3>
        </Link>
      </CardHeader>

      <CardContent className='space-y-4  !pt-2 !pb-0'>
        <p className='text-sm text-muted-foreground h-16 line-clamp-3 leading-relaxed'>
          {post.abstract}
        </p>

        <div className='flex flex-wrap gap-2'>
          {post.tags.length > 0 &&
            post.tags.map((tag) => (
              <Link key={tag.id} to={routes.tags.details(tag.slug)}>
                <Badge
                  variant='outline'
                  className='hover:bg-primary/10 hover:border-primary/50 transition-all text-xs'
                >
                  #{tag.title}
                </Badge>
              </Link>
            ))}
        </div>
      </CardContent>
      <CardFooter className='flex mt-auto items-center justify-between border-t border-primary/10 pt-4'>
        <Link
          to={routes.users.details(author?.username || post?.author?.username)}
          className='flex items-center gap-2 hover:opacity-80 transition-opacity'
        >
          <Avatar className='h-8 w-8 border-2 border-primary/20'>
            <AvatarImage
              src={
                author?.avatar?.url ||
                post.author?.avatar?.url ||
                '/placeholder.svg'
              }
              alt={author?.username || post.author?.username}
            />
            <AvatarFallback className='bg-primary/10 text-primary font-bold'>
              {author?.username?.[0] || post.author?.username?.[0]}
            </AvatarFallback>
          </Avatar>
          <span className='text-sm font-semibold'>
            {author?.username || post.author?.username}
          </span>
        </Link>

        <div className='flex items-center gap-3 text-xs text-muted-foreground'>
          <div className='flex items-center gap-1'>
            <Calendar className='h-3 w-3' />
            <span> {getDate(post.createDate)}</span>
          </div>
          <div className='flex items-center gap-1'>
            <Clock className='h-3 w-3' />
            <span>
              {post.readingTime} {t('common.min')}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
