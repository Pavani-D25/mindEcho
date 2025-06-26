"use client";
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, X, Loader2 } from 'lucide-react';

export default function VoiceAssistant({ onClose }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.error('Speech Recognition not supported in this browser');
        return;
      }

      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          recognitionRef.current.start();
        }
      };

      return () => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      };
    }
  }, [isListening]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setAiResponse('');
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  };

  const handleSend = async () => {
    if (!transcript || transcript === 'Listening...') return;
    
    setIsProcessing(true);
    try {
      // Call your API endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: transcript })
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      setAiResponse(data.reply);
      
      // Speak the response
      speakResponse(data.reply);
    } catch (error) {
      console.error('Error:', error);
      setAiResponse("Sorry, I couldn't process your request.");
    } finally {
      setIsProcessing(false);
    }
  };

  const speakResponse = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        layout
      >
        <div className="p-4 border-b flex justify-between items-center bg-purple-600 text-white">
          <h3 className="text-lg font-semibold">Voice Assistant</h3>
          <button 
            onClick={onClose} 
            className="text-white hover:text-purple-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-gray-50 rounded-lg p-4 min-h-32 mb-4">
            <p className="text-gray-800">
              {transcript || "Speak your thoughts and feelings..."}
            </p>
            {aiResponse && (
              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <p className="text-purple-800">{aiResponse}</p>
              </div>
            )}
            {isProcessing && (
              <div className="mt-4 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-4">
            <button
              onClick={toggleListening}
              className={`p-5 rounded-full ${
                isListening 
                  ? 'bg-red-500 animate-pulse ring-4 ring-red-200' 
                  : 'bg-purple-600 hover:bg-purple-700'
              } text-white shadow-lg transition-all`}
              aria-label={isListening ? "Stop listening" : "Start listening"}
            >
              {isListening ? (
                <MicOff className="w-6 h-6" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </button>

            {transcript && !isListening && (
              <button
                onClick={handleSend}
                disabled={isProcessing}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-medium disabled:opacity-50 transition-colors"
              >
                {isProcessing ? 'Processing...' : 'Get Recommendations'}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}