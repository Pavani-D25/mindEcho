// // // "use client";
// // // import { useState } from 'react';
// // // import { motion, AnimatePresence } from 'framer-motion';
// // // import { Smile, Frown, Meh, Heart, Zap } from 'lucide-react';

// // // const moodOptions = [
// // //   { id: 'happy', icon: <Smile className="w-8 h-8" />, label: 'Happy', color: 'bg-yellow-100' },
// // //   { id: 'sad', icon: <Frown className="w-8 h-8" />, label: 'Sad', color: 'bg-blue-100' },
// // //   { id: 'neutral', icon: <Meh className="w-8 h-8" />, label: 'Neutral', color: 'bg-gray-100' },
// // //   { id: 'excited', icon: <Zap className="w-8 h-8" />, label: 'Excited', color: 'bg-orange-100' },
// // //   { id: 'loved', icon: <Heart className="w-8 h-8" />, label: 'Loved', color: 'bg-pink-100' },
// // // ];

// // // export default function MoodInputCard() {
// // //   const [selectedMood, setSelectedMood] = useState(null);
// // //   const [journalText, setJournalText] = useState('');
// // //   const [showJournal, setShowJournal] = useState(false);
// // //   const [aiResponse, setAiResponse] = useState(null);
// // //   const [isLoading, setIsLoading] = useState(false);

// // //   const handleMoodSelect = (mood) => {
// // //     setSelectedMood(mood);
// // //     setShowJournal(false);
// // //     setAiResponse(null);
// // //   };

// // //   const handleJournalSubmit = async () => {
// // //     setIsLoading(true);
// // //     try {
// // //       // Call your AI API here
// // //       const response = await fetch('/api/analyze-mood', {
// // //         method: 'POST',
// // //         headers: { 'Content-Type': 'application/json' },
// // //         body: JSON.stringify({ text: journalText })
// // //       });
// // //       const data = await response.json();
// // //       setAiResponse(data);
// // //     } catch (error) {
// // //       console.error('Error:', error);
// // //     } finally {
// // //       setIsLoading(false);
// // //     }
// // //   };

// // //   return (
// // //     <motion.div 
// // //       initial={{ opacity: 0, y: 20 }}
// // //       animate={{ opacity: 1, y: 0 }}
// // //       transition={{ duration: 0.5, delay: 0.2 }}
// // //       className="bg-white rounded-2xl shadow-xl p-6"
// // //     >
// // //       <h2 className="text-xl font-semibold mb-4 text-gray-800">How are you feeling today?</h2>
      
// // //       <div className="flex justify-center space-x-4 mb-6">
// // //         {moodOptions.map((mood) => (
// // //           <motion.button
// // //             key={mood.id}
// // //             whileHover={{ scale: 1.1 }}
// // //             whileTap={{ scale: 0.9 }}
// // //             onClick={() => handleMoodSelect(mood)}
// // //             className={`flex flex-col items-center p-3 rounded-xl ${
// // //               selectedMood?.id === mood.id ? `${mood.color} ring-2 ring-purple-500` : 'bg-gray-50'
// // //             }`}
// // //           >
// // //             {mood.icon}
// // //             <span className="text-sm mt-1">{mood.label}</span>
// // //           </motion.button>
// // //         ))}
// // //       </div>

// // //       <div className="text-center mb-4">
// // //         <button 
// // //           onClick={() => setShowJournal(!showJournal)}
// // //           className="text-purple-600 hover:text-purple-800 text-sm font-medium"
// // //         >
// // //           {showJournal ? 'Choose mood instead' : 'Or journal your thoughts instead'}
// // //         </button>
// // //       </div>

// // //       <AnimatePresence>
// // //         {showJournal && (
// // //           <motion.div
// // //             initial={{ height: 0, opacity: 0 }}
// // //             animate={{ height: 'auto', opacity: 1 }}
// // //             exit={{ height: 0, opacity: 0 }}
// // //             className="overflow-hidden"
// // //           >
// // //             <textarea
// // //               value={journalText}
// // //               onChange={(e) => setJournalText(e.target.value)}
// // //               placeholder="Write how you're feeling today..."
// // //               className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
// // //               rows={4}
// // //             />
// // //             <button
// // //               onClick={handleJournalSubmit}
// // //               disabled={isLoading || !journalText.trim()}
// // //               className="mt-3 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50"
// // //             >
// // //               {isLoading ? 'Analyzing...' : 'Get AI Recommendations'}
// // //             </button>
// // //           </motion.div>
// // //         )}
// // //       </AnimatePresence>

// // //       <AnimatePresence>
// // //         {aiResponse && (
// // //           <motion.div
// // //             initial={{ opacity: 0, y: 20 }}
// // //             animate={{ opacity: 1, y: 0 }}
// // //             className="mt-6 p-4 bg-purple-50 rounded-lg"
// // //           >
// // //             <h3 className="font-semibold text-purple-800 mb-2">AI Recommendation</h3>
// // //             <p className="text-gray-700">{aiResponse.recommendation}</p>
// // //             {aiResponse.type === 'exercise' && (
// // //               <button className="mt-3 text-sm text-purple-600 hover:text-purple-800">
// // //                 Start this exercise now
// // //               </button>
// // //             )}
// // //           </motion.div>
// // //         )}
// // //       </AnimatePresence>
// // //     </motion.div>
// // //   );
// // // }


