import type { FileProps } from '@/types/api';

export interface PostProps {
  title: string;
  slug: string;
  content: string;
  abstract: string;
  id: string;
  coverImage: FileProps | null;
  createDate: string;
  updateDate: string;
  readingTime: number;
  author: UserProps;
  tags?: TagProps[];
  category: CategoryProps;
  game?: GameProps;
  comments: CommentProps[];
}

export interface PostSummaryProps {
  id: string;
  title: string;
  slug: string;
  abstract: string;
  content: string;
  coverImage: FileProps;
  author: UserProps;
  publishedAt: string;
  tags: TagProps[];
  category: CategoryProps;
  game: GameProps;
  comments: CommentProps[];
}

export type UserRole = 'superAdmin' | 'admin' | 'author' | 'user';
export type UserStatus = 'active' | 'blocked';

export interface UserProps {
  id: string;
  username: string;
  email: string;
  postsCount: number;
  blocksCount: number;
  followersCount: number;
  followingsCount: number;
  isFollowing: boolean;
  lastSeen: string;
  avatar: FileProps;
  bio: string;
  role: UserRole;
  status?: UserStatus;
  createDate?: string;
}

export interface NotificationProps {
  id: string;
  seen: boolean;
  message: string;
  post: SummaryProps;
  createDate: string;
}

export interface TagProps {
  id: string;
  postsCount: number;
  title: string;
  slug: string;
}

export interface CategoryProps {
  id: string;
  title: string;
  slug: string;
  parentId: string;
}

export interface SummaryProps {
  id: string;
  title: string;
  slug?: string;
}

export interface GameProps {
  id: string;
  title: string;
  slug: string;
  isFavorite?: boolean;
  coverImage: FileProps;
  description: string;
  releaseDate: string;
}

type CommentStatusType = 'approved' | 'rejected' | 'pending';

export interface CommentProps {
  id: string;
  username: string;
  message: string;
  avatar: FileProps;
  createDate: string;
  status: CommentStatusType;
  replies?: CommentProps[];
}

export interface FollowerProps {
  id: string;
  username: string;
  userId: string;
  avatar?: FileProps;
  since: string;
  role: UserRole;
  isFollowing?: boolean;
  isBlocked?: boolean;
}

export interface BlockedProps {
  id: string;
  username: string;
  userId: string;
  avatar?: FileProps;
  blockedAt: string;
  role: UserRole;
}
