

// // "use client";

// // import { useState, useEffect } from "react";
// // import { AnimatePresence, motion } from "framer-motion";
// // import { X, Send, Brain, Sparkles, MessageSquare, Heart, Lightbulb, PenTool, Zap } from "lucide-react";
// // import { auth, rtdb } from "@/lib/firebase";
// // import { onAuthStateChanged } from "firebase/auth";
// // import { ref, push } from "firebase/database";

// // export default function JournalEntryOverlay({ onClose }) {
// //   const [entry, setEntry] = useState("");
// //   const [aiResponse, setAiResponse] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [user, setUser] = useState(null);
// //   const [isFocused, setIsFocused] = useState(false);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     const unsub = onAuthStateChanged(auth, (firebaseUser) => {
// //       setUser(firebaseUser);
// //     });
// //     return () => unsub();
// //   }, []);

// //   const handleSubmit = async () => {
// //     if (!entry.trim() || !user) return;
// //     setLoading(true);
// //     setAiResponse(null);
// //     setError(null);

// //     try {
// //       await push(ref(rtdb, `journals/${user.uid}`), {
// //         entry,
// //         createdAt: Date.now(),
// //       });

// //       const res = await fetch("/api/analyze-journal", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ entry }),
// //       });

// //       if (!res.ok) {
// //         const errorText = await res.text();
// //         throw new Error(`API request failed: ${res.status} - ${errorText}`);
// //       }

// //       const data = await res.json();
// //       if (data.error) {
// //         throw new Error(data.error);
// //       }

// //       setAiResponse(data?.recommendation || "No AI response received.");
// //     } catch (err) {
// //       console.error("Error in handleSubmit:", err);
// //       setError(err.message || "Something went wrong.");
// //       setAiResponse("Unable to get AI analysis. Please try again.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <motion.div
// //       initial={{ opacity: 0 }}
// //       animate={{ opacity: 1 }}
// //       exit={{ opacity: 0 }}
// //       className="fixed bg-black/80 inset-0 z-50 flex items-center justify-center p-4"
// //     >
// //       {/* Enhanced Backdrop */}
// //       <div
// //         // className="absolute inset-0 bg-gradient-to-br from-blue-50/95 via-indigo-50/90 to-purple-50/95 backdrop-blur-2xl"
// //         className="absolute inset-0 bg-white/10 backdrop-blur-xl"
// //         onClick={onClose}
// //       />
      
// //       {/* Floating Orbs */}
// //       <div className="absolute inset-0 overflow-hidden pointer-events-none">
// //         {[...Array(8)].map((_, i) => (
// //           <motion.div
// //             key={i}
// //             className="absolute rounded-full bg-gradient-to-r from-blue-200/30 to-purple-200/30 blur-xl"
// //             style={{
// //               width: `${100 + Math.random() * 200}px`,
// //               height: `${100 + Math.random() * 200}px`,
// //               left: `${Math.random() * 100}%`,
// //               top: `${Math.random() * 100}%`,
// //             }}
// //             animate={{
// //               x: [0, Math.random() * 100 - 50, 0],
// //               y: [0, Math.random() * 100 - 50, 0],
// //               scale: [1, 1.2, 1],
// //             }}
// //             transition={{
// //               duration: 8 + Math.random() * 4,
// //               repeat: Infinity,
// //               ease: "easeInOut",
// //             }}
// //           />
// //         ))}
// //       </div>

// //       {/* Main Modal - Side by Side Layout */}
// //       <motion.div
// //         initial={{ y: 50, scale: 0.9, opacity: 0 }}
// //         animate={{ y: 0, scale: 1, opacity: 1 }}
// //         exit={{ y: 50, scale: 0.9, opacity: 0 }}
// //         className="relative  p-6 bg-white/90 backdrop-blur-sm rounded-3xl w-full max-w-7xl max-h-[95vh] overflow-hidden"
// //       >
// //         {/* Header Bar */}
// //         <div className="relative mb-6 flex justify-between items-center">
// //           <motion.div
// //             initial={{ x: -50, opacity: 0 }}
// //             animate={{ x: 0, opacity: 1 }}
// //             transition={{ delay: 0.2 }}
// //             className="flex items-center gap-4"
// //           >
// //             <motion.div
              
// //               className="p-3 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg"
// //             >
// //               <Brain className="w-8 h-8 text-white" />
// //             </motion.div>
// //             <div>
// //               <h1 className="text-3xl font-bold text-gray-800 mb-1">Neural Journal</h1>
// //               <p className="text-blue-600">Write your thoughts, get AI insights in real-time</p>
// //             </div>
// //           </motion.div>
          
// //           <motion.button
// //             initial={{ x: 50, opacity: 0 }}
// //             animate={{ x: 0, opacity: 1 }}
// //             transition={{ delay: 0.2 }}
// //             whileHover={{ scale: 1.1 }}
// //             whileTap={{ scale: 0.9 }}
// //             onClick={onClose}
// //             className="p-3 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-gray-600 hover:text-gray-800 transition-all duration-200 border border-gray-200 shadow-lg"
// //           >
// //             <X className="w-6 h-6" />
// //           </motion.button>
// //         </div>

