import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Ban, Clock, Info } from 'lucide-react';

// Components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import BanDetailsDialog from '@/components/admin/BanDetailsDialog';
import LoadingWrapper from '@/components/ui/loading-wrapper';
import PaginationControls from '@/components/ui/pagination-controls';

// Hooks
import { useBanListQuery } from '@/utilities/api/management/ban';

// Utilities
import { getDate } from '@/utilities';

// Types
import type { BanRecordProps, BanType } from '@/types/management/ban';
import { useSearchParams } from 'react-router-dom';

export default function BanListPage() {
  // States
  const [selectedBan, setSelectedBan] = useState<BanRecordProps | null>(null);
  const [showBanDetails, setShowBanDetails] = useState(false);

  // Hooks
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const bans = useBanListQuery({ refetchOnQueryChange: true });

  // Utilities
  const getBanTypeBadge = (type: string) => {
    switch (type) {
      case 'permanent':
        return (
          <Badge
            variant='destructive'
            className='w-fit flex items-center gap-1'
          >
            <Ban className='h-3 w-3' />
            {t('ban.permanent')}
          </Badge>
        );
      case 'temporary':
        return (
          <Badge variant='secondary' className='w-fit flex items-center gap-1'>
            <Clock className='h-3 w-3' />
            {t('ban.temporary')}
          </Badge>
        );
      default:
        return <Badge variant='outline'>{type}</Badge>;
    }
  };

  const handleFilterType = (type: BanType | 'all') => {
    setSearchParams((sp) => {
      if (!type || type === 'all') sp.delete('type');
      else sp.set('type', type);
      return sp;
    });
  };

  // Render
  return (
    <div className='min-h-screen bg-background'>
      <div className='container py-4 md:py-8 px-4 md:px-6'>
        {/* Header */}
        <div className='mb-6 md:mb-8'>
          <div className='flex flex-col sm:flex-row sm:items-center gap-3 mb-4'>
            <div className='p-2 rounded-lg bg-red-100 dark:bg-red-900'>
              <Ban className='h-6 w-6 text-red-600' />
            </div>
            <div>
              <h1 className='text-2xl md:text-3xl font-bold'>
                {t('ban.title')}
              </h1>
              <p className='text-muted-foreground text-sm md:text-base'>
                {t('ban.description')}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className='grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6'>
            <Card className='bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800'>
              <CardContent className='p-3 md:p-4'>
                <div className='flex items-center gap-2'>
                  <Ban className='h-4 w-4 md:h-5 md:w-5 text-red-500' />
                  <div>
                    <div className='text-lg md:text-2xl font-bold text-red-500'>
                      {bans.data?.pagination?.totalDocs || 0}
                    </div>
                    <div className='text-xs md:text-sm text-muted-foreground'>
                      {t('ban.totalBans')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800'>
              <CardContent className='p-3 md:p-4'>
                <div className='flex items-center gap-2'>
                  <Clock className='h-4 w-4 md:h-5 md:w-5 text-orange-500' />
                  <div>
                    <div className='text-lg md:text-2xl font-bold text-orange-500'>
                      {
                        bans.data.docs.filter((b) => b.type === 'temporary')
                          .length
                      }
                    </div>
                    <div className='text-xs md:text-sm text-muted-foreground'>
                      {t('ban.temporary')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 border-gray-200 dark:border-gray-800'>
              <CardContent className='p-3 md:p-4'>
                <div className='flex items-center gap-2'>
                  <Ban className='h-4 w-4 md:h-5 md:w-5 text-gray-500' />
                  <div>
                    <div className='text-lg md:text-2xl font-bold text-gray-500'>
                      {
                        bans.data.docs.filter((b) => b.type === 'permanent')
                          .length
                      }
                    </div>
                    <div className='text-xs md:text-sm text-muted-foreground'>
                      {t('ban.permanent')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className='flex flex-col sm:flex-row gap-3 md:gap-4'>
            <Select
              value={searchParams.get('type')}
              onValueChange={handleFilterType}
            >
              <SelectTrigger className='w-full sm:w-48'>
                <SelectValue placeholder={t('ban.filterByType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>{t('common.all')}</SelectItem>
                <SelectItem value='permanent'>{t('ban.permanent')}</SelectItem>
                <SelectItem value='temporary'>{t('ban.temporary')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bans Table */}
        <Card>
          <CardHeader className='pb-3 md:pb-6'>
            <CardTitle className='text-lg md:text-xl'>
              {t('ban.allBans')} ({bans.data.docs.length})
            </CardTitle>
          </CardHeader>
          <CardContent className='p-0'>
            <LoadingWrapper isLoading={bans.isFetching}>
              {bans.data.docs.length === 0 ? (
                <div className='text-center py-8 md:py-12 px-4'>
                  <Ban className='h-10 w-10 md:h-12 md:w-12 text-muted-foreground mx-auto mb-4' />
                  <h3 className='text-base md:text-lg font-semibold mb-2'>
                    {t('ban.noBans')}
                  </h3>
                  <p className='text-muted-foreground text-sm md:text-base'>
                    {t('ban.noBansDescription')}
                  </p>
                </div>
              ) : (
                <>
                  <div className='overflow-x-auto'>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className='min-w-[150px]'>
                            {t('ban.bannedUser')}
                          </TableHead>
                          <TableHead className='min-w-[100px]'>
                            {t('ban.type')}
                          </TableHead>
                          <TableHead className='min-w-[120px] hidden md:table-cell'>
                            {t('ban.startDate')}
                          </TableHead>
                          <TableHead className='min-w-[120px] hidden lg:table-cell'>
                            {t('ban.endDate')}
                          </TableHead>
                          <TableHead>{t('ban.bannedBy')}</TableHead>
                          <TableHead className='min-w-[80px]'>
                            {t('common.actions')}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bans.data.docs.map((ban) => (
                          <TableRow key={ban.id}>
                            <TableCell>
                              <div className='flex items-center gap-2'>
                                <Avatar className='h-6 w-6 md:h-8 md:w-8'>
                                  <AvatarImage src={ban.user.avatar?.url} />
                                  <AvatarFallback className='text-xs'>
                                    {ban.user.username[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className='font-medium text-sm'>
                                    @{ban.user.username}
                                  </div>
                                  <div className='text-xs text-muted-foreground truncate max-w-32'>
                                    {ban.user.email}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{getBanTypeBadge(ban.type)}</TableCell>
                            <TableCell className='hidden md:table-cell'>
                              <div className='text-xs md:text-sm'>
                                {getDate(ban.startAt, 'YYYY/MM/DD')}
                              </div>
                            </TableCell>
                            <TableCell className='hidden lg:table-cell'>
                              <div className='text-xs md:text-sm'>
                                {ban.endAt
                                  ? getDate(ban.endAt, 'YYYY/MM/DD')
                                  : '-'}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className='flex items-center gap-2'>
                                <Avatar className='h-6 w-6'>
                                  <AvatarImage src={ban.actor.avatar?.url} />
                                  <AvatarFallback className='text-xs'>
                                    {ban.actor.username[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <span className='text-xs md:text-sm truncate max-w-20'>
                                  {ban.actor.username}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                size='sm'
                                variant='outline'
                                className='text-blue-600 hover:text-blue-700 p-1 md:p-2'
                                onClick={() => {
                                  setSelectedBan(ban);
                                  setShowBanDetails(true);
                                }}
                              >
                                <Info className='h-3 w-3 md:h-4 md:w-4' />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  <div className='p-4 border-t'>
                    <PaginationControls pagination={bans.data.pagination} />
                  </div>
                </>
              )}
            </LoadingWrapper>
          </CardContent>
        </Card>
      </div>

      {/* Ban Details Dialog */}
      <BanDetailsDialog
        open={showBanDetails}
        onOpenChange={setShowBanDetails}
        ban={selectedBan}
      />
    </div>
  );
}
