// // "use client";
// // import { motion } from "framer-motion";
// // import { Home, HeartPulse, MessageSquare, Mic, BookOpen } from "lucide-react";

// // export default function FloatingNav({
// //   activeView,
// //   setActiveView,
// //   setShowVoiceAssistant,
// //   setShowChatBot,
// //   setShowJournalModal,
// // }) {
// //   const navItems = [
// //     {
// //       name: "home",
// //       label: "Home",
// //       icon: <Home className="h-5 w-5" />,
// //       onClick: () => setActiveView("home"),
// //     },
// //     {
// //       name: "mood",
// //       label: "Mood",
// //       icon: <HeartPulse className="h-5 w-5" />,
// //       onClick: () => setActiveView("mood"),
// //     },
// //     {
// //       name: "journal",
// //       label: "Journal",
// //       icon: <BookOpen className="h-5 w-5" />,
// //       onClick: () => setShowJournalModal(true),
// //     },
// //     {
// //       name: "chat",
// //       label: "Chat",
// //       icon: <MessageSquare className="h-5 w-5" />,
// //       onClick: () => setShowChatBot(true),
// //     },
// //     {
// //       name: "voice",
// //       label: "Voice",
// //       icon: <Mic className="h-5 w-5" />,
// //       onClick: () => setShowVoiceAssistant(true),
// //     },
// //   ];

// //   return (
// //     <motion.div
// //       initial={{ opacity: 0, y: 60 }}
// //       animate={{ opacity: 1, y: 0 }}
// //       transition={{ duration: 0.4 }}
// //       className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-md rounded-full bg-black/70 backdrop-blur-lg border border-white/10 shadow-xl px-2 py-2 flex justify-between"
// //     >
// //       {navItems.map((item) => {
// //         const isActive = activeView === item.name;
// //         return (
// //           <button
// //             key={item.name}
// //             onClick={item.onClick}
// //             className={`relative flex items-center justify-center p-0 transition-all ${
// //               isActive ? "h-12 w-12 -mt-6" : "h-10 w-10 hover:scale-110"
// //             }`}
// //           >
// //             {isActive && (
// //               <motion.span 
// //                 layoutId="nav-bubble"
// //                 className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg"
// //                 transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
// //               />
// //             )}
// //             <div className={`relative z-10 p-2 rounded-full ${
// //               isActive 
// //                 ? "text-white" 
// //                 : "text-white/70 bg-white/10 hover:bg-white/20"
// //             }`}>
// //               {item.icon}
// //             </div>
// //             {isActive && (
// //               <motion.span 
// //                 initial={{ opacity: 0, y: 10 }}
// //                 animate={{ opacity: 1, y: 0 }}
// //                 className="absolute -bottom-5 text-xs text-white font-medium"
// //               >
// //                 {item.label}
// //               </motion.span>
// //             )}
// //           </button>
// //         );
// //       })}
// //     </motion.div>
// //   );
// // }



// "use client";

// import { motion } from "framer-motion";
// import {
//   Home,
//   HeartPulse,
//   MessageSquare,
//   Mic,
//   BookOpen,
// } from "lucide-react";

// export default function FloatingNav({
//   activeView,
//   setActiveView,
//   setShowVoiceAssistant,
//   setShowChatBot,
//   setShowJournalModal,
// }) {
//   const navItems = [
//     {
//       name: "home",
//       label: "Home",
//       icon: <Home className="h-5 w-5" />,
//       action: () => setActiveView("home"),
//     },
//     {
//       name: "mood",
//       label: "Mood",
//       icon: <HeartPulse className="h-5 w-5" />,
//       action: () => setActiveView("mood"),
//     },
//     {
//       name: "journal",
//       label: "Journal",
//       icon: <BookOpen className="h-5 w-5" />,
//       action: () => setShowJournalModal(true),
//     },
//     {
//       name: "chat",
//       label: "Chat",
//       icon: <MessageSquare className="h-5 w-5" />,
//       action: () => setShowChatBot(true),
//     },
//     {
//       name: "voice",
//       label: "Voice",
//       icon: <Mic className="h-5 w-5" />,
//       action: () => setShowVoiceAssistant(true),
//     },
//   ];

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 60 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//       className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-md rounded-full bg-black/70 backdrop-blur-lg border border-white/10 shadow-xl px-2 py-2 flex justify-between"
//     >
//       {navItems.map((item) => {
//         const isActive = activeView === item.name;

//         return (
//           <button
//             key={item.name}
//             onClick={item.action}
//             className={`relative flex flex-col items-center justify-center transition-all ${
//               isActive ? "h-12 w-12 -mt-6" : "h-10 w-10 hover:scale-110"
//             }`}
//           >
//             {/* Active background bubble */}
//             {isActive && (
//               <motion.span
//                 layoutId="nav-bubble"
//                 className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-md"
//                 transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
//               />
//             )}

//             {/* Icon */}
//             <div
//               className={`relative z-10 p-2 rounded-full ${
//                 isActive
//                   ? "text-white"
//                   : "text-white/70 bg-white/10 hover:bg-white/20"
//               }`}
//             >
//               {item.icon}
//             </div>

//             {/* Label */}
//             {isActive && (
//               <motion.span
//                 initial={{ opacity: 0, y: 6 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="absolute -bottom-5 text-xs text-white font-medium"
//               >
//                 {item.label}
//               </motion.span>
//             )}
//           </button>
//         );
//       })}
//     </motion.div>
//   );
// }


x