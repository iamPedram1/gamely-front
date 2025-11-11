import type { UserProps } from '@/types/management/blog';

export type BanType = 'permanent' | 'temporary';
export type BanStatusType = 'active' | 'expired';

export interface BanRecordProps {
  id: string;
  reason?: string;
  user: UserProps;
  actor: UserProps;
  type: BanType;
  status: BanStatusType;
  startAt: string;
  endAt: string | null;
}
