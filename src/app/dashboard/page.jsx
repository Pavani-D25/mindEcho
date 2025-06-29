// // "use client";
// // import { useState } from 'react';
// // import { AnimatePresence, motion } from 'framer-motion';
// // import { Mic, MessageSquare, Home, BookOpen, User } from 'lucide-react';
// // import MoodAnalysisChart from '../../components/MoodAnalysisChart';
// // import MoodInputCard from '../../components/MoodInputCard';
// // import DailyNotesCalendar from "@/components/DailyNotesCalendar.jsx";
// // import Recommendations from '../../components/Recommendations';
// // import VoiceAssistant from '../../components/VoiceAssistant';
// // import ChatBot from '../../components/ChatBot'; // Corrected
// // import FloatingNav from '../../components/FloatingNav';
// // import UserMenu from '@/components/UserMenu';
// // import JournalModal from '../../components/JournalModal'; // if used

// // export default function Dashboard() {
// //   const [activeView, setActiveView] = useState('home');
// //   const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
// //   const [showChatBot, setShowChatBot] = useState(false);
// //   const [showJournalModal, setShowJournalModal] = useState(false);

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
// //       {/* Top Navigation */}
// //       <header className="flex justify-between items-center mb-8">
// //         <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
// //           MindBloom
// //         </h1>
// //         <UserMenu />
// //       </header>

// //       {/* Floating Navigation */}
// //       <FloatingNav
// //         activeView={activeView}
// //         setActiveView={setActiveView}
// //         setShowVoiceAssistant={setShowVoiceAssistant}
// //         setShowChatBot={setShowChatBot}
// //         setShowJournalModal={setShowJournalModal}
// //       />

// //       {/* Conditional Rendering Based on Active View */}
// //       {activeView === 'home' && (
// //         <>
// //           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
// //             <div className="lg:col-span-2 space-y-6">
// //               <motion.div
// //                 initial={{ opacity: 0, y: 20 }}
// //                 animate={{ opacity: 1, y: 0 }}
// //                 transition={{ duration: 0.5 }}
// //                 className="bg-white rounded-2xl shadow-xl p-6"
// //               >
// //                 <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Monthly Mood Analysis</h2>
// //                 <MoodAnalysisChart />
// //               </motion.div>
// //               <MoodInputCard />
// //             </div>
// //             <div className="bg-white rounded-2xl shadow-xl p-6">
// //               <DailyNotesCalendar />
// //             </div>
// //           </div>
// //           <Recommendations />
// //         </>
// //       )}

// //       {activeView === 'mood' && (
// //         <>
// //           <motion.div
// //             initial={{ opacity: 0 }}
// //             animate={{ opacity: 1 }}
// //             className="bg-white rounded-2xl shadow-xl p-6 max-w-3xl mx-auto"
// //           >
// //             <h2 className="text-xl font-semibold mb-4 text-gray-800">Mood Dashboard</h2>
// //             <MoodAnalysisChart />
// //             <MoodInputCard />
// //             <CalendarWithMood />
// //           </motion.div>
// //         </>
// //       )}

// //       {/* Modals */}
// //       <AnimatePresence>
// //         {showVoiceAssistant && (
// //           <VoiceAssistant onClose={() => setShowVoiceAssistant(false)} />
// //         )}
// //         {showChatBot && (
// //           <ChatBot onClose={() => setShowChatBot(false)} />
// //         )}
// //         {showJournalModal && (
// //           <JournalModal onClose={() => setShowJournalModal(false)} />
// //         )}
// //       </AnimatePresence>
// //     </div>
// //   );
// // }

// "use client";
// import { useState } from "react";
// import { AnimatePresence, motion } from "framer-motion";

// import MoodAnalysisChart from "../../components/MoodAnalysisChart";
// import MoodInputCard from "../../components/MoodInputCard";
// import DailyNotesCalendar from "@/components/DailyNotesCalendar.jsx";
// import Recommendations from "../../components/Recommendations";
// import VoiceAssistant from "../../components/VoiceAssistant";
// import ChatBot from "../../components/ChatBot";
// import FloatingNav from "../../components/FloatingNav";
// import UserMenu from "@/components/UserMenu";
// import JournalEntryOverlay from "../../components/JournalEntryOverlay"; // Make sure this path is correct

// export default function Dashboard() {
//   const [activeView, setActiveView] = useState("home");
//   const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
//   const [showChatBot, setShowChatBot] = useState(false);
//   const [showJournalModal, setShowJournalModal] = useState(false);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
//       {/* Top Navigation */}
//       <header className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
//           MindBloom
//         </h1>
//         <UserMenu />
//       </header>

