// // "use client";
// // import { useState } from 'react';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import { Smile, Frown, Meh, Heart, Zap } from 'lucide-react';

// // const moodOptions = [
// //   { id: 'happy', icon: <Smile className="w-8 h-8" />, label: 'Happy', color: 'bg-yellow-100' },
// //   { id: 'sad', icon: <Frown className="w-8 h-8" />, label: 'Sad', color: 'bg-blue-100' },
// //   { id: 'neutral', icon: <Meh className="w-8 h-8" />, label: 'Neutral', color: 'bg-gray-100' },
// //   { id: 'excited', icon: <Zap className="w-8 h-8" />, label: 'Excited', color: 'bg-orange-100' },
// //   { id: 'loved', icon: <Heart className="w-8 h-8" />, label: 'Loved', color: 'bg-pink-100' },
// // ];

// // export default function MoodInputCard() {
// //   const [selectedMood, setSelectedMood] = useState(null);
// //   const [journalText, setJournalText] = useState('');
// //   const [showJournal, setShowJournal] = useState(false);
// //   const [aiResponse, setAiResponse] = useState(null);
// //   const [isLoading, setIsLoading] = useState(false);

// //   const handleMoodSelect = (mood) => {
// //     setSelectedMood(mood);
// //     setShowJournal(false);
// //     setAiResponse(null);
// //   };

// //   const handleJournalSubmit = async () => {
// //     setIsLoading(true);
// //     try {
// //       // Call your AI API here
// //       const response = await fetch('/api/analyze-mood', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ text: journalText })
// //       });
// //       const data = await response.json();
// //       setAiResponse(data);
// //     } catch (error) {
// //       console.error('Error:', error);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   return (
// //     <motion.div 
// //       initial={{ opacity: 0, y: 20 }}
// //       animate={{ opacity: 1, y: 0 }}
// //       transition={{ duration: 0.5, delay: 0.2 }}
// //       className="bg-white rounded-2xl shadow-xl p-6"
// //     >
// //       <h2 className="text-xl font-semibold mb-4 text-gray-800">How are you feeling today?</h2>
      
// //       <div className="flex justify-center space-x-4 mb-6">
// //         {moodOptions.map((mood) => (
// //           <motion.button
// //             key={mood.id}
// //             whileHover={{ scale: 1.1 }}
// //             whileTap={{ scale: 0.9 }}
// //             onClick={() => handleMoodSelect(mood)}
// //             className={`flex flex-col items-center p-3 rounded-xl ${
// //               selectedMood?.id === mood.id ? `${mood.color} ring-2 ring-purple-500` : 'bg-gray-50'
// //             }`}
// //           >
// //             {mood.icon}
// //             <span className="text-sm mt-1">{mood.label}</span>
// //           </motion.button>
// //         ))}
// //       </div>

// //       <div className="text-center mb-4">
// //         <button 
// //           onClick={() => setShowJournal(!showJournal)}
// //           className="text-purple-600 hover:text-purple-800 text-sm font-medium"
// //         >
// //           {showJournal ? 'Choose mood instead' : 'Or journal your thoughts instead'}
// //         </button>
// //       </div>

// //       <AnimatePresence>
// //         {showJournal && (
// //           <motion.div
// //             initial={{ height: 0, opacity: 0 }}
// //             animate={{ height: 'auto', opacity: 1 }}
// //             exit={{ height: 0, opacity: 0 }}
// //             className="overflow-hidden"
// //           >
// //             <textarea
// //               value={journalText}
// //               onChange={(e) => setJournalText(e.target.value)}
// //               placeholder="Write how you're feeling today..."
// //               className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
// //               rows={4}
// //             />
// //             <button
// //               onClick={handleJournalSubmit}
// //               disabled={isLoading || !journalText.trim()}
// //               className="mt-3 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50"
// //             >
// //               {isLoading ? 'Analyzing...' : 'Get AI Recommendations'}
// //             </button>
// //           </motion.div>
// //         )}
// //       </AnimatePresence>

// //       <AnimatePresence>
// //         {aiResponse && (
// //           <motion.div
// //             initial={{ opacity: 0, y: 20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             className="mt-6 p-4 bg-purple-50 rounded-lg"
// //           >
// //             <h3 className="font-semibold text-purple-800 mb-2">AI Recommendation</h3>
// //             <p className="text-gray-700">{aiResponse.recommendation}</p>
// //             {aiResponse.type === 'exercise' && (
// //               <button className="mt-3 text-sm text-purple-600 hover:text-purple-800">
// //                 Start this exercise now
// //               </button>
// //             )}
// //           </motion.div>
// //         )}
// //       </AnimatePresence>
// //     </motion.div>
// //   );
// // }


