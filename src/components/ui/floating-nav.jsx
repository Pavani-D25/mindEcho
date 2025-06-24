"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Home, HeartPulse, Settings, MessageSquare } from "lucide-react";

export const FloatingNav = ({ className }) => {
  const [active, setActive] = useState("home");
  
  const navItems = [
    { name: "home", icon: <Home className="h-4 w-4" /> },
    { name: "mood", icon: <HeartPulse className="h-4 w-4" /> },
    { name: "chat", icon: <MessageSquare className="h-4 w-4" /> },
    { name: "settings", icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex max-w-fit fixed top-10 inset-x-0 mx-auto border border-white/20 rounded-full bg-black/50 backdrop-blur-md px-4 py-2 z-50 ${className}`}
    >
      {navItems.map((item) => (
        <button
          key={item.name}
          onClick={() => setActive(item.name)}
          className={`relative rounded-full p-2 text-sm transition-all ${
            active === item.name 
              ? "text-white bg-gradient-to-br from-purple-600 to-blue-500" 
              : "text-white/60 hover:text-white/90"
          }`}
        >
          {item.icon}
          {active === item.name && (
            <motion.span
              layoutId="active-pill"
              className="absolute inset-0 rounded-full bg-white/10"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </button>
      ))}
    </motion.div>
  );
};