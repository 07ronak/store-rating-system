// src/app/stores/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Star, Search } from "lucide-react";
import Navbar from "../../components/Navbar";
import ProtectedRoute from "../../components/ProtectedRoute";
import { storeApi } from "../../services/users";
import { StoreWithRating } from "../../types";

export default function StoresPage() {
  const [stores, setStores] = useState<StoreWithRating[]>([]);
  const [filteredStores, setFilteredStores] = useState<StoreWithRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [searchAddress, setSearchAddress] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "address" | "rating">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    filterAndSortStores();
  }, [stores, searchName, searchAddress, sortBy, sortOrder]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await storeApi.getStores();
      setStores(response.stores);
    } catch (error) {
      console.error("Failed to fetch stores:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortStores = () => {
    let filtered = [...stores];

    // Filter by name
    if (searchName) {
      filtered = filtered.filter((store) =>
        store.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    // Filter by address
    if (searchAddress) {
      filtered = filtered.filter((store) =>
        store.address.toLowerCase().includes(searchAddress.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: string | number = "";
      let bValue: string | number = "";

      if (sortBy === "rating") {
        aValue = a.overallRating;
        bValue = b.overallRating;
      } else {
        aValue = a[sortBy].toLowerCase();
        bValue = b[sortBy].toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredStores(filtered);
  };

  const handleSort = (field: "name" | "address" | "rating") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const openRatingModal = (store: StoreWithRating) => {
    setSelectedStore(store.id);
    setRating(store.userRating || 0);
  };

  const closeRatingModal = () => {
    setSelectedStore(null);
    setRating(0);
  };

  const handleSubmitRating = async () => {
    if (!selectedStore || rating === 0) return;

    try {
      setSubmitting(true);
      const store = stores.find((s) => s.id === selectedStore);

      if (store?.userRatingId) {
        await storeApi.updateRating({ storeId: selectedStore, rating });
      } else {
        await storeApi.submitRating({ storeId: selectedStore, rating });
      }

      await fetchStores();
      closeRatingModal();
    } catch (error) {
      console.error("Failed to submit rating:", error);
      alert("Failed to submit rating");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (count: number, interactive: boolean = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= count
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            } ${
              interactive ? "cursor-pointer hover:scale-110 transition" : ""
            }`}
            onClick={interactive ? () => setRating(star) : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <ProtectedRoute allowedRoles={["USER"]}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              All Stores
            </h1>
            <p className="text-gray-600">Browse and rate stores in your area</p>
          </div>

          {/* Search Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search by Name
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Store name..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="text-black w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search by Address
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Address..."
                    value={searchAddress}
                    onChange={(e) => setSearchAddress(e.target.value)}
                    className="text-black w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stores Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredStores.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No stores found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th
                        onClick={() => handleSort("name")}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        Name{" "}
                        {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        onClick={() => handleSort("address")}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        Address{" "}
                        {sortBy === "address" &&
                          (sortOrder === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        onClick={() => handleSort("rating")}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        Overall Rating{" "}
                        {sortBy === "rating" &&
                          (sortOrder === "asc" ? "↑" : "↓")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Your Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStores.map((store) => (
                      <tr key={store.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {store.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-600">{store.address}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {renderStars(Math.round(store.overallRating))}
                            <span className="text-sm text-gray-600">
                              ({store.overallRating.toFixed(1)})
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {store.userRating ? (
                            <div className="flex items-center gap-2">
                              {renderStars(store.userRating)}
                              <span className="text-sm text-gray-600">
                                ({store.userRating})
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">
                              Not rated
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => openRatingModal(store)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                          >
                            {store.userRating ? "Update" : "Rate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Rating Modal */}
        {selectedStore && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Rate Store
              </h2>
              <p className="text-gray-600 mb-6">
                Select your rating (1-5 stars)
              </p>
              <div className="flex justify-center mb-6">
                {renderStars(rating, true)}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={closeRatingModal}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitRating}
                  disabled={rating === 0 || submitting}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
