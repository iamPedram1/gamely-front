import type { FileProps } from '@/types/api';
import type { WithDictionary } from '@/types/translation';

interface PostTranslation {
  title: string;
  abstract: string;
  content: string;
}

interface PostBaseProps {
  id: string;
  slug: string;
  translations: WithDictionary<PostTranslation>;
}

export interface PostProps extends PostBaseProps {
  coverImage: FileProps | null;
  createdDate: string;
  updateDate: string;
  readingTime: number;
  author: UserProps;
  tags?: TagProps[];
  category: CategoryProps;
  game?: GameProps;
  comments: CommentProps[];
}

export interface PostSummaryProps extends PostBaseProps {}

export interface UserProps {
  id: string;
  name: string;
  email: string;
  avatar: FileProps;
  bio: string;
  role: 'admin' | 'author' | 'user';
  status?: 'active' | 'blocked';
  createdDate?: string;
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
  translations: WithDictionary<{ title: string }>;
  slug?: string;
}

export interface GameProps {
  id: string;
  slug: string;
  coverImage: FileProps;
  translations: WithDictionary<{ title: string; description: string }>;
  releaseDate: string;
}

type CommentStatusType = 'approved' | 'reject' | 'pending';

export interface CommentProps {
  id: string;
  username: string;
  content: string;
  avatar: FileProps;
  createdDate: string;
  status: CommentStatusType;
}
