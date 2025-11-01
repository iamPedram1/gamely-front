import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Flag,
  Eye,
  Check,
  X,
  AlertTriangle,
  MessageSquare,
  User,
} from 'lucide-react';

// Components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Searchbar from '@/components/ui/searchbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// Utilities
import { getDate } from '@/utilities';
import routes from '@/utilities/routes';
import {
  useReportsQuery,
  useUpdateReportStatusMutate,
} from '@/utilities/api/management/report';
import type { ReportProps, ReportStatusType } from '@/types/management/report';
import type {
  CommentProps,
  PostProps,
  UserProps,
} from '@/types/management/blog';

interface Report {
  id: string;
  type: 'comment' | 'post' | 'user';
  reason: string;
  description: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  user: {
    id: string;
    username: string;
    avatar?: { url: string };
  };
  target: {
    id: string;
    title?: string;
    content: string;
    author: {
      id: string;
      username: string;
      avatar?: { url: string };
    };
  };
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: {
    id: string;
    username: string;
  };
}

export default function ReportsListPage() {
  const { t, i18n } = useTranslation();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const reports = useReportsQuery();
  const updateStatus = useUpdateReportStatusMutate();
  console.log({ ...reports });

  const getStatusBadge = (status: Report['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant='destructive'>{t('reports.pending')}</Badge>;
      case 'reviewed':
        return <Badge variant='secondary'>{t('reports.reviewed')}</Badge>;
      case 'resolved':
        return (
          <Badge className='bg-green-500 hover:bg-green-600'>
            {t('reports.resolved')}
          </Badge>
        );
      case 'dismissed':
        return <Badge variant='outline'>{t('reports.dismissed')}</Badge>;
      default:
        return <Badge variant='outline'>{status}</Badge>;
    }
  };

  const getTypeIcon = (type: Report['type']) => {
    switch (type) {
      case 'comment':
        return <MessageSquare className='h-4 w-4' />;
      case 'post':
        return <Flag className='h-4 w-4' />;
      case 'user':
        return <User className='h-4 w-4' />;
      default:
        return <AlertTriangle className='h-4 w-4' />;
    }
  };

  const pendingCount = reports.data.docs.filter(
    (r) => r.status === 'pending'
  ).length;
  const reviewedCount = reports.data.docs.filter(
    (r) => r.status === 'reviewed'
  ).length;
  const resolvedCount = reports.data.docs.filter(
    (r) => r.status === 'resolved'
  ).length;

  const handleUpdateReportStatus = (
    reportId: string,
    status: ReportStatusType
  ) => {
    updateStatus.mutate({ id: reportId, status });
  };

  const getTargetUser = (report: ReportProps) => {
    switch (report.type) {
      case 'comment':
        return (report.target as CommentProps).creator;
      case 'user':
        return report.target as UserProps;
      case 'post':
        return (report.target as PostProps).author;
    }
  };

  // Render
  return (
    <div className='min-h-screen bg-background'>
      <div className='container py-8'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='p-2 rounded-lg bg-red-100 dark:bg-red-900'>
              <Flag className='h-6 w-6 text-red-600' />
            </div>
            <div>
              <h1 className='text-3xl font-bold'>{t('reports.title')}</h1>
              <p className='text-muted-foreground'>
                {t('reports.description')}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
            <Card>
              <CardContent className='p-4'>
                <div className='flex items-center gap-2'>
                  <AlertTriangle className='h-5 w-5 text-red-500' />
                  <div>
                    <div className='text-2xl font-bold text-red-500'>
                      {pendingCount}
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      {t('reports.pending')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='p-4'>
                <div className='flex items-center gap-2'>
                  <Eye className='h-5 w-5 text-blue-500' />
                  <div>
                    <div className='text-2xl font-bold text-blue-500'>
                      {reviewedCount}
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      {t('reports.reviewed')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='p-4'>
                <div className='flex items-center gap-2'>
                  <Check className='h-5 w-5 text-green-500' />
                  <div>
                    <div className='text-2xl font-bold text-green-500'>
                      {resolvedCount}
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      {t('reports.resolved')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='p-4'>
                <div className='flex items-center gap-2'>
                  <Flag className='h-5 w-5 text-purple-500' />
                  <div>
                    <div className='text-2xl font-bold text-purple-500'>
                      {reports.data.pagination.totalDocs}
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      {t('reports.total')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className='flex flex-col sm:flex-row gap-4'>
            <Searchbar
              className='w-full'
              placeholder={t('reports.searchPlaceholder')}
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-full sm:w-48'>
                <SelectValue placeholder={t('reports.filterByStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>{t('common.all')}</SelectItem>
                <SelectItem value='pending'>{t('reports.pending')}</SelectItem>
                <SelectItem value='reviewed'>
                  {t('reports.reviewed')}
                </SelectItem>
                <SelectItem value='resolved'>
                  {t('reports.resolved')}
                </SelectItem>
                <SelectItem value='dismissed'>
                  {t('reports.dismissed')}
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className='w-full sm:w-48'>
                <SelectValue placeholder={t('reports.filterByType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>{t('common.all')}</SelectItem>
                <SelectItem value='comment'>{t('reports.comment')}</SelectItem>
                <SelectItem value='post'>{t('reports.post')}</SelectItem>
                <SelectItem value='user'>{t('reports.user')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Reports Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t('reports.allReports')} ({2})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reports.data.docs.length === 0 ? (
              <div className='text-center py-12'>
                <Flag className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
                <h3 className='text-lg font-semibold mb-2'>
                  {t('reports.noReports')}
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
                      <TableHead>{t('reports.user')}</TableHead>
                      <TableHead>{t('reports.reportedUser')}</TableHead>
                      <TableHead>{t('reports.status')}</TableHead>
                      <TableHead>{t('reports.date')}</TableHead>
                      <TableHead>{t('common.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.data.docs.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            {getTypeIcon(report.type)}
                            <span className='capitalize'>
                              {t(`reports.${report.type}`)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className='font-medium'>{report.reason}</div>
                            <div className='text-sm text-muted-foreground truncate max-w-48'>
                              {report.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Link
                            to={routes.dashboard.users.edit(report.user.id)}
                          >
                            <div className='flex items-center gap-2'>
                              <Avatar className='h-8 w-8'>
                                <AvatarImage src={report.user.avatar?.url} />
                                <AvatarFallback>
                                  {report.user.username[0]}
                                </AvatarFallback>
                              </Avatar>
                              <span className='text-sm'>
                                {report.user.username}
                              </span>
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Link
                            to={routes.dashboard.users.edit(report.user.id)}
                          >
                            <div className='flex items-center gap-2'>
                              <Avatar className='h-8 w-8'>
                                <AvatarImage
                                  src={getTargetUser(report)?.avatar?.url}
                                />
                                <AvatarFallback>
                                  {getTargetUser(report).username[0]}
                                </AvatarFallback>
                              </Avatar>
                              <span className='text-sm'>
                                {getTargetUser(report).username}
                              </span>
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell>
                          <div className='text-sm'>
                            <div>
                              {getDate(
                                report.createDate,
                                'YYYY/MM/DD-HH:mm:ss'
                              )}
                            </div>
                            {report.updateDate && (
                              <div className='text-muted-foreground'>
                                {t('reports.reviewedOn')}{' '}
                                {getDate(
                                  report.updateDate,
                                  'YYYY/MM/DD-HH:mm:ss'
                                )}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className='flex gap-2'>
                            {report.status === 'pending' && (
                              <>
                                <Button
                                  size='sm'
                                  variant='outline'
                                  className='text-blue-600 hover:text-blue-700'
                                  onClick={() =>
                                    handleUpdateReportStatus(
                                      report.id,
                                      'reviewed'
                                    )
                                  }
                                >
                                  <Eye className='h-4 w-4' />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      size='sm'
                                      variant='outline'
                                      className='text-green-600 hover:text-green-700'
                                    >
                                      <Check className='h-4 w-4' />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        {t('reports.resolveReport')}
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        {t('reports.resolveReportConfirmation')}
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        {t('common.cancel')}
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        className='bg-green-600 hover:bg-green-700'
                                        onClick={() =>
                                          handleUpdateReportStatus(
                                            report.id,
                                            'resolved'
                                          )
                                        }
                                      >
                                        {t('reports.resolve')}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      size='sm'
                                      variant='outline'
                                      className='text-red-600 hover:text-red-700'
                                    >
                                      <X className='h-4 w-4' />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        {t('reports.dismissReport')}
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        {t('reports.dismissReportConfirmation')}
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        {t('common.cancel')}
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        className='bg-red-600 hover:bg-red-700'
                                        onClick={() =>
                                          handleUpdateReportStatus(
                                            report.id,
                                            'dismissed'
                                          )
                                        }
                                      >
                                        {t('reports.dismiss')}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
