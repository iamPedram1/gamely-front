import { CommentProps, PostProps, UserProps } from '@/types/management/blog';

export type ReportType = 'comment' | 'post' | 'user';
export type ReportReasonType =
  | 'spam'
  | 'harassment'
  | 'inappropriate'
  | 'misinformation'
  | 'violence'
  | 'other';

export type ReportStatusType =
  | 'pending'
  | 'reviewed'
  | 'resolved'
  | 'dismissed';

export interface ReportProps {
  id: string;
  type: ReportType;
  status: ReportStatusType;
  reason: ReportReasonType;
  description: string;
  updateDate: string;
  createDate: string;
  user: UserProps;
  target: UserProps | CommentProps | PostProps;
}
