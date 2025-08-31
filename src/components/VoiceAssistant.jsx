// // import React, { useState, useRef, useEffect } from 'react';
// // import { Mic, MicOff, Volume2, VolumeX, Settings, MessageCircle, Play, Pause, Square } from 'lucide-react';

// // const VoiceAssistant = () => {
// //   const [isListening, setIsListening] = useState(false);
// //   const [isProcessing, setIsProcessing] = useState(false);
// //   const [isPlaying, setIsPlaying] = useState(false);
// //   const [transcript, setTranscript] = useState('');
// //   const [messages, setMessages] = useState([]);
// //   const [isMuted, setIsMuted] = useState(false);
// //   const [showSettings, setShowSettings] = useState(false);
// //   const [settings, setSettings] = useState({
// //     voiceId: 'en-US-davis', // Default Murf voice
// //     speed: 1.0,
// //     language: 'en-US'
// //   });

// //   const recognitionRef = useRef(null);
// //   const audioRef = useRef(null);
// //   const currentAudioUrl = useRef(null);

// //   // Available Murf voices
// //   const murfVoices = [
// //     { id: 'en-US-davis', name: 'Davis (Male)', language: 'en-US' },
// //     { id: 'en-US-jenny', name: 'Jenny (Female)', language: 'en-US' },
// //     { id: 'en-US-guy', name: 'Guy (Male)', language: 'en-US' },
// //     { id: 'en-US-sara', name: 'Sara (Female)', language: 'en-US' },
// //     { id: 'en-GB-charles', name: 'Charles (British Male)', language: 'en-GB' },
// //     { id: 'en-GB-charlotte', name: 'Charlotte (British Female)', language: 'en-GB' }
// //   ];

// //   // Initialize speech recognition
// //   useEffect(() => {
// //     if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
// //       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
// //       recognitionRef.current = new SpeechRecognition();
// //       recognitionRef.current.continuous = false;
// //       recognitionRef.current.interimResults = true;
// //       recognitionRef.current.lang = settings.language;

// //       recognitionRef.current.onresult = (event) => {
// //         const transcript = Array.from(event.results)
// //           .map(result => result[0])
// //           .map(result => result.transcript)
// //           .join('');
        
// //         setTranscript(transcript);
        
// //         if (event.results[0].isFinal) {
// //           handleUserInput(transcript);
// //         }
// //       };

// //       recognitionRef.current.onend = () => {
// //         setIsListening(false);
// //       };

// //       recognitionRef.current.onerror = (event) => {
// //         console.error('Speech recognition error:', event.error);
// //         setIsListening(false);
// //         setTranscript('');
// //       };
// //     }
// //   }, [settings.language]);

// //   const startListening = () => {
// //     if (recognitionRef.current && !isListening) {
// //       setTranscript('');
// //       setIsListening(true);
// //       recognitionRef.current.start();
// //     }
// //   };

// //   const stopListening = () => {
// //     if (recognitionRef.current && isListening) {
// //       recognitionRef.current.stop();
// //       setIsListening(false);
// //     }
// //   };

// //   const handleUserInput = async (text) => {
// //     if (!text.trim()) return;

// //     const userMessage = { type: 'user', content: text, timestamp: Date.now() };
// //     setMessages(prev => [...prev, userMessage]);
// //     setTranscript('');
// //     setIsProcessing(true);

// //     try {
// //       // Get AI response
// //       const aiResponse = await fetch('/api/ai-reply', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({
// //           text: text,
// //           language: settings.language,
// //           voiceSettings: settings
// //         })
// //       });

// //       const aiData = await aiResponse.json();
// //       const assistantMessage = { 
// //         type: 'assistant', 
// //         content: aiData.reply, 
// //         timestamp: Date.now() 
// //       };
      
// //       setMessages(prev => [...prev, assistantMessage]);

// //       // Generate speech with Murf AI
// //       if (!isMuted) {
// //         await generateSpeech(aiData.reply);
// //       }

// //     } catch (error) {
// //       console.error('Error processing input:', error);
// //       const errorMessage = { 
// //         type: 'assistant', 
// //         content: 'Sorry, I encountered an error. Please try again.', 
// //         timestamp: Date.now() 
// //       };
// //       setMessages(prev => [...prev, errorMessage]);
// //     } finally {
// //       setIsProcessing(false);
// //     }
// //   };