// // "use client";

// // import { useState } from "react";
// // import { motion, AnimatePresence } from "framer-motion";
// // import { Smile, Frown, Meh, Heart, Zap } from "lucide-react";

// // const moodOptions = [
// //   { id: "happy", icon: <Smile className="w-8 h-8" />, label: "Happy", color: "bg-yellow-100" },
// //   { id: "sad", icon: <Frown className="w-8 h-8" />, label: "Sad", color: "bg-blue-100" },
// //   { id: "neutral", icon: <Meh className="w-8 h-8" />, label: "Neutral", color: "bg-gray-100" },
// //   { id: "excited", icon: <Zap className="w-8 h-8" />, label: "Excited", color: "bg-orange-100" },
// //   { id: "loved", icon: <Heart className="w-8 h-8" />, label: "Loved", color: "bg-pink-100" },
// // ];

// // export default function MoodInputCard() {
// //   const [selectedMood, setSelectedMood] = useState(null);
// //   const [journalText, setJournalText] = useState("");
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
// //       const response = await fetch("/api/analyze-mood", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ text: journalText })
// //       });
// //       const data = await response.json();
// //       setAiResponse({
// //         exercise: data.exercise,
// //         song: data.song,
// //         movie: data.movie,
// //       });
// //     } catch (error) {
// //       console.error("Error:", error);
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
// //               selectedMood?.id === mood.id ? `${mood.color} ring-2 ring-purple-500` : "bg-gray-50"
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
// //           {showJournal ? "Choose mood instead" : "Or journal your thoughts instead"}
// //         </button>
// //       </div>

// //       <AnimatePresence>
// //         {showJournal && (
// //           <motion.div
// //             initial={{ height: 0, opacity: 0 }}
// //             animate={{ height: "auto", opacity: 1 }}
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
// //               {isLoading ? "Analyzing..." : "Get AI Recommendations"}
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
// //             <h3 className="font-semibold text-purple-800 mb-2">AI Recommendations</h3>

// //             <div className="space-y-4">
// //               {aiResponse.exercise && (
// //                 <div className="bg-white p-3 rounded-lg shadow border">
// //                   <h4 className="font-semibold text-purple-700">🧘 Exercise</h4>
// //                   <p className="text-gray-700">{aiResponse.exercise.title}</p>
// //                   <small className="text-gray-500">{aiResponse.exercise.duration} – {aiResponse.exercise.description}</small>
// //                 </div>
// //               )}
// //               {aiResponse.song && (
// //                 <div className="bg-white p-3 rounded-lg shadow border">
// //                   <h4 className="font-semibold text-blue-700">🎵 Song</h4>
// //                   <p className="text-gray-700">{aiResponse.song.title}</p>
// //                   <small className="text-gray-500">{aiResponse.song.duration} – {aiResponse.song.description}</small>
// //                 </div>
// //               )}
// //               {aiResponse.movie && (
// //                 <div className="bg-white p-3 rounded-lg shadow border">
// //                   <h4 className="font-semibold text-orange-700">🎬 Movie</h4>
// //                   <p className="text-gray-700">{aiResponse.movie.title}</p>
// //                   <small className="text-gray-500">{aiResponse.movie.duration} – {aiResponse.movie.description}</small>
// //                 </div>
// //               )}
// //             </div>
// //           </motion.div>
// //         )}
// //       </AnimatePresence>
// //     </motion.div>
// //   );
// // }



// // ✅ FIXED: MoodInputCard should pass userId to the API to save to Firebase per user and mood data.

// "use client";

// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Smile, Frown, Meh, Heart, Zap } from "lucide-react";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth, rtdb } from "@/lib/firebase";
// import { ref, push } from "firebase/database";

// const moodOptions = [
//   { id: "happy", icon: "😁", label: "Happy", color: "bg-yellow-100" },
//   { id: "sad", icon: "😟", label: "Sad", color: "bg-blue-100" },
//   { id: "neutral", icon: "😑", label: "Neutral", color: "bg-gray-100" },
//   { id: "excited", icon: "😎", label: "Excited", color: "bg-orange-100" },
//   { id: "loved", icon: "😍", label: "Loved", color: "bg-pink-100" },
// ];

