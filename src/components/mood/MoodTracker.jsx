"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Sparkles, Heart, Zap, Moon, Smile, Frown } from "lucide-react";
import { WavyBackground } from "@/components/ui/wavy-background";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { Meteors } from "@/components/ui/meteors";

const moods = [
  { emoji: "😊", name: "Happy", color: "from-yellow-400 to-amber-500", icon: <Smile className="w-6 h-6" /> },
  { emoji: "😔", name: "Sad", color: "from-blue-400 to-indigo-600", icon: <Frown className="w-6 h-6" /> },
  { emoji: "😡", name: "Angry", color: "from-red-500 to-rose-600", icon: <Zap className="w-6 h-6" /> },
  { emoji: "😴", name: "Tired", color: "from-purple-500 to-violet-600", icon: <Moon className="w-6 h-6" /> },
  { emoji: "😇", name: "Peaceful", color: "from-emerald-400 to-teal-600", icon: <Heart className="w-6 h-6" /> },
  { emoji: "😢", name: "Tearful", color: "from-indigo-500 to-blue-700", icon: <Frown className="w-6 h-6" /> },
];

const words = `Track your emotional journey through the cosmos of your mind`;

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [suggestion, setSuggestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { currentUser } = useAuth();

  const handleMoodSelect = async (mood) => {
    setSelectedMood(mood);
    setIsLoading(true);
    setShowConfetti(false);

    const prompt = `Suggest a personalized mental health activity (under 15 words) for someone feeling ${mood.name}. Make it warm and encouraging.`;

    try {
      const res = await fetch("/api/gpt-suggestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error("Failed to fetch suggestion");

      const data = await res.json();
      setSuggestion(data.response);
      setShowConfetti(true);

      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid, "moods", new Date().toISOString());
        await setDoc(docRef, {
          mood: mood.name,
          emoji: mood.emoji,
          suggestion: data.response,
          timestamp: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error("Error:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-black/50 backdrop-blur-md p-8 shadow-2xl">
      <WavyBackground className="absolute inset-0 z-0" />
      
      <div className="relative z-10">
        <div className="text-center mb-10">
          <TextGenerateEffect words={words} className="text-3xl font-bold text-white" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {moods.map((mood, i) => (
            <motion.button
              key={i}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMoodSelect(mood)}
              className={`relative overflow-hidden rounded-2xl p-6 flex flex-col items-center transition-all duration-300 ${
                selectedMood?.name === mood.name 
                  ? `bg-gradient-to-br ${mood.color} shadow-lg ring-2 ring-white/50` 
                  : "bg-white/5 hover:bg-white/10 border border-white/10"
              }`}
            >
              <span className="text-5xl mb-3">{mood.emoji}</span>
              <span className="font-medium text-white/90">{mood.name}</span>
              {selectedMood?.name === mood.name && <Meteors number={10} />}
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center py-12"
            >
              <div className="flex space-x-2">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                    className="w-3 h-3 bg-white rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {suggestion && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-white/20 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-blue-900/10 to-transparent opacity-40"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-white/10 rounded-full backdrop-blur-sm mr-3 border border-white/20">
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                  </div>
                  <h3 className="font-bold text-lg text-white">AI Wellness Guide</h3>
                </div>
                <p className="text-white/90 pl-12 text-lg">{suggestion}</p>
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-4 -top-4 text-6xl opacity-20"
                >
                  {selectedMood?.emoji}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}