"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Menu, LogOut, User } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function UserMenu() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  if (!currentUser) return null;

  return (
    <div className="relative text-right z-50">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full border border-white/20 hover:border-white/40 transition-all"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm text-white/80">{currentUser.email.split('@')[0]}</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-48 bg-black/70 backdrop-blur-lg border border-white/20 rounded-xl shadow-lg overflow-hidden"
          >
            <motion.button
              whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-3 text-sm text-white/90"
            >
              <LogOut className="w-4 h-4 mr-3 text-white/70" />
              Logout
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}