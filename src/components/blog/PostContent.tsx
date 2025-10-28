import { Link } from 'react-router-dom';

// Components
import { Badge } from '@/components/ui/badge';

// Types
import type { PostProps } from '@/types/blog';

interface PostContentProps {
  post: PostProps;
}

export default function PostContent({ post }: PostContentProps) {
  return (
    <>
      <div className='aspect-video overflow-hidden rounded-lg mb-8'>
        <img
          src={post.coverImage?.url || '/placeholder.svg'}
          alt={post.title}
          className='w-full h-full object-cover'
        />
      </div>
      <div className='prose prose-lg dark:prose-invert max-w-none mb-8'>
        {post.content.split('\n').map((paragraph, index) => (
          <p key={index} className='mb-4 whitespace-pre-wrap'>
            {paragraph}
          </p>
        ))}
      </div>
      <div className='flex flex-wrap gap-2 mb-8'>
        {post.tags.map((tag) => (
          <Link key={tag.id} to={`/tag/${tag.slug}`}>
            <Badge variant='outline' className='hover:bg-accent'>
              #{tag.title}
            </Badge>
          </Link>
        ))}
      </div>
    </>
  );
}