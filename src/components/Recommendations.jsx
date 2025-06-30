// // // // "use client";

// // // // import { useState, useEffect } from "react";
// // // // import { onAuthStateChanged } from "firebase/auth";
// // // // import { rtdb, auth } from "@/lib/firebase";
// // // // import { ref, onValue } from "firebase/database";
// // // // import { Activity, Music, Film } from "lucide-react";
// // // // import { motion } from "framer-motion";

// // // // const getIcon = (type) => {
// // // //   switch (type) {
// // // //     case "exercise":
// // // //       return <Activity className="w-5 h-5 text-purple-600" />;
// // // //     case "song":
// // // //       return <Music className="w-5 h-5 text-blue-600" />;
// // // //     case "movie":
// // // //       return <Film className="w-5 h-5 text-orange-600" />;
// // // //     default:
// // // //       return null;
// // // //   }
// // // // };

// // // // export default function RecommendationsPage() {
// // // //   const [userId, setUserId] = useState("guest");
// // // //   const [history, setHistory] = useState([]);

// // // //   // 🔐 Detect Firebase Auth user
// // // //   useEffect(() => {
// // // //     const unsubscribe = onAuthStateChanged(auth, (user) => {
// // // //       if (user?.email) {
// // // //         const safeId = user.email.replace(/\W/g, "_");
// // // //         setUserId(safeId);
// // // //       }
// // // //     });
// // // //     return () => unsubscribe();
// // // //   }, []);

// // // //   // 📥 Fetch recommendation history
// // // //   useEffect(() => {
// // // //     const recRef = ref(rtdb, `recommendations/${userId}`);
// // // //     const unsubscribe = onValue(recRef, (snapshot) => {
// // // //       const val = snapshot.val();
// // // //       if (val) {
// // // //         const values = Object.values(val);
// // // //         const sorted = values.sort((a, b) => b.timestamp - a.timestamp);
// // // //         setHistory(sorted);
// // // //       } else {
// // // //         setHistory([]);
// // // //       }
// // // //     });

// // // //     return () => unsubscribe();
// // // //   }, [userId]);

// // // //   return (
// // // //     <motion.div
// // // //       initial={{ opacity: 0, y: 20 }}
// // // //       animate={{ opacity: 1, y: 0 }}
// // // //       transition={{ duration: 0.5, delay: 0.4 }}
// // // //       className="mb-8"
// // // //     >
// // // //       <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Past Recommendations</h2>

