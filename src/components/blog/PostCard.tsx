import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock } from 'lucide-react';

// Components
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Utilities
import { getDate } from '@/utilities';

// Types
import type { PostProps } from '@/types/blog';

interface PostCardProps {
  post: PostProps;
}

export default function PostCard({ post }: PostCardProps) {
  // Custom Hooks
  const { t, i18n } = useTranslation();

  // Render
  return (
    <Card className='flex flex-col overflow-hidden hover:shadow-2xl transition-all border-primary/20 hover:border-primary/50 bg-card/50 backdrop-blur group'>
      {post.coverImage && (
        <Link to={`/posts/${post.slug}`}>
          <div className='aspect-video overflow-hidden relative'>
            <img
              src={post.coverImage?.url || '/placeholder.svg'}
              alt={post.title}
              className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
          </div>
        </Link>
      )}

      <CardHeader className='space-y-3'>
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
        <Link to={`/posts/${post.slug}`}>
          <h3 className='text-xl font-bold hover:text-primary transition-colors line-clamp-2 leading-tight'>
            {post.title}
          </h3>
        </Link>
      </CardHeader>

      <CardContent className='space-y-4'>
        <p className='text-muted-foreground line-clamp-3 leading-relaxed'>
          {post.title}
        </p>

        <div className='flex flex-wrap gap-2'>
          {post.tags.length > 0 &&
            post.tags.map((tag) => (
              <Link key={tag.id} to={`/tag/${tag.slug}`}>
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
          to={`/author/${post?.author?.id}`}
          className='flex items-center gap-2 hover:opacity-80 transition-opacity'
        >
          <Avatar className='h-8 w-8 border-2 border-primary/20'>
            <AvatarImage
              src={post.author?.avatar?.url || '/placeholder.svg'}
              alt={post.author.name}
            />
            <AvatarFallback className='bg-primary/10 text-primary font-bold'>
              {post.author.name[0]}
            </AvatarFallback>
          </Avatar>
          <span className='text-sm font-semibold'>{post.author.name}</span>
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
