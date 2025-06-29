// "use client";
// import { useState, useEffect } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import { X } from "lucide-react";
// import { auth, rtdb } from "@/lib/firebase";
// import { onAuthStateChanged } from "firebase/auth";
// import { ref, push } from "firebase/database";

// export default function JournalEntryOverlay({ onClose }) {
//   console.log("JournalEntryOverlay mounted");
//   const [entry, setEntry] = useState("");
//   const [aiResponse, setAiResponse] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [user, setUser] = useState(null);

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

//       const data = await res.json();
//       setAiResponse(data?.recommendation || "No AI response.");
//     } catch (err) {
//       console.error(err);
//       setAiResponse("Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//     {console.log("Rendering JournalEntryOverlay")}
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 z-50 flex items-center justify-center p-4"
//     >
//       {/* Blurred Gradient Backdrop */}
//       <div
//         className="absolute inset-0 bg-gradient-to-br from-purple-100/30 to-blue-100/30 backdrop-blur-lg"
//         onClick={onClose}
//       />

//       {/* Main Journal Box */}
//       <motion.div
//         initial={{ y: 20, scale: 0.98 }}
//         animate={{ y: 0, scale: 1 }}
//         className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-white/50 border-opacity-40 p-6"
//         style={{
//           boxShadow: "0 8px 32px rgba(149, 117, 205, 0.3)",
//           background:
//             "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(246,240,255,0.8) 100%)",
//         }}
//       >
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//         >
//           <X className="w-5 h-5" />
//         </button>

//         {/* Header */}
//         <h2 className="text-2xl font-bold text-purple-700 mb-2">
//           ✍️ Journal Entry
//         </h2>
//         <p className="text-sm text-gray-600 mb-4">
//           Write your thoughts and get AI mental health support.
//         </p>

//         {/* Textarea */}
//         <textarea
//           value={entry}
//           onChange={(e) => setEntry(e.target.value)}
//           rows={6}
//           className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none text-sm bg-white/70"
//           placeholder="Today I felt..."
//         />

//         {/* Submit */}
//         <button
//           onClick={handleSubmit}
//           disabled={!entry.trim() || loading || !user}
//           className={`mt-4 w-full text-sm py-2 px-4 rounded-lg font-medium transition-all ${
//             entry.trim() && user
//               ? "bg-purple-600 hover:bg-purple-700 text-white"
//               : "bg-gray-300 text-gray-600"
//           }`}
//         >
//           {loading ? "Analyzing..." : "Save & Analyze"}
//         </button>

//         {/* AI Feedback */}
//         <AnimatePresence>
//           {aiResponse && (
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: 10 }}
//               className="mt-4 bg-purple-100 text-purple-900 p-3 rounded-md text-sm shadow-sm"
//             >
//               💡 {aiResponse}
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.div>
//     </motion.div>
//     </>
//   );
// }

// "use client";
// import { useState, useEffect } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import { X, Send, BrainCircuit } from "lucide-react";
// import { auth, rtdb } from "@/lib/firebase";
// import { onAuthStateChanged } from "firebase/auth";
// import { ref, push } from "firebase/database";

// export default function JournalEntryOverlay({ onClose }) {
//   const [entry, setEntry] = useState("");
//   const [aiResponse, setAiResponse] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [user, setUser] = useState(null);
//   const [isFocused, setIsFocused] = useState(false);

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

//       const data = await res.json();
//       setAiResponse(data?.recommendation || "No AI response.");
//     } catch (err) {
//       console.error(err);
//       setAiResponse("Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 z-50 flex items-center justify-center p-4"
//     >
//       {/* Futuristic Backdrop */}
//       <div
//         className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/80 to-purple-900/80 backdrop-blur-3xl"
//         onClick={onClose}
//       />
      
//       {/* Grid Pattern (using background image) */}
//       <div 
//         className="absolute inset-0 opacity-20"
//         style={{
//           backgroundImage: `
//             linear-gradient(to right, rgba(139, 92, 246, 0.3) 1px, transparent 1px),
//             linear-gradient(to bottom, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
//           `,
//           backgroundSize: '40px 40px'
//         }}
//       />

