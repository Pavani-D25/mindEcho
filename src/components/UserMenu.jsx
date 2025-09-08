
// "use client";

// import { useAuth } from "@/context/AuthContext";
// import { useRouter } from "next/navigation";
// import { LogOut } from "lucide-react";
// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// export default function UserMenu() {
//   const { currentUser, logout } = useAuth();
//   const router = useRouter();
//   const [open, setOpen] = useState(false);

//   const handleLogout = async () => {
//     await logout();                 // ✅ sign out user
//     router.push("/auth/login");    // ✅ redirect to login
//   };

//   if (!currentUser) return null;

//   const getInitials = (email) => {
//     const name = email.split("@")[0];
//     return name.length >= 2 ? name.substring(0, 2).toUpperCase() : name.toUpperCase();
//   };

//   const getGreeting = () => {
//     const hour = new Date().getHours();
//     if (hour < 12) return "Good morning";
//     if (hour < 18) return "Good afternoon";
//     return "Good evening";
//   };

//   return (
//     <div className="relative text-right z-50">
//       <motion.div
//         whileHover={{ scale: 1.02 }}
//         whileTap={{ scale: 0.98 }}
//         onClick={() => setOpen(!open)}
//         className="flex items-center space-x-4 cursor-pointer"
//       >
//         {/* Text: hidden on small screens */}
//         <div className="hidden md:block text-right">
//           <p className="text-sm font-medium text-gray-700">{getGreeting()}</p>
//           <p className="text-xs text-gray-500">How are you feeling today?</p>
//         </div>

//         {/* Avatar: always visible */}
//         <div className="relative">
//           <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
//             {getInitials(currentUser.email)}
//           </div>
//           <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
//         </div>
//       </motion.div>

//       <AnimatePresence>
//         {open && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
//           >
//             <motion.button
//               whileHover={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
//               onClick={handleLogout}
//               className="flex w-full items-center px-4 py-3 text-sm text-gray-700 hover:text-red-600 transition-colors"
//             >
//               <LogOut className="w-4 h-4 mr-3 text-gray-500" />
//               Logout
//             </motion.button>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }



"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Streaks from "./Streaks"; // Import the Streaks component

export default function UserMenu() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();                 // ✅ sign out user
    router.push("/auth/login");    // ✅ redirect to login
  };

  if (!currentUser) return null;

  const getInitials = (email) => {
    const name = email.split("@")[0];
    return name.length >= 2 ? name.substring(0, 2).toUpperCase() : name.toUpperCase();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="relative text-right z-50">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-4 cursor-pointer"
      >
        {/* Text: hidden on small screens */}
        <div className="hidden md:block text-right">
          <p className="text-sm font-medium text-gray-700">{getGreeting()}</p>
          <p className="text-xs text-gray-500">How are you feeling today?</p>
        </div>

        {/* Avatar: always visible */}
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
            {getInitials(currentUser.email)}
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
        </div>
      </motion.div>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-transparent z-40"
              onClick={() => setOpen(false)}
            />
            
            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.2 }}
              className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50"
            >
              {/* User Info Header */}
              <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {getInitials(currentUser.email)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {currentUser.displayName || currentUser.email.split('@')[0]}
                    </p>
                    <p className="text-xs text-gray-500">{currentUser.email}</p>
                  </div>
                </div>
              </div>

              {/* Streaks Section */}
              <Streaks />

              {/* Menu Items */}
              <div className="py-1">
                <motion.button
                  whileHover={{ backgroundColor: "rgba(156, 163, 175, 0.1)" }}
                  className="flex w-full items-center px-4 py-3 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <User className="w-4 h-4 mr-3 text-gray-500" />
                  Profile
                </motion.button>
                
                <motion.button
                  whileHover={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-3 text-sm text-gray-700 hover:text-red-600 transition-colors border-t border-gray-100"
                >
                  <LogOut className="w-4 h-4 mr-3 text-gray-500" />
                  Logout
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}