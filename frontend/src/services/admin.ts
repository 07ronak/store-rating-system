// src/services/admin.ts
import api from "./api";
import {
  CreateUserData,
  CreateUserResponse,
  CreateStoreData,
  CreateStoreResponse,
  GetAdminStoresResponse,
  GetAdminUsersResponse,
  AdminDashboardStats,
  StoreFilters,
  UserFilters,
} from "../types";

// -------------------------
//       Admin Service
// -------------------------

const adminService = {
  /**
   * Admin dashboard stats
   * GET /admin/dashboard/stats
   */
  getDashboardStats: async () => {
    const response = await api.get<AdminDashboardStats>(
      "/admin/dashboard/stats"
    );
    return response.data;
  },

  /**
   * Create a new user (Admin only)
   * POST /admin/users
   */
  createUser: async (data: CreateUserData) => {
    const response = await api.post<CreateUserResponse>("/admin/users", data);
    return response.data;
  },

  /**
   * Create a new store
   * POST /admin/stores
   */
  createStore: async (data: CreateStoreData) => {
    const response = await api.post<CreateStoreResponse>("/admin/stores", data);
    return response.data;
  },

  /**
   * Fetch all stores with filters + sorting
   * GET /admin/stores
   */
  getStores: async (params?: StoreFilters) => {
    const response = await api.get<GetAdminStoresResponse>("/admin/stores", {
      params,
    });
    return response.data;
  },

  /**
   * Fetch all users with optional filters
   * GET /admin/users
   */
  getUsers: async (params?: UserFilters) => {
    const response = await api.get<GetAdminUsersResponse>("/admin/users", {
      params,
    });
    return response.data;
  },
};

export default adminService;
