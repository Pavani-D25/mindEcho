"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";

const moodColors = {
  Happy: "#facc15",
  Sad: "#60a5fa",
  Angry: "#f87171",
  Tired: "#a78bfa",
  Peaceful: "#34d399",
  Tearful: "#818cf8",
};

export default function MoodAnalysisChart() {
  const { currentUser } = useAuth();
  const [moodStats, setMoodStats] = useState([]);

  useEffect(() => {
    const fetchMoodStats = async () => {
      if (!currentUser) return;

      const moodRef = collection(db, "users", currentUser.uid, "moods");
      const snapshot = await getDocs(moodRef);
      const moodCount = {};

      snapshot.forEach((doc) => {
        const data = doc.data();
        const date = doc.id ? parseISO(doc.id) : new Date();
        const month = format(date, "MMM yyyy");
        const key = `${month}_${data.mood}`;

        moodCount[key] = (moodCount[key] || 0) + 1;
      });

      const grouped = {};
      Object.entries(moodCount).forEach(([key, count]) => {
        const [month, mood] = key.split("_");
        if (!grouped[month]) grouped[month] = {};
        grouped[month][mood] = count;
      });

      const chartData = Object.entries(grouped).map(([month, moods]) => ({
        month,
        ...moods,
      }));

      setMoodStats(chartData);
    };

    fetchMoodStats();
  }, [currentUser]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-80"
    >
      {moodStats.length === 0 ? (
        <p className="text-gray-500">No mood data yet for this month.</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={moodStats} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis allowDecimals={false} stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                background: "#111827",
                border: "1px solid #4b5563",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            {Object.keys(moodColors).map((mood) => (
              <Bar
                key={mood}
                dataKey={mood}
                stackId="a"
                fill={moodColors[mood]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
}
