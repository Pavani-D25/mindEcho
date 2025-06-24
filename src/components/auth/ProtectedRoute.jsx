"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (currentUser === null) {
      router.push("/auth/login");
    }
  }, [currentUser]);

  if (currentUser === null) {
    return <div className="text-center p-8">🔐 Redirecting to login...</div>;
  }

  return children;
}
