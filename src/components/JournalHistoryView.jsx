"use client";

import { useState, useEffect } from "react";
import { BookOpen, Calendar, Clock, Heart, Brain, Trash2 } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { rtdb, auth } from "@/lib/firebase";
import { ref, onValue, remove } from "firebase/database";

export default function JournalHistoryView() {
  const [journalEntries, setJournalEntries] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

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

  useEffect(() => {
    if (!userId) return;

    const recRef = ref(rtdb, `recommendations/${userId}`);
    const unsubscribe = onValue(recRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const entries = Object.keys(data)
          .map((key) => ({
            id: key,
            ...data[key],
          }))
          .filter(entry => entry.journalText) // Only show entries with journal text
          .sort((a, b) => b.timestamp - a.timestamp); // Sort by newest first
        
        setJournalEntries(entries);
      } else {
        setJournalEntries([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMoodEmoji = (mood) => {
    const moodMap = {
      happy: "😁",
      sad: "😟",
      neutral: "😑",
      excited: "😎",
      loved: "😍"
    };
    return moodMap[mood] || "🤔";
  };

  const getMoodColor = (mood) => {
    const colorMap = {
      happy: "from-yellow-400 to-amber-300",
      sad: "from-blue-400 to-indigo-300",
      neutral: "from-gray-400 to-slate-300",
      excited: "from-orange-400 to-amber-300",
      loved: "from-pink-400 to-rose-300"
    };
    return colorMap[mood] || "from-gray-400 to-slate-300";
  };

  const handleDeleteEntry = async (entryId) => {
    if (!userId) return;
    
    try {
      const entryRef = ref(rtdb, `recommendations/${userId}/${entryId}`);
      await remove(entryRef);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200 max-w-5xl mx-auto min-h-[600px] w-full">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 border border-gray-200 max-w-5xl mx-auto min-h-[600px] w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Journal History</h2>
            <p className="text-sm text-gray-600">Your emotional journey over time</p>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {journalEntries.length} {journalEntries.length === 1 ? 'entry' : 'entries'}
        </div>
      </div>

      {journalEntries.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No journal entries yet</h3>
          <p className="text-gray-500">Start journaling to track your emotional journey</p>
        </div>
      ) : (
        <div className="space-y-4">
          {journalEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setSelectedEntry(selectedEntry === entry.id ? null : entry.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getMoodColor(entry.mood)} flex items-center justify-center`}>
                      <span className="text-sm">{getMoodEmoji(entry.mood)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(entry.timestamp)}</span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-gray-800 leading-relaxed">
                      {selectedEntry === entry.id ? entry.journalText : truncateText(entry.journalText)}
                    </p>
                  </div>

                  {selectedEntry === entry.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <Brain className="w-4 h-4 mr-2" />
                        AI Recommendations
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {entry.exercise && (
                          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                            <h5 className="font-medium text-purple-700 text-sm mb-1">Activity</h5>
                            <p className="text-xs text-purple-600 mb-1">{entry.exercise.title}</p>
                            <p className="text-xs text-gray-600">{entry.exercise.description}</p>
                          </div>
                        )}
                        {entry.song && (
                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <h5 className="font-medium text-blue-700 text-sm mb-1">Music</h5>
                            <p className="text-xs text-blue-600 mb-1">{entry.song.title}</p>
                            <p className="text-xs text-gray-600">{entry.song.description}</p>
                          </div>
                        )}
                        {entry.movie && (
                          <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                            <h5 className="font-medium text-orange-700 text-sm mb-1">Visual</h5>
                            <p className="text-xs text-orange-600 mb-1">{entry.movie.title}</p>
                            <p className="text-xs text-gray-600">{entry.movie.description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteConfirm(entry.id);
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
<div className="fixed inset-0 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 shadow-lg flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Delete Entry?</h3>
            <p className="text-gray-600 mb-4">This action cannot be undone.</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteEntry(showDeleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}