//       {/* Main Panel */}
//       <motion.div
//         initial={{ y: 40, scale: 0.96 }}
//         animate={{ y: 0, scale: 1 }}
//         className="relative w-full max-w-2xl rounded-2xl border border-indigo-400/30 bg-gradient-to-br from-gray-900/80 to-indigo-900/80 backdrop-blur-xl shadow-2xl overflow-hidden"
//         style={{
//           boxShadow: `
//             0 0 0 1px rgba(139, 92, 246, 0.3),
//             0 0 40px rgba(139, 92, 246, 0.2),
//             0 0 80px rgba(139, 92, 246, 0.1)
//           `,
//         }}
//       >
//         {/* Neon Border */}
//         <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
//           background: `linear-gradient(135deg, rgba(139, 92, 246, 0.6) 0%, rgba(236, 72, 153, 0.6) 100%)`,
//           mask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
//           WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
//           maskComposite: 'exclude',
//           WebkitMaskComposite: 'xor',
//           padding: '2px',
//           borderRadius: 'inherit'
//         }} />

//         {/* Header */}
//         <div className="p-6 border-b border-indigo-400/20">
//           <div className="flex justify-between items-center">
//             <div className="flex items-center space-x-3">
//               <BrainCircuit className="h-6 w-6 text-indigo-400" />
//               <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400">
//                 Neural Journal
//               </h2>
//             </div>
//             <button
//               onClick={onClose}
//               className="p-1 rounded-full hover:bg-indigo-900/50 transition-colors text-indigo-300 hover:text-white"
//             >
//               <X className="w-5 h-5" />
//             </button>
//           </div>
//           <p className="mt-1 text-sm text-indigo-300/80">
//             Your thoughts shape your reality. Let our AI analyze your patterns.
//           </p>
//         </div>

//         {/* Text Area */}
//         <div className="p-6">
//           <motion.div
//             animate={{
//               borderColor: isFocused ? "rgba(139, 92, 246, 0.8)" : "rgba(124, 58, 237, 0.3)",
//               boxShadow: isFocused 
//                 ? "0 0 0 2px rgba(167, 139, 250, 0.5), 0 0 20px rgba(139, 92, 246, 0.3)" 
//                 : "none"
//             }}
//             transition={{ duration: 0.2 }}
//             className="relative rounded-xl border border-indigo-500/30 bg-gray-900/50 backdrop-blur-sm overflow-hidden"
//           >
//             <textarea
//               value={entry}
//               onChange={(e) => setEntry(e.target.value)}
//               onFocus={() => setIsFocused(true)}
//               onBlur={() => setIsFocused(false)}
//               rows={8}
//               className="w-full p-4 bg-transparent text-gray-200 placeholder-indigo-400/50 focus:outline-none resize-none"
//               style={{
//                 scrollbarWidth: 'thin',
//                 scrollbarColor: 'rgba(139, 92, 246, 0.3) transparent'
//               }}
//               placeholder="Begin neural recording... [Describe your thoughts, feelings, and experiences]"
//             />
            
//             {/* Character Counter */}
//             <div className="absolute bottom-2 right-2 text-xs text-indigo-400/50">
//               {entry.length}/1000
//             </div>
//           </motion.div>

//           {/* Submit Button */}
//           <motion.button
//             onClick={handleSubmit}
//             disabled={!entry.trim() || loading || !user}
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             className={`mt-6 w-full py-3 px-6 rounded-xl font-medium flex items-center justify-center space-x-2 transition-all ${
//               entry.trim() && user
//                 ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
//                 : "bg-gray-800 text-gray-500 cursor-not-allowed"
//             }`}
//           >
//             {loading ? (
//               <>
//                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 <span>Analyzing Neural Patterns...</span>
//               </>
//             ) : (
//               <>
//                 <Send className="w-4 h-4" />
//                 <span>Upload to Neural Cloud</span>
//               </>
//             )}
//           </motion.button>
//         </div>

