// // "use client";

// // import { useState } from "react";
// // import { useAuth } from "@/context/AuthContext";
// // import { Menu, Transition } from "@headlessui/react";
// // import { ChevronDown } from "lucide-react";
// // import Image from "next/image";

// // export default function UserMenu() {
// //   const { currentUser, logout } = useAuth();
// //   const [loading, setLoading] = useState(false);

// //   const handleLogout = async () => {
// //     setLoading(true);
// //     await logout();
// //     setLoading(false);
// //   };

// //   if (!currentUser) return null;

// //   return (
// //     <Menu as="div" className="relative inline-block text-left">
// //       <div className="flex items-center gap-2">
// //         <Menu.Button className="flex items-center space-x-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-100">
// //           <Image
// //             src={currentUser.photoURL || "/default-avatar.png"}
// //             alt="Avatar"
// //             width={30}
// //             height={30}
// //             className="rounded-full"
// //           />
// //           <ChevronDown className="w-4 h-4" />
// //         </Menu.Button>
// //       </div>

// //       <Transition
// //         enter="transition duration-100 ease-out"
// //         enterFrom="transform scale-95 opacity-0"
// //         enterTo="transform scale-100 opacity-100"
// //         leave="transition duration-75 ease-in"
// //         leaveFrom="transform scale-100 opacity-100"
// //         leaveTo="transform scale-95 opacity-0"
// //       >
// //         <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
// //           <div className="px-1 py-1">
// //             <Menu.Item>
// //               {({ active }) => (
// //                 <button
// //                   onClick={handleLogout}
// //                   className={`${
// //                     active ? "bg-red-100 text-red-600" : "text-gray-800"
// //                   } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
// //                   disabled={loading}
// //                 >
// //                   {loading ? "Logging out..." : "Log Out"}
// //                 </button>
// //               )}
// //             </Menu.Item>
// //           </div>
// //         </Menu.Items>
// //       </Transition>
// //     </Menu>
// //   );
// // }



// "use client";

// import { useState } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { Menu, Transition } from "@headlessui/react";
// import { ChevronDown } from "lucide-react";

// export default function UserMenu() {
//   const { currentUser, logout } = useAuth();
//   const [loading, setLoading] = useState(false);

//   const handleLogout = async () => {
//     setLoading(true);
//     await logout();
//     setLoading(false);
//   };

//   if (!currentUser) return null;

//   // Get user initials from email
//   const getInitials = (email) => {
//     const name = email.split('@')[0];
//     return name.length >= 2 ? name.substring(0, 2).toUpperCase() : name.toUpperCase();
//   };

//   return (
//     <Menu as="div" className="relative inline-block text-left">
//       <div className="flex items-center space-x-4">
//         <div className="text-right">
//           <p className="text-sm font-medium text-gray-700">Good morning</p>
//           <p className="text-xs text-gray-500">How are you feeling today?</p>
//         </div>
//         <Menu.Button className="relative flex items-center">
//           <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
//             {getInitials(currentUser.email)}
//           </div>
//           <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
//         </Menu.Button>
//       </div>

//       <Transition
//         enter="transition duration-100 ease-out"
//         enterFrom="transform scale-95 opacity-0"
//         enterTo="transform scale-100 opacity-100"
//         leave="transition duration-75 ease-in"
//         leaveFrom="transform scale-100 opacity-100"
//         leaveTo="transform scale-95 opacity-0"
//       >
//         <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
//           <div className="px-1 py-1">
//             <Menu.Item>
//               {({ active }) => (
//                 <button
//                   onClick={handleLogout}
//                   className={`${
//                     active ? "bg-red-100 text-red-600" : "text-gray-800"
//                   } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
//                   disabled={loading}
//                 >
//                   {loading ? "Logging out..." : "Log Out"}
//                 </button>
//               )}
//             </Menu.Item>
//           </div>
//         </Menu.Items>
//       </Transition>
//     </Menu>
//   );
// }

"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
          >
            <motion.button
              whileHover={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-3 text-sm text-gray-700 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-3 text-gray-500" />
              Logout
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
