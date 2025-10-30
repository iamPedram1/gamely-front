import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Trash2, Check, Loader2 } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useDeleteAllNotificationsMutation,
  useDeleteNotificationMutation,
  useNotificationsInfiniteQuery,
  useSeenAllNotificationsMutation,
  useSeenNotificationMutation,
} from '@/utilities/api/notification';

// Utilities
import { getDate } from '@/utilities';

export default function NotificationsMenu() {
  // Hooks
  const { t } = useTranslation();

  const notifications = useNotificationsInfiniteQuery();
  const seenOne = useSeenNotificationMutation({ disableAutoAlert: true });
  const seenAll = useSeenAllNotificationsMutation({ disableAutoAlert: true });
  const deleteAll = useDeleteAllNotificationsMutation({
    disableAutoAlert: true,
  });
  const deleteOne = useDeleteNotificationMutation({
    disableAutoAlert: true,
  });

  // Utilities
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target;
    const { scrollTop, scrollHeight, clientHeight } = target as HTMLElement;
    const { hasNextPage, isFetchingNextPage, fetchNextPage } = notifications;
    const isEndOfScroll = scrollHeight - scrollTop - clientHeight < 100;

    if (hasNextPage && !isFetchingNextPage && isEndOfScroll) fetchNextPage();
  };

  const allNotifications = useMemo(
    () => notifications.data?.pages.flatMap((page) => page.docs) || [],
    [notifications.data?.pages]
  );

  const unreadCount = useMemo(
    () => allNotifications.filter((n) => !n.seen).length,
    [allNotifications]
  );

  // Render
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='sm' className='relative h-9 w-9 p-0'>
          <Bell className='h-5 w-5' />
          {unreadCount > 0 && (
            <Badge
              variant='destructive'
              className='absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center'
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='w-80 bg-background/95 backdrop-blur-xl border-primary/20'
      >
        <div className='flex items-center justify-between px-2'>
          <DropdownMenuLabel className='font-semibold'>
            {t('notifications.title')}
          </DropdownMenuLabel>
          <div className='flex gap-1'>
            <Button
              variant='ghost'
              size='icon'
              className='h-7 w-7 text-primary hover:text-primary/80'
              onClick={() => seenAll.mutate(null)}
              title={t('notifications.markAllAsRead')}
            >
              <Check className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='h-7 w-7 text-destructive hover:text-destructive/80'
              onClick={() => deleteAll.mutate(null)}
              title={t('notifications.deleteAll')}
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </div>
        </div>
        <DropdownMenuSeparator />
        <ScrollArea onScrollCapture={handleScroll} className='h-64'>
          {allNotifications.length === 0 && !notifications.isFetching ? (
            <div className='p-4 text-center text-muted-foreground text-sm'>
              {t('notifications.empty')}
            </div>
          ) : (
            <>
              {allNotifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  onClick={() => seenOne.mutate(notification.id)}
                  className='flex flex-col items-start p-3 cursor-pointer hover:bg-accent/50'
                >
                  <div className='flex items-start gap-2 w-full'>
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        notification.seen ? 'bg-muted' : 'bg-primary'
                      }`}
                    />
                    <div className='flex-1'>
                      <p className='text-sm leading-relaxed'>
                        {notification.message}
                      </p>
                      <div className='flex justify-between items-center'>
                        <p className='text-xs text-muted-foreground mt-1'>
                          {getDate(notification.createDate)}
                        </p>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-7 w-7 text-destructive hover:text-destructive/80'
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            deleteOne.mutate(notification.id);
                          }}
                          title={t('notifications.deleteOne')}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
              {notifications.hasNextPage && (
                <div className='flex justify-center py-3'>
                  <Loader2 className='h-5 w-5 animate-spin text-muted-foreground' />
                </div>
              )}
            </>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
