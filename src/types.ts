// ================= GLOBAL TYPES =================
// Rule (from the senior's structure): only types used by TWO OR MORE
// features live here. A type used by one feature only lives in that
// feature's own types.ts (e.g. src/api/Auth/types.ts).
// Shared domain models (User, Post, ...) stay here because several
// features use them — moving them would create circular imports.

// ---------- Generic API wrappers ----------
export interface APIResponse {
  success: boolean;
  message: string;
  meta: Meta;
}

// Generic wrapper, handy for any endpoint: ApiResponse<Post[]>, etc.
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: Meta;
}

export interface Meta {
  pagination: Pagination;
}

export interface Pagination {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage: number;
  total: number;
}

// ---------- Shared models ----------
export interface User {
  _id: string;
  name: string;
  username: string;
  email?: string;
  photo: string;
  cover?: string;
}

export interface Post {
  _id: string;
  body?: string;
  image?: string;
  privacy: string;
  user: User;
  sharedPost?: SharedPost;
  likes: string[];
  createdAt: string;
  commentsCount: number;
  topComment?: TopComment;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  id: string;
  bookmarked: boolean;
}

export interface SharedPost {
  _id: string;
  body?: string;
  privacy: string;
  user: User;
  sharedPost?: SharedPost | null;
  likes: string[];
  createdAt: string;
  commentsCount: number;
  topComment: TopComment;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  id: string;
  image?: string;
}

export interface TopComment {
  _id: string;
  content: string;
  commentCreator: CommentCreator;
  post: string;
  parentComment?: TopComment | string | null;
  likes: string[];
  createdAt: string;
  image?: string;
}

export interface CommentCreator {
  _id: string;
  name: string;
  username: string;
  photo: string;
}

// ---------- Shared responses ----------
// AllPostsResponse is used by Posts AND Users (bookmarks, user posts).
export interface AllPostsResponse {
  success: boolean;
  message: string;
  data: DataAllPosts;
  meta: Meta;
}

export interface DataAllPosts {
  posts: Post[];
}

// ProfileResponse is used by Profile AND Users (other-user profile).
export interface ProfileResponse {
  success: boolean;
  message: string;
  data: User;
}

// ---------- Notifications (no feature folder yet) ----------
// These stay global until a Notifications feature exists —
// then they move to src/api/Notifications/types.ts.
export interface Notification {
  _id: string;
  content?: string;
  sender?: User;
  post?: string;
  createdAt: string;
  isRead: boolean;
}

export interface NotificationsResponse {
  success: boolean;
  message: string;
  data: { notifications: Notification[] };
  meta?: Meta;
}