// // // //       {history.length === 0 ? (
// // // //         <p className="text-gray-500 text-sm">No recommendations found yet.</p>
// // // //       ) : (
// // // //         history.map((recGroup, index) => (
// // // //           <div key={index} className="mb-6">
// // // //             <p className="text-sm text-gray-400 mb-2">
// // // //               {new Date(recGroup.timestamp).toLocaleString()}
// // // //             </p>
// // // //             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// // // //               {["exercise", "song", "movie"].map((type) => (
// // // //                 <motion.div
// // // //                   key={type}
// // // //                   whileHover={{ y: -5 }}
// // // //                   className="bg-white rounded-xl shadow-md p-5 flex items-start"
// // // //                 >
// // // //                   <div className="p-2 rounded-full bg-opacity-20 mr-4">
// // // //                     {getIcon(type)}
// // // //                   </div>
// // // //                   <div>
// // // //                     <h3 className="font-medium text-gray-800">{recGroup[type]?.title}</h3>
// // // //                     <p className="text-sm text-gray-600 mt-1">{recGroup[type]?.description}</p>
// // // //                     <div className="flex justify-between items-center mt-3">
// // // //                       <span className="text-xs text-gray-500">{recGroup[type]?.duration}</span>
// // // //                       <span className="text-xs text-purple-600 font-medium">AI Recommended</span>
// // // //                     </div>
// // // //                   </div>
// // // //                 </motion.div>
// // // //               ))}
// // // //             </div>
// // // //           </div>
// // // //         ))
// // // //       )}
// // // //     </motion.div>
// // // //   );
// // // // }


  // "use client";

  // import { useState, useEffect } from "react";
  // import { onAuthStateChanged } from "firebase/auth";
  // import { rtdb, auth } from "@/lib/firebase";
  // import { ref, onValue } from "firebase/database";
  // import { Activity, Music, Film, ChevronRight, ChevronLeft } from "lucide-react";
  // import { motion } from "framer-motion";

  // const getIcon = (type) => {
  //   switch (type) {
  //     case "exercise":
  //       return <Activity className="w-5 h-5 text-purple-600" />;
  //     case "song":
  //       return <Music className="w-5 h-5 text-blue-600" />;
  //     case "movie":
  //       return <Film className="w-5 h-5 text-orange-600" />;
  //     default:
  //       return null;
  //   }
  // };

  // export default function RecommendationsPage() {
  //   const [userId, setUserId] = useState("guest");
  //   const [history, setHistory] = useState([]);
  //   const [currentIndex, setCurrentIndex] = useState(0);

  //   useEffect(() => {
  //     const unsubscribe = onAuthStateChanged(auth, (user) => {
  //       if (user?.email) {
  //         const safeId = user.email.replace(/\W/g, "_");
  //         setUserId(safeId);
  //       }
  //     });
  //     return () => unsubscribe();
  //   }, []);

  //   useEffect(() => {
  //     const recRef = ref(rtdb, `recommendations/${userId}`);
  //     const unsubscribe = onValue(recRef, (snapshot) => {
  //       const val = snapshot.val();
  //       if (val) {
  //         const values = Object.values(val);
  //         const sorted = values.sort((a, b) => b.timestamp - a.timestamp);
  //         setHistory(sorted);
  //       } else {
  //         setHistory([]);
  //       }
  //     });

  //     return () => unsubscribe();
  //   }, [userId]);

  //   const nextRecommendation = () => {
  //     setCurrentIndex((prev) => (prev + 1) % history.length);
  //   };

  //   const prevRecommendation = () => {
  //     setCurrentIndex((prev) => (prev - 1 + history.length) % history.length);
  //   };

  //   if (history.length === 0) {
  //     return (
  //       <div className="flex flex-col items-center justify-center h-64">
  //         <div className="bg-gray-50 rounded-xl p-6 text-center max-w-md">
  //           <p className="text-gray-600 font-medium">No recommendations yet</p>
  //           <p className="text-sm text-gray-400 mt-2">
  //             Your AI-generated recommendations will appear here
  //           </p>
  //         </div>
  //       </div>
  //     );
  //   }

  //   const currentRec = history[currentIndex];

  //   return (
  //     <div className="relative">
  //       <div className="flex justify-between items-center mb-4">
  //         <h2 className="text-xl font-semibold text-gray-800">Your Past Recommendations</h2>
  //         <div className="flex items-center space-x-2">
  //           <span className="text-sm text-gray-500">
  //             {currentIndex + 1} of {history.length}
  //           </span>
  //           <button
  //             onClick={prevRecommendation}
  //             className="p-1 rounded-full hover:bg-gray-100"
  //             disabled={history.length <= 1}
  //           >
  //             <ChevronLeft className="w-5 h-5 text-gray-500" />
  //           </button>
  //           <button
  //             onClick={nextRecommendation}
  //             className="p-1 rounded-full hover:bg-gray-100"
  //             disabled={history.length <= 1}
  //           >
  //             <ChevronRight className="w-5 h-5 text-gray-500" />
  //           </button>
  //         </div>
  //       </div>

  //       <motion.div
  //         key={currentIndex}
  //         initial={{ opacity: 0, x: 20 }}
  //         animate={{ opacity: 1, x: 0 }}
  //         exit={{ opacity: 0, x: -20 }}
  //         transition={{ duration: 0.3 }}
  //         className="bg-white rounded-xl shadow-sm p-5"
  //       >
  //         <div className="flex items-center justify-between mb-4">
  //           <p className="text-sm text-gray-500">
  //             {new Date(currentRec.timestamp).toLocaleString()}
  //           </p>
  //         </div>

  //         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  //           {["exercise", "song", "movie"].map((type) => (
  //             <div
  //               key={type}
  //               className="border rounded-lg p-4 hover:shadow-md transition-shadow"
  //             >
  //               <div className="flex items-start">
  //                 <div className="p-2 rounded-lg bg-gray-50 mr-3">
  //                   {getIcon(type)}
  //                 </div>
  //                 <div>
  //                   <h3 className="font-medium text-gray-800 line-clamp-1">
  //                     {currentRec[type]?.title || "No title"}
  //                   </h3>
  //                   <p className="text-sm text-gray-600 mt-1 line-clamp-2">
  //                     {currentRec[type]?.description || "No description"}
  //                   </p>
  //                   <div className="flex justify-between items-center mt-3">
  //                     <span className="text-xs text-gray-500">
  //                       {currentRec[type]?.duration || "No duration"}
  //                     </span>
  //                     <span className="text-xs text-purple-600 font-medium">
  //                       AI Recommended
  //                     </span>
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           ))}
  //         </div>
  //       </motion.div>

  //       <div className="flex justify-center mt-4">
  //         <div className="flex space-x-2">
  //           {history.map((_, index) => (
  //             <button
  //               key={index}
  //               onClick={() => setCurrentIndex(index)}
  //               className={`w-2 h-2 rounded-full ${
  //                 index === currentIndex ? "bg-purple-600" : "bg-gray-300"
  //               }`}
  //             />
  //           ))}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }



