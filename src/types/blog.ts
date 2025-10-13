import { FileProps } from '@/types/api';

export interface PostProps {
  title: string;
  slug: string;
  content: string;
  abstract: string;
  id: string;
  coverImage: FileProps | null;
  createdAt: string;
  updatedAt: string;
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
  excerpt: string;
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
  bio: string;
  name: string;
  email: string;
  avatar: FileProps;
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
  createdAt?: string;
  updatedAt?: string;
}

export interface CommentProps {
  id: string;
  content: string;
  username: string;
  createdAt: string;
  avatar: FileProps;
  replies: CommentProps[];
}
