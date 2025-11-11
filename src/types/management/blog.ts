import type { FileProps } from '@/types/api';
import type { WithDictionary } from '@/types/translation';

// <----------------   POST   ---------------->
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
  createDate: string;
  updateDate: string;
  readingTime: number;
  author: UserProps;
  tags?: TagProps[];
  category: CategoryProps;
  game?: GameProps;
  comments: CommentProps[];
}

export interface PostSummaryProps extends PostBaseProps {}

// <----------------   USER   ---------------->
export interface UserProps {
  id: string;
  username: string;
  email: string;
  avatar: FileProps;
  bio: string;
  role: 'admin' | 'author' | 'user';
  status?: 'active' | 'blocked';
  createDate?: string;
}

// <----------------   TAG   ---------------->
export interface TagTranslationProps {
  title: string;
}

export interface TagProps {
  id: string;
  slug: string;
  postsCount: number;
  translations: WithDictionary<TagTranslationProps>;
}

// <----------------   CATEGORY   ---------------->
export interface CategoryTranslation {
  title: string;
}

export interface CategoryProps {
  id: string;
  slug: string;
  parentId: string;
  translations: WithDictionary<CategoryTranslation>;
}

export interface SummaryProps {
  id: string;
  title?: string;
  translations: WithDictionary<{ title: string }>;
  slug?: string;
}

// <----------------   GAME   ---------------->
export interface GameTranslation {
  description: string;
}

export interface GameProps {
  id: string;
  slug: string;
  title: string;
  coverImage: FileProps;
  translations: WithDictionary<GameTranslation>;
  releaseDate: string;
}

// <----------------   COMMENT   ---------------->
export type CommentStatusType = 'approved' | 'rejected' | 'pending';

export interface CommentProps {
  id: string;
  creator: UserProps;
  message: string;
  createDate: string;
  status: CommentStatusType;
  post: SummaryProps;
}