// "use client";

// import { useState, useEffect } from "react";
// import { onAuthStateChanged } from "firebase/auth";
// import { rtdb, auth } from "@/lib/firebase";
// import { ref, onValue } from "firebase/database";
// import { Activity, Music, Film, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
// import { motion } from "framer-motion";

// const getIcon = (type) => {
//   switch (type) {
//     case "exercise":
//       return Activity;
//     case "song":
//       return Music;
//     case "movie":
//       return Film;
//     default:
//       return Activity;
//   }
// };

// const getGradient = (type) => {
//   switch (type) {
//     case "exercise":
//       return "from-green-400 to-emerald-300";
//     case "song":
//       return "from-blue-400 to-cyan-300";
//     case "movie":
//       return "from-pink-400 to-rose-300";
//     default:
//       return "from-purple-400 to-indigo-300";
//   }
// };

// export default function RecommendationsPage() {
//   const [userId, setUserId] = useState("guest");
//   const [history, setHistory] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user?.email) {
//         const safeId = user.email.replace(/\W/g, "_");
//         setUserId(safeId);
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     const recRef = ref(rtdb, `recommendations/${userId}`);
//     const unsubscribe = onValue(recRef, (snapshot) => {
//       const val = snapshot.val();
//       if (val) {
//         const values = Object.values(val);
//         const sorted = values.sort((a, b) => b.timestamp - a.timestamp);
//         setHistory(sorted);
//       } else {
//         setHistory([]);
//       }
//     });

//     return () => unsubscribe();
//   }, [userId]);

//   const nextRecommendation = () => {
//     setCurrentIndex((prev) => (prev + 1) % history.length);
//   };

//   const prevRecommendation = () => {
//     setCurrentIndex((prev) => (prev - 1 + history.length) % history.length);
//   };

//   if (history.length === 0) {
//     return (
//       <motion.div 
//         className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.3 }}
//       >
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-xl font-semibold text-gray-800">AI Recommendations</h3>
//           <Sparkles className="w-6 h-6 text-purple-500" />
//         </div>
//         <div className="flex flex-col items-center justify-center h-64">
//           <div className="bg-gray-50 rounded-xl p-6 text-center max-w-md">
//             <p className="text-gray-600 font-medium">No recommendations yet</p>
//             <p className="text-sm text-gray-400 mt-2">
//               Your AI-generated recommendations will appear here
//             </p>
//           </div>
//         </div>
//       </motion.div>
//     );
//   }

//   const currentRec = history[currentIndex];

//   return (
//     <div className="relative">
//       <motion.div 
//         className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.3 }}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-xl font-semibold text-gray-800">AI Recommendations</h3>
//           <div className="flex items-center space-x-3">
//             <Sparkles className="w-6 h-6 text-purple-500" />
//             <div className="flex items-center space-x-2">
//               <span className="text-sm text-gray-500">
//                 {currentIndex + 1} of {history.length}
//               </span>
//               <button
//                 onClick={prevRecommendation}
//                 className="p-1 rounded-full hover:bg-gray-100 transition-colors"
//                 disabled={history.length <= 1}
//               >
//                 <ChevronLeft className="w-5 h-5 text-gray-500" />
//               </button>
//               <button
//                 onClick={nextRecommendation}
//                 className="p-1 rounded-full hover:bg-gray-100 transition-colors"
//                 disabled={history.length <= 1}
//               >
//                 <ChevronRight className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Timestamp */}
//         <div className="mb-4">
//           <p className="text-sm text-gray-500">
//             {new Date(currentRec.timestamp).toLocaleString()}
//           </p>
//         </div>

//         {/* Recommendations Grid */}
//         <motion.div
//           key={currentIndex}
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           exit={{ opacity: 0, x: -20 }}
//           transition={{ duration: 0.3 }}
//           className="grid grid-cols-1 md:grid-cols-3 gap-4"
//         >
//           {["exercise", "song", "movie"].map((type) => {
//             const IconComponent = getIcon(type);
//             const recommendation = currentRec[type];
            
//             return (
//               <motion.div
//                 key={type}
//                 className={`p-4 rounded-xl bg-gradient-to-br ${getGradient(type)} text-white cursor-pointer`}
//                 whileHover={{ scale: 1.02, y: -2 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 <IconComponent className="w-8 h-8 mb-3" />
//                 <h4 className="font-semibold mb-1 line-clamp-1">
//                   {recommendation?.title || "No title"}
//                 </h4>
//                 <p className="text-sm opacity-90 mb-3 line-clamp-2">
//                   {recommendation?.description || "No description"}
//                 </p>
//                 <div className="flex justify-between items-center">
//                   <span className="text-xs opacity-75">
//                     {recommendation?.duration || "No duration"}
//                   </span>
//                   <span className="text-xs font-medium bg-opacity-20 px-2 py-1 rounded-full">
//                     AI Recommended
//                   </span>
//                 </div>
//               </motion.div>
//             );
//           })}
//         </motion.div>

