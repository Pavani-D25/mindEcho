"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { collection, getDocs } from "firebase/firestore";
import { format, parseISO } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function MoodCalendar() {
  const [moodMap, setMoodMap] = useState({});
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchMoods = async () => {
      if (!currentUser) return;

      const moodRef = collection(db, "users", currentUser.uid, "moods");
      const snapshot = await getDocs(moodRef);
      const map = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        const date = format(doc.id ? parseISO(doc.id) : new Date(), "yyyy-MM-dd");
        map[date] = data;
      });
      setMoodMap(map);
    };

    fetchMoods();
  }, [currentUser]);

  const renderMood = (date) => {
    const day = format(date, "yyyy-MM-dd");
    const mood = moodMap[day];
    return mood ? (
      <div className="text-center text-xl">{mood.emoji}</div>
    ) : null;
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-semibold text-center mb-4">Mood Calendar</h2>
      <DayPicker
        mode="month"
        components={{
          DayContent: ({ date }) => (
            <div className="h-14 w-14 flex items-center justify-center">
              {renderMood(date)}
            </div>
          ),
        }}
        className="border rounded-xl p-4"
      />
    </div>
  );
}