// //         {/* Side by Side Content */}
// //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          
// //           {/* Left Side - Journal Entry */}
// //           <motion.div
// //             initial={{ x: -100, opacity: 0 }}
// //             animate={{ x: 0, opacity: 1 }}
// //             transition={{ delay: 0.3 }}
// //             className="flex flex-col"
// //           >
// //             <div className="bg-white/90 backdrop-blur-lg rounded-3xl border border-gray-200 shadow-2xl flex-1 flex flex-col overflow-hidden">
// //               {/* Journal Header */}
// //               <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50">
// //                 <div className="flex items-center gap-3">
// //                   <div className="p-2 bg-emerald-500 rounded-xl shadow-lg">
// //                     <PenTool className="w-5 h-5 text-white" />
// //                   </div>
// //                   <div>
// //                     <h2 className="text-xl font-semibold text-gray-800">Your Journal</h2>
// //                     <p className="text-emerald-600 text-sm">Express your thoughts freely</p>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Journal Input */}
// //               <div className="flex-1 p-6 flex flex-col">
// //                 <motion.div
// //                   animate={{
// //                     borderColor: isFocused 
// //                       ? "rgba(16, 185, 129, 0.5)" 
// //                       : "rgba(229, 231, 235, 0.8)",
// //                     boxShadow: isFocused
// //                       ? "0 0 0 1px rgba(16, 185, 129, 0.3), 0 0 30px rgba(16, 185, 129, 0.1)"
// //                       : "0 2px 10px rgba(0, 0, 0, 0.1)",
// //                   }}
// //                   transition={{ duration: 0.3 }}
// //                   className="flex-1 rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm overflow-hidden shadow-inner"
// //                 >
// //                   <textarea
// //                     value={entry}
// //                     onChange={(e) => setEntry(e.target.value)}
// //                     onFocus={() => setIsFocused(true)}
// //                     onBlur={() => setIsFocused(false)}
// //                     placeholder="What's on your mind today? Share your thoughts, feelings, experiences, or reflections..."
// //                     className="w-full h-full p-6 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none resize-none text-lg leading-relaxed"
// //                     maxLength={2000}
// //                   />
// //                 </motion.div>
                
// //                 {/* Character Counter */}
// //                 <div className="flex justify-between items-center mt-4">
// //                   <div className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600 border border-gray-200">
// //                     {entry.length}/2000 characters
// //                   </div>
                  
// //                   {/* Submit Button */}
// //                   <motion.button
// //                     onClick={handleSubmit}
// //                     disabled={!entry.trim() || loading || !user}
// //                     whileHover={{ scale: 1.05 }}
// //                     whileTap={{ scale: 0.95 }}
// //                     className={`px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 transition-all duration-300 ${
// //                       entry.trim() && user
// //                         ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-teal-600"
// //                         : "bg-gray-200 text-gray-400 cursor-not-allowed"
// //                     }`}
// //                   >
// //                     {loading ? (
// //                       <>
// //                         <motion.div
// //                           animate={{ rotate: 360 }}
// //                           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
// //                         >
// //                           <Brain className="w-4 h-4" />
// //                         </motion.div>
// //                         <span>Analyzing...</span>
// //                       </>
// //                     ) : (
// //                       <>
// //                         <Zap className="w-4 h-4" />
// //                         <span>Analyze</span>
// //                       </>
// //                     )}
// //                   </motion.button>
// //                 </div>

// //                 {/* Error Display */}
// //                 {error && (
// //                   <motion.div
// //                     initial={{ opacity: 0, y: -10 }}
// //                     animate={{ opacity: 1, y: 0 }}
// //                     className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl"
// //                   >
// //                     <p className="text-red-600 text-sm">{error}</p>
// //                   </motion.div>
// //                 )}
// //               </div>
// //             </div>
// //           </motion.div>

