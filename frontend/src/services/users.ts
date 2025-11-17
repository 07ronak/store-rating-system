// src/services/users.ts
import api from "./api";
import {
  GetStoresResponse,
  SubmitRatingData,
  RatingResponse,
  StoreFilters,
} from "../types";

class StoreAPI {
  /**
   * GET /user/stores
   * Fetch all stores with overall ratings and user's personal rating
   */
  async getStores(filters?: StoreFilters): Promise<GetStoresResponse> {
    const response = await api.get("/user/stores", { params: filters });
    return response.data;
  }

  /**
   * POST /user/ratings
   * Submit a new rating for a store
   */
  async submitRating(data: SubmitRatingData): Promise<RatingResponse> {
    const response = await api.post("/user/ratings", data);
    return response.data;
  }

  /**
   * PUT /user/ratings
   * Update an existing rating
   */
  async updateRating(data: SubmitRatingData): Promise<RatingResponse> {
    const response = await api.put("/user/ratings", data);
    return response.data;
  }
}

export const storeApi = new StoreAPI();