//         {/* AI Response */}
//         <AnimatePresence>
//           {aiResponse && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: 'auto' }}
//               exit={{ opacity: 0, height: 0 }}
//               className="border-t border-indigo-400/20 bg-gradient-to-b from-indigo-900/30 to-transparent"
//             >
//               <div className="p-6">
//                 <div className="flex items-start space-x-3">
//                   <div className="flex-shrink-0 p-2 rounded-lg bg-indigo-900/50 border border-indigo-400/30">
//                     <BrainCircuit className="h-5 w-5 text-indigo-300" />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <h3 className="text-sm font-semibold text-indigo-300 mb-1">NEURAL ANALYSIS</h3>
//                     <div className="text-gray-300 text-sm">
//                       <p>{aiResponse}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.div>
//     </motion.div>
//   );
// }



// "use client";
// import { useState, useEffect } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import { X, Send, BrainCircuit } from "lucide-react";
// import { auth, rtdb } from "@/lib/firebase";
// import { onAuthStateChanged } from "firebase/auth";
// import { ref, push } from "firebase/database";

// export default function JournalEntryOverlay({ onClose }) {
//   const [entry, setEntry] = useState("");
//   const [aiResponse, setAiResponse] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [user, setUser] = useState(null);
//   const [isFocused, setIsFocused] = useState(false);

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

//       const data = await res.json();
//       setAiResponse(data?.recommendation || "No AI response.");
//     } catch (err) {
//       console.error(err);
//       setAiResponse("Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 z-50 flex items-center justify-center p-4"
//     >
//       {/* Glassmorphic Backdrop */}
//       <div
//         className="absolute inset-0 bg-white/10 backdrop-blur-3xl"
//         onClick={onClose}
//       />
      
//       {/* Main Panel */}
//       <motion.div
//         initial={{ y: 40, scale: 0.96 }}
//         animate={{ y: 0, scale: 1 }}
//         className="relative w-full max-w-2xl rounded-2xl border border-lightGray-300/30 bg-white/20 backdrop-blur-xl shadow-2xl overflow-hidden"
//         style={{
//           boxShadow: `
//             0 0 0 1px rgba(245, 245, 245, 0.3),
//             0 0 40px rgba(245, 245, 245, 0.2),
//             0 0 80px rgba(245, 245, 245, 0.1)
//           `,
//         }}
//       >
//         {/* Header */}
//         <div className="p-6 border-b border-lightGray-300/20">
//           <div className="flex justify-between items-center">
//             <div className="flex items-center space-x-3">
//               <BrainCircuit className="h-6 w-6 text-lightGray-400" />
//               <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-lightGray-400 to-blue-400">
//                 Neural Journal
//               </h2>
//             </div>
//             <button
//               onClick={onClose}
//               className="p-1 rounded-full hover:bg-lightGray-200/50 transition-colors text-lightGray-300 hover:text-white"
//             >
//               <X className="w-5 h-5" />
//             </button>
//           </div>
//           <p className="mt-1 text-sm text-lightGray-300/80">
//             Your thoughts shape your reality. Let our AI analyze your patterns.
//           </p>
//         </div>

//         {/* Text Area */}
//         <div className="p-6">
//           <motion.div
//             animate={{
//               borderColor: isFocused ? "rgba(245, 245, 245, 0.8)" : "rgba(124, 58, 237, 0.3)",
//               boxShadow: isFocused 
//                 ? "0 0 0 2px rgba(167, 139, 250, 0.5), 0 0 20px rgba(139, 92, 246, 0.3)" 
//                 : "none"
//             }}
//             transition={{ duration: 0.2 }}
//             className="relative rounded-xl border border-lightGray-500/30 bg-white/50 backdrop-blur-sm overflow-hidden"
//           >
//             <textarea
//               value={entry}
//               onChange={(e) => setEntry(e.target.value)}
//               onFocus={() => setIsFocused(true)}
//               onBlur={() => setIsFocused(false)}
//                             rows={8}
//               className="w-full p-4 bg-transparent text-gray-200 placeholder-lightGray-400/50 focus:outline-none resize-none"
//               style={{
//                 scrollbarWidth: 'thin',
//                 scrollbarColor: 'rgba(245, 245, 245, 0.3) transparent'
//               }}
//               placeholder="Begin neural recording... [Describe your thoughts, feelings, and experiences]"
//             />
            
