import { ReactNode, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

interface InfiniteScrollListProps<T> {
  data: T[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  renderItem: (item: T, index: number) => ReactNode;
  emptyState: ReactNode;
  loadingState?: ReactNode;
  className?: string;
  containerClassName?: string;
  itemClassName?: string;
}

export default function InfiniteScrollList<T extends { id: string }>(props: InfiniteScrollListProps<T>) {
  const {
    data,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    renderItem,
    emptyState,
    className = 'space-y-4',
    containerClassName = '',
    itemClassName = ''
  } = props;

  const handleScroll = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    const isEndOfScroll = scrollHeight - scrollTop - clientHeight < 300;
    
    if (hasNextPage && !isFetchingNextPage && isEndOfScroll) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (data.length === 0) {
    return (
      <div className={containerClassName}>
        {emptyState}
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      <div className={className}>
        {data.map((item, index) => (
          <div key={item.id} className={itemClassName}>
            {renderItem(item, index)}
          </div>
        ))}
        
        {isFetchingNextPage && (
          <div className='flex justify-center py-8'>
            <Loader2 className='h-6 w-6 animate-spin text-primary' />
          </div>
        )}
      </div>
    </div>
  );
}

// Grid version for card layouts
interface InfiniteScrollGridProps<T> extends Omit<InfiniteScrollListProps<T>, 'className'> {
  gridClassName?: string;
  columns?: {
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export function InfiniteScrollGrid<T extends { id: string }>(props: InfiniteScrollGridProps<T>) {
  const {
    data,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    renderItem,
    emptyState,
    gridClassName,
    columns = { default: 1, md: 2, lg: 3 },
    containerClassName = '',
    itemClassName = ''
  } = props;

  const handleScroll = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    const isEndOfScroll = scrollHeight - scrollTop - clientHeight < 300;
    
    if (hasNextPage && !isFetchingNextPage && isEndOfScroll) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const getGridClasses = () => {
    let classes = 'grid gap-4 md:gap-6';
    
    if (gridClassName) return `${classes} ${gridClassName}`;
    
    classes += ` grid-cols-${columns.default}`;
    if (columns.sm) classes += ` sm:grid-cols-${columns.sm}`;
    if (columns.md) classes += ` md:grid-cols-${columns.md}`;
    if (columns.lg) classes += ` lg:grid-cols-${columns.lg}`;
    if (columns.xl) classes += ` xl:grid-cols-${columns.xl}`;
    
    return classes;
  };

  if (data.length === 0) {
    return (
      <div className={containerClassName}>
        {emptyState}
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      <div className={getGridClasses()}>
        {data.map((item, index) => (
          <div key={item.id} className={itemClassName}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
      
      {isFetchingNextPage && (
        <div className='flex justify-center py-8 mt-6'>
          <Loader2 className='h-6 w-6 animate-spin text-primary' />
        </div>
      )}
    </div>
  );
}