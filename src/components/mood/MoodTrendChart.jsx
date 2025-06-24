"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { fetchMoodHistory } from "@/lib/fetchMoodHistory";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

export default function MoodTrendChart() {
  const [moodData, setMoodData] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      if (currentUser?.uid) {
        const data = await fetchMoodHistory(currentUser.uid);
        const moodLevels = {
          "Tearful": 1, "Sad": 2, "Tired": 3, 
          "Angry": 4, "Peaceful": 5, "Happy": 6
        };
        const formatted = data.map(item => ({
          name: item.date,
          moodLevel: moodLevels[item.mood] || 0,
          mood: item.mood,
        }));
        setMoodData(formatted);
      }
    };
    loadData();
  }, [currentUser]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 rounded-3xl bg-black/50 backdrop-blur-md border border-white/20 shadow-xl"
    >
      <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
        <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Emotional Frequency
        </span>
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={moodData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="name" 
              stroke="rgba(255,255,255,0.6)" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              domain={[0, 6]} 
              ticks={[1, 2, 3, 4, 5, 6]} 
              stroke="rgba(255,255,255,0.6)"
            />
            <Tooltip 
              contentStyle={{
                background: 'rgba(0,0,0,0.8)',
                borderColor: 'rgba(255,255,255,0.2)',
                borderRadius: '8px',
                backdropFilter: 'blur(10px)'
              }}
              formatter={(value) => {
                const moods = ["", "Tearful", "Sad", "Tired", "Angry", "Peaceful", "Happy"];
                return [moods[value], "Mood"];
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="moodLevel" 
              stroke="url(#moodGradient)"
              strokeWidth={3}
              dot={{ r: 4, fill: 'rgba(124, 58, 237, 0.8)' }}
              activeDot={{ r: 6, fill: 'rgba(236, 72, 153, 1)' }}
            />
            <defs>
              <linearGradient id="moodGradient" x1="0" y1="0" x2="100%" y2="0">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}