import type { ApiResponse } from "../../../types.ts";
import type { AllCommentsResponse, Comment, CreateCommentReq } from "./types.ts";
import { api } from "../../client.ts";
// ================= Comments =================
// GET /posts/:postId/comments — all comments on a post
export async function getComments(postId: string): Promise<AllCommentsResponse> {
  const { data } = await api.get<AllCommentsResponse>(`/posts/${postId}/comments`);
  return data;
}
// POST /posts/:postId/comments — create a comment (replies use the same call)
export async function createComment(postId: string, body: CreateCommentReq): Promise<ApiResponse<Comment>> {
  const formData = new FormData();
  formData.append("content", body.content);
  if (body.image) formData.append("image", body.image);
  if (body.parentComment) formData.append("parentComment", body.parentComment);

  const { data } = await api.post<ApiResponse<Comment>>(`/posts/${postId}/comments`, formData);
  return data;
}
// PUT /comments/:commentId — edit a comment
export async function updateComment(postId: string, commentId: string, body: CreateCommentReq): Promise<ApiResponse<Comment>> {
  const formData = new FormData();
  formData.append("content", body.content);
  if (body.image) formData.append("image", body.image);

  const { data } = await api.put<ApiResponse<Comment>>(`/posts/${postId}/comments/${commentId}`, formData);
  return data;
}
// DELETE /comments/:commentId — delete a comment
export async function deleteComment(postId: string, commentId: string): Promise<ApiResponse<Comment>> {
  const { data } = await api.delete<ApiResponse<Comment>>(`/posts/${postId}/comments/${commentId}`);
  return data;
}
// PUT /comments/:commentId/like — like a comment
export async function likeComment(postId: string, commentId: string): Promise<ApiResponse<Comment>> {
  const { data } = await api.put<ApiResponse<Comment>>(`/posts/${postId}/comments/${commentId}/like`);
  return data;
}
