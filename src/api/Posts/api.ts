import type { AllPostsResponse, ApiResponse, Post, User } from "../../types.ts";
import type { CreatePostReq, FeedFilter, UpdatePostReq } from "./types.ts";
import { api } from "../client.ts";
// ================= Posts =================
// GET /posts — all posts
export async function getAllPosts(page = 1, limit = 10): Promise<AllPostsResponse> {
  const { data } = await api.get<AllPostsResponse>("/posts", {
    params: { page, limit, sort: "-createdAt" },
  });
  return data;
}
// GET /posts/:postId — one post's details
export async function getPost(postId: string): Promise<ApiResponse<Post>> {
  const { data } = await api.get<ApiResponse<Post>>(`/posts/${postId}`);
  return data;
}
// POST /posts — create a post (text + optional image)
export async function createPost(post: CreatePostReq): Promise<ApiResponse<Post>> {
  const formData = new FormData();
  formData.append("body", post.body);
  if (post.image) formData.append("image", post.image);
  if (post.privacy) formData.append("privacy", post.privacy);

  const { data } = await api.post<ApiResponse<Post>>("/posts", formData);
  return data;
}
// PUT /posts/:postId — edit a post
export async function updatePost(postId: string, post: UpdatePostReq): Promise<ApiResponse<Post>> {
  const formData = new FormData();
  if (post.body) formData.append("body", post.body);
  if (post.image) formData.append("image", post.image);
  if (post.privacy) formData.append("privacy", post.privacy);

  const { data } = await api.put<ApiResponse<Post>>(`/posts/${postId}`, formData);
  return data;
}
// DELETE /posts/:postId — delete a post
export async function deletePost(postId: string): Promise<ApiResponse<Post>> {
  const { data } = await api.delete<ApiResponse<Post>>(`/posts/${postId}`);
  return data;
}
// ================= Extras =================
// GET /posts/feed?only=following|me|all — filtered feeds
export async function getFeed(filter: FeedFilter, page = 1, limit = 10): Promise<AllPostsResponse> {
  const { data } = await api.get<AllPostsResponse>("/posts/feed", {
    params: { only: filter, page, limit, sort: "-createdAt" },
  });
  return data;
}
// PUT /posts/:postId/like — like toggle
export async function likePost(postId: string): Promise<ApiResponse<Post>> {
  const { data } = await api.put<ApiResponse<Post>>(`/posts/${postId}/like`);
  return data;
}
// GET /posts/:postId/likers — who liked it
export async function getPostLikers(postId: string): Promise<ApiResponse<User[]>> {
  const { data } = await api.get<ApiResponse<User[]>>(`/posts/${postId}/likers`);
  return data;
}
// PUT /posts/:postId/bookmark — bookmark toggle
export async function bookmarkPost(postId: string): Promise<ApiResponse<Post>> {
  const { data } = await api.put<ApiResponse<Post>>(`/posts/${postId}/bookmark`);
  return data;
}
// POST /posts/:postId/share — share a post
export async function sharePost(postId: string): Promise<ApiResponse<Post>> {
  const { data } = await api.post<ApiResponse<Post>>(`/posts/${postId}/share`);
  return data;
}
