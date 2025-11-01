import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, FileText, Calendar } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import Searchbar from '@/components/ui/searchbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Utilities
import routes from '@/utilities/routes';
import { useCategoriesInfiniteQuery } from '@/utilities/api/category';

export default function CategoriesPage() {
  const { t } = useTranslation();

  // Hooks
  const categories = useCategoriesInfiniteQuery();
  const allCategories = useMemo(
    () => categories.data.pages.flatMap((page) => page.docs),
    [categories.data]
  );

  // Render
  return (
    <div className='min-h-screen bg-background'>
      <div className='container py-8'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className='text-2xl md:text-4xl md:text-6xl font-bold mb-4 gradient-gaming-text'>
            {t('categories.title')}
          </h1>
          <p className='text-xl text-muted-foreground max-w-2xl mx-auto mb-8'>
            {t('categories.description')}
          </p>

          {/* Stats */}
          <div className='flex flex-wrap justify-center gap-6 mb-8'>
            <div className='text-center'>
              <div className='text-3xl font-bold gradient-gaming-text'>
                {categories.data.pages[0].pagination.totalDocs}
              </div>
              <div className='text-sm text-muted-foreground'>
                {t('categories.totalCategories')}
              </div>
            </div>
            <div className='text-center'>
              <div className='text-3xl font-bold gradient-gaming-text'>
                {10}
              </div>
              <div className='text-sm text-muted-foreground'>
                {t('categories.totalPosts')}
              </div>
            </div>
            <div className='text-center'>
              <div className='text-3xl font-bold gradient-gaming-text'>{5}</div>
              <div className='text-sm text-muted-foreground'>
                {t('categories.trending')}
              </div>
            </div>
          </div>

          {/* Search */}
          <Searchbar />
        </div>
        {/* Categories Grid */}
        {allCategories.length === 0 ? (
          <Card className='max-w-md mx-auto'>
            <CardContent className='flex flex-col items-center justify-center py-12'>
              <Search className='h-12 w-12 text-muted-foreground mb-4' />
              <h3 className='text-lg font-semibold mb-2'>
                {t('common.noResults')}
              </h3>
              <p className='text-muted-foreground text-center'>
                {t('common.tryDifferentSearch')}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {allCategories.map((category) => (
              <Card
                key={category.id}
                className='group flex flex-col border-primary/20 hover:border-primary/40 hover:shadow-xl transition-all duration-300'
              >
                <CardHeader className='relative pb-4'>
                  <div className='flex items-start justify-between'>
                    <div className='flex items-center gap-3'>
                      {/* <div
                        className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center text-2xl shadow-lg`}
                      >
                        {category.icon}
                      </div> */}
                      <div>
                        <CardTitle className='text-xl group-hover:gradient-gaming-text transition-all'>
                          {category.title}
                        </CardTitle>
                        {/* {category.trending && (
                          <Badge
                            variant='secondary'
                            className='mt-1 bg-gradient-gaming text-white'
                          >
                            <TrendingUp className='h-3 w-3 mr-1' />
                            {t('categories.trending')}
                          </Badge>
                        )} */}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className='flex flex-col justify-end flex-grow gap-4'>
                  <p className='text-muted-foreground text-sm leading-relaxed line-clamp-1'>
                    {/* {category.description} */}
                  </p>
                  <div className='flex items-center justify-between text-sm'>
                    <div className='flex items-center gap-1 text-muted-foreground'>
                      <FileText className='h-4 w-4' />
                      <span>
                        {/* {category.postCount} {t('categories.posts')} */}
                      </span>
                    </div>
                    <div className='flex items-center gap-1 text-muted-foreground'>
                      <Calendar className='h-4 w-4' />
                      {/* <span>{formatDate(category.lastPostDate)}</span> */}
                    </div>
                  </div>
                  <Link to={routes.categories.details(category.slug)}>
                    <Button
                      className='w-full gradient-gaming glow-effect hover:glow-effect-strong transition-all'
                      size='sm'
                    >
                      {t('categories.explore')}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {/* TODO: Featured Categories
        {!searchQuery && trendingCategories.length > 0 && (
          <div className='mt-16'>
            <h2 className='text-3xl font-bold text-center mb-8 gradient-gaming-text'>
              {t('categories.featuredCategories')}
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              {trendingCategories.slice(0, 4).map((category) => (
                <Link
                  key={category.id}
                  to={routes.categories.details(category.slug)}
                  className='group'
                >
                  <Card className='hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/20 hover:border-primary/40'>
                    <CardContent className='p-4 text-center'>
                      <div
                        className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center text-3xl mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform`}
                      >
                        {category.icon}
                      </div>
                      <h3 className='font-semibold group-hover:gradient-gaming-text transition-all'>
                        {category.title}
                      </h3>
                      <p className='text-sm text-muted-foreground mt-1'>
                        {category.postCount} {t('categories.posts')}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}