//       {/* Floating Navigation */}
//       <FloatingNav
//         activeView={activeView}
//         setActiveView={setActiveView}
//         setShowVoiceAssistant={setShowVoiceAssistant}
//         setShowChatBot={setShowChatBot}
//         setShowJournalModal={setShowJournalModal} // Pass setter to open journal modal
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

//       {activeView === "mood" && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="bg-white rounded-2xl shadow-xl p-6 max-w-3xl mx-auto"
//         >
//           <h2 className="text-xl font-semibold mb-4 text-gray-800">
//             Mood Dashboard
//           </h2>
//           <MoodAnalysisChart />
//           <MoodInputCard />
//           {/* CalendarWithMood component missing from your snippet — add if needed */}
//         </motion.div>
//       )}

//       {/* Modals */}
//       {/* <AnimatePresence>
//         {showVoiceAssistant && (
//           <VoiceAssistant onClose={() => setShowVoiceAssistant(false)} />
//         )}
//         {showChatBot && <ChatBot onClose={() => setShowChatBot(false)} />}
//         {showJournalModal && (
//           <JournalModal onClose={() => setShowJournalModal(false)} />
//         )}
//       </AnimatePresence> */}

//       <AnimatePresence>
//         {showVoiceAssistant && (
//           <VoiceAssistant onClose={() => setShowVoiceAssistant(false)} />
//         )}
//         {showChatBot && <ChatBot onClose={() => setShowChatBot(false)} />}
//         {showJournalModal && (
//   <>
//     {console.log("✅ JournalEntryOverlay visible")}
//     <JournalEntryOverlay onClose={() => setShowJournalModal(false)} />
//   </>
// )}

//       </AnimatePresence>
//     </div>
//   );
// }



"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Home, 
  BarChart3, 
  Mic, 
  MessageCircle, 
  PenTool, 
  Settings,
  Calendar,
  Heart,
  Brain,
  Sparkles,
  TrendingUp,
  Moon,
  Sun,
  Activity
} from "lucide-react";

// Mock components for demo
const MoodAnalysisChart = () => (
  <div className="h-64 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl flex items-center justify-center border border-purple-100">
    <div className="text-center">
      <BarChart3 className="w-12 h-12 text-purple-500 mx-auto mb-2" />
      <p className="text-gray-600">Mood Analysis Chart</p>
    </div>
  </div>
);

const MoodInputCard = () => (
  <motion.div 
    className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
    whileHover={{ y: -2 }}
    transition={{ duration: 0.2 }}
  >
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-800">How are you feeling?</h3>
      <Heart className="w-5 h-5 text-pink-500" />
    </div>
    <div className="grid grid-cols-5 gap-3">
      {['😊', '😢', '😡', '😴', '🤔'].map((emoji, i) => (
        <button
          key={i}
          className="aspect-square bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl flex items-center justify-center text-2xl hover:scale-105 transition-transform border border-purple-100"
        >
          {emoji}
        </button>
      ))}
    </div>
  </motion.div>
);

