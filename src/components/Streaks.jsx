"use client";

import { motion } from "framer-motion";
import { Flame, Calendar, Trophy, Target } from "lucide-react";
import { useStreak } from "@/hooks/useStreak";

export default function Streaks() {
  const { 
    streakData, 
    loading, 
    getStreakColor, 
    getStreakIcon, 
    getStreakMessage 
  } = useStreak();

  const iconComponents = {
    calendar: Calendar,
    flame: Flame,
    target: Target,
    trophy: Trophy
  };

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

  const IconComponent = iconComponents[getStreakIcon(streakData.current)];

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
            <IconComponent className="w-4 h-4" />
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
        {getStreakMessage()}
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