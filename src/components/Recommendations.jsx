
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
      return <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />;
    case "song":
      return <Music className="w-5 h-5 sm:w-6 sm:h-6 text-violet-500" />;
    case "movie":
      return <Film className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />;
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600">Loading your recommendations...</p>
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-sm sm:max-w-md">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-2xl blur-xl opacity-20"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 text-center border border-white/20 shadow-xl">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">No recommendations yet</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Your AI-curated recommendations will appear here like magic ✨
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentRec = history[currentIndex];

  return (
    <div className="min-h-screen  p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-19xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 lg:mb-8 space-y-3 sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Your AI Recommendations
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Curated just for you</p>
          </div>
          
          <div className="flex flex-col xs:flex-row items-start xs:items-center space-y-2 xs:space-y-0 xs:space-x-3 sm:space-x-4 w-full sm:w-auto">
            <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 border border-white/20">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                {currentIndex + 1} of {history.length}
              </span>
            </div>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={prevRecommendation}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/70 backdrop-blur-sm border border-white/20 hover:bg-white/90 transition-all duration-200 flex items-center justify-center group disabled:opacity-50"
                disabled={history.length <= 1}
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
              </button>
              <button
                onClick={nextRecommendation}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/70 backdrop-blur-sm border border-white/20 hover:bg-white/90 transition-all duration-200 flex items-center justify-center group disabled:opacity-50"
                disabled={history.length <= 1}
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
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
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-600/10 rounded-2xl sm:rounded-3xl blur-2xl"></div>
          <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-xl">
            
            {/* Timestamp */}
            <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between mb-4 sm:mb-6 space-y-2 xs:space-y-0">
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-medium">
                  {new Date(currentRec.timestamp).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center space-x-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium">
                <Sparkles className="w-3 h-3" />
                <span>AI Curated</span>
              </div>
            </div>

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {["exercise", "song", "movie"].map((type) => (
                <div
                  key={type}
                  className={`group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br ${getGradient(type)} border-2 hover:scale-[1.02] transition-all duration-300 cursor-pointer`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative p-3 sm:p-4 lg:p-6">
                    {/* Icon */}
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg">
                        {getIcon(type)}
                      </div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {type}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="space-y-2 sm:space-y-3">
                      <h3 className="font-bold text-gray-800 text-sm sm:text-base lg:text-lg leading-tight">
                        {currentRec[type]?.title || "No title"}
                      </h3>
                      
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                        {currentRec[type]?.description || "No description"}
                      </p>
                      
                      <div className="flex items-center justify-between pt-1 sm:pt-2">
                        <div className="flex items-center space-x-1 text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span className="text-xs font-medium">
                            {currentRec[type]?.duration || "No duration"}
                          </span>
                        </div>
                        
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-4 sm:mt-6 lg:mt-8">
          <div className="flex space-x-1.5 sm:space-x-2 bg-white/70 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 border border-white/20 max-w-full overflow-x-auto">
            {history.map((rec, index) => (
              <button
                key={rec.id}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 flex-shrink-0 ${
                  index === currentIndex 
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 scale-110" 
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}