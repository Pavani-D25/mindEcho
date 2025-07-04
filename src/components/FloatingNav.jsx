// // // "use client";
// // // import { motion } from 'framer-motion';
// // // import { Home, BookOpen, MessageSquare, Mic } from 'lucide-react';

// // // export default function FloatingNav({ activeView, setActiveView, setShowVoiceAssistant, setShowChatBot }) {
// // //   const navItems = [
// // //     { id: 'home', icon: <Home className="w-5 h-5" />, label: 'Home' },
// // //     { id: 'journal', icon: <BookOpen className="w-5 h-5" />, label: 'Journal' },
// // //   ];

// // //   return (
// // //     <motion.div
// // //       initial={{ y: -50, opacity: 0 }}
// // //       animate={{ y: 0, opacity: 1 }}
// // //       transition={{ duration: 0.5 }}
// // //       className="fixed left-1/2 transform -translate-x-1/2 top-20 z-50"
// // //     >
// // //       <div className="flex items-center bg-white rounded-full shadow-lg p-2 space-x-2">
// // //         {navItems.map((item) => (
// // //           <button
// // //             key={item.id}
// // //             onClick={() => setActiveView(item.id)}
// // //             className={`flex items-center justify-center p-3 rounded-full transition-all ${
// // //               activeView === item.id ? 'bg-purple-100 text-purple-600' : 'text-gray-500 hover:bg-gray-100'
// // //             }`}
// // //           >
// // //             {item.icon}
// // //           </button>
// // //         ))}

// // //         <div className="h-6 w-px bg-gray-200 mx-1"></div>

// // //         <button
// // //           onClick={() => setShowChatBot(true)}
// // //           className="flex items-center justify-center p-3 rounded-full text-gray-500 hover:bg-gray-100"
// // //         >
// // //           <MessageSquare className="w-5 h-5" />
// // //         </button>

// // //         <button
// // //           onClick={() => setShowVoiceAssistant(true)}
// // //           className="flex items-center justify-center p-3 rounded-full text-gray-500 hover:bg-gray-100"
// // //         >
// // //           <Mic className="w-5 h-5" />
// // //         </button>
// // //       </div>
// // //     </motion.div>
// // //   );
// // // }


// // "use client";
// // import { motion } from 'framer-motion';
// // import { Home, BookOpen, MessageSquare, Mic } from 'lucide-react';

// // export default function FloatingNav({ 
// //   activeView, 
// //   setActiveView, 
// //   setShowVoiceAssistant, 
// //   setShowChatBot,
// //   setShowJournalModal // Add this prop
// // }) {
// //   const navItems = [
// //     { 
// //       id: 'home', 
// //       icon: <Home className="w-5 h-5" />, 
// //       label: 'Home',
// //       action: () => setActiveView('home')
// //     },
// //     { 
// //       id: 'journal', 
// //       icon: <BookOpen className="w-5 h-5" />, 
// //       label: 'Journal',
// //       action: () => {
// //         console.log('Journal button clicked');
// //         setShowJournalModal(true); // Use the modal setter instead
// //       }
// //     },
// //   ];

// //   return (
// //     <motion.div
// //       initial={{ y: -50, opacity: 0 }}
// //       animate={{ y: 0, opacity: 1 }}
// //       transition={{ duration: 0.5 }}
// //       className="fixed left-1/2 transform -translate-x-1/2 top-20 z-50"
// //     >
// //       <div className="flex items-center bg-white rounded-full shadow-lg p-2 space-x-2">
// //         {navItems.map((item) => (
// //           <button
// //             key={item.id}
// //             onClick={item.action}
// //             className={`flex items-center justify-center p-3 rounded-full transition-all ${
// //               activeView === item.id ? 'bg-purple-100 text-purple-600' : 'text-gray-500 hover:bg-gray-100'
// //             }`}
// //           >
// //             {item.icon}
// //           </button>
// //         ))}

// //         <div className="h-6 w-px bg-gray-200 mx-1"></div>