// //   const generateSpeech = async (text) => {
// //     try {
// //       // Force correct voice ID to override any caching issues
// //       const correctVoiceId = 'en-US-natalie'; // Hardcoded working voice
      
// //       // Debug: Log what we're sending
// //       console.log('Voice Assistant sending:', {
// //         text: text.substring(0, 50) + '...',
// //         voiceId: correctVoiceId,
// //         speed: settings.speed,
// //         originalVoiceId: settings.voiceId
// //       });

// //       // First try Murf API with forced correct voice
// //       const response = await fetch('/api/murf-tts', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({
// //           text: text,
// //           voiceId: correctVoiceId, // Use the working voice ID
// //           speed: settings.speed
// //         })
// //       });

// //       if (response.ok) {
// //         const audioBlob = await response.blob();
// //         const audioUrl = URL.createObjectURL(audioBlob);
        
// //         // Clean up previous audio URL
// //         if (currentAudioUrl.current) {
// //           URL.revokeObjectURL(currentAudioUrl.current);
// //         }
// //         currentAudioUrl.current = audioUrl;

// //         // Play the audio
// //         if (audioRef.current) {
// //           audioRef.current.src = audioUrl;
// //           audioRef.current.play();
// //         }
// //         return; // Success - exit early
// //       }
// //     } catch (error) {
// //       console.error('Murf API failed, falling back to browser TTS:', error);
// //     }

// //     // Fallback to browser TTS if Murf fails
// //     if ('speechSynthesis' in window) {
// //       const utterance = new SpeechSynthesisUtterance(text);
// //       utterance.rate = settings.speed;
// //       utterance.pitch = 1;
// //       utterance.volume = 1;
      
// //       // Try to find a voice that matches the language
// //       const voices = speechSynthesis.getVoices();
// //       const preferredVoice = voices.find(voice => 
// //         voice.lang.startsWith(settings.language) && 
// //         (voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('male'))
// //       ) || voices.find(voice => voice.lang.startsWith(settings.language)) || voices[0];
      
// //       if (preferredVoice) {
// //         utterance.voice = preferredVoice;
// //       }

// //       utterance.onstart = () => setIsPlaying(true);
// //       utterance.onend = () => setIsPlaying(false);
// //       utterance.onerror = () => setIsPlaying(false);

// //       speechSynthesis.speak(utterance);
// //     }
// //   };

// //   const togglePlayback = () => {
// //     if (audioRef.current) {
// //       if (isPlaying) {
// //         audioRef.current.pause();
// //       } else {
// //         audioRef.current.play();
// //       }
// //     }
// //   };

// //   const clearConversation = () => {
// //     setMessages([]);
// //     setTranscript('');
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
// //       <div className="max-w-4xl mx-auto">
// //         {/* Header */}
// //         <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
// //           <div className="flex items-center justify-between">
// //             <div className="flex items-center space-x-3">
// //               <div className="p-3 bg-blue-100 rounded-full">
// //                 <MessageCircle className="h-8 w-8 text-blue-600" />
// //               </div>
// //               <div>
// //                 <h1 className="text-2xl font-bold text-gray-800">Voice Assistant</h1>
// //                 <p className="text-gray-600">Powered by Murf AI</p>
// //               </div>
// //             </div>
// //             <div className="flex items-center space-x-2">
// //               <button
// //                 onClick={() => setIsMuted(!isMuted)}
// //                 className={`p-2 rounded-lg transition-colors ${
// //                   isMuted ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
// //                 }`}
// //               >
// //                 {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
// //               </button>
// //               <button
// //                 onClick={() => setShowSettings(!showSettings)}
// //                 className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
// //               >
// //                 <Settings className="h-5 w-5" />
// //               </button>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Settings Panel */}
// //         {showSettings && (
// //           <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
// //             <h2 className="text-lg font-semibold text-gray-800 mb-4">Voice Settings</h2>
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">Voice</label>
// //                 <select
// //                   value={settings.voiceId}
// //                   onChange={(e) => setSettings(prev => ({ ...prev, voiceId: e.target.value }))}
// //                   className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                 >
// //                   {murfVoices.map(voice => (
// //                     <option key={voice.id} value={voice.id}>
// //                       {voice.name}
// //                     </option>
// //                   ))}
// //                 </select>
// //               </div>
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Speed: {settings.speed}x
// //                 </label>
// //                 <input
// //                   type="range"
// //                   min="0.5"
// //                   max="2.0"
// //                   step="0.1"
// //                   value={settings.speed}
// //                   onChange={(e) => setSettings(prev => ({ ...prev, speed: parseFloat(e.target.value) }))}
// //                   className="w-full"
// //                 />
// //               </div>
// //             </div>
// //           </div>
// //         )}

