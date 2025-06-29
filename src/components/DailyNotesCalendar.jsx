// // "use client";

// // import { useState, useEffect } from "react";
// // import {
// //   format,
// //   isSameDay,
// //   startOfMonth,
// //   endOfMonth,
// //   startOfWeek,
// //   endOfWeek,
// //   addDays,
// //   addMonths,
// //   subMonths,
// // } from "date-fns";
// // import { motion } from "framer-motion";
// // import { onAuthStateChanged } from "firebase/auth";
// // import { ref, onValue, set } from "firebase/database";
// // import { auth, rtdb } from "@/lib/firebase";

// // export default function DailyNotesCalendar() {
// //   const [currentMonth, setCurrentMonth] = useState(new Date());
// //   const [selectedDate, setSelectedDate] = useState(new Date());
// //   const [userId, setUserId] = useState(null);
// //   const [noteText, setNoteText] = useState("");
// //   const [notes, setNotes] = useState({});
// //   const [loading, setLoading] = useState(false);

// //   // Get user ID
// //   useEffect(() => {
// //     const unsubscribe = onAuthStateChanged(auth, (user) => {
// //       setUserId(user ? user.uid : "guest");
// //     });
// //     return () => unsubscribe();
// //   }, []);

// //   // Load notes from Firebase
// //   useEffect(() => {
// //     if (!userId) return;

// //     const notesRef = ref(rtdb, `notes/${userId}`);
// //     onValue(notesRef, (snapshot) => {
// //       const data = snapshot.val() || {};
// //       setNotes(data);
// //     });
// //   }, [userId]);

// //   // Set noteText when date is selected
// //   useEffect(() => {
// //     const dateKey = format(selectedDate, "yyyy-MM-dd");
// //     setNoteText(notes[dateKey] || "");
// //   }, [selectedDate, notes]);

// //   const getCalendarDates = () => {
// //     const start = startOfWeek(startOfMonth(currentMonth));
// //     const end = endOfWeek(endOfMonth(currentMonth));
// //     const days = [];
// //     let day = start;
// //     while (day <= end) {
// //       days.push(day);
// //       day = addDays(day, 1);
// //     }
// //     return days;
// //   };

// //   const handleSaveNote = async () => {
// //     if (!userId) return;

// //     setLoading(true);
// //     const dateKey = format(selectedDate, "yyyy-MM-dd");
// //     const noteRef = ref(rtdb, `notes/${userId}/${dateKey}`);
// //     await set(noteRef, noteText);
// //     setLoading(false);
// //   };

// //   const calendarDays = getCalendarDates();

// //   return (
// //     <div className="p-6 max-w-4xl mx-auto">
// //       <div className="flex justify-between items-center mb-4">
// //         <h1 className="text-2xl font-bold">Daily Notes Calendar</h1>
// //         <div className="flex space-x-4 items-center">
// //           <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>←</button>
// //           <span className="text-lg font-semibold">{format(currentMonth, "MMMM yyyy")}</span>
// //           <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>→</button>
// //         </div>
// //       </div>

// //       <div className="grid grid-cols-7 gap-1 mb-2 text-center text-gray-600 font-medium">
// //         {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
// //           <div key={d}>{d}</div>
// //         ))}
// //       </div>

// //       <div className="grid grid-cols-7 gap-1 mb-6">
// //         {calendarDays.map((day) => {
// //           const isSelected = isSameDay(day, selectedDate);
// //           const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
// //           const dateKey = format(day, "yyyy-MM-dd");
// //           const hasNote = notes[dateKey];

// //           return (
// //             <motion.button
// //               key={day.toString()}
// //               onClick={() => setSelectedDate(day)}
// //               whileTap={{ scale: 0.95 }}
// //               className={`h-14 w-full rounded-md text-sm p-1 
// //                 ${isSelected ? "border-2 border-purple-500" : "border border-gray-200"}
// //                 ${isCurrentMonth ? "bg-white" : "bg-gray-50 text-gray-400"}
// //                 relative`}
// //             >
// //               <span>{format(day, "d")}</span>
// //               {hasNote && (
// //                 <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-purple-500" />
// //               )}
// //             </motion.button>
// //           );
// //         })}
// //       </div>