// //         <button
// //           onClick={() => {
// //             console.log('Chat button clicked');
// //             setShowChatBot(true);
// //           }}
// //           className="flex items-center justify-center p-3 rounded-full text-gray-500 hover:bg-gray-100"
// //         >
// //           <MessageSquare className="w-5 h-5" />
// //         </button>

// //         <button
// //           onClick={() => {
// //             console.log('Voice button clicked');
// //             setShowVoiceAssistant(true);
// //           }}
// //           className="flex items-center justify-center p-3 rounded-full text-gray-500 hover:bg-gray-100"
// //         >
// //           <Mic className="w-5 h-5" />
// //         </button>
// //       </div>
// //     </motion.div>
// //   );
// // }


// "use client";
// import { motion } from 'framer-motion';
// import { Home, BookOpen, MessageCircle, Mic, PenTool, BarChart3 } from 'lucide-react';

// export default function FloatingNav({ 
//   activeView, 
//   setActiveView, 
//   setShowVoiceAssistant, 
//   setShowChatBot,
//   setShowJournalModal
// }) {
//   return (
//     <motion.div
//       className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
//       initial={{ y: 100, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       transition={{ delay: 0.5 }}
//     >
//       <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-2">
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={() => {
//               console.log('Home button clicked');
//               setActiveView("home");
//             }}
//             className={`p-3 rounded-xl transition-all ${
//               activeView === "home" 
//                 ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg" 
//                 : "text-gray-600 hover:bg-gray-100"
//             }`}
//           >
//             <Home className="w-5 h-5" />
//           </button>
//           <button
//             onClick={() => {
//               console.log('Mood button clicked');
//               setActiveView("mood");
//             }}
//             className={`p-3 rounded-xl transition-all ${
//               activeView === "mood" 
//                 ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg" 
//                 : "text-gray-600 hover:bg-gray-100"
//             }`}
//           >
//             <BarChart3 className="w-5 h-5" />
//           </button>
//           <div className="w-px h-8 bg-gray-200 mx-1" />
//           <button
//             onClick={() => {
//               console.log('Voice button clicked');
//               setShowVoiceAssistant(true);
//             }}
//             className="p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all"
//           >
//             <Mic className="w-5 h-5" />
//           </button>
//           <button
//             onClick={() => {
//               console.log('Chat button clicked');
//               setShowChatBot(true);
//             }}
//             className="p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all"
//           >
//             <MessageCircle className="w-5 h-5" />
//           </button>
//           <button
//             onClick={() => {
//               console.log('Journal button clicked');
//               setShowJournalModal(true);
//             }}
//             className="p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all"
//           >
//             <PenTool className="w-5 h-5" />
//           </button>
//         </div>
//       </div>
//     </motion.div>
//   );
// }


"use client";
import { motion } from 'framer-motion';
import { Home, BookOpen, MessageCircle, Mic, PenTool } from 'lucide-react';

export default function FloatingNav({ 
  activeView, 
  setActiveView, 
  setShowVoiceAssistant, 
  setShowChatBot,
  setShowJournalModal
}) {
  return (
    <motion.div
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              console.log('Home button clicked');
              setActiveView("home");
            }}
            className={`p-3 rounded-xl transition-all ${
              activeView === "home" 
                ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg" 
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
             <Home className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              console.log('Mood button clicked');
              setActiveView("mood");
            }}
            className={`p-3 rounded-xl transition-all ${
              activeView === "mood" 
                ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg" 
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <BookOpen className="w-5 h-5" />
          </button>
          <div className="w-px h-8 bg-gray-200 mx-1" />
          <button
            onClick={() => {
              console.log('Voice button clicked');
              setShowVoiceAssistant(true);
            }}
            className="p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all"
          >
            <Mic className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              console.log('Chat button clicked');
              setShowChatBot(true);
            }}
            className="p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all"
          >
            <MessageCircle className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              console.log('Journal button clicked');
              setShowJournalModal(true);
            }}
            className="p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all"
          >
            <PenTool className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}