//             {/* Character Counter */}
//             <div className="absolute bottom-2 right-2 text-xs text-lightGray-400/50">
//               {entry.length}/1000
//             </div>
//           </motion.div>

//           {/* Submit Button */}
//           <motion.button
//             onClick={handleSubmit}
//             disabled={!entry.trim() || loading || !user}
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             className={`mt-6 w-full py-3 px-6 rounded-xl font-medium flex items-center justify-center space-x-2 transition-all ${
//               entry.trim() && user
//                 ? "bg-gradient-to-r from-lightGray-600 to-blue-600 text-white shadow-lg shadow-lightGray-500/20 hover:shadow-lightGray-500/40"
//                 : "bg-gray-800 text-gray-500 cursor-not-allowed"
//             }`}
//           >
//             {loading ? (
//               <>
//                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 <span>Analyzing Neural Patterns...</span>
//               </>
//             ) : (
//               <>
//                 <Send className="w-4 h-4" />
//                 <span>Upload to Neural Cloud</span>
//               </>
//             )}
//           </motion.button>
//         </div>

//         {/* AI Response */}
//         <AnimatePresence>
//           {aiResponse && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: 'auto' }}
//               exit={{ opacity: 0, height: 0 }}
//               className="border-t border-lightGray-400/20 bg-gradient-to-b from-lightGray-900/30 to-transparent"
//             >
//               <div className="p-6">
//                 <div className="flex items-start space-x-3">
//                   <div className="flex-shrink-0 p-2 rounded-lg bg-lightGray-900/50 border border-lightGray-400/30">
//                     <BrainCircuit className="h-5 w-5 text-lightGray-300" />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <h3 className="text-sm font-semibold text-lightGray-300 mb-1">NEURAL ANALYSIS</h3>
//                     <div className="text-gray-300 text-sm">
//                       <p>{aiResponse}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.div>
//     </motion.div>
//   );
// }


// import { useState, useEffect } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import { X, Send, BrainCircuit } from "lucide-react";
// import { auth, rtdb } from "@/lib/firebase";
// import { onAuthStateChanged } from "firebase/auth";
// import { ref, push } from "firebase/database";

// export default function JournalEntryOverlay({ onClose }) {
//   const [entry, setEntry] = useState("");
//   const [aiResponse, setAiResponse] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [user, setUser] = useState(null);
//   const [isFocused, setIsFocused] = useState(false);

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

//       const data = await res.json();
//       setAiResponse(data?.recommendation || "No AI response.");
//     } catch (err) {
//       console.error(err);
//       setAiResponse("Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 z-50 flex items-center justify-center p-4"
//     >
//       {/* Enhanced glassmorphic backdrop */}
//       <div 
//         className="absolute inset-0 bg-gradient-to-br from-purple-100/30 to-blue-100/30 backdrop-blur-lg" 
//         onClick={onClose} 
//       />
      
//       {/* Main container with futuristic design */}
//       <motion.div 
//         initial={{ y: 20, scale: 0.98 }}
//         animate={{ y: 0, scale: 1 }}
//         className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-white/50 border-opacity-40"
//         style={{
//                    boxShadow: '0 8px 32px rgba(149, 117, 205, 0.3)',
//           background: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(246,240,255,0.8) 100%)'
//         }}
//       >
//         {/* Holographic header */}
//         <div className="p-5 border-b border-white/30 flex justify-between items-center relative overflow-hidden">
//           <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5"></div>
//           <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 relative z-10">
//             VOICE INTERFACE
//           </h3>
//           <button
//             onClick={onClose}
//             className="p-1 rounded-full hover:bg-lightGray-200/50 transition-colors text-lightGray-300 hover:text-white"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Text Area */}
//         <div className="p-6">
//           <motion.div
//             animate={{
//               borderColor: isFocused ? "rgba(245, 245, 245, 0.8)" : "rgba(124, 58, 237, 0.3)",
//               boxShadow: isFocused 
//                 ? "0 0 0 2px rgba(167, 139, 250, 0.5), 0 0 20px rgba(139, 92, 246, 0.3)" 
//                 : "none"
//             }}
//             transition={{ duration: 0.2 }}
//             className="relative rounded-xl border border-lightGray-500/30 bg-white/50 backdrop-blur-sm overflow-hidden"
//           >
//             <textarea
//               value={entry}
//               onChange={(e) => setEntry(e.target.value)}
//               onFocus={() => setIsFocused(true)}
//               onBlur={() => setIsFocused(false)}
//               rows={8}
//               className="w-full p-4 bg-transparent text-gray-200 placeholder-lightGray-400/50 focus:outline-none resize-none"
//               style={{
//                 scrollbarWidth: 'thin',
//                 scrollbarColor: 'rgba(245, 245, 245, 0.3) transparent'
//               }}
//               placeholder="Begin neural recording... [Describe your thoughts, feelings, and experiences]"
//             />
            