// //       <div className="bg-white rounded-xl shadow-lg p-6">
// //         <h2 className="text-xl font-semibold mb-2">{format(selectedDate, "PPPP")}</h2>
// //         <textarea
// //           value={noteText}
// //           onChange={(e) => setNoteText(e.target.value)}
// //           placeholder="Write your notes for this day..."
// //           rows={5}
// //           className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
// //         />
// //         <button
// //           onClick={handleSaveNote}
// //           className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
// //           disabled={loading}
// //         >
// //           {loading ? "Saving..." : "Save Note"}
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }





// "use client";

// import { useState, useEffect } from "react";
// import {
//   format,
//   isSameDay,
//   startOfMonth,
//   endOfMonth,
//   startOfWeek,
//   endOfWeek,
//   addDays,
//   addMonths,
//   subMonths,
// } from "date-fns";
// import { motion, AnimatePresence } from "framer-motion";
// import { onAuthStateChanged } from "firebase/auth";
// import { ref, onValue, set } from "firebase/database";
// import { auth, rtdb } from "@/lib/firebase";

// // Toast Component
// const Toast = ({ message, type, onClose }) => {
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       onClose();
//     }, 3000);
//     return () => clearTimeout(timer);
//   }, [onClose]);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -50, scale: 0.9 }}
//       animate={{ opacity: 1, y: 0, scale: 1 }}
//       exit={{ opacity: 0, y: -20, scale: 0.9 }}
//       className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
//         type === 'success' 
//           ? 'bg-green-500 text-white' 
//           : type === 'error' 
//           ? 'bg-red-500 text-white' 
//           : 'bg-blue-500 text-white'
//       }`}
//     >
//       <div className="flex items-center space-x-2">
//         <span>{message}</span>
//         <button
//           onClick={onClose}
//           className="ml-2 text-white hover:text-gray-200"
//         >
//           ×
//         </button>
//       </div>
//     </motion.div>
//   );
// };

// export default function DailyNotesCalendar() {
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [userId, setUserId] = useState(null);
//   const [noteText, setNoteText] = useState("");
//   const [notes, setNotes] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [toast, setToast] = useState(null);

//   // Get user ID
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setUserId(user ? user.uid : "guest");
//     });
//     return () => unsubscribe();
//   }, []);

//   // Load notes from Firebase
//   useEffect(() => {
//     if (!userId) return;

//     const notesRef = ref(rtdb, `notes/${userId}`);
//     onValue(notesRef, (snapshot) => {
//       const data = snapshot.val() || {};
//       setNotes(data);
//     });
//   }, [userId]);

//   // Set noteText when date is selected
//   useEffect(() => {
//     const dateKey = format(selectedDate, "yyyy-MM-dd");
//     setNoteText(notes[dateKey] || "");
//   }, [selectedDate, notes]);

//   const showToast = (message, type = 'success') => {
//     setToast({ message, type });
//   };

//   const hideToast = () => {
//     setToast(null);
//   };

//   const getCalendarDates = () => {
//     const start = startOfWeek(startOfMonth(currentMonth));
//     const end = endOfWeek(endOfMonth(currentMonth));
//     const days = [];
//     let day = start;
//     while (day <= end) {
//       days.push(day);
//       day = addDays(day, 1);
//     }
//     return days;
//   };

//   const handleSaveNote = async () => {
//     if (!userId) {
//       showToast("Please log in to save notes", "error");
//       return;
//     }

//     setLoading(true);
//     try {
//       const dateKey = format(selectedDate, "yyyy-MM-dd");
//       const noteRef = ref(rtdb, `notes/${userId}/${dateKey}`);
      
