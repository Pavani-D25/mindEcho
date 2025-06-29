// "use client";

// import { useState, useEffect } from "react";
// import { onAuthStateChanged } from "firebase/auth";
// import { rtdb, auth } from "@/lib/firebase";
// import { ref, onValue } from "firebase/database";
// import { Activity, Music, Film } from "lucide-react";
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

//   // 🔐 Detect Firebase Auth user
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user?.email) {
//         const safeId = user.email.replace(/\W/g, "_");
//         setUserId(safeId);
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   // 📥 Fetch recommendation history
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

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5, delay: 0.4 }}
//       className="mb-8"
//     >
//       <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Past Recommendations</h2>

//       {history.length === 0 ? (
//         <p className="text-gray-500 text-sm">No recommendations found yet.</p>
//       ) : (
//         history.map((recGroup, index) => (
//           <div key={index} className="mb-6">
//             <p className="text-sm text-gray-400 mb-2">
//               {new Date(recGroup.timestamp).toLocaleString()}
//             </p>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {["exercise", "song", "movie"].map((type) => (
//                 <motion.div
//                   key={type}
//                   whileHover={{ y: -5 }}
//                   className="bg-white rounded-xl shadow-md p-5 flex items-start"
//                 >
//                   <div className="p-2 rounded-full bg-opacity-20 mr-4">
//                     {getIcon(type)}
//                   </div>
//                   <div>
//                     <h3 className="font-medium text-gray-800">{recGroup[type]?.title}</h3>
//                     <p className="text-sm text-gray-600 mt-1">{recGroup[type]?.description}</p>
//                     <div className="flex justify-between items-center mt-3">
//                       <span className="text-xs text-gray-500">{recGroup[type]?.duration}</span>
//                       <span className="text-xs text-purple-600 font-medium">AI Recommended</span>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         ))
//       )}
//     </motion.div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { rtdb, auth } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { Activity, Music, Film, ChevronRight, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

const getIcon = (type) => {
  switch (type) {
    case "exercise":
      return <Activity className="w-5 h-5 text-purple-600" />;
    case "song":
      return <Music className="w-5 h-5 text-blue-600" />;
    case "movie":
      return <Film className="w-5 h-5 text-orange-600" />;
    default:
      return null;
  }
};

export default function RecommendationsPage() {
  const [userId, setUserId] = useState("guest");
  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email) {
        const safeId = user.email.replace(/\W/g, "_");
        setUserId(safeId);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const recRef = ref(rtdb, `recommendations/${userId}`);
    const unsubscribe = onValue(recRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        const values = Object.values(val);
        const sorted = values.sort((a, b) => b.timestamp - a.timestamp);
        setHistory(sorted);
      } else {
        setHistory([]);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  const nextRecommendation = () => {
    setCurrentIndex((prev) => (prev + 1) % history.length);
  };

  const prevRecommendation = () => {
    setCurrentIndex((prev) => (prev - 1 + history.length) % history.length);
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="bg-gray-50 rounded-xl p-6 text-center max-w-md">
          <p className="text-gray-600 font-medium">No recommendations yet</p>
          <p className="text-sm text-gray-400 mt-2">
            Your AI-generated recommendations will appear here
          </p>
        </div>
      </div>
    );
  }

  const currentRec = history[currentIndex];

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Your Past Recommendations</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {currentIndex + 1} of {history.length}
          </span>
          <button
            onClick={prevRecommendation}
            className="p-1 rounded-full hover:bg-gray-100"
            disabled={history.length <= 1}
          >
            <ChevronLeft className="w-5 h-5 text-gray-500" />
          </button>
          <button
            onClick={nextRecommendation}
            className="p-1 rounded-full hover:bg-gray-100"
            disabled={history.length <= 1}
          >
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            {new Date(currentRec.timestamp).toLocaleString()}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["exercise", "song", "movie"].map((type) => (
            <div
              key={type}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start">
                <div className="p-2 rounded-lg bg-gray-50 mr-3">
                  {getIcon(type)}
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 line-clamp-1">
                    {currentRec[type]?.title || "No title"}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {currentRec[type]?.description || "No description"}
                  </p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-gray-500">
                      {currentRec[type]?.duration || "No duration"}
                    </span>
                    <span className="text-xs text-purple-600 font-medium">
                      AI Recommended
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="flex justify-center mt-4">
        <div className="flex space-x-2">
          {history.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? "bg-purple-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}