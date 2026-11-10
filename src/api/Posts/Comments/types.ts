import type { Meta, TopComment } from "../../../types.ts";

// A full comment is the same shape as a top comment
export type Comment = TopComment;

export interface CreateCommentReq {
  content: string;
  image?: File | null;
  parentComment?: string;
}

export interface AllCommentsResponse {
  success: boolean;
  message: string;
  data: { comments: Comment[] };
  meta: Meta;
}
