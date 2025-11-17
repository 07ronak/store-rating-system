// src/services/storeOwner.ts
import api from "./api";
import { StoreOwnerDashboardResponse } from "../types";

class StoreOwnerAPI {
  /**
   * GET /store-owner/dashboard
   * Fetch all stores owned by the authenticated user with detailed ratings
   */
  async getDashboard(): Promise<StoreOwnerDashboardResponse> {
    const response = await api.get<StoreOwnerDashboardResponse>(
      "/store-owner/dashboard"
    );
    return response.data;
  }
}

export const storeOwnerApi = new StoreOwnerAPI();
export default storeOwnerApi;
