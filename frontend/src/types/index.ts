// ============================================
//           ENUMS & BASE TYPES
// ============================================

export type UserRole = "ADMIN" | "USER" | "STORE_OWNER";

// ============================================
//           CORE DOMAIN MODELS
// ============================================

export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;

  // Optional relations (only returned if backend includes them)
  stores?: Store[];
  ratings?: Rating[];
}

export interface Store {
  id: string;
  name: string;
  email?: string | null;
  address: string;
  ownerId?: string | null;
  createdAt: string;
  updatedAt: string;

  // Optional relations
  owner?: User | null;
  ratings?: Rating[];
}

export interface Rating {
  id: string;
  rating: number;
  userId: string;
  storeId: string;
  createdAt: string;
  updatedAt: string;

  // Optional relations
  user?: User;
  store?: Store;
}

// ============================================
//        AUTHENTICATION TYPES
// ============================================

export interface SignupData {
  name: string;
  email: string;
  password: string;
  address: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

// ============================================
//        USER (NORMAL) SERVICE TYPES
// ============================================

// Store with overall rating and user's personal rating
export interface StoreWithRating {
  id: string;
  name: string;
  address: string;
  overallRating: number; // Average rating (0 if no ratings)
  userRating: number | null; // Current user's rating
  userRatingId: string | null; // ID of user's rating for updates
}

export interface GetStoresResponse {
  stores: StoreWithRating[];
}

export interface SubmitRatingData {
  storeId: string;
  rating: number;
}

export interface RatingResponse {
  message: string;
  rating: Rating;
}

// ============================================
//        ADMIN SERVICE TYPES
// ============================================

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  address: string;
  role: UserRole;
}

export interface CreateUserResponse {
  message: string;
  user: User;
}

export interface CreateStoreData {
  name: string;
  email?: string | null;
  address: string;
  ownerId?: string | null;
}

export interface CreateStoreResponse {
  message: string;
  store: Store;
}

export interface AdminStoreWithRating {
  id: string;
  name: string;
  email: string | null;
  address: string;
  rating: number; // Average rating
  totalRatings: number; // Count of ratings
  owner: {
    id: string;
    name: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetAdminStoresResponse {
  stores: AdminStoreWithRating[];
}

export interface AdminUserStore {
  id: string;
  name: string;
  email: string | null;
  address: string;
  rating: number; // Average rating
  totalRatings: number; // Count of ratings
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  address: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  stores?: AdminUserStore[]; // Only for STORE_OWNER role
}

export interface GetAdminUsersResponse {
  users: AdminUser[];
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

// ============================================
//     STORE OWNER SERVICE TYPES
// ============================================

// Rating with user details for store owner dashboard
export interface RatingWithUser {
  id: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

// Store with detailed rating information
export interface StoreWithDetailedRatings {
  id: string;
  name: string;
  email: string | null;
  address: string;
  averageRating: number; // CHANGED from overallRating to match backend
  totalRatings: number; // Count of ratings
  ratings: RatingWithUser[]; // All ratings with user info
}

export interface StoreOwnerDashboardResponse {
  totalStores: number;
  stores: StoreWithDetailedRatings[];
}

// ============================================
//        COMMON API TYPES
// ============================================

export interface ApiError {
  error: string;
  statusCode?: number;
}

export interface ApiSuccessMessage {
  message: string;
}

// ============================================
//        QUERY/FILTER TYPES
// ============================================

export interface StoreFilters {
  name?: string;
  email?: string;
  address?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface UserFilters {
  name?: string;
  email?: string;
  address?: string;
  role?: UserRole;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