// "use client";

// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Smile, Frown, Meh, Heart, Zap } from "lucide-react";

// const moodOptions = [
//   { id: "happy", icon: <Smile className="w-8 h-8" />, label: "Happy", color: "bg-yellow-100" },
//   { id: "sad", icon: <Frown className="w-8 h-8" />, label: "Sad", color: "bg-blue-100" },
//   { id: "neutral", icon: <Meh className="w-8 h-8" />, label: "Neutral", color: "bg-gray-100" },
//   { id: "excited", icon: <Zap className="w-8 h-8" />, label: "Excited", color: "bg-orange-100" },
//   { id: "loved", icon: <Heart className="w-8 h-8" />, label: "Loved", color: "bg-pink-100" },
// ];

// export default function MoodInputCard() {
//   const [selectedMood, setSelectedMood] = useState(null);
//   const [journalText, setJournalText] = useState("");
//   const [showJournal, setShowJournal] = useState(false);
//   const [aiResponse, setAiResponse] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleMoodSelect = (mood) => {
//     setSelectedMood(mood);
//     setShowJournal(false);
//     setAiResponse(null);
//   };

//   const handleJournalSubmit = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch("/api/analyze-mood", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ text: journalText })
//       });
//       const data = await response.json();
//       setAiResponse({
//         exercise: data.exercise,
//         song: data.song,
//         movie: data.movie,
//       });
//     } catch (error) {
//       console.error("Error:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5, delay: 0.2 }}
//       className="bg-white rounded-2xl shadow-xl p-6"
//     >
//       <h2 className="text-xl font-semibold mb-4 text-gray-800">How are you feeling today?</h2>

//       <div className="flex justify-center space-x-4 mb-6">
//         {moodOptions.map((mood) => (
//           <motion.button
//             key={mood.id}
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             onClick={() => handleMoodSelect(mood)}
//             className={`flex flex-col items-center p-3 rounded-xl ${
//               selectedMood?.id === mood.id ? `${mood.color} ring-2 ring-purple-500` : "bg-gray-50"
//             }`}
//           >
//             {mood.icon}
//             <span className="text-sm mt-1">{mood.label}</span>
//           </motion.button>
//         ))}
//       </div>

//       <div className="text-center mb-4">
//         <button
//           onClick={() => setShowJournal(!showJournal)}
//           className="text-purple-600 hover:text-purple-800 text-sm font-medium"
//         >
//           {showJournal ? "Choose mood instead" : "Or journal your thoughts instead"}
//         </button>
//       </div>

//       <AnimatePresence>
//         {showJournal && (
//           <motion.div
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: "auto", opacity: 1 }}
//             exit={{ height: 0, opacity: 0 }}
//             className="overflow-hidden"
//           >
//             <textarea
//               value={journalText}
//               onChange={(e) => setJournalText(e.target.value)}
//               placeholder="Write how you're feeling today..."
//               className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//               rows={4}
//             />
//             <button
//               onClick={handleJournalSubmit}
//               disabled={isLoading || !journalText.trim()}
//               className="mt-3 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50"
//             >
//               {isLoading ? "Analyzing..." : "Get AI Recommendations"}
//             </button>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <AnimatePresence>
//         {aiResponse && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="mt-6 p-4 bg-purple-50 rounded-lg"
//           >
//             <h3 className="font-semibold text-purple-800 mb-2">AI Recommendations</h3>

//             <div className="space-y-4">
//               {aiResponse.exercise && (
//                 <div className="bg-white p-3 rounded-lg shadow border">
//                   <h4 className="font-semibold text-purple-700">🧘 Exercise</h4>
//                   <p className="text-gray-700">{aiResponse.exercise.title}</p>
//                   <small className="text-gray-500">{aiResponse.exercise.duration} – {aiResponse.exercise.description}</small>
//                 </div>
//               )}
//               {aiResponse.song && (
//                 <div className="bg-white p-3 rounded-lg shadow border">
//                   <h4 className="font-semibold text-blue-700">🎵 Song</h4>
//                   <p className="text-gray-700">{aiResponse.song.title}</p>
//                   <small className="text-gray-500">{aiResponse.song.duration} – {aiResponse.song.description}</small>
//                 </div>
//               )}
//               {aiResponse.movie && (
//                 <div className="bg-white p-3 rounded-lg shadow border">
//                   <h4 className="font-semibold text-orange-700">🎬 Movie</h4>
//                   <p className="text-gray-700">{aiResponse.movie.title}</p>
//                   <small className="text-gray-500">{aiResponse.movie.duration} – {aiResponse.movie.description}</small>
//                 </div>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// }