// //           {/* Right Side - AI Analysis */}
// //           <motion.div
// //             initial={{ x: 100, opacity: 0 }}
// //             animate={{ x: 0, opacity: 1 }}
// //             transition={{ delay: 0.4 }}
// //             className="flex flex-col"
// //           >
// //             <div className="bg-white/90 backdrop-blur-lg rounded-3xl border border-gray-200 shadow-2xl flex-1 flex flex-col overflow-hidden">
// //               {/* AI Header */}
// //               <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
// //                 <div className="flex items-center gap-3">
// //                   <motion.div
// //                     animate={{ 
// //                       boxShadow: [
// //                         "0 0 20px rgba(168, 85, 247, 0.3)",
// //                         "0 0 30px rgba(236, 72, 153, 0.4)",
// //                         "0 0 20px rgba(168, 85, 247, 0.3)"
// //                       ]
// //                     }}
// //                     transition={{ duration: 2, repeat: Infinity }}
// //                     className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg"
// //                   >
// //                     <Brain className="w-5 h-5 text-white" />
// //                   </motion.div>
// //                   <div>
// //                     <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
// //                       AI Analysis
// //                       <Sparkles className="w-4 h-4 text-yellow-500" />
// //                     </h2>
// //                     <p className="text-purple-600 text-sm">Personalized insights and recommendations</p>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* AI Content Area */}
// //               <div className="flex-1 p-6 flex flex-col">
// //                 <AnimatePresence mode="wait">
// //                   {loading ? (
// //                     <motion.div
// //                       key="loading"
// //                       initial={{ opacity: 0 }}
// //                       animate={{ opacity: 1 }}
// //                       exit={{ opacity: 0 }}
// //                       className="flex-1 flex items-center justify-center"
// //                     >
// //                       <div className="text-center">
// //                         <motion.div
// //                           animate={{ rotate: 360, scale: [1, 1.2, 1] }}
// //                           transition={{ duration: 2, repeat: Infinity }}
// //                           className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center"
// //                         >
// //                           <Brain className="w-8 h-8 text-white" />
// //                         </motion.div>
// //                         <p className="text-gray-700 text-lg">Analyzing your thoughts...</p>
// //                         <p className="text-gray-500 text-sm mt-2">This may take a moment</p>
// //                       </div>
// //                     </motion.div>
// //                   ) : aiResponse ? (
// //                     <motion.div
// //                       key="response"
// //                       initial={{ opacity: 0, y: 20 }}
// //                       animate={{ opacity: 1, y: 0 }}
// //                       exit={{ opacity: 0, y: -20 }}
// //                       className="flex-1 flex flex-col"
// //                     >
// //                       {/* Response Content */}
// //                       <div className="flex-1 bg-white/5 rounded-2xl p-6 border border-white/10 overflow-y-auto">
// //                         <div className="flex items-start gap-4">
// //                           <div className="flex-shrink-0 mt-1">
// //                             <div className="p-2 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg">
// //                               <MessageSquare className="w-4 h-4 text-white" />
// //                             </div>
// //                           </div>
// //                           <div className="flex-1">
// //                             <motion.p
// //                               initial={{ opacity: 0 }}
// //                               animate={{ opacity: 1 }}
// //                               transition={{ delay: 0.3, duration: 0.8 }}
// //                               className="text-black leading-relaxed text-base"
// //                             >
// //                               {aiResponse}
// //                             </motion.p>
// //                           </div>
// //                         </div>
// //                       </div>
                      
// //                       {/* Action Buttons */}
// //                       <motion.div
// //                         initial={{ opacity: 0, y: 10 }}
// //                         animate={{ opacity: 1, y: 0 }}
// //                         transition={{ delay: 0.5 }}
// //                         className="flex items-center gap-3 mt-4"
// //                       >
// //                         <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm text-white transition-all duration-200 border border-white/10">
// //                           <Heart className="w-4 h-4" />
// //                           Helpful
// //                         </button>
// //                         <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm text-white transition-all duration-200 border border-white/10">
// //                           <Lightbulb className="w-4 h-4" />
// //                           Save Insight
// //                         </button>
// //                       </motion.div>
// //                     </motion.div>
// //                   ) : (
// //                     <motion.div
// //                       key="empty"
// //                       initial={{ opacity: 0 }}
// //                       animate={{ opacity: 1 }}
// //                       exit={{ opacity: 0 }}
// //                       className="flex-1 flex items-center justify-center"
// //                     >
// //                       <div className="text-center">
// //                         <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-2xl flex items-center justify-center">
// //                           <Sparkles className="w-8 h-8 text-black/60" />
// //                         </div>
// //                         <p className="text-black/60 text-lg">AI insights will appear here</p>
// //                         <p className="text-black/40 text-sm mt-2">Write in your journal and click analyze</p>
// //                       </div>
// //                     </motion.div>
// //                   )}
// //                 </AnimatePresence>
// //               </div>
// //             </div>
// //           </motion.div>
// //         </div>
// //       </motion.div>
// //     </motion.div>
// //   );
// // }


// "use client";

// import { useState, useEffect } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import { X, Send, Brain, Sparkles, MessageSquare, Heart, Lightbulb, PenTool, Zap, ArrowRight, ArrowLeft } from "lucide-react";
// import { auth, rtdb } from "@/lib/firebase";
// import { onAuthStateChanged } from "firebase/auth";
// import { ref, push } from "firebase/database";

