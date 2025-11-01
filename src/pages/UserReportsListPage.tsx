import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Flag,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  FileText,
  User,
  AlertTriangle,
} from 'lucide-react';

// Components
import { Badge } from '@/components/ui/badge';
import LoadingWrapper from '@/components/ui/loading-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Hooks
import useAuth from '@/hooks/useAuth';
import { useUserReportsQuery } from '@/utilities/api/report';

// Utilities
import { getDate } from '@/utilities';

// Types
import type { ReportStatusType } from '@/types/management/report';

export default function UserReportsListPage() {
  // States
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Hooks
  const { t } = useTranslation();
  const { profile } = useAuth();
  const reportsQuery = useUserReportsQuery({ enabled: !!profile?.id });

  const getStatusBadge = (status: ReportStatusType) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant='destructive' className='flex items-center gap-1'>
            <Clock className='h-3 w-3' />
            {t('reports.pending')}
          </Badge>
        );
      case 'reviewed':
        return (
          <Badge variant='secondary' className='flex items-center gap-1'>
            <Eye className='h-3 w-3' />
            {t('reports.reviewed')}
          </Badge>
        );
      case 'resolved':
        return (
          <Badge className='bg-green-500 hover:bg-green-600 flex items-center gap-1'>
            <CheckCircle className='h-3 w-3' />
            {t('reports.resolved')}
          </Badge>
        );
      case 'dismissed':
        return (
          <Badge variant='outline' className='flex items-center gap-1'>
            <XCircle className='h-3 w-3' />
            {t('reports.dismissed')}
          </Badge>
        );
      default:
        return <Badge variant='outline'>{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <MessageSquare className='h-4 w-4 text-blue-500' />;
      case 'post':
        return <FileText className='h-4 w-4 text-green-500' />;
      case 'user':
        return <User className='h-4 w-4 text-purple-500' />;
      default:
        return <AlertTriangle className='h-4 w-4 text-orange-500' />;
    }
  };

  const filteredReports =
    reportsQuery.data?.docs?.filter(
      (report) => statusFilter === 'all' || report.status === statusFilter
    ) || [];

  const statusCounts = {
    pending:
      reportsQuery.data?.docs?.filter((r) => r.status === 'pending').length ||
      0,
    reviewed:
      reportsQuery.data?.docs?.filter((r) => r.status === 'reviewed').length ||
      0,
    resolved:
      reportsQuery.data?.docs?.filter((r) => r.status === 'resolved').length ||
      0,
    dismissed:
      reportsQuery.data?.docs?.filter((r) => r.status === 'dismissed').length ||
      0,
  };

  return (
    <div className='min-h-screen bg-background'>
      <div className='max-w-7xl mx-auto p-6 space-y-8'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold gradient-gaming-text'>
              {t('reports.myReports')}
            </h1>
            <p className='text-muted-foreground mt-2'>
              {t('reports.myReportsDescription')}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <Card className='bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800'>
            <CardContent className='p-4'>
              <div className='flex items-center gap-3'>
                <div className='p-2 rounded-lg bg-red-100 dark:bg-red-900'>
                  <Clock className='h-5 w-5 text-red-600' />
                </div>
                <div>
                  <div className='text-2xl font-bold text-red-600'>
                    {statusCounts.pending}
                  </div>
                  <div className='text-sm text-red-600/80'>
                    {t('reports.pending')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800'>
            <CardContent className='p-4'>
              <div className='flex items-center gap-3'>
                <div className='p-2 rounded-lg bg-blue-100 dark:bg-blue-900'>
                  <Eye className='h-5 w-5 text-blue-600' />
                </div>
                <div>
                  <div className='text-2xl font-bold text-blue-600'>
                    {statusCounts.reviewed}
                  </div>
                  <div className='text-sm text-blue-600/80'>
                    {t('reports.reviewed')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800'>
            <CardContent className='p-4'>
              <div className='flex items-center gap-3'>
                <div className='p-2 rounded-lg bg-green-100 dark:bg-green-900'>
                  <CheckCircle className='h-5 w-5 text-green-600' />
                </div>
                <div>
                  <div className='text-2xl font-bold text-green-600'>
                    {statusCounts.resolved}
                  </div>
                  <div className='text-sm text-green-600/80'>
                    {t('reports.resolved')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 border-gray-200 dark:border-gray-800'>
            <CardContent className='p-4'>
              <div className='flex items-center gap-3'>
                <div className='p-2 rounded-lg bg-gray-100 dark:bg-gray-900'>
                  <XCircle className='h-5 w-5 text-gray-600' />
                </div>
                <div>
                  <div className='text-2xl font-bold text-gray-600'>
                    {statusCounts.dismissed}
                  </div>
                  <div className='text-sm text-gray-600/80'>
                    {t('reports.dismissed')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className='flex flex-col sm:flex-row gap-4'>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className='w-full sm:w-48'>
              <SelectValue placeholder={t('reports.filterByStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>{t('common.all')}</SelectItem>
              <SelectItem value='pending'>{t('reports.pending')}</SelectItem>
              <SelectItem value='reviewed'>{t('reports.reviewed')}</SelectItem>
              <SelectItem value='resolved'>{t('reports.resolved')}</SelectItem>
              <SelectItem value='dismissed'>
                {t('reports.dismissed')}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reports Table */}
        <Card className='bg-background/95 backdrop-blur-xl border-primary/20'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Flag className='h-5 w-5' />
              {t('reports.yourReports')} ({filteredReports.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LoadingWrapper isLoading={reportsQuery.isFetching}>
              {filteredReports.length === 0 ? (
                <div className='text-center py-12'>
                  <Flag className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
                  <h3 className='text-lg font-semibold mb-2'>
                    {statusFilter === 'all'
                      ? t('reports.noReports')
                      : t('reports.noReportsWithStatus', {
                          status: t(`reports.${statusFilter}`),
                        })}
                  </h3>
                  <p className='text-muted-foreground'>
                    {t('reports.noReportsDescription')}
                  </p>
                </div>
              ) : (
                <div className='overflow-x-auto'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('reports.type')}</TableHead>
                        <TableHead>{t('reports.reason')}</TableHead>
                        <TableHead>{t('reports.description')}</TableHead>
                        <TableHead>{t('reports.status')}</TableHead>
                        <TableHead>{t('reports.submittedOn')}</TableHead>
                        <TableHead>{t('reports.lastUpdate')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell>
                            <div className='flex items-center gap-2'>
                              {getTypeIcon(report.type)}
                              <span className='capitalize font-medium'>
                                {t(`reports.${report.type}`)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant='secondary' className='capitalize'>
                              {t(`report.reasons.${report.reason}`, {
                                status: report.reason,
                              })}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className='max-w-xs'>
                              <p className='text-sm text-muted-foreground truncate'>
                                {report.description}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(report.status)}</TableCell>
                          <TableCell>
                            <div className='text-sm'>
                              {getDate(report.createDate, 'YYYY/MM/DD HH:mm')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className='text-sm'>
                              {report.updateDate
                                ? getDate(report.updateDate, 'YYYY/MM/DD HH:mm')
                                : '-'}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </LoadingWrapper>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
