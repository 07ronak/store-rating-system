// src/services/auth.ts
import api from "./api";
import {
  SignupData,
  LoginData,
  ChangePasswordData,
  AuthResponse,
  User,
  ApiSuccessMessage,
} from "../types";

const TOKEN_KEY = "token";
const USER_KEY = "user";

// -------------------------
//    Helper Functions
// -------------------------

// Save token + user in localStorage
const saveAuthData = (token: string, user: User) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

// Clear auth data
export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.href = "/login";
  }
};

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(USER_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

// Get token
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// Get user role
export const getUserRole = (): string | null => {
  const user = getCurrentUser();
  return user?.role || null;
};

// -------------------------
//    API Functions
// -------------------------

// Signup
export const signup = async (data: SignupData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/signup", data);

  // If backend returns token, save it
  if (response.data.token) {
    saveAuthData(response.data.token, response.data.user);
  }

  return response.data;
};

// Login
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", data);

  // Store token + user
  saveAuthData(response.data.token, response.data.user);

  return response.data;
};

// Update password (requires token)
export const updatePassword = async (
  data: ChangePasswordData
): Promise<ApiSuccessMessage> => {
  const response = await api.put<ApiSuccessMessage>(
    "/auth/change-password",
    data
  );

  return response.data;
};

// -------------------------
//    Default Export
// -------------------------

export default {
  signup,
  login,
  logout,
  updatePassword,
  getCurrentUser,
  getToken,
  isAuthenticated,
  getUserRole,
};
