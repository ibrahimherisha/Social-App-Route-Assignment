import type { AllPostsResponse, ApiResponse, Meta, Post, ProfileResponse, User } from "../../types.ts";
import { api } from "../client.ts";
// ================= Extras =================
// GET /users/bookmarks — your saved posts
export async function getBookmarks(): Promise<AllPostsResponse> {
  // The bookmarks endpoint returns { data: { bookmarks: [...] } },
  // not { data: { posts: [...] } } like the feed does — unwrap it here
  // so the page can keep reading data.posts.
  const { data } = await api.get<{ success: boolean; message: string; meta: Meta; data: { bookmarks: Post[] } }>(
    "/users/bookmarks",
  );
  return { success: data.success, message: data.message, meta: data.meta, data: { posts: data.data.bookmarks } };
}
// GET /users/suggestions — people to follow
export async function getSuggestions(): Promise<ApiResponse<User[]>> {
  const { data } = await api.get<ApiResponse<User[]>>("/users/suggestions");
  return data;
}
// PUT /users/:userId/follow — follow toggle
export async function followUser(userId: string): Promise<ApiResponse<User>> {
  const { data } = await api.put<ApiResponse<User>>(`/users/${userId}/follow`);
  return data;
}
// GET /users/:userId/profile — another user's profile
export async function getUserProfile(userId: string): Promise<ProfileResponse> {
  const { data } = await api.get<ProfileResponse>(`/users/${userId}/profile`);
  const raw = data.data as unknown;
  const user = ((raw as { user?: User } | null)?.user ?? raw) as User;
  return { ...data, data: user };
}
// GET /users/:userId/posts — another user's posts
export async function getUserPosts(userId: string): Promise<AllPostsResponse> {
  const { data } = await api.get<AllPostsResponse>(`/users/${userId}/posts`);
  return data;
}
// PUT /users/upload-photo — profile photo
export async function uploadProfilePhoto(photo: File): Promise<ApiResponse<User>> {
  const formData = new FormData();
  formData.append("photo", photo);

  const { data } = await api.put<ApiResponse<User>>("/users/upload-photo", formData);
  return data;
}
