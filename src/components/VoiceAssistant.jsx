// "use client";
// import { useState, useEffect, useRef } from 'react';
// import { motion } from 'framer-motion';
// import { Mic, MicOff, X, Loader2 } from 'lucide-react';

// export default function VoiceAssistant({ onClose }) {
//   const [isListening, setIsListening] = useState(false);
//   const [transcript, setTranscript] = useState('');
//   const [aiResponse, setAiResponse] = useState('');
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [audioLevel, setAudioLevel] = useState(0);
//   const recognitionRef = useRef(null);
//   const animationRef = useRef(null);

//   // Audio level animation
//   useEffect(() => {
//     if (isListening) {
//       const updateAudioLevel = () => {
//         setAudioLevel(Math.random() * 100);
//         animationRef.current = requestAnimationFrame(updateAudioLevel);
//       };
//       animationRef.current = requestAnimationFrame(updateAudioLevel);
//       return () => cancelAnimationFrame(animationRef.current);
//     } else {
//       setAudioLevel(0);
//     }
//   }, [isListening]);

//   // Initialize speech recognition
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//       if (!SpeechRecognition) {
//         console.error('Speech Recognition not supported in this browser');
//         return;
//       }

//       recognitionRef.current = new SpeechRecognition();
//       recognitionRef.current.continuous = true;
//       recognitionRef.current.interimResults = true;
//       recognitionRef.current.lang = 'en-US';

//       recognitionRef.current.onresult = (event) => {
//         let interimTranscript = '';
//         let finalTranscript = '';

//         for (let i = event.resultIndex; i < event.results.length; i++) {
//           const transcript = event.results[i][0].transcript;
//           if (event.results[i].isFinal) {
//             finalTranscript += transcript + ' ';
//           } else {
//             interimTranscript += transcript;
//           }
//         }

//         setTranscript(finalTranscript || interimTranscript);
//       };

//       recognitionRef.current.onerror = (event) => {
//         console.error('Speech recognition error', event.error);
//         setIsListening(false);
//       };

//       recognitionRef.current.onend = () => {
//         if (isListening) {
//           recognitionRef.current.start();
//         }
//       };

//       return () => {
//         if (recognitionRef.current) {
//           recognitionRef.current.stop();
//         }
//         cancelAnimationFrame(animationRef.current);
//       };
//     }
//   }, [isListening]);

//   const toggleListening = () => {
//     if (isListening) {
//       recognitionRef.current.stop();
//       setIsListening(false);
//     } else {
//       try {
//         recognitionRef.current.start();
//         setIsListening(true);
//         setAiResponse('');
//       } catch (error) {
//         console.error('Error starting recognition:', error);
//       }
//     }
//   };

//   const handleSend = async () => {
//     if (!transcript) return;
    
//     setIsProcessing(true);
//     try {
//       const response = await fetch('/api/chat', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ prompt: transcript })
//       });

//       if (!response.ok) throw new Error('API request failed');

//       const data = await response.json();
//       setAiResponse(data.reply);
//       speakResponse(data.reply);
//     } catch (error) {
//       console.error('Error:', error);
//       setAiResponse("Sorry, I couldn't process your request.");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const speakResponse = (text) => {
//     if ('speechSynthesis' in window) {
//       const utterance = new SpeechSynthesisUtterance(text);
//       utterance.rate = 0.9;
//       utterance.pitch = 0.8;
//       window.speechSynthesis.speak(utterance);
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
//           boxShadow: '0 8px 32px rgba(149, 117, 205, 0.3)',
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
//             className="p-1.5 rounded-full hover:bg-white/30 transition-all relative z-10"
//           >
//             <X className="w-5 h-5 text-purple-600" />
//           </button>
//         </div>

//         {/* Content area */}
//         <div className="p-6">
//           {/* Futuristic glass panel with dynamic audio visualization */}
//           <div className="relative bg-white/60 rounded-2xl p-5 min-h-48 mb-6 border border-white/50 overflow-hidden">
//             {/* Audio visualization bars */}
//             {isListening && (
//               <div className="absolute inset-0 flex items-end justify-center gap-1 px-4 pb-3 pointer-events-none">
//                 {Array.from({ length: 20 }).map((_, i) => (
//                   <motion.div
//                     key={i}
//                     animate={{
//                       height: `${Math.random() * audioLevel}%`,
//                     }}
//                     transition={{ duration: 0.2 }}
//                     className="w-1.5 bg-gradient-to-t from-purple-400 to-blue-400 rounded-t-full"
//                     style={{ height: `${Math.random() * 30}%` }}
//                   />
//                 ))}
//               </div>
//             )}
            
