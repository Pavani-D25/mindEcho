"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { rtdb, auth } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { Activity, Music, Film } from "lucide-react";
import { motion } from "framer-motion";

const getIcon = (type) => {
  switch (type) {
    case "exercise":
      return <Activity className="w-5 h-5 text-purple-600" />;
    case "song":
      return <Music className="w-5 h-5 text-blue-600" />;
    case "movie":
      return <Film className="w-5 h-5 text-orange-600" />;
    default:
      return null;
  }
};

export default function RecommendationsPage() {
  const [userId, setUserId] = useState("guest");
  const [history, setHistory] = useState([]);

  // 🔐 Detect Firebase Auth user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email) {
        const safeId = user.email.replace(/\W/g, "_");
        setUserId(safeId);
      }
    });
    return () => unsubscribe();
  }, []);

  // 📥 Fetch recommendation history
  useEffect(() => {
    const recRef = ref(rtdb, `recommendations/${userId}`);
    const unsubscribe = onValue(recRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        const values = Object.values(val);
        const sorted = values.sort((a, b) => b.timestamp - a.timestamp);
        setHistory(sorted);
      } else {
        setHistory([]);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mb-8"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Past Recommendations</h2>

      {history.length === 0 ? (
        <p className="text-gray-500 text-sm">No recommendations found yet.</p>
      ) : (
        history.map((recGroup, index) => (
          <div key={index} className="mb-6">
            <p className="text-sm text-gray-400 mb-2">
              {new Date(recGroup.timestamp).toLocaleString()}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["exercise", "song", "movie"].map((type) => (
                <motion.div
                  key={type}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-md p-5 flex items-start"
                >
                  <div className="p-2 rounded-full bg-opacity-20 mr-4">
                    {getIcon(type)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{recGroup[type]?.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{recGroup[type]?.description}</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs text-gray-500">{recGroup[type]?.duration}</span>
                      <span className="text-xs text-purple-600 font-medium">AI Recommended</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))
      )}
    </motion.div>
  );
}