// //         {/* Main Voice Interface */}
// //         <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 text-center">
// //           <div className="mb-6">
// //             <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full transition-all duration-300 ${
// //               isListening ? 'bg-red-100 animate-pulse' : 
// //               isProcessing ? 'bg-yellow-100' : 'bg-blue-100'
// //             }`}>
// //               {isProcessing ? (
// //                 <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
// //               ) : (
// //                 <button
// //                   onClick={isListening ? stopListening : startListening}
// //                   disabled={isProcessing}
// //                   className={`w-16 h-16 rounded-full transition-all ${
// //                     isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
// //                   } text-white disabled:opacity-50`}
// //                 >
// //                   {isListening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
// //                 </button>
// //               )}
// //             </div>
// //           </div>
          
// //           <div className="mb-4">
// //             {isListening && (
// //               <p className="text-red-600 font-medium animate-pulse">Listening...</p>
// //             )}
// //             {isProcessing && (
// //               <p className="text-yellow-600 font-medium">Processing...</p>
// //             )}
// //             {!isListening && !isProcessing && (
// //               <p className="text-gray-600">Tap the microphone to start speaking</p>
// //             )}
// //           </div>

// //           {transcript && (
// //             <div className="bg-gray-50 rounded-lg p-4 mb-4">
// //               <p className="text-gray-800 italic">"{transcript}"</p>
// //             </div>
// //           )}

// //           {/* Audio Controls */}
// //           <div className="flex justify-center space-x-4">
// //             <button
// //               onClick={togglePlayback}
// //               disabled={!currentAudioUrl.current}
// //               className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
// //             >
// //               {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
// //             </button>
// //             <button
// //               onClick={clearConversation}
// //               className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
// //             >
// //               <Square className="h-5 w-5" />
// //             </button>
// //           </div>
// //         </div>

// //         {/* Conversation History */}
// //         {messages.length > 0 && (
// //           <div className="bg-white rounded-2xl shadow-lg p-6">
// //             <h2 className="text-lg font-semibold text-gray-800 mb-4">Conversation</h2>
// //             <div className="space-y-4 max-h-96 overflow-y-auto">
// //               {messages.map((message, index) => (
// //                 <div
// //                   key={index}
// //                   className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
// //                 >
// //                   <div
// //                     className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
// //                       message.type === 'user'
// //                         ? 'bg-blue-500 text-white'
// //                         : 'bg-gray-100 text-gray-800'
// //                     }`}
// //                   >
// //                     <p className="text-sm">{message.content}</p>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         )}

// //         {/* Hidden audio element */}
// //         <audio
// //           ref={audioRef}
// //           onPlay={() => setIsPlaying(true)}
// //           onPause={() => setIsPlaying(false)}
// //           onEnded={() => setIsPlaying(false)}
// //           style={{ display: 'none' }}
// //         />
// //       </div>
// //     </div>
// //   );
// // };

// // export default VoiceAssistant;




// import React, { useState, useRef, useEffect } from 'react';
// import { Mic, MicOff, Volume2, VolumeX, Settings, MessageCircle, Play, Pause, Square, X } from 'lucide-react';

// const VoiceAssistant = ({ onClose }) => {
//   const [isModalOpen, setIsModalOpen] = useState(true); // Start open since it's controlled by parent
//   const [isListening, setIsListening] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [transcript, setTranscript] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [isMuted, setIsMuted] = useState(false);
//   const [showSettings, setShowSettings] = useState(false);
//   const [settings, setSettings] = useState({
//     voiceId: 'en-US-davis',
//     speed: 1.0,
//     language: 'en-US'
//   });

//   const recognitionRef = useRef(null);
//   const audioRef = useRef(null);
//   const currentAudioUrl = useRef(null);

