// hooks/useStreak.js
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { rtdb } from "@/lib/firebase";
import { ref, onValue, set } from "firebase/database";

export function useStreak() {
  const { currentUser } = useAuth();
  const [streakData, setStreakData] = useState({
    current: 0,
    longest: 0,
    lastEntryDate: null,
    totalEntries: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const journalsRef = ref(rtdb, `journals/${currentUser.uid}`);
    const streaksRef = ref(rtdb, `streaks/${currentUser.uid}`);

    // Listen to journal entries to calculate streaks in real-time
    const unsubscribe = onValue(journalsRef, async (snapshot) => {
      const entries = snapshot.val();
      
      if (!entries) {
        const emptyData = {
          current: 0,
          longest: 0,
          lastEntryDate: null,
          totalEntries: 0
        };
        setStreakData(emptyData);
        setLoading(false);
        return;
      }

      // Calculate streak data
      const calculatedData = calculateStreakData(entries);
      setStreakData(calculatedData);

      // Save to streaks collection for quick access
      try {
        await set(streaksRef, {
          ...calculatedData,
          lastUpdated: Date.now()
        });
      } catch (error) {
        console.error("Error saving streak data:", error);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Utility functions
  const getStreakColor = (streak) => {
    if (streak === 0) return "text-gray-400";
    if (streak < 3) return "text-orange-500";
    if (streak < 7) return "text-yellow-500";
    if (streak < 30) return "text-blue-500";
    return "text-purple-600";
  };

  const getStreakIcon = (streak) => {
    if (streak === 0) return "calendar";
    if (streak < 7) return "flame";
    if (streak < 30) return "target";
    return "trophy";
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

  const getStreakMessage = () => {
    if (streakData.current === 0) {
      return "Start your journaling journey!";
    } else if (isStreakActive()) {
      return "Keep it up! 🎉";
    } else {
      return "Time to journal today!";
    }
  };

  return {
    streakData,
    loading,
    getStreakColor,
    getStreakIcon,
    isStreakActive,
    getStreakMessage
  };
}

// Helper function to calculate streak data from journal entries
function calculateStreakData(entries) {
  // Convert entries to array with dates
  const entriesArray = Object.values(entries).map(entry => ({
    ...entry,
    date: new Date(entry.createdAt)
  }));

  // Sort by date (most recent first)
  entriesArray.sort((a, b) => b.date - a.date);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Group entries by date
  const entriesByDate = new Map();
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
  let currentStreak = 0;
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
  let longestStreak = 0;
  let tempStreak = 0;

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

  return {
    current: currentStreak,
    longest: longestStreak,
    lastEntryDate: sortedDates[0] || null,
    totalEntries: entriesArray.length
  };
}