//             {/* Character Counter */}
//             <div className="absolute bottom-2 right-2 text-xs text-lightGray-400/50">
//               {entry.length}/1000
//             </div>
//           </motion.div>

//           {/* Submit Button */}
//           <motion.button
//             onClick={handleSubmit}
//             disabled={!entry.trim() || loading || !user}
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             className={`mt-6 w-full py-3 px-6 rounded-xl font-medium flex items-center justify-center space-x-2 transition-all ${
//               entry.trim() && user
//                 ? "bg-gradient-to-r from-lightGray-600 to-blue-600 text-white shadow-lg shadow-lightGray-500/20 hover:shadow-lightGray-500/40"
//                 : "bg-gray-800 text-gray-500 cursor-not-allowed"
//             }`}
//           >
//             {loading ? (
//               <>
//                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="[http://www.w3.org/2000/svg"](http://www.w3.org/2000/svg") fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 <span>Analyzing Neural Patterns...</span>
//               </>
//             ) : (
//               <>
//                 <Send className="w-4 h-4" />
//                 <span>Upload to Neural Cloud</span>
//               </>
//             )}
//           </motion.button>
//         </div>

//         {/* AI Response */}
//         <AnimatePresence>
//           {aiResponse && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: 'auto' }}
//                             exit={{ opacity: 0, height: 0 }}
//               className="border-t border-lightGray-400/20 bg-gradient-to-b from-lightGray-900/30 to-transparent"
//             >
//               <div className="p-6">
//                 <div className="flex items-start space-x-3">
//                   <div className="flex-shrink-0 p-2 rounded-lg bg-lightGray-900/50 border border-lightGray-400/30">
//                     <BrainCircuit className="h-5 w-5 text-lightGray-300" />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <h3 className="text-sm font-semibold text-lightGray-300 mb-1">NEURAL ANALYSIS</h3>
//                     <div className="text-gray-300 text-sm">
//                       <p>{aiResponse}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.div>
//     </motion.div>
//   );
// }




// "use client";

// import { useState, useEffect } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import { X, Send, BrainCircuit } from "lucide-react";
// import { auth, rtdb } from "@/lib/firebase";
// import { onAuthStateChanged } from "firebase/auth";
// import { ref, push } from "firebase/database";

// export default function JournalEntryOverlay({ onClose }) {
//   const [entry, setEntry] = useState("");
//   const [aiResponse, setAiResponse] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [user, setUser] = useState(null);
//   const [isFocused, setIsFocused] = useState(false);

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

//       const data = await res.json();
//       setAiResponse(data?.recommendation || "No AI response.");
//     } catch (err) {
//       console.error(err);
//       setAiResponse("Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 z-50 flex items-center justify-center p-4"
//     >
//       {/* Blurred Backdrop */}
//       <div
//         className="absolute inset-0 bg-gradient-to-br from-purple-100/20 to-blue-100/30 backdrop-blur-2xl"
//         onClick={onClose}
//       />