// ✅ FIXED: MoodInputCard should pass userId to the API to save to Firebase per user and mood data.

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smile, Frown, Meh, Heart, Zap } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, rtdb } from "@/lib/firebase";
import { ref, push } from "firebase/database";

const moodOptions = [
  { id: "happy", icon: <Smile className="w-8 h-8" />, label: "Happy", color: "bg-yellow-100" },
  { id: "sad", icon: <Frown className="w-8 h-8" />, label: "Sad", color: "bg-blue-100" },
  { id: "neutral", icon: <Meh className="w-8 h-8" />, label: "Neutral", color: "bg-gray-100" },
  { id: "excited", icon: <Zap className="w-8 h-8" />, label: "Excited", color: "bg-orange-100" },
  { id: "loved", icon: <Heart className="w-8 h-8" />, label: "Loved", color: "bg-pink-100" },
];

export default function MoodInputCard() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [journalText, setJournalText] = useState("");
  const [showJournal, setShowJournal] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState("guest");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email) {
        const safeId = user.email.replace(/\W/g, "_");
        setUserId(safeId);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setShowJournal(false);
    setAiResponse(null);
  };

  const handleJournalSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/analyze-mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: journalText, userId }),
      });
      const data = await response.json();
      setAiResponse({
        exercise: data.exercise,
        song: data.song,
        movie: data.movie,
      });

      // Also push mood data for calendar view
      if (selectedMood) {
        const moodRef = ref(rtdb, `moods/${userId}`);
        await push(moodRef, {
          date: new Date().toISOString(),
          mood: selectedMood.id,
        });
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-2xl shadow-xl p-6"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800">How are you feeling today?</h2>

      <div className="flex justify-center space-x-4 mb-6">
        {moodOptions.map((mood) => (
          <motion.button
            key={mood.id}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleMoodSelect(mood)}
            className={`flex flex-col items-center p-3 rounded-xl ${
              selectedMood?.id === mood.id ? `${mood.color} ring-2 ring-purple-500` : "bg-gray-50"
            }`}
          >
            {mood.icon}
            <span className="text-sm mt-1">{mood.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="text-center mb-4">
        <button
          onClick={() => setShowJournal(!showJournal)}
          className="text-purple-600 hover:text-purple-800 text-sm font-medium"
        >
          {showJournal ? "Choose mood instead" : "Or journal your thoughts instead"}
        </button>
      </div>

      <AnimatePresence>
        {showJournal && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <textarea
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="Write how you're feeling today..."
              className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={4}
            />
            <button
              onClick={handleJournalSubmit}
              disabled={isLoading || !journalText.trim()}
              className="mt-3 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50"
            >
              {isLoading ? "Analyzing..." : "Get AI Recommendations"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {aiResponse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-purple-50 rounded-lg"
          >
            <h3 className="font-semibold text-purple-800 mb-2">AI Recommendations</h3>

            <div className="space-y-4">
              {aiResponse.exercise && (
                <div className="bg-white p-3 rounded-lg shadow border">
                  <h4 className="font-semibold text-purple-700">🧘 Exercise</h4>
                  <p className="text-gray-700">{aiResponse.exercise.title}</p>
                  <small className="text-gray-500">{aiResponse.exercise.duration} – {aiResponse.exercise.description}</small>
                </div>
              )}
              {aiResponse.song && (
                <div className="bg-white p-3 rounded-lg shadow border">
                  <h4 className="font-semibold text-blue-700">🎵 Song</h4>
                  <p className="text-gray-700">{aiResponse.song.title}</p>
                  <small className="text-gray-500">{aiResponse.song.duration} – {aiResponse.song.description}</small>
                </div>
              )}
              {aiResponse.movie && (
                <div className="bg-white p-3 rounded-lg shadow border">
                  <h4 className="font-semibold text-orange-700">🎬 Movie</h4>
                  <p className="text-gray-700">{aiResponse.movie.title}</p>
                  <small className="text-gray-500">{aiResponse.movie.duration} – {aiResponse.movie.description}</small>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
