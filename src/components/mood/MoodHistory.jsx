"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { CalendarDays } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const emojiColors = {
  "Happy": "bg-gradient-to-br from-yellow-400 to-amber-500",
  "Sad": "bg-gradient-to-br from-blue-400 to-indigo-600",
  "Angry": "bg-gradient-to-br from-red-500 to-rose-600",
  "Tired": "bg-gradient-to-br from-purple-500 to-violet-600",
  "Peaceful": "bg-gradient-to-br from-emerald-400 to-teal-600",
  "Tearful": "bg-gradient-to-br from-indigo-500 to-blue-700",
};

export default function MoodHistory() {
  const { currentUser } = useAuth();
  const [moods, setMoods] = useState([]);

  useEffect(() => {
    const fetchMoods = async () => {
      if (!currentUser) return;
      const moodsRef = collection(db, "users", currentUser.uid, "moods");
      const q = query(moodsRef, orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMoods(data);
    };
    fetchMoods();
  }, [currentUser]);

  if (!currentUser) return null;

  return (
    <div className="rounded-3xl border border-white/20 bg-black/50 backdrop-blur-md p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
        <CalendarDays className="w-6 h-6 text-purple-400" />
        <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Emotional Timeline
        </span>
      </h2>
      
      {moods.length === 0 ? (
        <p className="text-white/50">Your emotional journey begins here.</p>
      ) : (
        <div className="space-y-4">
          {moods.map((mood, index) => (
            <motion.div
              key={mood.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-xl border border-white/10 hover:border-white/20 transition-all bg-gradient-to-r from-white/5 to-white/[0.01] backdrop-blur-sm"
            >
              <div className="flex gap-4 items-start">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${emojiColors[mood.mood] || 'bg-gray-600'}`}>
                  <span className="text-2xl">{mood.emoji}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-white">{mood.mood}</h3>
                    <span className="text-xs text-white/50">
                      {new Date(mood.timestamp?.seconds * 1000).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="mt-1 text-white/80 text-sm italic">✨ {mood.suggestion}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}