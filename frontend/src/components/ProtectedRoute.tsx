// src/components/ProtectedRoute.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "../services/auth";
import { UserRole } from "../types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[]; // Optional: restrict by role
  requireAuth?: boolean; // Default: true
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  requireAuth = true,
}: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const user = getCurrentUser();

      // If authentication is required but user is not logged in
      if (requireAuth && !user) {
        router.push("/login");
        return;
      }

      // If specific roles are required, check if user has one of them
      if (allowedRoles && user) {
        if (!allowedRoles.includes(user.role)) {
          // Redirect based on user's actual role
          if (user.role === "ADMIN") {
            router.push("/admin-panel");
          } else if (user.role === "STORE_OWNER") {
            router.push("/manage-store");
          } else {
            router.push("/stores");
          }
          return;
        }
      }

      // User is authorized
      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router, allowedRoles, requireAuth]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Render children only if authorized
  return isAuthorized ? <>{children}</> : null;
}