//   // Available Murf voices
//   const murfVoices = [
//     { id: 'en-US-davis', name: 'Davis (Male)', language: 'en-US' },
//     { id: 'en-US-jenny', name: 'Jenny (Female)', language: 'en-US' },
//     { id: 'en-US-guy', name: 'Guy (Male)', language: 'en-US' },
//     { id: 'en-US-sara', name: 'Sara (Female)', language: 'en-US' },
//     { id: 'en-GB-charles', name: 'Charles (British Male)', language: 'en-GB' },
//     { id: 'en-GB-charlotte', name: 'Charlotte (British Female)', language: 'en-GB' }
//   ];

//   // Initialize speech recognition
//   useEffect(() => {
//     if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//       recognitionRef.current = new SpeechRecognition();
//       recognitionRef.current.continuous = false;
//       recognitionRef.current.interimResults = true;
//       recognitionRef.current.lang = settings.language;

//       recognitionRef.current.onresult = (event) => {
//         const transcript = Array.from(event.results)
//           .map(result => result[0])
//           .map(result => result.transcript)
//           .join('');
        
//         setTranscript(transcript);
        
//         if (event.results[0].isFinal) {
//           handleUserInput(transcript);
//         }
//       };

//       recognitionRef.current.onend = () => {
//         setIsListening(false);
//       };

//       recognitionRef.current.onerror = (event) => {
//         console.error('Speech recognition error:', event.error);
//         setIsListening(false);
//         setTranscript('');
//       };
//     }
//   }, [settings.language]);

//   const startListening = () => {
//     if (recognitionRef.current && !isListening) {
//       setTranscript('');
//       setIsListening(true);
//       recognitionRef.current.start();
//     }
//   };

//   const stopListening = () => {
//     if (recognitionRef.current && isListening) {
//       recognitionRef.current.stop();
//       setIsListening(false);
//     }
//   };

//   const handleUserInput = async (text) => {
//     if (!text.trim()) return;

//     const userMessage = { type: 'user', content: text, timestamp: Date.now() };
//     setMessages(prev => [...prev, userMessage]);
//     setTranscript('');
//     setIsProcessing(true);

//     try {
//       // Get AI response
//       const aiResponse = await fetch('/api/ai-reply', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           text: text,
//           language: settings.language,
//           voiceSettings: settings
//         })
//       });

//       const aiData = await aiResponse.json();
//       const assistantMessage = { 
//         type: 'assistant', 
//         content: aiData.reply, 
//         timestamp: Date.now() 
//       };
      
//       setMessages(prev => [...prev, assistantMessage]);

//       // Generate speech with Murf AI
//       if (!isMuted) {
//         await generateSpeech(aiData.reply);
//       }

//     } catch (error) {
//       console.error('Error processing input:', error);
//       const errorMessage = { 
//         type: 'assistant', 
//         content: 'Sorry, I encountered an error. Please try again.', 
//         timestamp: Date.now() 
//       };
//       setMessages(prev => [...prev, errorMessage]);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const generateSpeech = async (text) => {
//     try {
//       // Force correct voice ID to override any caching issues
//       const correctVoiceId = 'en-US-natalie';
      
//       console.log('Voice Assistant sending:', {
//         text: text.substring(0, 50) + '...',
//         voiceId: correctVoiceId,
//         speed: settings.speed,
//         originalVoiceId: settings.voiceId
//       });

//       const response = await fetch('/api/murf-tts', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           text: text,
//           voiceId: correctVoiceId,
//           speed: settings.speed
//         })
//       });

//       if (response.ok) {
//         const audioBlob = await response.blob();
//         const audioUrl = URL.createObjectURL(audioBlob);
        
//         if (currentAudioUrl.current) {
//           URL.revokeObjectURL(currentAudioUrl.current);
//         }
//         currentAudioUrl.current = audioUrl;

//         if (audioRef.current) {
//           audioRef.current.src = audioUrl;
//           audioRef.current.play();
//         }
//         return;
//       }
//     } catch (error) {
//       console.error('Murf API failed, falling back to browser TTS:', error);
//     }

//     // Fallback to browser TTS if Murf fails
//     if ('speechSynthesis' in window) {
//       const utterance = new SpeechSynthesisUtterance(text);
//       utterance.rate = settings.speed;
//       utterance.pitch = 1;
//       utterance.volume = 1;
      
//       const voices = speechSynthesis.getVoices();
//       const preferredVoice = voices.find(voice => 
//         voice.lang.startsWith(settings.language) && 
//         (voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('male'))
//       ) || voices.find(voice => voice.lang.startsWith(settings.language)) || voices[0];
      
