// // "use client";

// // import { useEffect, useState } from "react";
// // import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
// // import { useAuth } from "@/context/AuthContext";
// // import { db } from "@/lib/firebase";
// // import { collection, getDocs } from "firebase/firestore";
// // import { format, parseISO } from "date-fns";
// // import { motion } from "framer-motion";

// // const moodColors = {
// //   Happy: "#facc15",
// //   Sad: "#60a5fa",
// //   Angry: "#f87171",
// //   Tired: "#a78bfa",
// //   Peaceful: "#34d399",
// //   Tearful: "#818cf8",
// // };

// // export default function MoodAnalysisChart() {
// //   const { currentUser } = useAuth();
// //   const [moodStats, setMoodStats] = useState([]);

// //   useEffect(() => {
// //     const fetchMoodStats = async () => {
// //       if (!currentUser) return;

// //       const moodRef = collection(db, "users", currentUser.uid, "moods");
// //       const snapshot = await getDocs(moodRef);
// //       const moodCount = {};

// //       snapshot.forEach((doc) => {
// //         const data = doc.data();
// //         const date = doc.id ? parseISO(doc.id) : new Date();
// //         const month = format(date, "MMM yyyy");
// //         const key = `${month}_${data.mood}`;

// //         moodCount[key] = (moodCount[key] || 0) + 1;
// //       });

// //       const grouped = {};
// //       Object.entries(moodCount).forEach(([key, count]) => {
// //         const [month, mood] = key.split("_");
// //         if (!grouped[month]) grouped[month] = {};
// //         grouped[month][mood] = count;
// //       });

// //       const chartData = Object.entries(grouped).map(([month, moods]) => ({
// //         month,
// //         ...moods,
// //       }));

// //       setMoodStats(chartData);
// //     };

// //     fetchMoodStats();
// //   }, [currentUser]);

// //   return (
// //     <motion.div
// //       initial={{ opacity: 0 }}
// //       animate={{ opacity: 1 }}
// //       className="w-full h-80"
// //     >
// //       {moodStats.length === 0 ? (
// //         <p className="text-gray-500">No mood data yet for this month.</p>
// //       ) : (
// //         <ResponsiveContainer width="100%" height="100%">
// //           <BarChart data={moodStats} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
// //             <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
// //             <XAxis dataKey="month" stroke="#6b7280" />
// //             <YAxis allowDecimals={false} stroke="#6b7280" />
// //             <Tooltip
// //               contentStyle={{
// //                 background: "#111827",
// //                 border: "1px solid #4b5563",
// //                 borderRadius: "8px",
// //                 color: "#fff",
// //               }}
// //             />
// //             {Object.keys(moodColors).map((mood) => (
// //               <Bar
// //                 key={mood}
// //                 dataKey={mood}
// //                 stackId="a"
// //                 fill={moodColors[mood]}
// //                 radius={[4, 4, 0, 0]}
// //               />
// //             ))}
// //           </BarChart>
// //         </ResponsiveContainer>
// //       )}
// //     </motion.div>
// //   );
// // }




// "use client";

// import { useEffect, useState } from "react";
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip,
//   ResponsiveContainer, CartesianGrid
// } from "recharts";
// import { useAuth } from "@/context/AuthContext";
// import { rtdb } from "@/lib/firebase";
// import { ref, get } from "firebase/database";
// import { parseISO, format, isValid } from "date-fns";
// import { motion } from "framer-motion";

// const moodColors = {
//   Happy: "#facc15",
//   Sad: "#60a5fa",
//   Angry: "#f87171",
//   Tired: "#a78bfa",
//   Peaceful: "#34d399",
//   Tearful: "#818cf8",
//   excited: "#f472b6" // ✅ support the "excited" mood
// };

// export default function MoodAnalysisChart() {
//   const { currentUser } = useAuth();
//   const [moodStats, setMoodStats] = useState([]);

//   useEffect(() => {
//     const fetchMoodStats = async () => {
//       if (!currentUser) return;

//       const moodRef = ref(rtdb, `moods/${currentUser.email.replace('.', '_')}`);
//       const snapshot = await get(moodRef);

//       if (!snapshot.exists()) {
//         setMoodStats([]);
//         return;
//       }

//       const data = snapshot.val(); // object of mood entries
//       const moodCount = {};

//       Object.values(data).forEach((entry) => {
//         const mood = entry.mood;
//         const rawDate = entry.date;
//         if (!mood || !rawDate) return;

//         let parsedDate;
//         try {
//           parsedDate = parseISO(rawDate);
//           if (!isValid(parsedDate)) throw new Error();
//         } catch {
//           parsedDate = new Date();
//         }

//         const month = format(parsedDate, "MMM yyyy");
//         const key = `${month}_${mood}`;
//         moodCount[key] = (moodCount[key] || 0) + 1;
//       });

//       const grouped = {};
//       Object.entries(moodCount).forEach(([key, count]) => {
//         const [month, mood] = key.split("_");
//         if (!grouped[month]) grouped[month] = {};
//         grouped[month][mood] = count;
//       });

//       const chartData = Object.entries(grouped).map(([month, moods]) => ({
//         month,
//         ...moods,
//       }));

//       setMoodStats(chartData);
//     };

