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

export interface UserProps {
  id: string;
  name: string;
  email: string;
  avatar: FileProps;
  bio: string;
  role: 'superAdmin' | 'admin' | 'author' | 'user';
  status?: 'active' | 'blocked';
  createDate?: string;
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
  coverImage: FileProps;
  description: string;
  releaseDate: string;
}

type CommentStatusType = 'approved' | 'rejected' | 'pending';

export interface CommentProps {
  id: string;
  username: string;
  content: string;
  avatar: FileProps;
  createDate: string;
  status: CommentStatusType;
}
