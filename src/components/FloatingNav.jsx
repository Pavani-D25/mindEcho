"use client";
import { motion } from 'framer-motion';
import { Home, BookOpen, MessageSquare, Mic } from 'lucide-react';

export default function FloatingNav({ activeView, setActiveView, setShowVoiceAssistant, setShowChatBot }) {
  const navItems = [
    { id: 'home', icon: <Home className="w-5 h-5" />, label: 'Home' },
    { id: 'journal', icon: <BookOpen className="w-5 h-5" />, label: 'Journal' },
  ];

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed left-1/2 transform -translate-x-1/2 top-20 z-50"
    >
      <div className="flex items-center bg-white rounded-full shadow-lg p-2 space-x-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex items-center justify-center p-3 rounded-full transition-all ${
              activeView === item.id ? 'bg-purple-100 text-purple-600' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {item.icon}
          </button>
        ))}

        <div className="h-6 w-px bg-gray-200 mx-1"></div>

        <button
          onClick={() => setShowChatBot(true)}
          className="flex items-center justify-center p-3 rounded-full text-gray-500 hover:bg-gray-100"
        >
          <MessageSquare className="w-5 h-5" />
        </button>

        <button
          onClick={() => setShowVoiceAssistant(true)}
          className="flex items-center justify-center p-3 rounded-full text-gray-500 hover:bg-gray-100"
        >
          <Mic className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}