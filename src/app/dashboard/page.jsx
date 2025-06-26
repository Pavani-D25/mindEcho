"use client";
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Mic, MessageSquare, Home, BookOpen, User } from 'lucide-react';
import MoodAnalysisChart from '../../components/MoodAnalysisChart';
import MoodInputCard from '../../components/MoodInputCard';
import DailyNotesCalendar from "@/components/DailyNotesCalendar.jsx";
import Recommendations from '../../components/Recommendations';
import VoiceAssistant from '../../components/VoiceAssistant';
import ChatBot from '../../components/ChatBot'; // Corrected
import FloatingNav from '../../components/FloatingNav';
import UserMenu from '@/components/UserMenu';
import JournalModal from '../../components/JournalModal'; // if used

export default function Dashboard() {
  const [activeView, setActiveView] = useState('home');
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [showChatBot, setShowChatBot] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      {/* Top Navigation */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
          MindBloom
        </h1>
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

      {/* Conditional Rendering Based on Active View */}
      {activeView === 'home' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Monthly Mood Analysis</h2>
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

      {activeView === 'mood' && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl p-6 max-w-3xl mx-auto"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Mood Dashboard</h2>
            <MoodAnalysisChart />
            <MoodInputCard />
            <CalendarWithMood />
          </motion.div>
        </>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showVoiceAssistant && (
          <VoiceAssistant onClose={() => setShowVoiceAssistant(false)} />
        )}
        {showChatBot && (
          <ChatBot onClose={() => setShowChatBot(false)} />
        )}
        {showJournalModal && (
          <JournalModal onClose={() => setShowJournalModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
