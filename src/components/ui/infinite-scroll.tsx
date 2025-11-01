import { ReactNode, useRef, useCallback, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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

export default function InfiniteScrollList<T extends { id: string }>({
  data,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  renderItem,
  emptyState,
  loadingState,
  className = "space-y-4 max-h-[600px] overflow-y-auto pr-1",
  containerClassName = "",
  itemClassName = ""
}: InfiniteScrollListProps<T>) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isEndOfScroll = scrollHeight - scrollTop - clientHeight < 100;
    
    if (hasNextPage && !isFetchingNextPage && isEndOfScroll) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const defaultLoadingState = useMemo(() => (
    <div className='flex justify-center py-12'>
      <Loader2 className='h-8 w-8 animate-spin text-primary' />
    </div>
  ), []);

  if (data.length === 0) {
    return (
      <div className={containerClassName}>
        {emptyState}
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      <div
        className={className}
        ref={scrollContainerRef}
        onScroll={handleScroll}
      >
        {data.map((item, index) => (
          <div key={item.id} className={itemClassName}>
            {renderItem(item, index)}
          </div>
        ))}
        
        {isFetchingNextPage && (
          <div className='flex justify-center py-4'>
            <Loader2 className='h-5 w-5 animate-spin text-primary' />
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

export function InfiniteScrollGrid<T extends { id: string }>({
  data,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  renderItem,
  emptyState,
  loadingState,
  gridClassName,
  columns = { default: 1, md: 2, lg: 3 },
  containerClassName = "",
  itemClassName = ""
}: InfiniteScrollGridProps<T>) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isEndOfScroll = scrollHeight - scrollTop - clientHeight < 100;
    
    if (hasNextPage && !isFetchingNextPage && isEndOfScroll) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const getGridClasses = () => {
    let classes = 'grid gap-6';
    
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
      <div
        className="max-h-[80vh] overflow-y-auto pr-1"
        ref={scrollContainerRef}
        onScroll={handleScroll}
      >
        <div className={getGridClasses()}>
          {data.map((item, index) => (
            <div key={item.id} className={itemClassName}>
              {renderItem(item, index)}
            </div>
          ))}
        </div>
        
        {isFetchingNextPage && (
          <div className='flex justify-center py-4 mt-6'>
            <Loader2 className='h-5 w-5 animate-spin text-primary' />
          </div>
        )}
      </div>
    </div>
  );
}