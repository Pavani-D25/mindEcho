

// "use client";
// import { useState } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import {  Brain } from "lucide-react";

// import MoodAnalysisChart from "../../components/MoodAnalysisChart";
// import MoodInputCard from "../../components/MoodInputCard";
// import DailyNotesCalendar from "@/components/DailyNotesCalendar.jsx";
// import Recommendations from "../../components/Recommendations";
// import VoiceAssistant from "../../components/VoiceAssistant";
// import ChatBot from "../../components/ChatBot";
// import FloatingNav from "../../components/FloatingNav";
// import UserMenu from "@/components/UserMenu";
// import JournalEntryOverlay from "../../components/JournalEntryOverlay";
// import JournalHistoryView from "../../components/JournalHistoryView"; // ADD THIS IMPORT

// export default function Dashboard() {
//   const [activeView, setActiveView] = useState("home");
//   const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
//   const [showChatBot, setShowChatBot] = useState(false);
//   const [showJournalModal, setShowJournalModal] = useState(false);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
//       {/* Top Navigation */}
//       <header className="flex justify-between items-center mb-8">
//         <div className="flex items-center space-x-2">
//           <Brain className="w-8 h-8 text-purple-600" />
//           <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
//             MindEcho
//           </h1>
//         </div>

//         <p className="hidden md:block flex-1 text-center text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
//           Your AI Mental Health Assistant
//         </p>

//         <UserMenu />
//       </header>

//       {/* Floating Navigation */}
//       <FloatingNav
//         activeView={activeView}
//         setActiveView={setActiveView}
//         setShowVoiceAssistant={setShowVoiceAssistant}
//         setShowChatBot={setShowChatBot}
//         setShowJournalModal={setShowJournalModal}
//       />

//       {/* Conditional Views */}
//       {activeView === "home" && (
//         <>
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//             <div className="lg:col-span-2 space-y-6">
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//                 className="bg-white rounded-2xl shadow-xl p-6"
//               >
//                 <h2 className="text-xl font-semibold mb-4 text-gray-800">
//                   Your Monthly Mood Analysis
//                 </h2>
//                 <MoodAnalysisChart />
//               </motion.div>
//               <MoodInputCard />
//             </div>
//             <div className="bg-white rounded-2xl shadow-xl p-6">
//               <DailyNotesCalendar />
//             </div>
//           </div>
//           <Recommendations />
//         </>
//       )}

//       {/* REPLACE THIS ENTIRE SECTION */}
//       {activeView === "mood" && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           <JournalHistoryView />
//         </motion.div>
//       )}

//       {/* Modals */}
//       <AnimatePresence>
//         {showVoiceAssistant && (
//           <VoiceAssistant onClose={() => setShowVoiceAssistant(false)} />
//         )}
//         {showChatBot && <ChatBot onClose={() => setShowChatBot(false)} />}
//         {showJournalModal && (
//           <>
//             {console.log("✅ JournalEntryOverlay visible")}
//             <JournalEntryOverlay onClose={() => setShowJournalModal(false)} />
//           </>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Brain } from "lucide-react";

import MoodAnalysisChart from "../../components/MoodAnalysisChart";
import MoodInputCard from "../../components/MoodInputCard";
import DailyNotesCalendar from "@/components/DailyNotesCalendar.jsx";
import Recommendations from "../../components/Recommendations";
import VoiceAssistant from "../../components/VoiceAssistant";
import ChatBot from "../../components/ChatBot";
import FloatingNav from "../../components/FloatingNav";
import UserMenu from "@/components/UserMenu";
import JournalEntryOverlay from "../../components/JournalEntryOverlay";
import JournalHistoryView from "../../components/JournalHistoryView";
import FaceDetection from "../../components/FaceDetection"; // ✅ NEW IMPORT

export default function Dashboard() {
  const [activeView, setActiveView] = useState("home");
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [showChatBot, setShowChatBot] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      {/* Top Navigation */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-2">
          <Brain className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            MindEcho
          </h1>
        </div>

        <p className="hidden md:block flex-1 text-center text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
          Your AI Mental Health Assistant
        </p>

        <UserMenu />
      </header>

      {/* Floating Navigation */}
      <FloatingNav
        activeView={activeView}
        setActiveView={setActiveView}
        setShowVoiceAssistant={setShowVoiceAssistant}
        setShowChatBot={setShowChatBot}
        setShowJournalModal={setShowJournalModal}
      />

      {/* Conditional Views */}
      {activeView === "home" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Your Monthly Mood Analysis
                </h2>
                <MoodAnalysisChart />
              </motion.div>
              <MoodInputCard />
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <DailyNotesCalendar />
            </div>
          </div>
          <Recommendations />
        </>
      )}

      {/* Journal History */}
      {activeView === "mood" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <JournalHistoryView />
        </motion.div>
      )}

      {/* ✅ Face Echo View */}
      {activeView === "face" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FaceDetection onClose={() => setActiveView("home")} />
        </motion.div>
      )}

      {/* Modals */}
      <AnimatePresence>
        <VoiceAssistant 
  isOpen={showVoiceAssistant} 
  onClose={() => setShowVoiceAssistant(false)} 
/>
        {showChatBot && <ChatBot onClose={() => setShowChatBot(false)} />}
        {showJournalModal && (
          <>
            {console.log("✅ JournalEntryOverlay visible")}
            <JournalEntryOverlay onClose={() => setShowJournalModal(false)} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