//       if (preferredVoice) {
//         utterance.voice = preferredVoice;
//       }

//       utterance.onstart = () => setIsPlaying(true);
//       utterance.onend = () => setIsPlaying(false);
//       utterance.onerror = () => setIsPlaying(false);

//       speechSynthesis.speak(utterance);
//     }
//   };

//   const togglePlayback = () => {
//     if (audioRef.current) {
//       if (isPlaying) {
//         audioRef.current.pause();
//       } else {
//         audioRef.current.play();
//       }
//     }
//   };

//   const clearConversation = () => {
//     setMessages([]);
//     setTranscript('');
//   };

//   const handleClose = () => {
//     setShowSettings(false);
//     if (isListening) {
//       stopListening();
//     }
//     // Call the parent's onClose function
//     if (onClose) {
//       onClose();
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//       <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden">
        
//         {/* Modal Header */}
//         <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white relative">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <div className="p-2 bg-white bg-opacity-20 rounded-full">
//                 <MessageCircle className="h-6 w-6" />
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold">Voice Assistant</h1>
//                 <p className="text-purple-100 text-sm">Powered by Murf AI</p>
//               </div>
//             </div>
//             <div className="flex items-center space-x-2">
//   <button
//     onClick={() => setIsMuted(!isMuted)}
//     className={`p-2 rounded-full transition-all ${
//       isMuted ? 'bg-red-500 bg-opacity-80' : 'bg-white bg-opacity-20 hover:bg-opacity-30'
//     }`}
//   >
//     {isMuted ? <VolumeX fill="black" className="h-4 w-4 " /> : <Volume2 fill="black" className="h-4 w-4" />}
//   </button>
//   <button
//     onClick={() => setShowSettings(!showSettings)}
//     className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all"
//   >
//     <Settings fill="black" className="h-4 w-4" />
//   </button>
//   <button
//     onClick={handleClose}
//     className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all ml-2"
//   >
//     <X fill="black" className="h-4 w-4" />
//   </button>
// </div>
//           </div>
//         </div>

//         {/* Modal Content */}
//         <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          
//           {/* Settings Panel */}
//           {showSettings && (
//             <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-200">
//               <h3 className="text-md font-semibold text-gray-800 mb-3">Voice Settings</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-xs font-medium text-gray-600 mb-2">Voice</label>
//                   <select
//                     value={settings.voiceId}
//                     onChange={(e) => setSettings(prev => ({ ...prev, voiceId: e.target.value }))}
//                     className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                   >
//                     {murfVoices.map(voice => (
//                       <option key={voice.id} value={voice.id}>
//                         {voice.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-600 mb-2">
//                     Speed: {settings.speed}x
//                   </label>
//                   <input
//                     type="range"
//                     min="0.5"
//                     max="2.0"
//                     step="0.1"
//                     value={settings.speed}
//                     onChange={(e) => setSettings(prev => ({ ...prev, speed: parseFloat(e.target.value) }))}
//                     className="w-full accent-purple-600"
//                   />
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Voice Interface */}
//           <div className="text-center mb-6">
//             <div className="mb-4">
//               <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full transition-all duration-300 ${
//                 isListening ? 'bg-red-100 shadow-lg animate-pulse' : 
//                 isProcessing ? 'bg-yellow-100 shadow-lg' : 'bg-gray-100 shadow-md'
//               }`}>
//                 {isProcessing ? (
//                   <div className="animate-spin w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full"></div>
//                 ) : (
//                   <button
//                     onClick={isListening ? stopListening : startListening}
//                     disabled={isProcessing}
//                     className={`w-12 h-12 rounded-full transition-all shadow-lg ${
//                       isListening ? 'bg-red-500 hover:bg-red-600 scale-110' : 'bg-purple-500 hover:bg-purple-600'
//                     } text-white disabled:opacity-50 transform hover:scale-105`}
//                   >
//                     {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
//                   </button>
//                 )}
//               </div>
//             </div>
            
//             <div className="mb-4">
//               {isListening && (
//                 <p className="text-red-600 font-medium animate-pulse text-sm">🎤 Listening...</p>
//               )}
//               {isProcessing && (
//                 <p className="text-yellow-600 font-medium text-sm">⚡ Processing...</p>
//               )}
//               {!isListening && !isProcessing && (
//                 <p className="text-gray-500 text-sm">Tap the microphone to start speaking</p>
//               )}
//             </div>

