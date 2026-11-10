import type { ProfileResponse, User } from "../../types.ts";
import { api } from "../client.ts";
// ================= Profile =================
// GET /users/profile-data — your profile page
export async function getProfile(): Promise<ProfileResponse> {
  const { data } = await api.get<ProfileResponse>("/users/profile-data");
  // The endpoint nests the user one level deeper ({ data: { user: {...} } })
  // — unwrap it so every caller gets a plain User.
  const raw = data.data as unknown;
  const user = ((raw as { user?: User } | null)?.user ?? raw) as User;
  return { ...data, data: user };
}
