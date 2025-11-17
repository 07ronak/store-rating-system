// src/components/Navbar.tsx
"use client";

import { useRouter } from "next/navigation";
import { Store, LogOut, KeyRound, User } from "lucide-react";
import { logout, getCurrentUser } from "@/services/auth";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUserName(user.name);
      setUserRole(user.role);
    }
  }, []);

  const handleLogout = () => {
    logout();
  };

  const handleChangePassword = () => {
    router.push("/change-password");
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <div className="bg-blue-600 p-2 rounded-lg">
              <Store className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Store Rating
            </span>
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center gap-4">
            {/* User Info */}
            <div className="hidden sm:flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
              <User className="w-4 h-4 text-gray-600" />
              <div className="text-sm">
                <p className="font-medium text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">
                  {userRole === "STORE_OWNER"
                    ? "Store Owner"
                    : userRole === "ADMIN"
                    ? "Admin"
                    : "User"}
                </p>
              </div>
            </div>

            {/* Change Password */}
            <button
              onClick={handleChangePassword}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Change Password"
            >
              <KeyRound className="w-5 h-5" />
              <span className="hidden md:inline">Change Password</span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
