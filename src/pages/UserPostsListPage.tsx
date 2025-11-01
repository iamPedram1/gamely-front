import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

// Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PostCard from '@/components/blog/PostCard';
import LoadingWrapper from '@/components/ui/loading-wrapper';
import { PostCardSkeleton } from '@/components/ui/loading-skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Hooks
import useAuth from '@/hooks/useAuth';
import { usePostsQuery } from '@/utilities/api/post';
import { useCategoriesQuery } from '@/utilities/api/category';

export default function UserPostsListPage() {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const postsQuery = usePostsQuery({
    enabled: true,
    queries: {
      // search: debouncedSearch,
      category: category || undefined,
      author: profile?.id, // Filter by current user's posts
    },
  });

  const categoriesQuery = useCategoriesQuery({ enabled: true });

  return (
    <div className='min-h-screen bg-background'>
      <div className='max-w-7xl mx-auto p-6 space-y-8'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-bold gradient-gaming-text'>
              {t('posts.myPosts')}
            </h1>
            <p className='text-muted-foreground mt-2'>
              {t('posts.manageYourPosts')}
            </p>
          </div>

          <Link to='/create-post'>
            <Button className='flex items-center gap-2'>
              <Plus className='h-4 w-4' />
              {t('posts.createNew')}
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder={t('posts.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='pl-10'
            />
          </div>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className='w-full sm:w-48'>
              <Filter className='h-4 w-4 mr-2' />
              <SelectValue placeholder={t('posts.filterByCategory')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=''>{t('posts.allCategories')}</SelectItem>
              {categoriesQuery.data?.docs?.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Posts Grid */}
        <LoadingWrapper isLoading={postsQuery.isFetching} type='skeleton'>
          {postsQuery.data?.docs?.length === 0 ? (
            <div className='text-center py-20'>
              <div className='max-w-md mx-auto'>
                <div className='w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center'>
                  <Plus className='h-12 w-12 text-muted-foreground' />
                </div>
                <h3 className='text-xl font-semibold mb-2'>
                  {t('posts.noPosts')}
                </h3>
                <p className='text-muted-foreground mb-6'>
                  {t('posts.noPostsDescription')}
                </p>
                <Link to='/create-post'>
                  <Button>
                    <Plus className='h-4 w-4 mr-2' />
                    {t('posts.createFirstPost')}
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {postsQuery.isFetching
                ? Array.from({ length: 6 }).map((_, i) => (
                    <PostCardSkeleton key={i} />
                  ))
                : postsQuery.data?.docs?.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
            </div>
          )}
        </LoadingWrapper>
      </div>
    </div>
  );
}
