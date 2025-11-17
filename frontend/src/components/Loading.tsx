// src/components/Loading.tsx
import { Loader2 } from "lucide-react";

interface LoadingProps {
  fullScreen?: boolean;
  message?: string;
}

export default function Loading({
  fullScreen = true,
  message = "Loading...",
}: LoadingProps) {
  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}
