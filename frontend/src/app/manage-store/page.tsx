// src/app/manage-store/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Store, Star, Users } from "lucide-react";
import Navbar from "../../components/Navbar";
import ProtectedRoute from "../../components/ProtectedRoute";
import { storeOwnerApi } from "../../services/storeOwner";
import { StoreWithDetailedRatings } from "../../types";

export default function ManageStorePage() {
  const [stores, setStores] = useState<StoreWithDetailedRatings[]>([]);
  const [totalStores, setTotalStores] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expandedStore, setExpandedStore] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await storeOwnerApi.getDashboard();
      setStores(response.stores);
      setTotalStores(response.totalStores);
    } catch (error) {
      console.error("Failed to fetch dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStoreExpansion = (storeId: string) => {
    setExpandedStore(expandedStore === storeId ? null : storeId);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["STORE_OWNER"]}>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["STORE_OWNER"]}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Stores Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your stores and view customer ratings
            </p>
          </div>

          {/* Summary Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Stores</p>
                <p className="text-3xl font-bold text-gray-900">
                  {totalStores}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Store className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Stores List */}
          {stores.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No stores assigned yet</p>
              <p className="text-gray-400 text-sm mt-2">
                Contact an administrator to assign stores to your account
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {stores.map((store) => (
                <div
                  key={store.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  {/* Store Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">
                          {store.name}
                        </h2>
                        <p className="text-gray-600 mb-2">{store.address}</p>
                        {store.email && (
                          <p className="text-gray-500 text-sm">{store.email}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          {renderStars(Math.round(store.averageRating))}
                          <span className="text-lg font-bold text-gray-900">
                            {store.averageRating.toFixed(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {store.totalRatings} rating
                          {store.totalRatings !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Store Statistics */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Average Rating
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          {store.averageRating.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Total Ratings
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          {store.totalRatings}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          5-Star Ratings
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          {store.ratings.filter((r) => r.rating === 5).length}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Low Ratings (≤2)
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          {store.ratings.filter((r) => r.rating <= 2).length}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Toggle Ratings Button */}
                  <div className="px-6 py-4 bg-gray-50">
                    <button
                      onClick={() => toggleStoreExpansion(store.id)}
                      className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                    >
                      <Users className="w-4 h-4" />
                      {expandedStore === store.id
                        ? "Hide Customer Ratings"
                        : "Show Customer Ratings"}
                    </button>
                  </div>

                  {/* Ratings Table */}
                  {expandedStore === store.id && (
                    <div className="p-6">
                      {store.ratings.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">
                          No ratings yet for this store
                        </p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Customer
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Email
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Rating
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Date
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {store.ratings.map((rating) => (
                                <tr
                                  key={rating.id}
                                  className="hover:bg-gray-50"
                                >
                                  <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="font-medium text-gray-900">
                                      {rating.user.name}
                                    </div>
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-gray-600">
                                    {rating.user.email}
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                      {renderStars(rating.rating)}
                                      <span className="text-sm font-semibold text-gray-900">
                                        {rating.rating}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-gray-600 text-sm">
                                    {new Date(
                                      rating.createdAt
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
