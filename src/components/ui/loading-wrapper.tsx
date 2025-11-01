import { ReactNode } from 'react';
import { GamingLoader, TableSkeleton } from '@/components/ui/loading-skeleton';

interface LoadingWrapperProps {
  isLoading: boolean;
  children: ReactNode;
  type?: 'gaming' | 'table' | 'skeleton';
  rows?: number;
  className?: string;
}

export function LoadingWrapper({ 
  isLoading, 
  children, 
  type = 'gaming', 
  rows = 5,
  className = '' 
}: LoadingWrapperProps) {
  if (isLoading) {
    switch (type) {
      case 'gaming':
        return <GamingLoader />;
      case 'table':
        return <TableSkeleton rows={rows} />;
      case 'skeleton':
        return (
          <div className={`animate-pulse space-y-4 ${className}`}>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </div>
        );
      default:
        return <GamingLoader />;
    }
  }

  return <>{children}</>;
}

export default LoadingWrapper;