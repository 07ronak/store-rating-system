// src/app/admin-panel/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Users, Store, Star, RefreshCw } from "lucide-react";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import ProtectedRoute from "../../../components/ProtectedRoute";
import adminService from "../../../services/admin";
import {
  AdminDashboardStats,
  AdminStoreWithRating,
  AdminUser,
} from "../../../types";

type ViewMode = "stores" | "users";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [stores, setStores] = useState<AdminStoreWithRating[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("stores");
  const [loading, setLoading] = useState(true);

  // Search and sort states for stores
  const [storeSearchName, setStoreSearchName] = useState("");
  const [storeSearchEmail, setStoreSearchEmail] = useState("");
  const [storeSearchAddress, setStoreSearchAddress] = useState("");
  const [storeSortBy, setStoreSortBy] = useState<string>("name");
  const [storeSortOrder, setStoreSortOrder] = useState<"asc" | "desc">("asc");

  // Search and sort states for users
  const [userSearchName, setUserSearchName] = useState("");
  const [userSearchEmail, setUserSearchEmail] = useState("");
  const [userSearchAddress, setUserSearchAddress] = useState("");
  const [userSearchRole, setUserSearchRole] = useState("");
  const [userSortBy, setUserSortBy] = useState<string>("name");
  const [userSortOrder, setUserSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, storesData, usersData] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getStores(),
        adminService.getUsers(),
      ]);
      setStats(statsData);
      setStores(storesData.stores);
      setUsers(usersData.users);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleView = () => {
    setViewMode(viewMode === "stores" ? "users" : "stores");
  };

  const handleStoreSort = (field: string) => {
    if (storeSortBy === field) {
      setStoreSortOrder(storeSortOrder === "asc" ? "desc" : "asc");
    } else {
      setStoreSortBy(field);
      setStoreSortOrder("asc");
    }
  };

  const handleUserSort = (field: string) => {
    if (userSortBy === field) {
      setUserSortOrder(userSortOrder === "asc" ? "desc" : "asc");
    } else {
      setUserSortBy(field);
      setUserSortOrder("asc");
    }
  };

  const filteredStores = stores
    .filter((store) => {
      if (
        storeSearchName &&
        !store.name.toLowerCase().includes(storeSearchName.toLowerCase())
      )
        return false;
      if (
        storeSearchEmail &&
        store.email &&
        !store.email.toLowerCase().includes(storeSearchEmail.toLowerCase())
      )
        return false;
      if (
        storeSearchAddress &&
        !store.address.toLowerCase().includes(storeSearchAddress.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      const aValue = a[storeSortBy as keyof AdminStoreWithRating];
      const bValue = b[storeSortBy as keyof AdminStoreWithRating];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return storeSortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return storeSortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

  const filteredUsers = users
    .filter((user) => {
      if (
        userSearchName &&
        !user.name.toLowerCase().includes(userSearchName.toLowerCase())
      )
        return false;
      if (
        userSearchEmail &&
        !user.email.toLowerCase().includes(userSearchEmail.toLowerCase())
      )
        return false;
      if (
        userSearchAddress &&
        !user.address.toLowerCase().includes(userSearchAddress.toLowerCase())
      )
        return false;
      if (userSearchRole && user.role !== userSearchRole) return false;
      return true;
    })
    .sort((a, b) => {
      const aValue = a[userSortBy as keyof AdminUser];
      const bValue = b[userSortBy as keyof AdminUser];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return userSortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
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
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link
            href="/admin-panel"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin Panel
          </Link>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Overview of system statistics</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats?.totalUsers || 0}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Stores</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats?.totalStores || 0}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Store className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Ratings</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats?.totalRatings || 0}
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Star className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* View Toggle Button */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <button
              onClick={toggleView}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              <RefreshCw className="w-5 h-5" />
              Switch to {viewMode === "stores" ? "Users" : "Stores"} View
            </button>
          </div>

          {/* Search Filters */}
          {viewMode === "stores" ? (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-black">
              <h2 className="text-lg font-semibold mb-4">Search Stores</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={storeSearchName}
                    onChange={(e) => setStoreSearchName(e.target.value)}
                    placeholder="Search by name..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="text"
                    value={storeSearchEmail}
                    onChange={(e) => setStoreSearchEmail(e.target.value)}
                    placeholder="Search by email..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={storeSearchAddress}
                    onChange={(e) => setStoreSearchAddress(e.target.value)}
                    placeholder="Search by address..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-black">
              <h2 className="text-lg font-semibold mb-4">Search Users</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={userSearchName}
                    onChange={(e) => setUserSearchName(e.target.value)}
                    placeholder="Search by name..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="text"
                    value={userSearchEmail}
                    onChange={(e) => setUserSearchEmail(e.target.value)}
                    placeholder="Search by email..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={userSearchAddress}
                    onChange={(e) => setUserSearchAddress(e.target.value)}
                    placeholder="Search by address..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={userSearchRole}
                    onChange={(e) => setUserSearchRole(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Roles</option>
                    <option value="USER">User</option>
                    <option value="STORE_OWNER">Store Owner</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Data Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              {viewMode === "stores" ? (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th
                        onClick={() => handleStoreSort("name")}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        Name{" "}
                        {storeSortBy === "name" &&
                          (storeSortOrder === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        onClick={() => handleStoreSort("email")}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        Email{" "}
                        {storeSortBy === "email" &&
                          (storeSortOrder === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        onClick={() => handleStoreSort("address")}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        Address{" "}
                        {storeSortBy === "address" &&
                          (storeSortOrder === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        onClick={() => handleStoreSort("rating")}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        Rating{" "}
                        {storeSortBy === "rating" &&
                          (storeSortOrder === "asc" ? "↑" : "↓")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Ratings
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Owner
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStores.map((store) => (
                      <tr key={store.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          {store.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {store.email || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {store.address}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-yellow-600 font-semibold">
                            {store.rating.toFixed(1)} ★
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {store.totalRatings}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {store.owner ? store.owner.name : "No Owner"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th
                        onClick={() => handleUserSort("name")}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        Name{" "}
                        {userSortBy === "name" &&
                          (userSortOrder === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        onClick={() => handleUserSort("email")}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        Email{" "}
                        {userSortBy === "email" &&
                          (userSortOrder === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        onClick={() => handleUserSort("address")}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        Address{" "}
                        {userSortBy === "address" &&
                          (userSortOrder === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        onClick={() => handleUserSort("role")}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        Role{" "}
                        {userSortBy === "role" &&
                          (userSortOrder === "asc" ? "↑" : "↓")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stores
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {user.address}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === "ADMIN"
                                ? "bg-red-100 text-red-800"
                                : user.role === "STORE_OWNER"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {user.role === "STORE_OWNER" && user.stores
                            ? user.stores.length
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
