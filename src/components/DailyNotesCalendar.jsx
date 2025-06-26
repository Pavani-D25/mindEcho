"use client";

import { useState, useEffect } from "react";
import {
  format,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
} from "date-fns";
import { motion } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";
import { ref, onValue, set } from "firebase/database";
import { auth, rtdb } from "@/lib/firebase";

export default function DailyNotesCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [userId, setUserId] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState({});
  const [loading, setLoading] = useState(false);

  // Get user ID
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : "guest");
    });
    return () => unsubscribe();
  }, []);

  // Load notes from Firebase
  useEffect(() => {
    if (!userId) return;

    const notesRef = ref(rtdb, `notes/${userId}`);
    onValue(notesRef, (snapshot) => {
      const data = snapshot.val() || {};
      setNotes(data);
    });
  }, [userId]);

  // Set noteText when date is selected
  useEffect(() => {
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    setNoteText(notes[dateKey] || "");
  }, [selectedDate, notes]);

  const getCalendarDates = () => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    const days = [];
    let day = start;
    while (day <= end) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  };

  const handleSaveNote = async () => {
    if (!userId) return;

    setLoading(true);
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    const noteRef = ref(rtdb, `notes/${userId}/${dateKey}`);
    await set(noteRef, noteText);
    setLoading(false);
  };

  const calendarDays = getCalendarDates();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Daily Notes Calendar</h1>
        <div className="flex space-x-4 items-center">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>←</button>
          <span className="text-lg font-semibold">{format(currentMonth, "MMMM yyyy")}</span>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>→</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2 text-center text-gray-600 font-medium">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 mb-6">
        {calendarDays.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
          const dateKey = format(day, "yyyy-MM-dd");
          const hasNote = notes[dateKey];

          return (
            <motion.button
              key={day.toString()}
              onClick={() => setSelectedDate(day)}
              whileTap={{ scale: 0.95 }}
              className={`h-14 w-full rounded-md text-sm p-1 
                ${isSelected ? "border-2 border-purple-500" : "border border-gray-200"}
                ${isCurrentMonth ? "bg-white" : "bg-gray-50 text-gray-400"}
                relative`}
            >
              <span>{format(day, "d")}</span>
              {hasNote && (
                <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-purple-500" />
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-2">{format(selectedDate, "PPPP")}</h2>
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Write your notes for this day..."
          rows={5}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={handleSaveNote}
          className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Note"}
        </button>
      </div>
    </div>
  );
}