//     fetchMoodStats();
//   }, [currentUser]);

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="w-full max-w-5xl mx-auto p-4 md:p-6 bg-white dark:bg-black/30 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10"
//     >
//       <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800 dark:text-white">
//         Mood Analysis Over Time 
//       </h2>

//       <div className="h-64 md:h-80">
//         {moodStats.length === 0 ? (
//           <p className="text-sm text-gray-500 dark:text-gray-400">
//             No mood data available.
//           </p>
//         ) : (
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={moodStats}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//               <XAxis dataKey="month" stroke="#6b7280" />
//               <YAxis allowDecimals={false} stroke="#6b7280" />
//               <Tooltip
//                 contentStyle={{
//                   background: "#111827",
//                   border: "1px solid #4b5563",
//                   borderRadius: "8px",
//                   color: "#fff",
//                 }}
//               />
//               {Object.keys(moodColors).map((mood) => (
//                 <Bar
//                   key={mood}
//                   dataKey={mood}
//                   stackId="a"
//                   fill={moodColors[mood]}
//                   radius={[4, 4, 0, 0]}
//                 />
//               ))}
//             </BarChart>
//           </ResponsiveContainer>
//         )}
//       </div>
//     </motion.div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";
import { useAuth } from "@/context/AuthContext";
import { rtdb } from "@/lib/firebase";
import { ref, get } from "firebase/database";
import { parseISO, format, isValid } from "date-fns";
import { motion } from "framer-motion";

const moodColors = {
  Happy: "#facc15",
  Sad: "#60a5fa",
  Angry: "#f87171",
  Tired: "#a78bfa",
  Peaceful: "#34d399",
  Tearful: "#818cf8",
  excited: "#f472b6",
  happy: "#facc15" // Add lowercase version
};

export default function MoodAnalysisChart() {
  const { currentUser } = useAuth();
  const [moodStats, setMoodStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoodStats = async () => {
      if (!currentUser?.email) {
        setLoading(false);
        return;
      }

      try {
        // Use Realtime Database with proper email sanitization
        const sanitizedEmail = currentUser.email.replace(/\./g, '_').replace('@', '_');
        const moodRef = ref(rtdb, `moods/${sanitizedEmail}`);
        
        console.log("Fetching from path:", `moods/${sanitizedEmail}`); // Debug log
        
        const snapshot = await get(moodRef);
        
        if (!snapshot.exists()) {
          console.log("No data found at path:", `moods/${sanitizedEmail}`); // Debug log
          setMoodStats([]);
          setLoading(false);
          return;
        }

        const data = snapshot.val();
        console.log("Raw data:", data); // Debug log
        
        const moodCount = {};

        Object.values(data).forEach((entry) => {
          const mood = entry.mood;
          const rawDate = entry.date;
          
          console.log("Processing entry:", entry); // Debug log
          
          if (!mood || !rawDate) return;

          let parsedDate;
          try {
            parsedDate = parseISO(rawDate);
            if (!isValid(parsedDate)) throw new Error();
          } catch {
            console.warn("Invalid date format:", rawDate);
            parsedDate = new Date();
          }

          const month = format(parsedDate, "MMM yyyy");
          const key = `${month}_${mood}`;
          moodCount[key] = (moodCount[key] || 0) + 1;
        });

        console.log("Mood count:", moodCount); // Debug log

        // Group by month
        const grouped = {};
        Object.entries(moodCount).forEach(([key, count]) => {
          const [month, mood] = key.split("_");
          if (!grouped[month]) grouped[month] = {};
          grouped[month][mood] = count;
        });

        // Convert to chart data format
        const chartData = Object.entries(grouped).map(([month, moods]) => ({
          month,
          ...moods,
        }));

        console.log("Chart data:", chartData); // Debug log
        setMoodStats(chartData);
      } catch (error) {
        console.error("Error fetching mood data:", error);
        setMoodStats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodStats();
  }, [currentUser]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-5xl mx-auto p-4 md:p-6 bg-white dark:bg-black/30 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10"
    >
      <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Mood Analysis Over Time 
      </h2>

      <div className="h-64 md:h-80">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Loading mood data...
            </p>
          </div>
        ) : moodStats.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No mood data available. Start logging your moods to see analysis!
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={moodStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                stroke="#6b7280" 
                fontSize={12}
                tick={{ fill: '#6b7280' }}
              />
              <YAxis 
                allowDecimals={false} 
                stroke="#6b7280" 
                fontSize={12}
                tick={{ fill: '#6b7280' }}
              />
              <Tooltip
                contentStyle={{
                  background: "#111827",
                  border: "1px solid #4b5563",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                labelStyle={{ color: "#fff" }}
              />
              {Object.keys(moodColors).map((mood) => (
                <Bar
                  key={mood}
                  dataKey={mood}
                  stackId="a"
                  fill={moodColors[mood]}
                  radius={[2, 2, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      
      {/* Debug info - remove in production */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
          <p>Debug: User email: {currentUser?.email}</p>
          <p>Debug: Sanitized: {currentUser?.email?.replace(/\./g, '_').replace('@', '_')}</p>
          <p>Debug: Stats count: {moodStats.length}</p>
        </div>
      )} */}
    </motion.div>
  );
}