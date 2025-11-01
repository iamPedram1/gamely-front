import { useTranslation } from 'react-i18next';
import { Calendar, Clock, Flag } from 'lucide-react';

// Components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Utilities
import { getDate } from '@/utilities';

// Types
import type { PostProps } from '@/types/client/blog';

interface PostHeaderProps {
  post: PostProps;
  onReport?: () => void;
}

export default function PostHeader({ post, onReport }: PostHeaderProps) {
  // Hooks
  const { t } = useTranslation();

  return (
    <header className='space-y-6'>
      <div className='flex items-center gap-2'>
        <Badge variant='secondary'>{post.category.title}</Badge>
        {post.game && <Badge variant='outline'>{post.game.title}</Badge>}
      </div>

      <h1 className='text-xl md:text-5xl font-bold'>{post.title}</h1>
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
      <div className='flex items-center justify-between'>
        {onReport && (
          <Button
            variant='outline'
            size='sm'
            onClick={onReport}
            className='flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50'
          >
            <Flag className='h-4 w-4' />
            {t('post.report')}
          </Button>
        )}
      </div>
    </header>
  );
}
