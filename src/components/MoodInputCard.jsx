

// "use client";

// import { useState, useEffect } from "react";
// import { Zap, Music, Film } from "lucide-react";
// import { onAuthStateChanged } from "firebase/auth";
// import { rtdb, auth } from "@/lib/firebase";
// import { ref, push } from "firebase/database";

// const moodOptions = [
//   { id: "happy", icon: "😁", label: "Happy", color: "from-yellow-400 to-amber-300" },
//   { id: "sad", icon: "😟", label: "Sad", color: "from-blue-400 to-indigo-300" },
//   { id: "neutral", icon: "😑", label: "Neutral", color: "from-gray-400 to-slate-300" },
//   { id: "excited", icon: "😎", label: "Excited", color: "from-orange-400 to-amber-300" },
//   { id: "loved", icon: "😍", label: "Loved", color: "from-pink-400 to-rose-300" },
// ];

// export default function MoodInputCard() {
//   const [selectedMood, setSelectedMood] = useState(null);
//   const [journalText, setJournalText] = useState("");
//   const [aiResponse, setAiResponse] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [userId, setUserId] = useState(null);
//   const [activeTab, setActiveTab] = useState("mood");
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user?.email) {
//         const safeId = user.email.replace(/\W/g, "_");
//         setUserId(safeId);
//       } else {
//         setUserId("guest");
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   // const saveRecommendationsToFirebase = async (recommendations) => {
//   //   if (!userId) return;
//   //   try {
//   //     const recRef = ref(rtdb, `recommendations/${userId}`);
//   //     await push(recRef, {
//   //       ...recommendations,
//   //       timestamp: Date.now(),
//   //       mood: selectedMood?.id,
//   //       journalText: activeTab === "journal" ? journalText : null,
//   //     });
//   //   } catch (error) {
//   //     console.error("Error saving recommendations:", error);
//   //   }
//   // };



//   const saveRecommendationsToFirebase = async (recommendations) => {
//   if (!userId) return;
  
//   // Validate all required fields
//   if (!recommendations || 
//       !recommendations.exercise || 
//       !recommendations.song || 
//       !recommendations.movie) {
//     console.error("Invalid recommendations data:", recommendations);
//     return;
//   }

//   try {
//     const recRef = ref(rtdb, `recommendations/${userId}`);
//     const dataToSave = {
//       exercise: recommendations.exercise,
//       song: recommendations.song,
//       movie: recommendations.movie,
//       timestamp: Date.now(),
//       mood: selectedMood?.id || 'unknown', // Fallback to 'unknown' if mood not set
//       journalText: activeTab === "journal" ? journalText : null,
//     };
    
//     await push(recRef, dataToSave);
//   } catch (error) {
//     console.error("Error saving recommendations:", error);
//     setError("Failed to save recommendations. Please try again.");
//   }
// };
//   const handleMoodSelect = (mood) => {
//     setSelectedMood(mood);
//     setAiResponse(null);
//     setError(null);
//   };

//   const handleMoodSubmit = async () => {
//     if (!selectedMood || !userId) return;
//     setIsLoading(true);
//     setError(null);

//     try {
//       const response = await fetch("/api/analyze-mood", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           text: `I'm feeling ${selectedMood.label.toLowerCase()} today.`,
//           userId,
//           mood: selectedMood.id,
//         }),
//       });

//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//       const data = await response.json();
//       if (data.error) throw new Error(data.error);

//       const recommendations = {
//         exercise: data.exercise,
//         song: data.song,
//         movie: data.movie,
//       };

//       setAiResponse(recommendations);
//       await saveRecommendationsToFirebase(recommendations);
//     } catch (error) {
//       setError(error.message || "Something went wrong. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleJournalSubmit = async () => {
//     if (!journalText.trim() || !userId) return;
//     setIsLoading(true);
//     setError(null);

//     try {
//       const response = await fetch("/api/analyze-mood", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           text: journalText,
//           userId,
//           mood: selectedMood?.id,
//         }),
//       });

//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//       const data = await response.json();
//       if (data.error) throw new Error(data.error);

//       const recommendations = {
//         exercise: data.exercise,
//         song: data.song,
//         movie: data.movie,
//       };

//       setAiResponse(recommendations);
//       await saveRecommendationsToFirebase(recommendations);
//     } catch (error) {
//       setError(error.message || "Something went wrong. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 border border-gray-200 max-w-5xl mx-auto min-h-[600px] w-full">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
//         <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Emotion Sync</h2>
//         <div className="flex space-x-1 bg-gray-100 p-1 rounded-full w-full sm:w-auto">
//           <button
//             onClick={() => setActiveTab("mood")}
//             className={`px-3 py-1 text-sm rounded-full transition-all flex-1 sm:flex-none ${
//               activeTab === "mood" ? "bg-purple-600 text-white" : "text-gray-600"
//             }`}
//           >
//             Mood
//           </button>
//           <button
//             onClick={() => setActiveTab("journal")}
//             className={`px-3 py-1 text-sm rounded-full transition-all flex-1 sm:flex-none ${
//               activeTab === "journal" ? "bg-purple-600 text-white" : "text-gray-600"
//             }`}
//           >
//             Journal
//           </button>
//         </div>
//       </div>

//       {error && (
//         <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
//           {error}
//         </div>
//       )}

//       {!userId && (
//         <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-lg text-sm">
//           Please sign in to save your recommendations
//         </div>
//       )}

//       {activeTab === "mood" ? (
//         <div>
//           <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3 mb-8">
//             {moodOptions.map((mood) => (
//               <button
//                 key={mood.id}
//                 onClick={() => handleMoodSelect(mood)}
//                 className={`flex flex-col items-center p-3 sm:p-4 rounded-xl transition-all transform hover:scale-105 ${
//                   selectedMood?.id === mood.id
//                     ? `bg-gradient-to-br ${mood.color} shadow-lg`
//                     : "bg-gray-100 hover:bg-gray-200"
//                 }`}
//               >
//                 <span className="text-xl sm:text-2xl mb-1">{mood.icon}</span>
//                 <span className="text-xs font-medium text-gray-700 text-center leading-tight">{mood.label}</span>
//               </button>
//             ))}
//           </div>

//           {selectedMood && (
//             <div className="mt-4">
//               <button
//                 onClick={handleMoodSubmit}
//                 disabled={isLoading || !userId}
//                 className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl font-medium text-white flex items-center justify-center space-x-2 hover:shadow-lg transition-all disabled:opacity-50"
//               >
//                 {isLoading ? (
//                   <>
//                     <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0..." />
//                     </svg>
//                     <span className="text-sm sm:text-base">Analyzing</span>
//                   </>
//                 ) : (
//                   <>
//                     <Zap className="w-5 h-5" />
//                     <span className="text-sm sm:text-base">Get Recommendations</span>
//                   </>
//                 )}
//               </button>
//             </div>
//           )}
//         </div>
//       ) : (
//         <div>
//           <div className="relative mb-4">
//             <textarea
//               value={journalText}
//               onChange={(e) => setJournalText(e.target.value)}
//               placeholder="Express your thoughts..."
//               className="w-full p-4 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm sm:text-base"
//               rows={4}
//               maxLength={500}
//             />
//             <div className="absolute bottom-3 right-3 text-xs text-gray-400">
//               {journalText.length}/500
//             </div>
//           </div>
//           <button
//             onClick={handleJournalSubmit}
//             disabled={isLoading || !journalText.trim() || !userId}
//             className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl font-medium text-white flex items-center justify-center space-x-2 hover:shadow-lg transition-all disabled:opacity-50"
//           >
//             {isLoading ? (
//               <>
//                 <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0..." />
//                 </svg>
//                 <span className="text-sm sm:text-base">Analyzing Emotions</span>
//               </>
//             ) : (
//               <>
//                 <Zap className="w-5 h-5" />
//                 <span className="text-sm sm:text-base">Generate AI Insights</span>
//               </>
//             )}
//           </button>
//         </div>
//       )}

//       {/* Empty state */}
//       {!isLoading && !aiResponse && (
//         <div className="text-center text-gray-400 italic mt-10 text-sm sm:text-base px-4">
//           No recommendations yet. Submit your mood or journal entry to begin.
//         </div>
//       )}

//       {/* AI Response */}
//       {aiResponse && (
//         <div className="mt-8">
//           <h3 className="text-base sm:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mb-4">
//             Your NeuroSync Recommendations
//           </h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {aiResponse.exercise && (
//               <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-purple-300 transition-all">
//                 <div className="flex items-center mb-3">
//                   <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-400 mr-3">
//                     <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
//                   </div>
//                   <h4 className="font-semibold text-purple-600 text-sm sm:text-base">Activity</h4>
//                 </div>
//                 <h5 className="text-gray-800 font-medium mb-1 text-sm sm:text-base">{aiResponse.exercise.title}</h5>
//                 <p className="text-gray-600 text-xs sm:text-sm mb-2 leading-relaxed">{aiResponse.exercise.description}</p>
//                 <div className="flex justify-between items-center text-xs text-gray-500">
//                   <span>{aiResponse.exercise.duration}</span>
//                   <span className="text-purple-500">AI Optimized</span>
//                 </div>
//               </div>
//             )}

//             {aiResponse.song && (
//               <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-all">
//                 <div className="flex items-center mb-3">
//                   <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-400 mr-3">
//                     <Music className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
//                   </div>
//                   <h4 className="font-semibold text-blue-600 text-sm sm:text-base">Soundtrack</h4>
//                 </div>
//                 <h5 className="text-gray-800 font-medium mb-1 text-sm sm:text-base">{aiResponse.song.title}</h5>
//                 <p className="text-gray-600 text-xs sm:text-sm mb-2 leading-relaxed">{aiResponse.song.description}</p>
//                 <div className="flex justify-between items-center text-xs text-gray-500">
//                   <span>{aiResponse.song.duration}</span>
//                   <span className="text-blue-500">AI Selected</span>
//                 </div>
//               </div>
//             )}

//             {aiResponse.movie && (
//               <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-orange-300 transition-all">
//                 <div className="flex items-center mb-3">
//                   <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 mr-3">
//                     <Film className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
//                   </div>
//                   <h4 className="font-semibold text-orange-600 text-sm sm:text-base">Visual</h4>
//                 </div>
//                 <h5 className="text-gray-800 font-medium mb-1 text-sm sm:text-base">{aiResponse.movie.title}</h5>
//                 <p className="text-gray-600 text-xs sm:text-sm mb-2 leading-relaxed">{aiResponse.movie.description}</p>
//                 <div className="flex justify-between items-center text-xs text-gray-500">
//                   <span>{aiResponse.movie.duration}</span>
//                   <span className="text-orange-500">AI Curated</span>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
          
//     </div>
//   );
// }



"use client";

import { useState, useEffect } from "react";
import { Zap, Music, Film, Globe, ChevronDown } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { rtdb, auth } from "@/lib/firebase";
import { ref, push } from "firebase/database";

const moodOptions = [
  { id: "happy", icon: "😁", label: "Happy", color: "from-yellow-400 to-amber-300" },
  { id: "sad", icon: "😟", label: "Sad", color: "from-blue-400 to-indigo-300" },
  { id: "neutral", icon: "😑", label: "Neutral", color: "from-gray-400 to-slate-300" },
  { id: "excited", icon: "😎", label: "Excited", color: "from-orange-400 to-amber-300" },
  { id: "loved", icon: "😍", label: "Loved", color: "from-pink-400 to-rose-300" },
];

// Language options for media content
const mediaLanguageOptions = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
];

