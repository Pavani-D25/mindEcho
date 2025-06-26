"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export default function JournalModal({ onClose, onAnalyze }) {
  const [entry, setEntry] = useState("");
  const [saved, setSaved] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (entry.trim() === "") return;
    setSaved(true);
    setLoading(true);

    try {
      const response = await fetch("/api/analyze-journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entry }),
      });

      const data = await response.json();
      setAiResponse(data.recommendation);
    } catch (err) {
      setAiResponse("Sorry, I couldn't analyze that right now. Please try again later.");
    } finally {
      setLoading(false);
      setSaved(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl p-6"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold text-purple-700 mb-2">
          📝 Daily Journal
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Write your thoughts and let MindBloom give you AI-powered guidance.
        </p>

        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          rows={6}
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none text-sm"
          placeholder="Start typing your thoughts..."
        />

        <button
          onClick={handleSubmit}
          disabled={entry.trim() === "" || loading}
          className={`mt-4 w-full text-sm py-2 px-4 rounded-lg font-medium transition-all ${
            entry.trim()
              ? "bg-purple-600 hover:bg-purple-700 text-white"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          {loading ? "Analyzing..." : "Analyze & Save"}
        </button>

        <AnimatePresence>
          {aiResponse && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-4 bg-purple-50 text-purple-800 p-3 rounded-md text-sm"
            >
              💡 {aiResponse}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
