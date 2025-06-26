"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

export default function UserMenu() {
  const { currentUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await logout();
    setLoading(false);
  };

  if (!currentUser) return null;

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div className="flex items-center gap-2">
        <Menu.Button className="flex items-center space-x-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-100">
          <Image
            src={currentUser.photoURL || "/default-avatar.png"}
            alt="Avatar"
            width={30}
            height={30}
            className="rounded-full"
          />
          <ChevronDown className="w-4 h-4" />
        </Menu.Button>
      </div>

      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-in"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleLogout}
                  className={`${
                    active ? "bg-red-100 text-red-600" : "text-gray-800"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  disabled={loading}
                >
                  {loading ? "Logging out..." : "Log Out"}
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