// export default function MoodInputCard() {
//   const [selectedMood, setSelectedMood] = useState(null);
//   const [journalText, setJournalText] = useState("");
//   const [showJournal, setShowJournal] = useState(false);
//   const [aiResponse, setAiResponse] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [userId, setUserId] = useState("guest");

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user?.email) {
//         const safeId = user.email.replace(/\W/g, "_");
//         setUserId(safeId);
//       }
//     });
//     return () => unsubscribe();
//   }, []);

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
//         body: JSON.stringify({ text: journalText, userId }),
//       });
//       const data = await response.json();
//       setAiResponse({
//         exercise: data.exercise,
//         song: data.song,
//         movie: data.movie,
//       });

//       // Also push mood data for calendar view
//       if (selectedMood) {
//         const moodRef = ref(rtdb, `moods/${userId}`);
//         await push(moodRef, {
//           date: new Date().toISOString(),
//           mood: selectedMood.id,
//         });
//       }
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

//       <div className="text-center mb-24">
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


"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smile, Frown, Meh, Heart, Zap } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, rtdb } from "@/lib/firebase";
import { ref, push } from "firebase/database";

const moodOptions = [
  { id: "happy", icon: "😁", label: "Happy", color: "from-yellow-400 to-amber-300" },
  { id: "sad", icon: "😟", label: "Sad", color: "from-blue-400 to-indigo-300" },
  { id: "neutral", icon: "😑", label: "Neutral", color: "from-gray-400 to-slate-300" },
  { id: "excited", icon: "😎", label: "Excited", color: "from-orange-400 to-amber-300" },
  { id: "loved", icon: "😍", label: "Loved", color: "from-pink-400 to-rose-300" },
];

export default function MoodInputCard() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [journalText, setJournalText] = useState("");
  const [showJournal, setShowJournal] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState("guest");
  const [activeTab, setActiveTab] = useState("mood");

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
      className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-700"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-black">
          Emotion Sync
        </h2> 
        <div className="flex space-x-1 bg-gray-800 p-1 rounded-full">
          <button
            onClick={() => setActiveTab("mood")}
            className={`px-3 py-1 text-sm rounded-full transition-all ${
              activeTab === "mood" ? "bg-purple-600 text-white" : "text-gray-400"
            }`}
          >
            Mood
          </button>
          <button
            onClick={() => setActiveTab("journal")}
            className={`px-3 py-1 text-sm rounded-full transition-all ${
              activeTab === "journal" ? "bg-purple-600 text-white" : "text-gray-400"
            }`}
          >
            Journal
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "mood" ? (
          <motion.div
            key="mood"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-5 gap-3 mb-8">
              {moodOptions.map((mood) => (
                <motion.button
                  key={mood.id}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleMoodSelect(mood)}
                  className={`flex flex-col items-center p-4 rounded-xl transition-all ${
                    selectedMood?.id === mood.id
                      ? `bg-gradient-to-br ${mood.color} shadow-lg`
                      : "bg-gray-800 hover:bg-gray-700"
                  }`}
                >
                  <span className="text-2xl mb-1">{mood.icon}</span>
                  <span className="text-xs font-medium text-gray-300">{mood.label}</span>
                </motion.button>
              ))}
            </div>

            {selectedMood && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4"
              >
                <button
                  onClick={() => {
                    setShowJournal(false);
                    handleJournalSubmit();
                  }}
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl font-medium text-white flex items-center justify-center space-x-2 hover:shadow-purple-500/20 hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Analyzing</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      <span>Get Recommendations</span>
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="journal"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative mb-4">
              <textarea
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                placeholder="Express your thoughts..."
                className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-200 placeholder-gray-500"
                rows={5}
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                {journalText.length}/500
              </div>
            </div>
            <button
              onClick={handleJournalSubmit}
              disabled={isLoading || !journalText.trim()}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl font-medium text-white flex items-center justify-center space-x-2 hover:shadow-purple-500/20 hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Analyzing Emotions</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>Generate AI Insights</span>
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {aiResponse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 mb-4">
              Your NeuroSync Recommendations
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aiResponse.exercise && (
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-purple-500 transition-all"
                >
                  <div className="flex items-center mb-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-400 mr-3">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-purple-300">Activity</h4>
                  </div>
                  <h5 className="text-white font-medium mb-1">{aiResponse.exercise.title}</h5>
                  <p className="text-gray-400 text-sm mb-2">{aiResponse.exercise.description}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{aiResponse.exercise.duration}</span>
                    <span className="text-purple-400">AI Optimized</span>
                  </div>
                </motion.div>
              )}

              {aiResponse.song && (
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-blue-500 transition-all"
                >
                  <div className="flex items-center mb-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-400 mr-3">
                      <Music className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-blue-300">Soundtrack</h4>
                  </div>
                  <h5 className="text-white font-medium mb-1">{aiResponse.song.title}</h5>
                  <p className="text-gray-400 text-sm mb-2">{aiResponse.song.description}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{aiResponse.song.duration}</span>
                    <span className="text-blue-400">AI Selected</span>
                  </div>
                </motion.div>
              )}

              {aiResponse.movie && (
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-orange-500 transition-all"
                >
                  <div className="flex items-center mb-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 mr-3">
                      <Film className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-orange-300">Visual</h4>
                  </div>
                  <h5 className="text-white font-medium mb-1">{aiResponse.movie.title}</h5>
                  <p className="text-gray-400 text-sm mb-2">{aiResponse.movie.description}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{aiResponse.movie.duration}</span>
                    <span className="text-orange-400">AI Curated</span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}