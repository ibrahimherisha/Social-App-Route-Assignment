import { createContext } from "react";
import type { User } from "../types";
import type { ChangePasswordReq, LoginDataReq, RegisterDataReq } from "../api/Auth/types.ts";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginDataReq) => Promise<void>;
  signup: (data: RegisterDataReq) => Promise<void>;
  changePassword: (body: ChangePasswordReq) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
