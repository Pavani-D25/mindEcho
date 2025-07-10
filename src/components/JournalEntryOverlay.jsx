

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
        // className="absolute inset-0 bg-gradient-to-br from-blue-50/95 via-indigo-50/90 to-purple-50/95 backdrop-blur-2xl"
        className="absolute inset-0 bg-white/10 backdrop-blur-xl"
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
                              className="text-black leading-relaxed text-base"
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