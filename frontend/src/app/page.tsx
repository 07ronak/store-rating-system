// src/app/page.tsx
"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getUserRole } from "../services/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // If user is already logged in, redirect based on role
    if (isAuthenticated()) {
      const role = getUserRole();
      switch (role) {
        case "ADMIN":
          router.push("/admin-panel");
          break;
        case "STORE_OWNER":
          router.push("/manage-store");
          break;
        case "USER":
          router.push("/stores");
          break;
        default:
          router.push("/stores");
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to StoreRatings
            </h1>
            <p className="text-gray-600">
              Rate and review your favorite stores
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/signup"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition duration-200 block text-center"
            >
              Sign Up
            </Link>

            <Link
              href="/login"
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition duration-200 block text-center"
            >
              Login
            </Link>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Demo the platform with different user roles</p>
          </div>
        </div>
      </div>
    </div>
  );
}