//       if (noteText.trim() === "") {
//         // If note is empty, remove it from Firebase
//         await set(noteRef, null);
//         showToast("Note deleted successfully", "success");
//       } else {
//         await set(noteRef, noteText);
//         showToast("Note saved successfully!", "success");
//       }
//     } catch (error) {
//       console.error("Error saving note:", error);
//       showToast("Failed to save note. Please try again.", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calendarDays = getCalendarDates();

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       {/* Toast Notifications */}
//       <AnimatePresence>
//         {toast && (
//           <Toast
//             message={toast.message}
//             type={toast.type}
//             onClose={hideToast}
//           />
//         )}
//       </AnimatePresence>

//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">Daily Notes Calendar</h1>
//         <div className="flex space-x-4 items-center">
//           <button 
//             onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
//             className="px-3 py-1 rounded hover:bg-gray-100"
//           >
//             ←
//           </button>
//           <span className="text-lg font-semibold">{format(currentMonth, "MMMM yyyy")}</span>
//           <button 
//             onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
//             className="px-3 py-1 rounded hover:bg-gray-100"
//           >
//             →
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-7 gap-1 mb-2 text-center text-gray-600 font-medium">
//         {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
//           <div key={d}>{d}</div>
//         ))}
//       </div>

//       <div className="grid grid-cols-7 gap-1 mb-6">
//         {calendarDays.map((day) => {
//           const isSelected = isSameDay(day, selectedDate);
//           const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
//           const dateKey = format(day, "yyyy-MM-dd");
//           const hasNote = notes[dateKey];

//           return (
//             <motion.button
//               key={day.toString()}
//               onClick={() => setSelectedDate(day)}
//               whileTap={{ scale: 0.95 }}
//               className={`h-14 w-full rounded-md text-sm p-1 
//                 ${isSelected ? "border-2 border-purple-500" : "border border-gray-200"}
//                 ${isCurrentMonth ? "bg-white hover:bg-gray-50" : "bg-gray-50 text-gray-400"}
//                 relative transition-colors`}
//             >
//               <span>{format(day, "d")}</span>
//               {hasNote && (
//                 <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-purple-500" />
//               )}
//             </motion.button>
//           );
//         })}
//       </div>

//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <h2 className="text-xl font-semibold mb-2">{format(selectedDate, "PPPP")}</h2>
//         <textarea
//           value={noteText}
//           onChange={(e) => setNoteText(e.target.value)}
//           placeholder="Write your notes for this day..."
//           rows={5}
//           className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
//         />
//         <button
//           onClick={handleSaveNote}
//           className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
//           disabled={loading}
//         >
//           {loading ? "Saving..." : "Save Note"}
//         </button>
//       </div>
//     </div>
//   );
// }


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
import { motion, AnimatePresence } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";
import { ref, onValue, set } from "firebase/database";
import { auth, rtdb } from "@/lib/firebase";
import { BookOpen, Calendar, Sparkles } from "lucide-react";
import JournalEntryOverlay from "./JournalEntryOverlay";

// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
        type === 'success' 
          ? 'bg-green-500 text-white' 
          : type === 'error' 
          ? 'bg-red-500 text-white' 
          : 'bg-blue-500 text-white'
      }`}
    >
      <div className="flex items-center space-x-2">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-white hover:text-gray-200"
        >
          ×
        </button>
      </div>
    </motion.div>
  );
};

// Journal Viewer Component
const JournalViewer = ({ date, journalEntry, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ y: 50, scale: 0.9, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 50, scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-xl">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Journal Entry</h2>
                <p className="text-purple-600 text-sm">{format(date, "PPPP")}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/80 text-gray-600 hover:text-gray-800 transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {journalEntry}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function DailyNotesCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [userId, setUserId] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState({});
  const [journals, setJournals] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showJournal, setShowJournal] = useState(false);
  const [showJournalViewer, setShowJournalViewer] = useState(false);

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

  // Load journals from Firebase
  useEffect(() => {
    if (!userId) return;

    const journalsRef = ref(rtdb, `journals/${userId}`);
    onValue(journalsRef, (snapshot) => {
      const data = snapshot.val() || {};
      // Convert journal data to date-based format
      const journalsByDate = {};
      Object.values(data).forEach(journal => {
        if (journal.createdAt) {
          const date = format(new Date(journal.createdAt), "yyyy-MM-dd");
          journalsByDate[date] = journal.entry;
        }
      });
      setJournals(journalsByDate);
    });
  }, [userId]);

  // Set noteText when date is selected
  useEffect(() => {
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    setNoteText(notes[dateKey] || "");
  }, [selectedDate, notes]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

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
    if (!userId) {
      showToast("Please log in to save notes", "error");
      return;
    }

    setLoading(true);
    try {
      const dateKey = format(selectedDate, "yyyy-MM-dd");
      const noteRef = ref(rtdb, `notes/${userId}/${dateKey}`);
      
      if (noteText.trim() === "") {
        await set(noteRef, null);
        showToast("Note deleted successfully", "success");
      } else {
        await set(noteRef, noteText);
        showToast("Note saved successfully!", "success");
      }
    } catch (error) {
      console.error("Error saving note:", error);
      showToast("Failed to save note. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenJournal = () => {
    setShowJournal(true);
  };

  const handleCloseJournal = () => {
    setShowJournal(false);
  };

  const handleViewJournal = () => {
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    const journalEntry = journals[dateKey];
    if (journalEntry) {
      setShowJournalViewer(true);
    } else {
      showToast("No journal entry found for this date", "error");
    }
  };

  const calendarDays = getCalendarDates();
  const selectedDateKey = format(selectedDate, "yyyy-MM-dd");
  const hasJournalEntry = journals[selectedDateKey];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={hideToast}
          />
        )}
      </AnimatePresence>

      {/* Journal Entry Overlay */}
      <AnimatePresence>
        {showJournal && (
          <JournalEntryOverlay onClose={handleCloseJournal} />
        )}
      </AnimatePresence>

      {/* Journal Viewer */}
      <AnimatePresence>
        {showJournalViewer && hasJournalEntry && (
          <JournalViewer
            date={selectedDate}
            journalEntry={hasJournalEntry}
            onClose={() => setShowJournalViewer(false)}
          />
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <Calendar className="w-8 h-8 text-purple-600" />
          Daily Notes Calendar
        </h1>
        <div className="flex space-x-4 items-center">
          <button 
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="px-3 py-1 rounded hover:bg-gray-100"
          >
            ←
          </button>
          <span className="text-lg font-semibold">{format(currentMonth, "MMMM yyyy")}</span>
          <button 
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="px-3 py-1 rounded hover:bg-gray-100"
          >
            →
          </button>
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
          const hasJournal = journals[dateKey];

          return (
            <motion.button
              key={day.toString()}
              onClick={() => setSelectedDate(day)}
              whileTap={{ scale: 0.95 }}
              className={`h-14 w-full rounded-md text-sm p-1 
                ${isSelected ? "border-2 border-purple-500" : "border border-gray-200"}
                ${isCurrentMonth ? "bg-white hover:bg-gray-50" : "bg-gray-50 text-gray-400"}
                relative transition-colors`}
            >
              <span>{format(day, "d")}</span>
              <div className="absolute bottom-1 right-1 flex gap-1">
                {hasNote && (
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                )}
                {hasJournal && (
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{format(selectedDate, "PPPP")}</h2>
          <div className="flex gap-2">
            {hasJournalEntry && (
              <motion.button
                onClick={handleViewJournal}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                View Journal
              </motion.button>
            )}
            <motion.button
              onClick={handleOpenJournal}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              New Journal
            </motion.button>
          </div>
        </div>

        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Write your notes for this day..."
          rows={5}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none mb-4"
        />
        
        <button
          onClick={handleSaveNote}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Note"}
        </button>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Legend:</p>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-gray-600">Has Notes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-gray-600">Has Journal Entry</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}