const DailyNotesCalendar = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-gray-800">Daily Notes</h3>
      <Calendar className="w-5 h-5 text-purple-500" />
    </div>
    <div className="grid grid-cols-7 gap-2">
      {Array.from({ length: 28 }, (_, i) => (
        <div
          key={i}
          className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all cursor-pointer ${
            i === 15 
              ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg' 
              : i < 15 
                ? 'bg-gradient-to-br from-purple-50 to-pink-50 text-gray-600 border border-purple-100' 
                : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
          }`}
        >
          {i + 1}
        </div>
      ))}
    </div>
  </div>
);

const Recommendations = () => (
  <motion.div 
    className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
  >
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-xl font-semibold text-gray-800">AI Recommendations</h3>
      <Sparkles className="w-6 h-6 text-purple-500" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { icon: Activity, title: "Morning Yoga", desc: "Start your day mindfully", color: "from-green-400 to-emerald-300" },
        { icon: Brain, title: "Meditation", desc: "5-minute breathing exercise", color: "from-blue-400 to-cyan-300" },
        { icon: Heart, title: "Gratitude Journal", desc: "Reflect on positive moments", color: "from-pink-400 to-rose-300" }
      ].map((item, i) => (
        <motion.div
          key={i}
          className={`p-4 rounded-xl bg-gradient-to-br ${item.color} text-white cursor-pointer`}
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <item.icon className="w-8 h-8 mb-3" />
          <h4 className="font-semibold mb-1">{item.title}</h4>
          <p className="text-sm opacity-90">{item.desc}</p>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const FloatingNav = ({ activeView, setActiveView, setShowVoiceAssistant, setShowChatBot, setShowJournalModal }) => (
  <motion.div
    className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.5 }}
  >
    <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-2">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setActiveView("home")}
          className={`p-3 rounded-xl transition-all ${
            activeView === "home" 
              ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg" 
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Home className="w-5 h-5" />
        </button>
        <button
          onClick={() => setActiveView("mood")}
          className={`p-3 rounded-xl transition-all ${
            activeView === "mood" 
              ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg" 
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <BarChart3 className="w-5 h-5" />
        </button>
        <div className="w-px h-8 bg-gray-200 mx-1" />
        <button
          onClick={() => setShowVoiceAssistant(true)}
          className="p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all"
        >
          <Mic className="w-5 h-5" />
        </button>
        <button
          onClick={() => setShowChatBot(true)}
          className="p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all"
        >
          <MessageCircle className="w-5 h-5" />
        </button>
        <button
          onClick={() => setShowJournalModal(true)}
          className="p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all"
        >
          <PenTool className="w-5 h-5" />
        </button>
      </div>
    </div>
  </motion.div>
);

const UserMenu = () => (
  <div className="flex items-center space-x-4">
    <div className="text-right">
      <p className="text-sm font-medium text-gray-700">Good morning</p>
      <p className="text-xs text-gray-500">How are you feeling today?</p>
    </div>
    <div className="relative">
      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
        JD
      </div>
      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
    </div>
  </div>
);

const VoiceAssistant = ({ onClose }) => (
  <motion.div
    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div
      className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl"
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mic className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Voice Assistant</h3>
        <p className="text-gray-600 mb-6">I'm listening... How can I help you today?</p>
        <div className="flex space-x-2 justify-center">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-2 h-8 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  </motion.div>
);

const ChatBot = ({ onClose }) => (
  <motion.div
    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div
      className="bg-white rounded-3xl p-6 max-w-lg w-full mx-4 shadow-2xl max-h-[80vh] flex flex-col"
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">MindBloom Assistant</h3>
            <p className="text-xs text-green-500">Online</p>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </div>
      
      <div className="flex-1 space-y-4 overflow-y-auto mb-4">
        <div className="bg-gray-50 rounded-2xl p-3 max-w-xs">
          <p className="text-sm">Hello! I'm here to support your mental wellness journey. How are you feeling today?</p>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl">
          Send
        </button>
      </div>
    </motion.div>
  </motion.div>
);

const JournalEntryOverlay = ({ onClose }) => (
  <motion.div
    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div
      className="bg-white rounded-3xl p-6 max-w-2xl w-full mx-4 shadow-2xl max-h-[80vh] flex flex-col"
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <PenTool className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Daily Journal</h3>
            <p className="text-sm text-gray-500">Express your thoughts and feelings</p>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">
          ✕
        </button>
      </div>
      
      <div className="flex-1 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">How was your day?</label>
          <textarea
            className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            placeholder="Write about your day, your feelings, or anything on your mind..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gratitude</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="What are you grateful for today?"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tomorrow's Goal</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="What do you want to accomplish tomorrow?"
          />
        </div>
      </div>
      
      <div className="flex space-x-3 mt-6">
        <button
          onClick={onClose}
          className="flex-1 py-3 px-4 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all">
          Save Entry
        </button>
      </div>
    </motion.div>
  </motion.div>
);

export default function Dashboard() {
  const [activeView, setActiveView] = useState("home");
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [showChatBot, setShowChatBot] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Top Navigation */}
      <motion.header 
        className="flex justify-between items-center mb-8 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              MindBloom
            </h1>
            <p className="text-sm text-gray-500">Your wellness companion</p>
          </div>
        </div>
        <UserMenu />
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {activeView === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-800">
                        Monthly Mood Analysis
                      </h2>
                      <TrendingUp className="w-5 h-5 text-purple-500" />
                    </div>
                    <MoodAnalysisChart />
                  </motion.div>
                  <MoodInputCard />
                </div>
                <motion.div 
                  className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <DailyNotesCalendar />
                </motion.div>
              </div>
              <Recommendations />
            </motion.div>
          )}

          {activeView === "mood" && (
            <motion.div
              key="mood"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 max-w-4xl mx-auto border border-white/20">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">Mood Dashboard</h2>
                    <p className="text-sm text-gray-500">Track and analyze your emotional patterns</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <MoodAnalysisChart />
                  <MoodInputCard />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Navigation */}
      <FloatingNav
        activeView={activeView}
        setActiveView={setActiveView}
        setShowVoiceAssistant={setShowVoiceAssistant}
        setShowChatBot={setShowChatBot}
        setShowJournalModal={setShowJournalModal}
      />

      {/* Modals */}
      <AnimatePresence>
        {showVoiceAssistant && (
          <VoiceAssistant onClose={() => setShowVoiceAssistant(false)} />
        )}
        {showChatBot && (
          <ChatBot onClose={() => setShowChatBot(false)} />
        )}
        {showJournalModal && (
          <JournalEntryOverlay onClose={() => setShowJournalModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}