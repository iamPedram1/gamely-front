import { FileProps } from '@/types/api';

export interface PostProps {
  title: string;
  slug: string;
  content: string;
  abstract: string;
  id: string;
  coverImage: { url: string } | null;
  createdAt: string;
  updatedAt: string;
  creator?: AuthorProps;
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
  author: AuthorProps;
  publishedAt: string;
  tags: TagProps[];
  category: CategoryProps;
  game: GameProps;
  comments: CommentProps[];
}

export interface AuthorProps {
  id: string;
  name: string;
}

export interface TagProps {
  id: string;
  postsCount: number;
  title: string;
  slug: string;
}

export interface TagSummaryProps {
  id: string;
  postsCount: number;
  title: string;
  slug: string;
}

export interface CategoryProps {
  id: string;
  title: string;
  slug: string;
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
  author: string;
  avatar: FileProps;
  content: string;
  createdAt: string;
}