//             {/* Text content */}
//             <div className="relative z-10">
//               <p className="text-gray-800 mb-4">
//                 {transcript || (
//                   <span className="text-gray-500/80">Speak your thoughts...</span>
//                 )}
//               </p>
//               {aiResponse && (
//                 <div className="p-4 bg-gradient-to-r from-purple-50/70 to-blue-50/70 rounded-xl border border-purple-200/50 backdrop-blur-sm">
//                   <p className="text-gray-800">{aiResponse}</p>
//                 </div>
//               )}
//               {isProcessing && (
//                 <div className="flex items-center justify-center mt-4 space-x-2">
//                   {[1, 2, 3].map((i) => (
//                     <motion.div
//                       key={i}
//                       animate={{ opacity: [0.3, 1, 0.3] }}
//                       transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
//                       className="w-2 h-2 bg-purple-600 rounded-full"
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Futuristic mic button with halo effect */}
//           <div className="flex justify-center mb-6">
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={toggleListening}
//               className={`relative p-6 rounded-full ${
//                 isListening 
//                   ? 'bg-red-500/90 shadow-lg shadow-red-400/30' 
//                   : 'bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg'
//               } text-white border-2 border-white/50`}
//               style={{
//                 backdropFilter: 'blur(10px)'
//               }}
//             >
//               {isListening ? (
//                 <>
//                   <MicOff className="w-7 h-7" />
//                   <div className="absolute inset-0 rounded-full border-2 border-red-400/50 animate-pulse"></div>
//                 </>
//               ) : (
//                 <>
//                   <Mic className="w-7 h-7" />
//                   <div className="absolute inset-0 rounded-full border-2 border-white/30"></div>
//                 </>
//               )}
//             </motion.button>
//           </div>

//           {/* Submit button with futuristic styling */}
//           {transcript && !isListening && (
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={handleSend}
//               disabled={isProcessing}
//               className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3.5 px-6 rounded-xl font-medium disabled:opacity-50 transition-all shadow-lg relative overflow-hidden"
//             >
//               <span className="relative z-10">
//                 {isProcessing ? (
//                   <span className="flex items-center justify-center gap-2">
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                     PROCESSING
//                   </span>
//                 ) : (
//                   'GET RESPONSE'
//                 )}
//               </span>
//               <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-blue-500/30 opacity-0 hover:opacity-100 transition-opacity"></div>
//             </motion.button>
//           )}
//         </div>

//         {/* Futuristic footer */}
//         <div className="px-5 py-3 bg-white/30 border-t border-white/30 text-center">
//           <p className="text-xs text-purple-600/80 font-mono">
//             {isListening ? 'LISTENING...' : 'READY'} | VOICE INTERFACE v2.0
//           </p>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// }






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
    if (!transcript) return;
    
    setIsProcessing(true);
    try {
      // Simulated API call - replace with your actual endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: transcript })
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      setAiResponse(data.reply);
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
      utterance.rate = 0.9;
      utterance.pitch = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-3xl p-8 max-w-6xl w-full shadow-2xl max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold">Voice Assistant</h3>
          <div className="flex gap-2">
            <button 
              onClick={onClose} 
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto scrollbar-hide" style={{ maxHeight: 'calc(90vh - 120px)' }}>

        {/* Top Controls Section */}
        <div className="text-center mb-8">
          {/* Mic button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleListening}
            className={`w-20 h-20 ${
              isListening 
                ? 'bg-gradient-to-br from-red-500 to-red-600' 
                : 'bg-gradient-to-br from-purple-500 to-pink-500'
            } rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}
          >
            {isListening ? (
              <MicOff className="w-10 h-10 text-white" />
            ) : (
              <Mic className="w-10 h-10 text-white" />
            )}
          </motion.button>

          {/* Status text */}
          <p className="text-gray-600 mb-6 text-lg">
            {isProcessing ? 'Processing...' : 
             isListening ? "I'm listening... How can I help you today?" :
             transcript ? 'Click the mic to speak again or see response below' :
             "Click the mic to start speaking"}
          </p>

          {/* Audio visualization bars */}
          {isListening && (
            <div className="flex space-x-2 justify-center mb-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-8 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full"
                  animate={{
                    height: [8, 32, 8],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                />
              ))}
            </div>
          )}

          {/* Processing animation */}
          {isProcessing && (
            <div className="flex space-x-2 justify-center mb-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
                  className="w-3 h-3 bg-purple-600 rounded-full"
                />
              ))}
            </div>
          )}

          {/* Send button */}
          {transcript && !isListening && !isProcessing && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSend}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-8 rounded-xl font-medium shadow-lg"
            >
              Get Response
            </motion.button>
          )}
        </div>

        {/* Side by Side Content */}
        {(transcript || aiResponse) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left side - Transcript */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">You Said</h4>
              <div className="p-6 bg-gray-50 rounded-2xl min-h-[200px]">
                {transcript ? (
                  <p className="text-gray-800 leading-relaxed">{transcript}</p>
                ) : (
                  <p className="text-gray-400 italic">Your speech will appear here...</p>
                )}
              </div>
            </div>

            {/* Right side - AI Response */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-purple-800 border-b border-purple-200 pb-2">Recommendation</h4>
              <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl min-h-[200px]">
                {isProcessing ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                    <span className="ml-2 text-purple-600">Generating response...</span>
                  </div>
                ) : aiResponse ? (
                  <p className="text-gray-800 leading-relaxed">{aiResponse}</p>
                ) : (
                  <p className="text-gray-400 italic">AI recommendation will appear here...</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Empty state when no content */}
        {!transcript && !aiResponse && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mic className="w-12 h-12 text-purple-400" />
            </div>
            <h4 className="text-xl font-semibold text-gray-600 mb-2">Ready to Listen</h4>
            <p className="text-gray-500">Click the microphone button above to start your conversation</p>
          </div>
        )}
        </div>

        {/* Custom scrollbar styles */}
        <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </motion.div>
    </motion.div>
  );
}