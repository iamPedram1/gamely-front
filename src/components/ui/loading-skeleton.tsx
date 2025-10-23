// Components
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function PostCardSkeleton() {
  return (
    <Card className='overflow-hidden'>
      <Skeleton className='aspect-video w-full' />
      <CardHeader>
        <Skeleton className='h-6 w-3/4 mb-2' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-2/3' />
      </CardHeader>
      <CardContent>
        <div className='flex items-center gap-2'>
          <Skeleton className='h-8 w-8 rounded-full' />
          <Skeleton className='h-4 w-24' />
        </div>
      </CardContent>
    </Card>
  );
}

export function GameCardSkeleton() {
  return (
    <Card className='overflow-hidden'>
      <Skeleton className='aspect-video w-full' />
      <CardHeader>
        <Skeleton className='h-6 w-3/4' />
      </CardHeader>
      <CardContent>
        <Skeleton className='h-4 w-full mb-2' />
        <Skeleton className='h-4 w-2/3' />
      </CardContent>
    </Card>
  );
}

export function TagCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className='h-6 w-3/4' />
      </CardHeader>
      <CardContent>
        <Skeleton className='h-4 w-1/2' />
      </CardContent>
    </Card>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className='space-y-3'>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className='flex items-center gap-4'>
          <Skeleton className='h-12 w-12 rounded-full' />
          <div className='flex-1 space-y-2'>
            <Skeleton className='h-4 w-3/4' />
            <Skeleton className='h-3 w-1/2' />
          </div>
          <Skeleton className='h-8 w-20' />
        </div>
      ))}
    </div>
  );
}

export function GamingLoader() {
  return (
    <div className='flex flex-col items-center justify-center py-20 space-y-6'>
      <div className='relative'>
        <div className='absolute inset-0 bg-gradient-gaming opacity-50 blur-3xl animate-pulse' />
        <div className='relative flex items-center justify-center'>
          <div className='w-20 h-20 border-4 border-primary/30 border-t-primary rounded-full animate-spin' />
        </div>
      </div>
      <div className='text-center space-y-2'>
        <p className='text-xl font-bold gradient-gaming-text animate-pulse'>
          Loading...
        </p>
        <p className='text-sm text-muted-foreground'>
          Preparing your gaming experience
        </p>
      </div>
    </div>
  );
}
