import { api } from "../client.ts";
import type { AuthResponse, ChangePasswordReq, LoginDataReq, RegisterDataReq } from "./types.ts";

// ================= Auth =================
// POST /users/signup — create account
export async function signup(registerData: RegisterDataReq): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/users/signup", registerData);
  return data;
}
// POST /users/signin — login, returns the token
export async function login(credentials: LoginDataReq): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/users/signin", credentials);
  return data;
}
// PATCH /users/change-password — returns a NEW token, save it again on success
export async function changePassword(body: ChangePasswordReq): Promise<AuthResponse> {
  // The backend rejects "rePassword" — it only accepts the current
  // password and the new one. The confirm field stays in the form
  // (zod checks it matches), it just never leaves the browser.
  const { password, newPassword } = body;
  const { data } = await api.patch<AuthResponse>("/users/change-password", { password, newPassword });
  return data;
}