// export default function JournalEntryOverlay({ onClose }) {
//   const [entry, setEntry] = useState("");
//   const [aiResponse, setAiResponse] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [user, setUser] = useState(null);
//   const [isFocused, setIsFocused] = useState(false);
//   const [error, setError] = useState(null);
//   const [mobileStep, setMobileStep] = useState(1); // 1: Journal, 2: AI Response

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (firebaseUser) => {
//       setUser(firebaseUser);
//     });
//     return () => unsub();
//   }, []);

//   const handleSubmit = async () => {
//     if (!entry.trim() || !user) return;
//     setLoading(true);
//     setAiResponse(null);
//     setError(null);

//     try {
//       await push(ref(rtdb, `journals/${user.uid}`), {
//         entry,
//         createdAt: Date.now(),
//       });

//       const res = await fetch("/api/analyze-journal", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ entry }),
//       });

//       if (!res.ok) {
//         const errorText = await res.text();
//         throw new Error(`API request failed: ${res.status} - ${errorText}`);
//       }

//       const data = await res.json();
//       if (data.error) {
//         throw new Error(data.error);
//       }

//       setAiResponse(data?.recommendation || "No AI response received.");
//       setMobileStep(2); // Auto-advance to AI response on mobile
//     } catch (err) {
//       console.error("Error in handleSubmit:", err);
//       setError(err.message || "Something went wrong.");
//       setAiResponse("Unable to get AI analysis. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-pink-900/95 backdrop-blur-xl inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
//     >
//       {/* Animated Particles */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         {[...Array(12)].map((_, i) => (
//           <motion.div
//             key={i}
//             className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//             }}
//             animate={{
//               y: [0, -100, 0],
//               opacity: [0, 1, 0],
//               scale: [0, 1, 0],
//             }}
//             transition={{
//               duration: 3 + Math.random() * 2,
//               repeat: Infinity,
//               delay: Math.random() * 2,
//             }}
//           />
//         ))}
//       </div>

//       {/* Main Container - New Card-Based Design */}
//       <motion.div
//         initial={{ scale: 0.8, opacity: 0, rotateX: -15 }}
//         animate={{ scale: 1, opacity: 1, rotateX: 0 }}
//         exit={{ scale: 0.8, opacity: 0, rotateX: 15 }}
//         transition={{ type: "spring", damping: 20 }}
//         className="relative w-full max-w-6xl max-h-[92vh] bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
//         style={{
//           background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
//           boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
//         }}
//       >
//         {/* Header with Frosted Glass Effect */}
//         <div className="relative p-4 sm:p-6 border-b border-white/10 bg-gradient-to-r from-white/10 via-white/5 to-white/10">
//           <div className="flex justify-between items-center">
//             <motion.div
//               initial={{ x: -30, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               className="flex items-center gap-3"
//             >
//               <div className="relative">
//                 <motion.div
//                   animate={{ 
//                     rotate: [0, 360],
//                     scale: [1, 1.1, 1]
//                   }}
//                   transition={{ 
//                     rotate: { duration: 20, repeat: Infinity, ease: "linear" },
//                     scale: { duration: 2, repeat: Infinity }
//                   }}
//                   className="p-3 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl"
//                 >
//                   <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
//                 </motion.div>
//                 <motion.div
//                   animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
//                   transition={{ duration: 2, repeat: Infinity }}
//                   className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl blur-md -z-10"
//                 />
//               </div>
//               <div>
//                 <motion.h1 
//                   initial={{ y: -10, opacity: 0 }}
//                   animate={{ y: 0, opacity: 1 }}
//                   transition={{ delay: 0.1 }}
//                   className="text-2xl sm:text-4xl font-black text-white"
//                   style={{
//                     background: 'linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6)',
//                     WebkitBackgroundClip: 'text',
//                     WebkitTextFillColor: 'transparent',
//                     backgroundClip: 'text'
//                   }}
//                 >
//                   MindFlow
//                 </motion.h1>
//                 <motion.p 
//                   initial={{ y: -10, opacity: 0 }}
//                   animate={{ y: 0, opacity: 1 }}
//                   transition={{ delay: 0.2 }}
//                   className="text-blue-200/80 text-sm sm:text-base font-medium"
//                 >
//                   Neural Journal with AI Insights
//                 </motion.p>
//               </div>
//             </motion.div>
            
//             <motion.button
//               initial={{ x: 30, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               whileHover={{ scale: 1.05, rotate: 90 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={onClose}
//               className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 hover:text-white transition-all backdrop-blur-sm"
//             >
//               <X className="w-5 h-5 sm:w-6 sm:h-6" />
//             </motion.button>
//           </div>

//           {/* Mobile Step Indicator */}
//           <div className="lg:hidden mt-4">
//             <div className="flex items-center justify-center gap-3">
//               <motion.div
//                 animate={{ 
//                   scale: mobileStep === 1 ? 1.2 : 1,
//                   backgroundColor: mobileStep === 1 ? '#3b82f6' : 'rgba(255,255,255,0.3)'
//                 }}
//                 className="w-3 h-3 rounded-full"
//               />
//               <div className="flex-1 h-0.5 bg-white/20 rounded-full overflow-hidden">
//                 <motion.div
//                   animate={{ width: mobileStep === 2 ? '100%' : '0%' }}
//                   transition={{ duration: 0.5 }}
//                   className="h-full bg-gradient-to-r from-blue-400 to-purple-500"
//                 />
//               </div>
//               <motion.div
//                 animate={{ 
//                   scale: mobileStep === 2 ? 1.2 : 1,
//                   backgroundColor: mobileStep === 2 ? '#8b5cf6' : 'rgba(255,255,255,0.3)'
//                 }}
//                 className="w-3 h-3 rounded-full"
//               />
//             </div>
//             <div className="flex justify-between mt-2 text-xs text-white/60">
//               <span>Write</span>
//               <span>Analyze</span>
//             </div>
//           </div>
//         </div>

//         {/* Content Area - New Layout System */}
//         <div className="flex-1 overflow-hidden">
//           {/* Desktop: Side by Side */}
//           <div className="hidden lg:grid lg:grid-cols-2 h-full">
            
//             {/* Journal Side */}
//             <motion.div
//               initial={{ x: -50, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ delay: 0.3 }}
//               className="p-6 flex flex-col border-r border-white/10"
//             >
//               <div className="mb-4 flex items-center gap-3">
//                 <div className="p-2 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl">
//                   <PenTool className="w-5 h-5 text-white" />
//                 </div>
//                 <h3 className="text-xl font-bold text-white">Your Thoughts</h3>
//               </div>

//               <motion.div
//                 animate={{
//                   borderColor: isFocused ? 'rgba(34, 197, 94, 0.5)' : 'rgba(255, 255, 255, 0.1)',
//                   boxShadow: isFocused 
//                     ? '0 0 30px rgba(34, 197, 94, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
//                     : 'inset 0 1px 0 rgba(255, 255, 255, 0.1)'
//                 }}
//                 className="flex-1 rounded-2xl border bg-white/5 backdrop-blur-sm overflow-hidden"
//               >
//                 <textarea
//                   value={entry}
//                   onChange={(e) => setEntry(e.target.value)}
//                   onFocus={() => setIsFocused(true)}
//                   onBlur={() => setIsFocused(false)}
//                   placeholder="Pour your heart out... What's flowing through your mind right now?"
//                   className="w-full h-full p-6 bg-transparent text-white placeholder-white/40 focus:outline-none resize-none text-lg leading-relaxed font-medium"
//                   maxLength={2000}
//                 />
//               </motion.div>
              
//               <div className="mt-4 flex justify-between items-center">
//                 <div className="text-sm text-white/50">
//                   {entry.length}/2000 words flowing
//                 </div>
                
//                 <motion.button
//                   onClick={handleSubmit}
//                   disabled={!entry.trim() || loading || !user}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-3 transition-all ${
//                     entry.trim() && user
//                       ? "bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 text-white shadow-2xl hover:shadow-emerald-500/25"
//                       : "bg-white/10 text-white/40 cursor-not-allowed"
//                   }`}
//                 >
//                   {loading ? (
//                     <>
//                       <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
//                         <Brain className="w-5 h-5" />
//                       </motion.div>
//                       Processing...
//                     </>
//                   ) : (
//                     <>
//                       <Zap className="w-5 h-5" />
//                       Analyze Mind
//                     </>
//                   )}
//                 </motion.button>
//               </div>

//               {error && (
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl"
//                 >
//                   <p className="text-red-200 text-sm">{error}</p>
//                 </motion.div>
//               )}
//             </motion.div>

//             {/* AI Side */}
//             <motion.div
//               initial={{ x: 50, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ delay: 0.4 }}
//               className="p-6 flex flex-col"
//             >
//               <div className="mb-4 flex items-center gap-3">
//                 <motion.div
//                   animate={{ 
//                     boxShadow: [
//                       "0 0 20px rgba(168, 85, 247, 0.4)",
//                       "0 0 40px rgba(236, 72, 153, 0.6)",
//                       "0 0 20px rgba(168, 85, 247, 0.4)"
//                     ]
//                   }}
//                   transition={{ duration: 3, repeat: Infinity }}
//                   className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl"
//                 >
//                   <Brain className="w-5 h-5 text-white" />
//                 </motion.div>
//                 <h3 className="text-xl font-bold text-white flex items-center gap-2">
//                   Neural Analysis
//                   <Sparkles className="w-4 h-4 text-yellow-400" />
//                 </h3>
//               </div>

//               <div className="flex-1 rounded-2xl bg-white/5 border border-white/10 overflow-hidden backdrop-blur-sm">
//                 <AnimatePresence mode="wait">
//                   {loading ? (
//                     <motion.div
//                       key="loading"
//                       initial={{ opacity: 0, scale: 0.9 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       exit={{ opacity: 0, scale: 0.9 }}
//                       className="h-full flex items-center justify-center p-8"
//                     >
//                       <div className="text-center">
//                         <motion.div
//                           animate={{ 
//                             rotate: 360,
//                             scale: [1, 1.2, 1],
//                           }}
//                           transition={{ 
//                             rotate: { duration: 2, repeat: Infinity, ease: "linear" },
//                             scale: { duration: 1.5, repeat: Infinity }
//                           }}
//                           className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center"
//                         >
//                           <Brain className="w-8 h-8 text-white" />
//                         </motion.div>
//                         <motion.p 
//                           animate={{ opacity: [0.5, 1, 0.5] }}
//                           transition={{ duration: 2, repeat: Infinity }}
//                           className="text-white/80 text-lg font-medium"
//                         >
//                           Neural networks processing...
//                         </motion.p>
//                         <p className="text-white/50 text-sm mt-2">Analyzing emotional patterns</p>
//                       </div>
//                     </motion.div>
//                   ) : aiResponse ? (
//                     <motion.div
//                       key="response"
//                       initial={{ opacity: 0, y: 30 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -30 }}
//                       className="h-full flex flex-col p-6"
//                     >
//                       <div className="flex-1 overflow-y-auto">
//                         <motion.p
//                           initial={{ opacity: 0 }}
//                           animate={{ opacity: 1 }}
//                           transition={{ delay: 0.3, duration: 1 }}
//                           className="text-white/90 leading-relaxed text-base font-medium"
//                         >
//                           {aiResponse}
//                         </motion.p>
//                       </div>
                      
//                       <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: 0.6 }}
//                         className="flex items-center gap-3 mt-6 pt-4 border-t border-white/10"
//                       >
//                         <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm text-white/80 transition-all border border-white/20">
//                           <Heart className="w-4 h-4" />
//                           Insightful
//                         </button>
//                         <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm text-white/80 transition-all border border-white/20">
//                           <Lightbulb className="w-4 h-4" />
//                           Save
//                         </button>
//                       </motion.div>
//                     </motion.div>
//                   ) : (
//                     <motion.div
//                       key="empty"
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       className="h-full flex items-center justify-center p-8"
//                     >
//                       <div className="text-center">
//                         <Sparkles className="w-16 h-16 mx-auto mb-4 text-white/30" />
//                         <p className="text-white/60 text-lg">AI insights await...</p>
//                         <p className="text-white/40 text-sm mt-2">Share your thoughts to unlock analysis</p>
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             </motion.div>
//           </div>

//           {/* Mobile: Step-by-Step Flow */}
//           <div className="lg:hidden h-full">
//             <AnimatePresence mode="wait">
//               {mobileStep === 1 ? (
//                 <motion.div
//                   key="journal"
//                   initial={{ x: -100, opacity: 0 }}
//                   animate={{ x: 0, opacity: 1 }}
//                   exit={{ x: -100, opacity: 0 }}
//                   className="h-full p-4 flex flex-col"
//                 >
//                   <div className="mb-4 flex items-center gap-3">
//                     <div className="p-2 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl">
//                       <PenTool className="w-5 h-5 text-white" />
//                     </div>
//                     <h3 className="text-lg font-bold text-white">Express Yourself</h3>
//                   </div>

//                   <motion.div
//                     animate={{
//                       borderColor: isFocused ? 'rgba(34, 197, 94, 0.5)' : 'rgba(255, 255, 255, 0.1)',
//                     }}
//                     className="flex-1 rounded-2xl border bg-white/5 backdrop-blur-sm overflow-hidden mb-4"
//                   >
//                     <textarea
//                       value={entry}
//                       onChange={(e) => setEntry(e.target.value)}
//                       onFocus={() => setIsFocused(true)}
//                       onBlur={() => setIsFocused(false)}
//                       placeholder="What's on your mind? Let your thoughts flow freely..."
//                       className="w-full h-full p-4 bg-transparent text-white placeholder-white/40 focus:outline-none resize-none text-base leading-relaxed"
//                       maxLength={2000}
//                     />
//                   </motion.div>
                  
//                   <div className="flex justify-between items-center mb-4">
//                     <div className="text-sm text-white/50">
//                       {entry.length}/2000
//                     </div>
                    
//                     <motion.button
//                       onClick={handleSubmit}
//                       disabled={!entry.trim() || loading || !user}
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       className={`px-8 py-3 rounded-2xl font-bold flex items-center gap-3 transition-all ${
//                         entry.trim() && user
//                           ? "bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 text-white shadow-xl"
//                           : "bg-white/10 text-white/40 cursor-not-allowed"
//                       }`}
//                     >
//                       {loading ? (
//                         <>
//                           <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
//                             <Brain className="w-5 h-5" />
//                           </motion.div>
//                           Analyzing...
//                         </>
//                       ) : (
//                         <>
//                           Analyze Mind
//                           <ArrowRight className="w-5 h-5" />
//                         </>
//                       )}
//                     </motion.button>
//                   </div>

//                   {error && (
//                     <motion.div
//                       initial={{ opacity: 0, scale: 0.9 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       className="p-3 bg-red-500/20 border border-red-500/30 rounded-2xl"
//                     >
//                       <p className="text-red-200 text-sm">{error}</p>
//                     </motion.div>
//                   )}
//                 </motion.div>
//               ) : (
//                 <motion.div
//                   key="ai"
//                   initial={{ x: 100, opacity: 0 }}
//                   animate={{ x: 0, opacity: 1 }}
//                   exit={{ x: 100, opacity: 0 }}
//                   className="h-full p-4 flex flex-col"
//                 >
//                   <div className="mb-4 flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <motion.div
//                         animate={{ 
//                           boxShadow: [
//                             "0 0 15px rgba(168, 85, 247, 0.4)",
//                             "0 0 30px rgba(236, 72, 153, 0.6)",
//                             "0 0 15px rgba(168, 85, 247, 0.4)"
//                           ]
//                         }}
//                         transition={{ duration: 3, repeat: Infinity }}
//                         className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl"
//                       >
//                         <Brain className="w-5 h-5 text-white" />
//                       </motion.div>
//                       <h3 className="text-lg font-bold text-white flex items-center gap-2">
//                         AI Insights
//                         <Sparkles className="w-4 h-4 text-yellow-400" />
//                       </h3>
//                     </div>
                    
//                     <motion.button
//                       onClick={() => setMobileStep(1)}
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 border border-white/20"
//                     >
//                       <ArrowLeft className="w-5 h-5" />
//                     </motion.button>
//                   </div>

//                   <div className="flex-1 rounded-2xl bg-white/5 border border-white/10 overflow-hidden backdrop-blur-sm">
//                     <AnimatePresence mode="wait">
//                       {loading ? (
//                         <motion.div
//                           key="loading"
//                           initial={{ opacity: 0 }}
//                           animate={{ opacity: 1 }}
//                           exit={{ opacity: 0 }}
//                           className="h-full flex items-center justify-center p-6"
//                         >
//                           <div className="text-center">
//                             <motion.div
//                               animate={{ rotate: 360, scale: [1, 1.2, 1] }}
//                               transition={{ rotate: { duration: 2, repeat: Infinity, ease: "linear" }, scale: { duration: 1.5, repeat: Infinity } }}
//                               className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center"
//                             >
//                               <Brain className="w-6 h-6 text-white" />
//                             </motion.div>
//                             <p className="text-white/80 text-base">Processing thoughts...</p>
//                           </div>
//                         </motion.div>
//                       ) : aiResponse ? (
//                         <motion.div
//                           key="response"
//                           initial={{ opacity: 0, y: 20 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           exit={{ opacity: 0, y: -20 }}
//                           className="h-full flex flex-col p-4"
//                         >
//                           <div className="flex-1 overflow-y-auto">
//                             <p className="text-white/90 leading-relaxed text-sm">
//                               {aiResponse}
//                             </p>
//                           </div>
                          
//                           <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
//                             <button className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs text-white/80 transition-all">
//                               <Heart className="w-3 h-3" />
//                               Helpful
//                             </button>
//                             <button className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs text-white/80 transition-all">
//                               <Lightbulb className="w-3 h-3" />
//                               Save
//                             </button>
//                           </div>
//                         </motion.div>
//                       ) : (
//                         <motion.div
//                           key="empty"
//                           className="h-full flex items-center justify-center p-6"
//                         >
//                           <div className="text-center">
//                             <Sparkles className="w-12 h-12 mx-auto mb-3 text-white/30" />
//                             <p className="text-white/60 text-base">Ready for insights</p>
//                           </div>
//                         </motion.div>
//                       )}
//                     </AnimatePresence>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Brain, Sparkles, PenTool, Zap, ArrowRight, ArrowLeft, Heart, Lightbulb } from "lucide-react";
import { auth, rtdb } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ref, push } from "firebase/database";

