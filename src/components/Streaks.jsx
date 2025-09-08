"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame, Calendar, Trophy, Target } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { rtdb } from "@/lib/firebase";
import { ref, onValue, set, get } from "firebase/database";

export default function Streaks() {
  const { currentUser } = useAuth();
  const [streakData, setStreakData] = useState({
    current: 0,
    longest: 0,
    lastEntryDate: null,
    totalEntries: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const journalsRef = ref(rtdb, `journals/${currentUser.uid}`);
    const streaksRef = ref(rtdb, `streaks/${currentUser.uid}`);

    // Listen to journal entries to calculate streaks
    const unsubscribe = onValue(journalsRef, async (snapshot) => {
      const entries = snapshot.val();
      if (!entries) {
        setStreakData({
          current: 0,
          longest: 0,
          lastEntryDate: null,
          totalEntries: 0
        });
        setLoading(false);
        return;
      }

      // Convert entries to array with dates
      const entriesArray = Object.values(entries).map(entry => ({
        ...entry,
        date: new Date(entry.createdAt)
      }));

      // Sort by date (most recent first)
      entriesArray.sort((a, b) => b.date - a.date);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Calculate streaks
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      const entriesByDate = new Map();

      // Group entries by date
      entriesArray.forEach(entry => {
        const dateKey = entry.date.toDateString();
        if (!entriesByDate.has(dateKey)) {
          entriesByDate.set(dateKey, []);
        }
        entriesByDate.get(dateKey).push(entry);
      });

      const sortedDates = Array.from(entriesByDate.keys())
        .map(dateStr => new Date(dateStr))
        .sort((a, b) => b - a);

      // Calculate current streak
      let checkDate = new Date(today);
      let streakBroken = false;

      while (!streakBroken && sortedDates.length > 0) {
        const dateKey = checkDate.toDateString();
        if (entriesByDate.has(dateKey)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else if (checkDate.toDateString() === today.toDateString()) {
          // If today has no entry, check yesterday
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          streakBroken = true;
        }
      }

      // Calculate longest streak
      const allDates = sortedDates.sort((a, b) => a - b);
      tempStreak = 0;

      for (let i = 0; i < allDates.length; i++) {
        if (i === 0) {
          tempStreak = 1;
        } else {
          const prevDate = new Date(allDates[i - 1]);
          const currentDate = new Date(allDates[i]);
          const diffTime = currentDate - prevDate;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            tempStreak++;
          } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
          }
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak);

      const newStreakData = {
        current: currentStreak,
        longest: longestStreak,
        lastEntryDate: sortedDates[0] || null,
        totalEntries: entriesArray.length
      };

      setStreakData(newStreakData);

      // Save to streaks collection
      await set(streaksRef, {
        ...newStreakData,
        lastUpdated: Date.now()
      });

      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-gray-500">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Flame className="w-4 h-4" />
        </motion.div>
        <span className="text-xs">Loading...</span>
      </div>
    );
  }

  const getStreakColor = (streak) => {
    if (streak === 0) return "text-gray-400";
    if (streak < 3) return "text-orange-500";
    if (streak < 7) return "text-yellow-500";
    if (streak < 30) return "text-blue-500";
    return "text-purple-600";
  };

  const getStreakIcon = (streak) => {
    if (streak === 0) return <Calendar className="w-4 h-4" />;
    if (streak < 7) return <Flame className="w-4 h-4" />;
    if (streak < 30) return <Target className="w-4 h-4" />;
    return <Trophy className="w-4 h-4" />;
  };

  const isStreakActive = () => {
    if (!streakData.lastEntryDate) return false;
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const lastEntry = new Date(streakData.lastEntryDate);
    const todayStr = today.toDateString();
    const yesterdayStr = yesterday.toDateString();
    const lastEntryStr = lastEntry.toDateString();

    return lastEntryStr === todayStr || lastEntryStr === yesterdayStr;
  };

  return (
    <div className="px-4 py-3 border-b border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <motion.div
            animate={streakData.current > 0 ? {
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            className={getStreakColor(streakData.current)}
          >
            {getStreakIcon(streakData.current)}
          </motion.div>
          <span className="text-sm font-medium text-gray-700">
            Streak
          </span>
        </div>
        <div className="text-right">
          <div className={`text-lg font-bold ${getStreakColor(streakData.current)}`}>
            {streakData.current}
          </div>
          {streakData.current > 0 && (
            <div className="text-xs text-gray-500">
              {streakData.current === 1 ? 'day' : 'days'}
            </div>
          )}
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mb-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-500">Progress</span>
          <span className="text-xs text-gray-500">
            Best: {streakData.longest}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ 
              width: streakData.longest > 0 
                ? `${Math.min((streakData.current / streakData.longest) * 100, 100)}%`
                : '0%'
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-1.5 rounded-full ${
              streakData.current === 0 
                ? 'bg-gray-300'
                : streakData.current < 7 
                ? 'bg-gradient-to-r from-orange-400 to-yellow-400'
                : streakData.current < 30
                ? 'bg-gradient-to-r from-blue-400 to-purple-400'
                : 'bg-gradient-to-r from-purple-500 to-pink-500'
            }`}
          />
        </div>
      </div>

      {/* Status message */}
      <div className="text-xs text-gray-500">
        {streakData.current === 0 ? (
          "Start your journaling journey!"
        ) : isStreakActive() ? (
          "Keep it up! 🎉"
        ) : (
          "Time to journal today!"
        )}
      </div>

      {/* Total entries */}
      {streakData.totalEntries > 0 && (
        <div className="text-xs text-gray-400 mt-1">
          Total entries: {streakData.totalEntries}
        </div>
      )}
    </div>
  );
}   