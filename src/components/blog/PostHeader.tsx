import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock } from 'lucide-react';

// Components
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Utilities
import { getDate } from '@/utilities';

// Types
import type { PostProps } from '@/types/client/blog';

interface PostHeaderProps {
  post: PostProps;
}

export default function PostHeader({ post }: PostHeaderProps) {
  // Hooks
  const { t, i18n } = useTranslation();

  return (
    <div className='mb-6'>
      <div className='flex items-center gap-2 mb-4'>
        <Badge variant='secondary'>{post.category.title}</Badge>
        {post.game && <Badge variant='outline'>{post.game.title}</Badge>}
      </div>

      <h1 className='text-xl md:text-5xl font-bold mb-4'>{post.title}</h1>

      <div className='flex items-center gap-2 md:gap-4 text-sm text-muted-foreground mb-6'>
        <div className='flex items-center gap-2'>
          <Avatar className='h-10 w-10'>
            <AvatarImage
              src={post.author.avatar?.url || '/placeholder.svg'}
              alt={post.author.username}
            />
            <AvatarFallback>{post.author.username[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className='text-xs md:text-sm font-medium text-foreground'>
              {post.author.username}
            </p>
            <p className='text-xs'>{post.author.bio}</p>
          </div>
        </div>
        <Separator orientation='vertical' className='h-10' />
        <div className='flex items-center gap-1'>
          <Calendar className='h-4 w-4' />
          <span className='text-xs md:text-sm text-nowrap'>
            {getDate(post.createDate)}
          </span>
        </div>
        <Separator orientation='vertical' className='h-10' />
        <div className='flex items-center gap-1'>
          <Clock className='h-4 w-4' />
          <span className='text-xs md:text-sm text-nowrap'>
            {post.readingTime} {t('post.minRead')}
          </span>
        </div>
      </div>
    </div>
  );
}