//       {/* Modal Content */}
//       <motion.div
//         initial={{ y: 20, scale: 0.98 }}
//         animate={{ y: 0, scale: 1 }}
//         className="relative w-full max-w-md bg-white/70 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-[0_8px_32px_rgba(149,117,205,0.25)] overflow-hidden"
//       >
//         {/* Header */}
//         <div className="p-5 border-b border-white/20 flex justify-between items-center relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 pointer-events-none" />
//           <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 relative z-10">
//          JOURNAL YOUR THOUGHTS
//           </h3>
//           <button
//             onClick={onClose}
//             className="relative z-10 p-1 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Journal Input */}
//         <div className="p-6">
//           <motion.div
//             animate={{
//               borderColor: isFocused ? "rgba(255,255,255,0.6)" : "rgba(168,85,247,0.3)",
//               boxShadow: isFocused
//                 ? "0 0 0 2px rgba(168,85,247,0.4), 0 0 16px rgba(139,92,246,0.25)"
//                 : "none",
//             }}
//             transition={{ duration: 0.2 }}
//             className="relative rounded-xl border bg-white/40 border-white/20 backdrop-blur-md transition-all"
//           >
//             <textarea
//               value={entry}
//               onChange={(e) => setEntry(e.target.value)}
//               onFocus={() => setIsFocused(true)}
//               onBlur={() => setIsFocused(false)}
//               rows={8}
//               placeholder="Begin neural recording... [Describe your thoughts, feelings, and experiences]"
//               className="w-full p-4 bg-transparent text-gray-800 placeholder-gray-500 dark:text-white dark:placeholder-gray-400 focus:outline-none resize-none"
//               maxLength={1000}
//             />
//             <div className="absolute bottom-2 right-3 text-xs text-gray-400">
//               {entry.length}/1000
//             </div>
//           </motion.div>

//           {/* Submit Button */}
//           <motion.button
//             onClick={handleSubmit}
//             disabled={!entry.trim() || loading || !user}
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.97 }}
//             className={`mt-6 w-full py-3 px-6 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
//               entry.trim() && user
//                 ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md hover:shadow-xl"
//                 : "bg-gray-200 text-gray-400 cursor-not-allowed"
//             }`}
//           >
//             {loading ? (
//               <>
//                 <svg
//                   className="animate-spin -ml-1 h-4 w-4 text-white"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   />
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.3 0 0 5.3 0 12h4z"
//                   />
//                 </svg>
//                 <span>Analyzing Neural Patterns...</span>
//               </>
//             ) : (
//               <>
//                 <Send className="w-4 h-4" />
//                 <span>Upload to Neural Cloud</span>
//               </>
//             )}
//           </motion.button>
//         </div>

//         {/* AI Response Display */}
//         <AnimatePresence>
//           {aiResponse && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: "auto" }}
//               exit={{ opacity: 0, height: 0 }}
//               className="border-t border-white/10 bg-gradient-to-b from-gray-900/20 to-transparent"
//             >
//               <div className="p-6">
//                 <div className="flex items-start space-x-3">
//                   <div className="p-2 rounded-lg bg-black/30 border border-white/20">
//                     <BrainCircuit className="h-5 w-5 text-white/80" />
//                   </div>
//                   <div className="flex-1">
//                     <h4 className="text-sm font-semibold text-white/80 mb-1">
//                       NEURAL ANALYSIS
//                     </h4>
//                     <p className="text-sm text-white/70">{aiResponse}</p>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.div>
//     </motion.div>
//   );
// }




