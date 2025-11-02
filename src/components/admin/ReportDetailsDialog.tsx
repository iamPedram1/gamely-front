import { useTranslation } from 'react-i18next';
import {
  Flag,
  User,
  MessageSquare,
  FileText,
  Calendar,
  Clock,
  AlertTriangle,
} from 'lucide-react';

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
import type { ReportProps } from '@/types/management/report';
import type {
  CommentProps,
  PostProps,
  UserProps,
} from '@/types/management/blog';
import i18n from '@/utilities/i18n';
import { Link } from 'react-router-dom';
import routes from '@/utilities/routes';

interface ReportDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: ReportProps | null;
}

export default function ReportDetailsDialog({
  open,
  onOpenChange,
  report,
}: ReportDetailsDialogProps) {
  const { t } = useTranslation();

  if (!report) return null;

  const getStatusBadge = (status: string) => {
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <MessageSquare className='h-5 w-5 text-blue-500' />;
      case 'post':
        return <FileText className='h-5 w-5 text-green-500' />;
      case 'user':
        return <User className='h-5 w-5 text-purple-500' />;
      default:
        return <AlertTriangle className='h-5 w-5 text-orange-500' />;
    }
  };

  const getTargetUser = () => {
    switch (report.type) {
      case 'comment':
        return (report.target as CommentProps).creator;
      case 'user':
        return report.target as UserProps;
      case 'post':
        return (report.target as PostProps).author;
      default:
        return null;
    }
  };

  const getTargetContent = () => {
    switch (report.type) {
      case 'comment':
        return (report.target as CommentProps).message;
      case 'post':
        return {
          title: (report.target as PostProps).translations[i18n.language].title,
          content: (report.target as PostProps).translations[i18n.language]
            .content,
        };
      case 'user':
        return {
          bio: (report.target as UserProps).bio,
          username: (report.target as UserProps).username,
          id: (report.target as UserProps).id,
        };
      default:
        return null;
    }
  };

  const targetUser = getTargetUser();
  const targetContent = getTargetContent();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Flag className='h-5 w-5 text-red-500' />
            {t('reports.reportDetails')}
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Report Info */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  {getTypeIcon(report.type)}
                  <span className='capitalize'>
                    {t(`reports.${report.type}`)} {t('reports.report')}
                  </span>
                </div>
                {getStatusBadge(report.status)}
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <h4 className='font-semibold text-sm text-muted-foreground mb-1'>
                    {t('reports.reason')}
                  </h4>
                  <Badge variant='secondary' className='capitalize'>
                    {t(`report.reasons.${report.reason}`, report.reason)}
                  </Badge>
                </div>
                <div>
                  <h4 className='font-semibold text-sm text-muted-foreground mb-1'>
                    {t('reports.submittedOn')}
                  </h4>
                  <div className='flex items-center gap-1 text-sm'>
                    <Calendar className='h-4 w-4' />
                    {getDate(report.createDate, 'YYYY/MM/DD-HH:mm')}
                  </div>
                </div>
              </div>

              {report.updateDate && (
                <div>
                  <h4 className='font-semibold text-sm text-muted-foreground mb-1'>
                    {t('reports.lastUpdate')}
                  </h4>
                  <div className='flex items-center gap-1 text-sm'>
                    <Clock className='h-4 w-4' />
                    {getDate(report.updateDate, 'YYYY/MM/DD HH:mm')}
                  </div>
                </div>
              )}

              <div>
                <h4 className='font-semibold text-sm text-muted-foreground mb-2'>
                  {t('reports.description')}
                </h4>
                <p className='text-sm bg-muted/50 p-3 rounded-lg'>
                  {report.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Reporter Info */}
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>
                {t('reports.reportedBy')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                to={routes.dashboard.users.edit(report.user.id)}
                className='flex items-center gap-3 w-fit'
              >
                <Avatar className='h-10 w-10'>
                  <AvatarImage src={report.user.avatar?.url} />
                  <AvatarFallback>
                    {report.user.username[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className='font-medium'>@{report.user.username}</div>
                  <div className='text-sm text-muted-foreground'>
                    {report.user.email}
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>

          {/* Target Info */}
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>
                {t('reports.reportedContent')}
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {/* Target User */}
              {targetUser && (
                <div>
                  <h4 className='font-semibold text-sm text-muted-foreground mb-2'>
                    {report.type === 'user'
                      ? t('reports.reportedUser')
                      : t('reports.contentAuthor')}
                  </h4>
                  <Link to={routes.dashboard.users.edit(targetUser.id)}>
                    <div className='flex items-center gap-3 p-3 bg-muted/50 rounded-lg'>
                      <Avatar className='h-8 w-8'>
                        <AvatarImage src={targetUser.avatar?.url} />
                        <AvatarFallback>
                          {targetUser.username[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className='font-medium'>
                          @{targetUser.username}
                        </div>
                        {targetUser.email && (
                          <div className='text-sm text-muted-foreground'>
                            {targetUser.email}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* Target Content */}
              {targetContent && (
                <div>
                  <h4 className='font-semibold text-sm text-muted-foreground mb-2'>
                    {t('reports.content')}
                  </h4>
                  <div className='p-3 bg-muted/50 rounded-lg'>
                    {report.type === 'post' &&
                      typeof targetContent === 'object' &&
                      'title' in targetContent && (
                        <>
                          <h5 className='font-semibold mb-2'>
                            {targetContent.title}
                          </h5>
                          <p className='text-sm text-muted-foreground'>
                            {targetContent.content}
                          </p>
                        </>
                      )}

                    {report.type === 'comment' &&
                      typeof targetContent === 'string' && (
                        <p className='text-sm'>{targetContent}</p>
                      )}

                    {report.type === 'user' &&
                      typeof targetContent === 'object' &&
                      'username' in targetContent && (
                        <>
                          <Link
                            to={routes.dashboard.users.edit(targetContent.id)}
                          >
                            <div className='font-semibold mb-1'>
                              @{targetContent.username}
                            </div>
                          </Link>
                          {targetContent.bio && (
                            <p className='text-sm text-muted-foreground'>
                              {targetContent.bio}
                            </p>
                          )}
                        </>
                      )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