//             {transcript && (
//               <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-3 mb-4 border border-purple-200">
//                 <p className="text-gray-700 text-sm italic">"{transcript}"</p>
//               </div>
//             )}

//             {/* Audio Controls */}
//             <div className="flex justify-center space-x-3">
//               <button
//                 onClick={togglePlayback}
//                 disabled={!currentAudioUrl.current}
//                 className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors disabled:opacity-50 shadow-md"
//               >
//                 {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
//               </button>
//               <button
//                 onClick={clearConversation}
//                 className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors shadow-md"
//               >
//                 <Square className="h-4 w-4" />
//               </button>
//             </div>
//           </div>

//           {/* Conversation History */}
//           {messages.length > 0 && (
//             <div className="border-t border-gray-200 pt-4">
//               <h3 className="text-md font-semibold text-gray-800 mb-3">Conversation</h3>
//               <div className="space-y-3 max-h-64 overflow-y-auto">
//                 {messages.map((message, index) => (
//                   <div
//                     key={index}
//                     className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
//                   >
//                     <div
//                       className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${
//                         message.type === 'user'
//                           ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
//                           : 'bg-gray-100 text-gray-800 border border-gray-200'
//                       } shadow-sm`}
//                     >
//                       <p>{message.content}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Hidden audio element */}
//           <audio
//             ref={audioRef}
//             onPlay={() => setIsPlaying(true)}
//             onPause={() => setIsPlaying(false)}
//             onEnded={() => setIsPlaying(false)}
//             style={{ display: 'none' }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VoiceAssistant;


import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Settings, MessageCircle, Play, Pause, Square, X, ChevronDown, ChevronUp, Send, Keyboard } from 'lucide-react';

