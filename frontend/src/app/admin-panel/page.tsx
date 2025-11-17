// src/app/admin-panel/page.tsx
"use client";

import Link from "next/link";
import { Users, Store, BarChart3 } from "lucide-react";
import Navbar from "../../components/Navbar";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function AdminPanelPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Panel
            </h1>
            <p className="text-gray-600">
              Manage users, stores, and view dashboard statistics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Add Users */}
            <Link href="/admin-panel/add-users">
              <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition cursor-pointer border-2 border-transparent hover:border-blue-500">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-blue-100 p-4 rounded-full mb-4">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Add Users
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Create new user accounts with different roles
                  </p>
                </div>
              </div>
            </Link>

            {/* Add Store */}
            <Link href="/admin-panel/add-store">
              <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition cursor-pointer border-2 border-transparent hover:border-green-500">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-green-100 p-4 rounded-full mb-4">
                    <Store className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Add Store
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Register new stores in the system
                  </p>
                </div>
              </div>
            </Link>

            {/* Dashboard */}
            <Link href="/admin-panel/dashboard">
              <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition cursor-pointer border-2 border-transparent hover:border-purple-500">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-purple-100 p-4 rounded-full mb-4">
                    <BarChart3 className="w-8 h-8 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Dashboard
                  </h2>
                  <p className="text-gray-600 text-sm">
                    View statistics and manage all data
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
