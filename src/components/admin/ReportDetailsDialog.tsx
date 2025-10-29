import { useTranslation } from 'react-i18next';
import {
  Flag,
  User,
  Calendar,
  MessageSquare,
  AlertTriangle,
  Eye,
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { getDate } from '@/utilities';

interface Report {
  id: string;
  type: 'comment' | 'post' | 'user';
  reason: string;
  description: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  reportedBy: {
    id: string;
    username: string;
    avatar?: { url: string };
  };
  reportedContent: {
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

interface ReportDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: Report | null;
}

export default function ReportDetailsDialog({
  open,
  onOpenChange,
  report,
}: ReportDetailsDialogProps) {
  const { t, i18n } = useTranslation();

  if (!report) return null;

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
        return <MessageSquare className='h-5 w-5' />;
      case 'post':
        return <Flag className='h-5 w-5' />;
      case 'user':
        return <User className='h-5 w-5' />;
      default:
        return <AlertTriangle className='h-5 w-5' />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[700px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='p-2 rounded-lg bg-red-100 dark:bg-red-900'>
                {getTypeIcon(report.type)}
              </div>
              <div>
                <DialogTitle className='text-xl'>
                  {t('reports.reportDetails')}
                </DialogTitle>
                <DialogDescription>
                  {t('reports.reportId')}: {report.id}
                </DialogDescription>
              </div>
            </div>
            {getStatusBadge(report.status)}
          </div>
        </DialogHeader>

        <div className='space-y-6 py-4'>
          {/* Report Information */}
          <div className='space-y-4'>
            <h3 className='font-semibold text-lg flex items-center gap-2'>
              <AlertTriangle className='h-5 w-5 text-red-600' />
              {t('reports.reportInformation')}
            </h3>
            <Card>
              <CardContent className='pt-6 space-y-3'>
                <div className='flex items-start gap-3'>
                  <span className='font-medium min-w-24'>
                    {t('reports.type')}:
                  </span>
                  <div className='flex items-center gap-2'>
                    {getTypeIcon(report.type)}
                    <span className='capitalize'>
                      {t(`reports.${report.type}`)}
                    </span>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <span className='font-medium min-w-24'>
                    {t('reports.reason')}:
                  </span>
                  <span className='font-semibold text-red-600'>
                    {report.reason}
                  </span>
                </div>
                <div className='flex items-start gap-3'>
                  <span className='font-medium min-w-24'>
                    {t('reports.description')}:
                  </span>
                  <p className='flex-1 text-muted-foreground'>
                    {report.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Reporter Information */}
          <div className='space-y-4'>
            <h3 className='font-semibold text-lg flex items-center gap-2'>
              <User className='h-5 w-5' />
              {t('reports.reportedBy')}
            </h3>
            <Card>
              <CardContent className='pt-6'>
                <div className='flex items-center gap-3'>
                  <Avatar className='h-12 w-12'>
                    <AvatarImage src={report.reportedBy.avatar?.url} />
                    <AvatarFallback>
                      {report.reportedBy.username[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='font-semibold'>
                      {report.reportedBy.username}
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      ID: {report.reportedBy.id}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Reported Content */}
          <div className='space-y-4'>
            <h3 className='font-semibold text-lg flex items-center gap-2'>
              <MessageSquare className='h-5 w-5' />
              {t('reports.reportedContent')}
            </h3>
            <Card>
              <CardContent className='pt-6 space-y-4'>
                <div className='flex items-center gap-3'>
                  <Avatar className='h-12 w-12'>
                    <AvatarImage
                      src={report.reportedContent.author.avatar?.url}
                    />
                    <AvatarFallback>
                      {report.reportedContent.author.username[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='font-semibold'>
                      {report.reportedContent.author.username}
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      ID: {report.reportedContent.author.id}
                    </p>
                  </div>
                </div>
                <div className='bg-muted p-4 rounded-lg'>
                  <p className='text-sm'>{report.reportedContent.content}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Timeline */}
          <div className='space-y-4'>
            <h3 className='font-semibold text-lg flex items-center gap-2'>
              <Calendar className='h-5 w-5' />
              {t('reports.timeline')}
            </h3>
            <Card>
              <CardContent className='pt-6 space-y-3'>
                <div className='flex items-start gap-3'>
                  <span className='font-medium min-w-32'>
                    {t('reports.reportedOn')}:
                  </span>
                  <span className='text-muted-foreground'>
                    {getDate(report.createdAt, 'YYYY/MM/DD - HH:mm:ss')}
                  </span>
                </div>
                {report.reviewedAt && (
                  <>
                    <div className='flex items-start gap-3'>
                      <span className='font-medium min-w-32'>
                        {t('reports.reviewedOn')}:
                      </span>
                      <span className='text-muted-foreground'>
                        {getDate(report.reviewedAt, 'YYYY/MM/DD - HH:mm:ss')}
                      </span>
                    </div>
                    {report.reviewedBy && (
                      <div className='flex items-start gap-3'>
                        <span className='font-medium min-w-32'>
                          {t('reports.reviewedBy')}:
                        </span>
                        <span className='text-muted-foreground'>
                          {report.reviewedBy.username}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