const VoiceAssistant = ({ onClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(true); // Start open since it's controlled by parent
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [settings, setSettings] = useState({
    voiceId: 'en-US-davis',
    speed: 1.0,
    language: 'en-US'
  });

  const recognitionRef = useRef(null);
  const audioRef = useRef(null);
  const currentAudioUrl = useRef(null);
  const textInputRef = useRef(null);

  // Available Murf voices
  const murfVoices = [
    { id: 'en-US-davis', name: 'Davis (Male)', language: 'en-US' },
    { id: 'en-US-jenny', name: 'Jenny (Female)', language: 'en-US' },
    { id: 'en-US-guy', name: 'Guy (Male)', language: 'en-US' },
    { id: 'en-US-sara', name: 'Sara (Female)', language: 'en-US' },
    { id: 'en-GB-charles', name: 'Charles (British Male)', language: 'en-GB' },
    { id: 'en-GB-charlotte', name: 'Charlotte (British Female)', language: 'en-GB' }
  ];

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = settings.language;

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setTranscript(transcript);
        
        if (event.results[0].isFinal) {
          handleUserInput(transcript);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setTranscript('');
      };
    }
  }, [settings.language]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleUserInput = async (text) => {
    if (!text.trim()) return;

    const userMessage = { type: 'user', content: text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setTranscript('');
    setTextInput(''); // Clear text input
    setIsProcessing(true);

    try {
      // Get AI response
      const aiResponse = await fetch('/api/ai-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text,
          language: settings.language,
          voiceSettings: settings
        })
      });

      const aiData = await aiResponse.json();
      const assistantMessage = { 
        type: 'assistant', 
        content: aiData.reply, 
        timestamp: Date.now() 
      };
      
      setMessages(prev => [...prev, assistantMessage]);

      // Generate speech with Murf AI
      if (!isMuted) {
        await generateSpeech(aiData.reply);
      }

    } catch (error) {
      console.error('Error processing input:', error);
      const errorMessage = { 
        type: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.', 
        timestamp: Date.now() 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateSpeech = async (text) => {
    try {
      // Force correct voice ID to override any caching issues
      const correctVoiceId = 'en-US-natalie';
      
      console.log('Voice Assistant sending:', {
        text: text.substring(0, 50) + '...',
        voiceId: correctVoiceId,
        speed: settings.speed,
        originalVoiceId: settings.voiceId
      });

      const response = await fetch('/api/murf-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text,
          voiceId: correctVoiceId,
          speed: settings.speed
        })
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        if (currentAudioUrl.current) {
          URL.revokeObjectURL(currentAudioUrl.current);
        }
        currentAudioUrl.current = audioUrl;

        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play();
        }
        return;
      }
    } catch (error) {
      console.error('Murf API failed, falling back to browser TTS:', error);
    }

    // Fallback to browser TTS if Murf fails
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = settings.speed;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.startsWith(settings.language) && 
        (voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('male'))
      ) || voices.find(voice => voice.lang.startsWith(settings.language)) || voices[0];
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      speechSynthesis.speak(utterance);
    }
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setTranscript('');
    setTextInput('');
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (textInput.trim() && !isProcessing) {
      handleUserInput(textInput);
    }
  };

  const handleTextInputKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit(e);
    }
  };

  const handleClose = () => {
    setShowSettings(false);
    setShowTextInput(false);
    setTextInput('');
    if (isListening) {
      stopListening();
    }
    // Call the parent's onClose function
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white/95 backdrop-blur-xl w-full max-w-lg sm:max-w-xl lg:max-w-2xl max-h-[95vh] rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4 sm:p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
                <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold tracking-tight">Voice Assistant</h1>
                <p className="text-white/80 text-xs sm:text-sm font-medium">Powered by AI</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={() => setShowTextInput(!showTextInput)}
                className={`p-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  showTextInput ? 'bg-white/30' : 'bg-white/20 hover:bg-white/30'
                } shadow-lg backdrop-blur-sm border border-white/20`}
              >
                <Keyboard className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  isMuted ? 'bg-red-500/80 shadow-red-500/25' : 'bg-white/20 hover:bg-white/30'
                } shadow-lg backdrop-blur-sm border border-white/20`}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  showSettings ? 'bg-white/30' : 'bg-white/20 hover:bg-white/30'
                } shadow-lg backdrop-blur-sm border border-white/20`}
              >
                {showSettings ? <ChevronUp className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
              </button>
              <button
                onClick={handleClose}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm border border-white/20"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
          
          {/* Text Input Panel */}
          {showTextInput && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-blue-200/50 shadow-inner">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm sm:text-base font-semibold text-gray-800 flex items-center space-x-2">
                  <Keyboard className="h-4 w-4 text-blue-600" />
                  <span>Type Your Message</span>
                </h3>
              </div>
              <form onSubmit={handleTextSubmit} className="space-y-3">
                <div className="relative">
                  <textarea
                    ref={textInputRef}
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyDown={handleTextInputKeyPress}
                    placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
                    disabled={isProcessing}
                    className="w-full p-4 text-sm sm:text-base border-0 bg-white/70 backdrop-blur-sm rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all duration-200 resize-none min-h-[80px] disabled:opacity-50"
                    rows={3}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500">
                    {textInput.length > 0 ? `${textInput.length} characters` : 'Start typing...'}
                  </p>
                  <button
                    type="submit"
                    disabled={!textInput.trim() || isProcessing}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                      textInput.trim() && !isProcessing
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25 hover:bg-blue-600'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    } disabled:transform-none`}
                  >
                    <Send className="h-4 w-4" />
                    <span>Send</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Settings Panel */}
          {showSettings && (
            <div className="bg-gradient-to-br from-gray-50 to-blue-50/50 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-gray-200/50 shadow-inner">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm sm:text-base font-semibold text-gray-800 flex items-center space-x-2">
                  <Settings className="h-4 w-4 text-purple-600" />
                  <span>Voice Settings</span>
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Voice</label>
                  <div className="relative">
                    <select
                      value={settings.voiceId}
                      onChange={(e) => setSettings(prev => ({ ...prev, voiceId: e.target.value }))}
                      className="w-full p-3 text-sm border-0 bg-white/70 backdrop-blur-sm rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500/50 focus:bg-white transition-all duration-200 appearance-none cursor-pointer"
                    >
                      {murfVoices.map(voice => (
                        <option key={voice.id} value={voice.id}>
                          {voice.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                    Speed: {settings.speed}x
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.1"
                      value={settings.speed}
                      onChange={(e) => setSettings(prev => ({ ...prev, speed: parseFloat(e.target.value) }))}
                      className="w-full h-2 bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, rgb(147 51 234) 0%, rgb(147 51 234) ${(settings.speed - 0.5) / 1.5 * 100}%, rgb(229 231 235) ${(settings.speed - 0.5) / 1.5 * 100}%, rgb(229 231 235) 100%)`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Voice Interface */}
          <div className="text-center mb-6">
            {/* Main Microphone Button */}
            <div className="mb-6">
              <div className="relative inline-flex items-center justify-center">
                {/* Pulse Animation Ring */}
                {(isListening || isProcessing) && (
                  <div className={`absolute inset-0 rounded-full animate-ping ${
                    isListening ? 'bg-red-400/30' : 'bg-purple-400/30'
                  }`} style={{ width: '140px', height: '140px', margin: '-10px' }}></div>
                )}
                
                <div className={`relative flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 rounded-full transition-all duration-500 transform ${
                  isListening ? 'bg-gradient-to-br from-red-400 to-red-600 shadow-xl shadow-red-500/25 scale-105' : 
                  isProcessing ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-xl shadow-orange-500/25' : 
                  'bg-gradient-to-br from-purple-500 to-indigo-600 shadow-xl shadow-purple-500/25 hover:scale-105'
                } border-4 border-white/20 backdrop-blur-sm`}>
                  {isProcessing ? (
                    <div className="relative">
                      <div className="animate-spin w-10 h-10 border-4 border-white/30 border-t-white rounded-full"></div>
                      <div className="absolute inset-2 animate-pulse bg-white/20 rounded-full"></div>
                    </div>
                  ) : (
                    <button
  onClick={isListening ? stopListening : startListening}
  disabled={isProcessing}
  className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full transition-all duration-300 transform justify-center ${
    isListening ? 'bg-white/20 hover:bg-white/30 rotate-12' : 'bg-white/20 hover:bg-white/30'
  } text-white disabled:opacity-50 hover:scale-110 backdrop-blur-sm border border-white/30 shadow-lg flex justify-center items-center`}
>
  {isListening ? <MicOff className="h-7 w-7 sm:h-8 sm:w-8" /> : <Mic className="h-7 w-7 sm:h-8 sm:w-8" />}
</button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Status Messages */}
            <div className="mb-6 min-h-[2rem]">
              {isListening && (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <p className="text-red-600 font-semibold animate-pulse text-sm sm:text-base">Listening...</p>
                </div>
              )}
              {isProcessing && (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
                  <p className="text-amber-600 font-semibold text-sm sm:text-base">Processing...</p>
                </div>
              )}
              {!isListening && !isProcessing && (
                <div className="space-y-1">
                  <p className="text-gray-500 text-sm sm:text-base font-medium">Tap the microphone to start speaking</p>
                  <p className="text-gray-400 text-xs sm:text-sm">or use the keyboard button to type</p>
                </div>
              )}
            </div>

            {/* Live Transcript */}
            {transcript && (
              <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-purple-200/50 shadow-inner">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 animate-pulse"></div>
                  <p className="text-gray-700 text-sm sm:text-base italic leading-relaxed">"{transcript}"</p>
                </div>
              </div>
            )}

            {/* Audio Controls */}
            <div className="flex justify-center items-center space-x-4">
              <button
                onClick={togglePlayback}
                disabled={!currentAudioUrl.current}
                className={`p-3 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm border ${
                  isPlaying 
                    ? 'bg-green-500 text-white border-green-300 shadow-green-500/25' 
                    : 'bg-green-100 text-green-600 border-green-200 hover:bg-green-200 shadow-green-500/10'
                } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>
              
              <button
                onClick={clearConversation}
                className="p-3 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm border border-gray-200"
              >
                <Square className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Conversation History */}
          {messages.length > 0 && (
            <div className="border-t border-gray-200/50 pt-6">
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-purple-600" />
                <span>Conversation</span>
                <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-transparent"></div>
              </h3>
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-transparent">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div
                      className={`max-w-[80%] sm:max-w-xs px-4 py-3 rounded-2xl text-sm sm:text-base leading-relaxed ${
                        message.type === 'user'
                          ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/25'
                          : 'bg-white/80 backdrop-blur-sm text-gray-800 border border-gray-200/50 shadow-lg'
                      } transform transition-all duration-200 hover:scale-[1.02]`}
                    >
                      <p className="break-words">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hidden audio element */}
          <audio
            ref={audioRef}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            style={{ display: 'none' }}
          />
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;