//         {/* Dots Indicator */}
//         <div className="flex justify-center mt-6">
//           <div className="flex space-x-2">
//             {history.map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => setCurrentIndex(index)}
//                 className={`w-2 h-2 rounded-full transition-colors ${
//                   index === currentIndex ? "bg-purple-600" : "bg-gray-300"
//                 }`}
//               />
//             ))}
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// }




"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { rtdb, auth } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { Activity, Music, Film, ChevronRight, ChevronLeft, Sparkles, Clock, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const getIcon = (type) => {
  switch (type) {
    case "exercise":
      return <Activity className="w-6 h-6 text-emerald-500" />;
    case "song":
      return <Music className="w-6 h-6 text-violet-500" />;
    case "movie":
      return <Film className="w-6 h-6 text-amber-500" />;
    default:
      return null;
  }
};

const getGradient = (type) => {
  switch (type) {
    case "exercise":
      return "from-emerald-50 to-teal-50 border-emerald-200";
    case "song":
      return "from-violet-50 to-purple-50 border-violet-200";
    case "movie":
      return "from-amber-50 to-orange-50 border-amber-200";
    default:
      return "from-gray-50 to-gray-100 border-gray-200";
  }
};

export default function RecommendationsPage() {
  const [userId, setUserId] = useState(null);
  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email) {
        const safeId = user.email.replace(/\W/g, "_");
        setUserId(safeId);
      } else {
        setUserId("guest");
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const recRef = ref(rtdb, `recommendations/${userId}`);
    const unsubscribe = onValue(recRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        // Convert object to array while preserving Firebase keys
        const entries = Object.entries(val).map(([key, value]) => ({
          id: key,
          ...value,
          timestamp: Number(value.timestamp) // Ensure timestamp is a number
        }));
        
        const sorted = entries.sort((a, b) => b.timestamp - a.timestamp);
        setHistory(sorted);
        
        // Reset to first item when new data loads
        if (sorted.length > 0 && currentIndex >= sorted.length) {
          setCurrentIndex(0);
        }
      } else {
        setHistory([]);
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Firebase read error:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const nextRecommendation = () => {
    setCurrentIndex((prev) => (prev + 1) % history.length);
  };

  const prevRecommendation = () => {
    setCurrentIndex((prev) => (prev - 1 + history.length) % history.length);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-gray-600">Loading your recommendations...</p>
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-2xl blur-xl opacity-20"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center max-w-md border border-white/20 shadow-xl">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No recommendations yet</h3>
            <p className="text-gray-600 leading-relaxed">
              Your AI-curated recommendations will appear here like magic ✨
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentRec = history[currentIndex];

  return (
    
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Your AI Recommendations
            </h1>
            <p className="text-gray-600 mt-2">Curated just for you</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                {currentIndex + 1} of {history.length}
              </span>
            </div>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={prevRecommendation}
                className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm border border-white/20 hover:bg-white/90 transition-all duration-200 flex items-center justify-center group disabled:opacity-50"
                disabled={history.length <= 1}
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
              </button>
              <button
                onClick={nextRecommendation}
                className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm border border-white/20 hover:bg-white/90 transition-all duration-200 flex items-center justify-center group disabled:opacity-50"
                disabled={history.length <= 1}
              >
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <motion.div
          key={currentRec.id} // Use the Firebase ID as key for proper animations
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-600/10 rounded-3xl blur-2xl"></div>
          <div className="relative bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl">
            
            {/* Timestamp */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {new Date(currentRec.timestamp).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center space-x-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                <Sparkles className="w-3 h-3" />
                <span>AI Curated</span>
              </div>
            </div>

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {["exercise", "song", "movie"].map((type) => (
                <div
                  key={type}
                  className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${getGradient(type)} border-2 hover:scale-[1.02] transition-all duration-300 cursor-pointer`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative p-6">
                    {/* Icon */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg">
                        {getIcon(type)}
                      </div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {type}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <h3 className="font-bold text-gray-800 text-lg leading-tight">
                        {currentRec[type]?.title || "No title"}
                      </h3>
                      
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                        {currentRec[type]?.description || "No description"}
                      </p>
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-1 text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span className="text-xs font-medium">
                            {currentRec[type]?.duration || "No duration"}
                          </span>
                        </div>
                        
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
            {history.map((rec, index) => (
              <button
                key={rec.id}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 scale-110" 
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
   
  );
}