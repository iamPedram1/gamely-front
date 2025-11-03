import type { UserProps } from '@/types/management/blog';

export type UserStatus = 'active' | 'blocked';
export type BanType = 'permanent' | 'temporary';
export type UserRole = 'user' | 'author' | 'admin' | 'superAdmin';

export interface BanRecordProps {
  id: string;
  reason?: string;
  user: UserProps;
  actor: UserProps;
  type: BanType;
  startAt: string;
  endAt: string | null;
}
