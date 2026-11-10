export interface CreatePostReq {
  body: string;
  image?: File | null;
  privacy?: string;
}

export interface UpdatePostReq {
  body?: string;
  image?: File | null;
  privacy?: string;
}

export type FeedFilter = "following" | "me" | "all";