export default function MoodInputCard() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [journalText, setJournalText] = useState("");
  const [aiResponse, setAiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [activeTab, setActiveTab] = useState("mood");
  const [error, setError] = useState(null);
  const [mediaLanguage, setMediaLanguage] = useState("en");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [isLanguageLoading, setIsLanguageLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email) {
        const safeId = user.email.replace(/\W/g, "_");
        setUserId(safeId);
      } else {
        setUserId("guest");
      }
    });
    return () => unsubscribe();
  }, []);

  const saveRecommendationsToFirebase = async (recommendations) => {
    if (!userId) return;
    
    if (!recommendations || 
        !recommendations.exercise || 
        !recommendations.song || 
        !recommendations.movie) {
      console.error("Invalid recommendations data:", recommendations);
      return;
    }

    try {
      const recRef = ref(rtdb, `recommendations/${userId}`);
      const dataToSave = {
        exercise: recommendations.exercise,
        song: recommendations.song,
        movie: recommendations.movie,
        timestamp: Date.now(),
        mood: selectedMood?.id || 'unknown',
        journalText: activeTab === "journal" ? journalText : null,
        mediaLanguage: mediaLanguage,
      };
      
      await push(recRef, dataToSave);
    } catch (error) {
      console.error("Error saving recommendations:", error);
      setError("Failed to save recommendations. Please try again.");
    }
  };

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setAiResponse(null);
    setError(null);
  };

  const handleMoodSubmit = async () => {
    if (!selectedMood || !userId) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze-mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `I'm feeling ${selectedMood.label.toLowerCase()} today.`,
          userId,
          mood: selectedMood.id,
          mediaLanguage: mediaLanguage,
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const recommendations = {
        exercise: data.exercise,
        song: data.song,
        movie: data.movie,
      };

      setAiResponse(recommendations);
      await saveRecommendationsToFirebase(recommendations);
    } catch (error) {
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJournalSubmit = async () => {
    if (!journalText.trim() || !userId) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze-mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: journalText,
          userId,
          mood: selectedMood?.id,
          mediaLanguage: mediaLanguage,
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const recommendations = {
        exercise: data.exercise,
        song: data.song,
        movie: data.movie,
      };

      setAiResponse(recommendations);
      await saveRecommendationsToFirebase(recommendations);
    } catch (error) {
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // const handleLanguageChange = async (languageCode) => {
  //   setMediaLanguage(languageCode);
  //   setShowLanguageDropdown(false);
    
  //   // If we already have recommendations, regenerate them with the new language
  //   if (aiResponse) {
  //     if (activeTab === "mood" && selectedMood) {
  //       await handleMoodSubmit();
  //     } else if (activeTab === "journal" && journalText.trim()) {
  //       await handleJournalSubmit();
  //     }
  //   }
  // };

  const handleLanguageChange = async (languageCode) => {
  setMediaLanguage(languageCode);
  setShowLanguageDropdown(false);
  setAiResponse(null);
  
  if ((activeTab === "mood" && selectedMood) || (activeTab === "journal" && journalText.trim())) {
    setIsLanguageLoading(true);
    
    try {
      // ... (same fetch code as above)
    } catch (error) {
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLanguageLoading(false);
    }
  }
};
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 border border-gray-200 max-w-5xl mx-auto min-h-[600px] w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Emotion Sync</h2>
        
        <div className="flex items-center space-x-2">
          {/* Language Selector for Media */}
          <div className="relative">
            <button
  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
  className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors"
  disabled={isLanguageLoading}
>
  {isLanguageLoading ? (
    <svg className="animate-spin h-4 w-4 text-purple-500" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0..." />
    </svg>
  ) : (
    <>
      <Globe className="w-4 h-4" />
      <span>{mediaLanguageOptions.find(lang => lang.code === mediaLanguage)?.flag}</span>
      <span className="hidden sm:inline">
        {mediaLanguageOptions.find(lang => lang.code === mediaLanguage)?.name}
      </span>
      <ChevronDown className="w-4 h-4" />
    </>
  )}
</button>
            
            {showLanguageDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 max-h-60 overflow-y-auto">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b">
                  Media Language
                </div>
                {mediaLanguageOptions.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 ${
                      mediaLanguage === language.code ? "bg-purple-50 text-purple-700" : ""
                    }`}
                  >
                    <span className="text-lg">{language.flag}</span>
                    <span>{language.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-full">
            <button
              onClick={() => setActiveTab("mood")}
              className={`px-3 py-1 text-sm rounded-full transition-all ${
                activeTab === "mood" ? "bg-purple-600 text-white" : "text-gray-600"
              }`}
            >
              Mood
            </button>
            <button
              onClick={() => setActiveTab("journal")}
              className={`px-3 py-1 text-sm rounded-full transition-all ${
                activeTab === "journal" ? "bg-purple-600 text-white" : "text-gray-600"
              }`}
            >
              Journal
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {!userId && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-lg text-sm">
          Please sign in to save your recommendations
        </div>
      )}

      {activeTab === "mood" ? (
        <div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3 mb-8">
            {moodOptions.map((mood) => (
              <button
                key={mood.id}
                onClick={() => handleMoodSelect(mood)}
                className={`flex flex-col items-center p-3 sm:p-4 rounded-xl transition-all transform hover:scale-105 ${
                  selectedMood?.id === mood.id
                    ? `bg-gradient-to-br ${mood.color} shadow-lg`
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <span className="text-xl sm:text-2xl mb-1">{mood.icon}</span>
                <span className="text-xs font-medium text-gray-700 text-center leading-tight">{mood.label}</span>
              </button>
            ))}
          </div>

          {selectedMood && (
            <div className="mt-4">
              <button
                onClick={handleMoodSubmit}
                disabled={isLoading || !userId}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl font-medium text-white flex items-center justify-center space-x-2 hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0..." />
                    </svg>
                    <span className="text-sm sm:text-base">Analyzing</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span className="text-sm sm:text-base">Get Recommendations</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="relative mb-4">
            <textarea
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="Express your thoughts..."
              className="w-full p-4 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm sm:text-base"
              rows={4}
              maxLength={500}
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              {journalText.length}/500
            </div>
          </div>
          <button
            onClick={handleJournalSubmit}
            disabled={isLoading || !journalText.trim() || !userId}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl font-medium text-white flex items-center justify-center space-x-2 hover:shadow-lg transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0..." />
                </svg>
                <span className="text-sm sm:text-base">Analyzing Emotions</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span className="text-sm sm:text-base">Generate AI Insights</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !aiResponse && (
        <div className="text-center text-gray-400 italic mt-10 text-sm sm:text-base px-4">
          No recommendations yet. Submit your mood or journal entry to begin.
        </div>
      )}

      {/* AI Response */}
      {aiResponse && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base sm:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
              Your NeuroSync Recommendations
            </h3>
            
            {isLoading && (
              <div className="flex items-center text-sm text-gray-500">
                <svg className="animate-spin h-4 w-4 mr-1 text-purple-500" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0..." />
                </svg>
                Generating {mediaLanguageOptions.find(lang => lang.code === mediaLanguage)?.name} content...
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiResponse.exercise && (
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-purple-300 transition-all">
                <div className="flex items-center mb-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-400 mr-3">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-purple-600 text-sm sm:text-base">Activity</h4>
                </div>
                <h5 className="text-gray-800 font-medium mb-1 text-sm sm:text-base">{aiResponse.exercise.title}</h5>
                <p className="text-gray-600 text-xs sm:text-sm mb-2 leading-relaxed">{aiResponse.exercise.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{aiResponse.exercise.duration}</span>
                  <span className="text-purple-500">AI Optimized</span>
                </div>
              </div>
            )}

            {aiResponse.song && (
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-all">
                <div className="flex items-center mb-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-400 mr-3">
                    <Music className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-blue-600 text-sm sm:text-base">
                    Soundtrack • {mediaLanguageOptions.find(lang => lang.code === mediaLanguage)?.flag}
                  </h4>
                </div>
                <h5 className="text-gray-800 font-medium mb-1 text-sm sm:text-base">{aiResponse.song.title}</h5>
                <p className="text-gray-600 text-xs sm:text-sm mb-2 leading-relaxed">{aiResponse.song.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{aiResponse.song.duration}</span>
                  <span className="text-blue-500">{mediaLanguage.toUpperCase()} Content</span>
                </div>
              </div>
            )}

            {aiResponse.movie && (
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-orange-300 transition-all">
                <div className="flex items-center mb-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 mr-3">
                    <Film className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-orange-600 text-sm sm:text-base">
                    Visual • {mediaLanguageOptions.find(lang => lang.code === mediaLanguage)?.flag}
                  </h4>
                </div>
                <h5 className="text-gray-800 font-medium mb-1 text-sm sm:text-base">{aiResponse.movie.title}</h5>
                <p className="text-gray-600 text-xs sm:text-sm mb-2 leading-relaxed">{aiResponse.movie.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{aiResponse.movie.duration}</span>
                  <span className="text-orange-500">{mediaLanguage.toUpperCase()} Content</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}