"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Send, Brain, Sparkles, MessageSquare, Heart, Lightbulb, PenTool, Zap } from "lucide-react";
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Enhanced Backdrop */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-50/95 via-indigo-50/90 to-purple-50/95 backdrop-blur-2xl"
        onClick={onClose}
      />
      
      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-blue-200/30 to-purple-200/30 blur-xl"
            style={{
              width: `${100 + Math.random() * 200}px`,
              height: `${100 + Math.random() * 200}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main Modal - Side by Side Layout */}
      <motion.div
        initial={{ y: 50, scale: 0.9, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 50, scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-7xl max-h-[95vh] overflow-hidden"
      >
        {/* Header Bar */}
        <div className="relative mb-6 flex justify-between items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="p-3 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg"
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-1">Neural Journal</h1>
              <p className="text-blue-600">Write your thoughts, get AI insights in real-time</p>
            </div>
          </motion.div>
          
          <motion.button
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-3 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-gray-600 hover:text-gray-800 transition-all duration-200 border border-gray-200 shadow-lg"
          >
            <X className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Side by Side Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          
          {/* Left Side - Journal Entry */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col"
          >
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl border border-gray-200 shadow-2xl flex-1 flex flex-col overflow-hidden">
              {/* Journal Header */}
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500 rounded-xl shadow-lg">
                    <PenTool className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">Your Journal</h2>
                    <p className="text-emerald-600 text-sm">Express your thoughts freely</p>
                  </div>
                </div>
              </div>

              {/* Journal Input */}
              <div className="flex-1 p-6 flex flex-col">
                <motion.div
                  animate={{
                    borderColor: isFocused 
                      ? "rgba(16, 185, 129, 0.5)" 
                      : "rgba(229, 231, 235, 0.8)",
                    boxShadow: isFocused
                      ? "0 0 0 1px rgba(16, 185, 129, 0.3), 0 0 30px rgba(16, 185, 129, 0.1)"
                      : "0 2px 10px rgba(0, 0, 0, 0.1)",
                  }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm overflow-hidden shadow-inner"
                >
                  <textarea
                    value={entry}
                    onChange={(e) => setEntry(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="What's on your mind today? Share your thoughts, feelings, experiences, or reflections..."
                    className="w-full h-full p-6 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none resize-none text-lg leading-relaxed"
                    maxLength={2000}
                  />
                </motion.div>
                
                {/* Character Counter */}
                <div className="flex justify-between items-center mt-4">
                  <div className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600 border border-gray-200">
                    {entry.length}/2000 characters
                  </div>
                  
                  {/* Submit Button */}
                  <motion.button
                    onClick={handleSubmit}
                    disabled={!entry.trim() || loading || !user}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 transition-all duration-300 ${
                      entry.trim() && user
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-teal-600"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Brain className="w-4 h-4" />
                        </motion.div>
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>Analyze</span>
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Error Display */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl"
                  >
                    <p className="text-red-600 text-sm">{error}</p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right Side - AI Analysis */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col"
          >
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl border border-gray-200 shadow-2xl flex-1 flex flex-col overflow-hidden">
              {/* AI Header */}
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ 
                      boxShadow: [
                        "0 0 20px rgba(168, 85, 247, 0.3)",
                        "0 0 30px rgba(236, 72, 153, 0.4)",
                        "0 0 20px rgba(168, 85, 247, 0.3)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg"
                  >
                    <Brain className="w-5 h-5 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                      AI Analysis
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                    </h2>
                    <p className="text-purple-600 text-sm">Personalized insights and recommendations</p>
                  </div>
                </div>
              </div>

              {/* AI Content Area */}
              <div className="flex-1 p-6 flex flex-col">
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 flex items-center justify-center"
                    >
                      <div className="text-center">
                        <motion.div
                          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center"
                        >
                          <Brain className="w-8 h-8 text-white" />
                        </motion.div>
                        <p className="text-gray-700 text-lg">Analyzing your thoughts...</p>
                        <p className="text-gray-500 text-sm mt-2">This may take a moment</p>
                      </div>
                    </motion.div>
                  ) : aiResponse ? (
                    <motion.div
                      key="response"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex-1 flex flex-col"
                    >
                      {/* Response Content */}
                      <div className="flex-1 bg-white/5 rounded-2xl p-6 border border-white/10 overflow-y-auto">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">
                            <div className="p-2 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg">
                              <MessageSquare className="w-4 h-4 text-white" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3, duration: 0.8 }}
                              className="text-white leading-relaxed text-base"
                            >
                              {aiResponse}
                            </motion.p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center gap-3 mt-4"
                      >
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm text-white transition-all duration-200 border border-white/10">
                          <Heart className="w-4 h-4" />
                          Helpful
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm text-white transition-all duration-200 border border-white/10">
                          <Lightbulb className="w-4 h-4" />
                          Save Insight
                        </button>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 flex items-center justify-center"
                    >
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-2xl flex items-center justify-center">
                          <Sparkles className="w-8 h-8 text-white/60" />
                        </div>
                        <p className="text-white/60 text-lg">AI insights will appear here</p>
                        <p className="text-white/40 text-sm mt-2">Write in your journal and click analyze</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}