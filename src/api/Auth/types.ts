import type { APIResponse, User } from "../../types.ts";

export interface RegisterDataReq {
  name: string;
  username: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  password: string;
  rePassword: string;
}

export interface LoginDataReq {
  email: string;
  password: string;
}

export interface ChangePasswordReq {
  password: string;
  newPassword: string;
  rePassword: string;
}

export interface AuthResponseData {
  token: string;
  tokenType: string;
  expiresIn: string;
  user: User;
}

export interface AuthResponse extends APIResponse {
  data: AuthResponseData;
}