export default function JournalEntryOverlay({ onClose }) {
  const [entry, setEntry] = useState("");
  const [aiResponse, setAiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1); // 1: Journal, 2: AI Response

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsub();
  }, []);

  const handleSubmit = async () => {
    if (!entry.trim() || !user) return;
    setLoading(true);
    setAiResponse(null);
    setError(null);

    try {
      await push(ref(rtdb, `journals/${user.uid}`), {
        entry,
        createdAt: Date.now(),
      });

      const res = await fetch("/api/analyze-journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entry }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API request failed: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setAiResponse(data?.recommendation || "No AI response received.");
      setStep(2); // Advance to AI response
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      setError(err.message || "Something went wrong.");
      setAiResponse("Unable to get AI analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed bg-black/50 backdrop-blur-sm inset-0 z-50 flex items-center justify-center p-4 overflow-hidden"
    >
    

      {/* Main Container - Larger Dimensions */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="relative w-full max-w-2xl h-[85vh] bg-white/95 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl border border-gray-200/80 flex flex-col"
      >
        {/* Header with Enhanced Design */}
        <div className="p-5 border-b border-gray-200 bg-white relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-400 opacity-80"></div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}

                  className="p-3 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl"
                >
                  <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                  className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl blur-md -z-10"
                />
              </div>
              <div>
                 <motion.h1 
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl sm:text-4xl font-black text-white"
                  style={{
                    background: 'linear-gradient(90deg, #4f9cfaff, #916ef8ff, #f45aa9ff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  MindFlow
                </motion.h1>
                <motion.p 
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-black text-sm sm:text-base font-medium"
                >
                  Neural Journal with AI Insights
                </motion.p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Enhanced Step Indicator */}
          <div className="mt-5">
            <div className="flex items-center justify-center gap-4">
              <motion.div
                animate={{ 
                  scale: step === 1 ? 1.3 : 1,
                  backgroundColor: step === 1 ? '#3b82f6' : '#d1d5db',
                }}
                className="w-4 h-4 rounded-full transition-colors"
              />
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: step === 2 ? '100%' : '0%' }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-400 to-purple-400"
                />
              </div>
              <motion.div
                animate={{ 
                  scale: step === 2 ? 1.3 : 1,
                  backgroundColor: step === 2 ? '#8b5cf6' : '#d1d5db',
                }}
                className="w-4 h-4 rounded-full transition-colors"
              />
            </div>
            <div className="flex justify-between mt-2 text-sm font-medium text-gray-500">
              <span className={step === 1 ? "text-blue-600" : ""}>Write</span>
              <span className={step === 2 ? "text-purple-600" : ""}>Analyze</span>
            </div>
          </div>
        </div>

        {/* Content Area with Increased Height */}
        <div className="flex-1 overflow-hidden p-1">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="journal"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="h-full p-5 flex flex-col"
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="p-2.5 bg-blue-100 rounded-xl shadow-sm">
                    <PenTool className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Express Yourself</h3>
                </div>

                <motion.div
                  animate={{
                    borderColor: isFocused ? 'rgba(59, 130, 246, 0.7)' : 'rgba(209, 213, 219, 0.7)',
                    boxShadow: isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none'
                  }}
                  className="flex-1 rounded-xl border-2 bg-white border-gray-300 overflow-hidden mb-5 transition-all"
                >
                  <textarea
                    value={entry}
                    onChange={(e) => setEntry(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="What's on your mind? Let your thoughts flow freely... ✨"
                    className="w-full h-full p-5 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none resize-none text-base leading-relaxed"
                    maxLength={2000}
                    style={{ minHeight: '300px' }}
                  />
                </motion.div>
                
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-gray-500 flex items-center">
                    <span className={entry.length > 1800 ? "text-orange-500 font-medium" : ""}>
                      {entry.length}/2000
                    </span>
                    {entry.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                      >
                        {entry.split(/\s+/).filter(word => word.length > 0).length} words
                      </motion.div>
                    )}
                  </div>
                  
                  <motion.button
                    onClick={handleSubmit}
                    disabled={!entry.trim() || loading || !user}
                    whileHover={entry.trim() && user ? { scale: 1.03 } : {}}
                    whileTap={{ scale: 0.97 }}
                    className={`px-6 py-3.5 rounded-xl font-medium flex items-center gap-2 transition-all ${
                      entry.trim() && user
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-blue-400/30 hover:from-blue-600 hover:to-blue-700"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {loading ? (
                      <>
                        <motion.div 
                          animate={{ rotate: 360 }} 
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        >
                          <Brain className="w-5 h-5" />
                        </motion.div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Analyze Mind
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-50 border border-red-200 rounded-xl"
                  >
                    <p className="text-red-700 text-sm">{error}</p>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="ai"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 50, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="h-full p-5 flex flex-col"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div 
                      animate={{ 
                        rotate: [0, 5, 0, -5, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="p-2.5 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl shadow-sm"
                    >
                      <Brain className="w-5 h-5 text-purple-600" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      AI Insights
                      <Sparkles className="w-5 h-5 text-yellow-500" />
                    </h3>
                  </div>
                  
                  <motion.button
                    onClick={() => setStep(1)}
                    whileHover={{ scale: 1.05, backgroundColor: "#f3f4f6" }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm">Back</span>
                  </motion.button>
                </div>

                <div className="flex-1 rounded-xl bg-gray-50 border border-gray-200 overflow-hidden flex flex-col">
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-full flex items-center justify-center p-6"
                      >
                        <div className="text-center">
                          <motion.div
                            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                            transition={{ 
                              rotate: { duration: 2, repeat: Infinity, ease: "linear" }, 
                              scale: { duration: 1.5, repeat: Infinity } 
                            }}
                            className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center border border-purple-200/50 shadow-sm"
                          >
                            <Brain className="w-7 h-7 text-purple-600" />
                          </motion.div>
                          <p className="text-gray-600 text-base font-medium">Processing your thoughts...</p>
                          <p className="text-gray-500 text-sm mt-1">Analyzing emotional patterns</p>
                          
                          <motion.div 
                            className="flex justify-center mt-4 gap-1"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            {[...Array(3)].map((_, i) => (
                              <motion.div
                                key={i}
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                className="w-2 h-2 bg-blue-400 rounded-full mx-0.5"
                              />
                            ))}
                          </motion.div>
                        </div>
                      </motion.div>
                    ) : aiResponse ? (
                      <motion.div
                        key="response"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="h-full flex flex-col"
                      >
                        <div className="flex-1 overflow-y-auto p-5">
                          <div className="bg-white rounded-lg p-4 border border-gray-200/60 shadow-sm">
                            <p className="text-gray-700 leading-relaxed text-base">
                              {aiResponse}
                            </p>
                          </div>
                        </div>
                        
                        
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        className="h-full flex items-center justify-center p-6"
                      >
                        <div className="text-center">
                          <motion.div
                            animate={{ rotate: 10, scale: [1, 1.05, 1] }}
                            transition={{ duration: 3, repeat: Infinity }}
                          >
                            <Sparkles className="w-14 h-14 mx-auto mb-3 text-gray-400" />
                          </motion.div>
                          <p className="text-gray-500 text-base">Ready for insights</p>
                          <p className="text-gray-400 text-sm mt-1">Share your thoughts to unlock analysis</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}