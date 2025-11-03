import { useTranslation } from 'react-i18next';
import { Ban, User, Calendar, Clock, Shield } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Utilities
import { getDate } from '@/utilities';

// Types
import type { BanRecordProps } from '@/types/management/ban';

interface BanDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ban: BanRecordProps | null;
}

export default function BanDetailsDialog({
  open,
  onOpenChange,
  ban,
}: BanDetailsDialogProps) {
  const { t } = useTranslation();

  if (!ban) return null;

  const getBanTypeBadge = (type: string) => {
    switch (type) {
      case 'permanent':
        return (
          <Badge variant='destructive' className='flex items-center gap-1'>
            <Ban className='h-3 w-3' />
            {t('ban.permanent')}
          </Badge>
        );
      case 'temporary':
        return (
          <Badge variant='secondary' className='flex items-center gap-1'>
            <Clock className='h-3 w-3' />
            {t('ban.temporary')}
          </Badge>
        );
      default:
        return <Badge variant='outline'>{type}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Ban className='h-5 w-5 text-red-500' />
            {t('ban.banDetails')}
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Ban Info */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center justify-between'>
                <span>{t('ban.banInformation')}</span>
                {getBanTypeBadge(ban.type)}
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <h4 className='font-semibold text-sm text-muted-foreground mb-1'>
                    {t('ban.startDate')}
                  </h4>
                  <div className='flex items-center gap-1 text-sm'>
                    <Calendar className='h-4 w-4' />
                    {getDate(ban.startAt, 'YYYY/MM/DD HH:mm')}
                  </div>
                </div>

                {ban.endAt && (
                  <div>
                    <h4 className='font-semibold text-sm text-muted-foreground mb-1'>
                      {t('ban.endDate')}
                    </h4>
                    <div className='flex items-center gap-1 text-sm'>
                      <Calendar className='h-4 w-4' />
                      {getDate(ban.endAt, 'YYYY/MM/DD HH:mm')}
                    </div>
                  </div>
                )}
              </div>

              {ban.type === 'permanent' && (
                <div className='p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800'>
                  <p className='text-sm text-red-600 dark:text-red-400'>
                    {t('ban.permanentBanWarning')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Banned User Info */}
          <Card>
            <CardHeader>
              <CardTitle className='text-base flex items-center gap-2'>
                <User className='h-4 w-4' />
                {t('ban.bannedUser')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center gap-3 p-3 bg-muted/50 rounded-lg'>
                <Avatar className='h-10 w-10 border-2 border-primary/20'>
                  <AvatarImage src={ban.user.avatar?.url} />
                  <AvatarFallback>
                    {ban.user.username[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className='flex-1'>
                  <div className='font-medium'>@{ban.user.username}</div>
                  <div className='text-sm text-muted-foreground'>
                    {ban.user.email}
                  </div>
                </div>
                <Badge variant='secondary' className='capitalize'>
                  {t(`user.${ban.user.role}`)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Admin/Actor Info */}
          <Card>
            <CardHeader>
              <CardTitle className='text-base flex items-center gap-2'>
                <Shield className='h-4 w-4' />
                {t('ban.bannedBy')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center gap-3 p-3 bg-muted/50 rounded-lg'>
                <Avatar className='h-10 w-10 border-2 border-primary/20'>
                  <AvatarImage src={ban.actor.avatar?.url} />
                  <AvatarFallback>
                    {ban.actor.username[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className='flex-1'>
                  <div className='font-medium'>@{ban.actor.username}</div>
                  <div className='text-sm text-muted-foreground'>
                    {ban.actor.email}
                  </div>
                </div>
                <Badge
                  variant='default'
                  className='capitalize bg-primary/10 text-primary'
                >
                  {t(`user.${ban.actor.role}`)}
                </Badge>
              </div>
            </CardContent>
          </Card>
          {ban.reason && (
            <Card>
              <CardHeader>
                <CardTitle className='text-base flex items-center gap-2'>
                  <Shield className='h-4 w-4' />
                  {t('fields.reason')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex items-center gap-3 p-3 bg-muted/50 rounded-lg'>
                  <p className='text-sm'>{ban.reason}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
