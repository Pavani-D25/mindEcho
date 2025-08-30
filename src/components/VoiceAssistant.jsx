

// // src/components/VoiceAssistant.jsx
// import React, { useState, useRef } from "react";

// export default function VoiceAssistant() {
//   const [isRecording, setIsRecording] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);
//   const audioRef = useRef(null);

//   // Start recording
//   const startRecording = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     mediaRecorderRef.current = new MediaRecorder(stream);

//     audioChunksRef.current = [];
//     mediaRecorderRef.current.ondataavailable = (event) => {
//       if (event.data.size > 0) {
//         audioChunksRef.current.push(event.data);
//       }
//     };

//     mediaRecorderRef.current.start();
//     setIsRecording(true);
//   };

//   // Stop recording + process
//   const stopRecording = async () => {
//     mediaRecorderRef.current.stop();
//     setIsRecording(false);

//     mediaRecorderRef.current.onstop = async () => {
//       const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
//       await processAudio(audioBlob);
//     };
//   };

//   // Send audio to OpenAI for transcription → chat → TTS
//   const processAudio = async (audioBlob) => {
//     try {
//       const formData = new FormData();
//       formData.append("file", audioBlob, "speech.webm");
//       formData.append("model", "gpt-4o-mini-transcribe");

//       // 1. Transcribe speech
//       const transcriptRes = await fetch("https://api.openai.com/v1/audio/transcriptions", {
//         method: "POST",
//         headers: { Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}` },
//         body: formData,
//       });
//       const transcriptData = await transcriptRes.json();
//       const userText = transcriptData.text;

//       setMessages((prev) => [...prev, { role: "user", content: userText }]);

//       // 2. Send transcript to GPT
//       const chatRes = await fetch("https://api.openai.com/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           model: "gpt-4o-mini",
//           messages: [...messages, { role: "user", content: userText }],
//         }),
//       });
//       const chatData = await chatRes.json();
//       const aiReply = chatData.choices[0].message.content;

//       setMessages((prev) => [...prev, { role: "assistant", content: aiReply }]);

//       // 3. Convert reply to speech
//       const ttsRes = await fetch("https://api.openai.com/v1/audio/speech", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           model: "gpt-4o-mini-tts",
//           voice: "alloy",
//           input: aiReply,
//         }),
//       });

//       const ttsArrayBuffer = await ttsRes.arrayBuffer();
//       const audioUrl = URL.createObjectURL(new Blob([ttsArrayBuffer], { type: "audio/mpeg" }));
//       audioRef.current.src = audioUrl;
//       audioRef.current.play();
//     } catch (err) {
//       console.error("Voice assistant error:", err);
//     }
//   };

//   return (
//     <div className="p-4 border rounded-lg shadow-lg w-full max-w-md mx-auto">
//       <h2 className="text-xl font-bold mb-2">🎙️ AI Voice Assistant</h2>

//       <button
//         onClick={isRecording ? stopRecording : startRecording}
//         className={`px-4 py-2 rounded-lg text-white ${isRecording ? "bg-red-500" : "bg-green-500"}`}
//       >
//         {isRecording ? "🛑 Stop Recording" : "🎤 Start Recording"}
//       </button>

//       <audio ref={audioRef} controls className="mt-4 w-full" />

//       <div className="mt-4 max-h-60 overflow-y-auto border-t pt-2">
//         {messages.map((msg, i) => (
//           <div key={i} className={`mb-2 ${msg.role === "user" ? "text-blue-600" : "text-purple-600"}`}>
//             <b>{msg.role}:</b> {msg.content}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


import React, { useState, useRef, useCallback, useEffect } from "react";
import { 
  X, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Volume2,
  VolumeX,
  Zap,
  Radio,
  User,
  Bot,
  Loader2
} from "lucide-react";

export default function VoiceAssistant({ onClose = () => {} }) {
  // State variables
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [agentResponse, setAgentResponse] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [audioLevel, setAudioLevel] = useState(0);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [shouldKeepListening, setShouldKeepListening] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Voice settings with OpenAI voices
  const [voiceSettings, setVoiceSettings] = useState({
    voice: "alloy",
    model: "tts-1",
    speed: 1.0,
  });

  // OpenAI voice options
  const voiceOptions = [
    { 
      id: "alloy", 
      name: "ALLOY", 
      personality: "Balanced & Clear",
      accent: "Neutral",
      color: "from-blue-500 to-cyan-500"
    },
    { 
      id: "echo", 
      name: "ECHO", 
      personality: "Warm & Friendly",
      accent: "American",
      color: "from-green-500 to-emerald-500"
    },
    { 
      id: "fable", 
      name: "FABLE", 
      personality: "Expressive & Dynamic",
      accent: "British",
      color: "from-purple-500 to-violet-500"
    },
    { 
      id: "onyx", 
      name: "ONYX", 
      personality: "Deep & Authoritative",
      accent: "American",
      color: "from-gray-600 to-gray-800"
    },
    { 
      id: "nova", 
      name: "NOVA", 
      personality: "Energetic & Bright",
      accent: "American",
      color: "from-pink-500 to-rose-500"
    },
    { 
      id: "shimmer", 
      name: "SHIMMER", 
      personality: "Gentle & Soothing",
      accent: "American",
      color: "from-yellow-400 to-orange-500"
    }
  ];

  // Refs
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);
  const recognitionRef = useRef(null);
  const voiceSettingsRef = useRef(voiceSettings);
  const restartTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const streamTrackRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Status helpers
  const getStatusInfo = () => {
    if (isReconnecting) {
      return { text: 'RECONNECTING...', color: 'text-orange-600', bgColor: 'bg-orange-100', borderColor: 'border-orange-300' };
    }
    
    switch (connectionStatus) {
      case 'connected': 
        return { text: 'VOICE ASSISTANT ACTIVE', color: 'text-green-600', bgColor: 'bg-green-100', borderColor: 'border-green-300' };
      case 'connecting': 
        return { text: 'ESTABLISHING CONNECTION', color: 'text-amber-600', bgColor: 'bg-amber-100', borderColor: 'border-amber-300' };
      case 'listening': 
        return { text: 'LISTENING FOR INPUT', color: 'text-blue-600', bgColor: 'bg-blue-100', borderColor: 'border-blue-300' };
      case 'failed': 
        return { text: 'CONNECTION FAILED - RETRY?', color: 'text-red-600', bgColor: 'bg-red-100', borderColor: 'border-red-300' };
      default: 
        return { text: 'READY TO CONNECT', color: 'text-gray-600', bgColor: 'bg-gray-100', borderColor: 'border-gray-300' };
    }
  };

  const statusInfo = getStatusInfo();
  const currentVoice = voiceOptions.find(v => v.id === voiceSettings.voice) || voiceOptions[0];

  // Audio level monitor
  const monitorAudioLevel = useCallback(() => {
    if (analyserRef.current && !isMuted && isConnected && audioContextRef.current && audioContextRef.current.state === 'running') {
      try {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((s, v) => s + v, 0) / dataArray.length;
        setAudioLevel(average);
        animationRef.current = requestAnimationFrame(monitorAudioLevel);
      } catch (e) {
        console.warn('Audio monitoring error:', e);
        setAudioLevel(0);
      }
    } else {
      setAudioLevel(0);
    }
  }, [isMuted, isConnected]);

  // Clean up audio function
  const cleanupAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      if (audioRef.current.src && audioRef.current.src.startsWith('blob:')) {
        URL.revokeObjectURL(audioRef.current.src);
      }
      audioRef.current = null;
    }
    
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    setIsAgentSpeaking(false);
  }, []);

  // Mock AI Response (since we can't access real APIs in this environment)
  const mockAIResponse = useCallback((text) => {
    // Simulate some intelligent responses based on input
    const responses = [
      "That's an interesting question. Let me think about that for a moment.",
      "I understand what you're asking. Here's what I think about that topic.",
      "Great point! That reminds me of something similar I've been considering.",
      "Thanks for sharing that with me. I find that perspective quite fascinating.",
      "That's a complex topic with many different angles to consider.",
      "I appreciate you bringing that up. It's definitely worth discussing further.",
      "You've raised an important point that deserves a thoughtful response.",
      "I can see why that would be on your mind. Let me share my thoughts.",
      "That's something I've been thinking about too. Here's my take on it.",
      "Interesting perspective! I'd like to explore that idea with you."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)] + 
           " " + text.split(' ').slice(-3).join(' ') + " is definitely worth considering.";
  }, []);

  // Browser TTS function
  const speakWithBrowserTTS = useCallback((text) => {
    if (!window.speechSynthesis || !text.trim()) {
      setIsAgentSpeaking(false);
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = 1;
    utterance.rate = voiceSettings.speed;
    utterance.pitch = 1;
    utterance.lang = 'en-US';
    
    // Try to find a voice that matches our selection
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('female') || 
      voice.name.toLowerCase().includes('male') ||
      voice.lang.startsWith('en')
    ) || voices[0];
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.onstart = () => setIsAgentSpeaking(true);
    utterance.onend = () => setIsAgentSpeaking(false);
    utterance.onerror = () => setIsAgentSpeaking(false);
    
    setIsAgentSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, [voiceSettings.speed]);

  // Send text to AI and handle TTS
  const sendTextToAI = useCallback(async (text) => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      const userMessage = {
        sender: "user",
        text: text,
        loading: false,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, userMessage]);
      
      setAgentResponse("PROCESSING...");
      
      // Add loading message
      setMessages(prev => [...prev, {
        sender: "bot",
        text: "",
        loading: true,
        timestamp: new Date().toISOString(),
      }]);
      
      cleanupAudio();

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      // Get mock AI response
      const reply = mockAIResponse(text);
      setAgentResponse(reply);

      // Update messages with actual response
      setMessages(prev => [
        ...prev.slice(0, -1),
        {
          sender: "bot",
          text: reply,
          loading: false,
          timestamp: new Date().toISOString(),
        }
      ]);

      // Speak the response using browser TTS
      speakWithBrowserTTS(reply);
      
    } catch (err) {
      console.error('Error:', err);
      const errorMessage = "Sorry, I had trouble processing that. Could you try again?";
      setAgentResponse(errorMessage);
      
      // Remove loading message and add error message
      setMessages(prev => [
        ...prev.slice(0, -1),
        {
          sender: "bot",
          text: errorMessage,
          loading: false,
          timestamp: new Date().toISOString(),
        }
      ]);
      
      speakWithBrowserTTS(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [mockAIResponse, speakWithBrowserTTS, cleanupAudio, isProcessing]);

  // Initialize speech recognition with auto-restart
  const initializeSpeechRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return false;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log('Speech recognition started');
      setConnectionStatus('listening');
      setIsReconnecting(false);
    };

    recognition.onend = () => {
      console.log('Speech recognition ended');
      
      // Clear any pending restart
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      
      // Auto-restart if we should keep listening and still connected
      if (shouldKeepListening && isConnected && !isMuted && !isProcessing) {
        console.log('Auto-restarting speech recognition...');
        setIsReconnecting(true);
        
        restartTimeoutRef.current = setTimeout(() => {
          if (shouldKeepListening && recognitionRef.current && isConnected && !isMuted) {
            try {
              recognitionRef.current.start();
            } catch (error) {
              console.error('Failed to restart recognition:', error);
              // If restart fails, try reinitializing
              setTimeout(() => {
                if (shouldKeepListening && isConnected) {
                  if (initializeSpeechRecognition()) {
                    recognitionRef.current?.start();
                  }
                }
              }, 1000);
            }
          } else {
            setIsReconnecting(false);
          }
        }, 500);
      } else {
        setConnectionStatus(isConnected ? 'connected' : 'disconnected');
        setIsReconnecting(false);
      }
    };

    recognition.onresult = (event) => {
      let final = '';
      let interim = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }
      
      // Update transcript with interim results for better UX
      if (interim) {
        setTranscript(interim + (final ? ' ' + final : ''));
      }
      
      if (final.trim() && !isProcessing) {
        console.log('Final transcript:', final);
        setTranscript('');
        sendTextToAI(final);
      }
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      
      // Handle different error types
      switch (event.error) {
        case 'network':
          console.warn('Network error, will retry...');
          break;
        case 'not-allowed':
          console.error('Microphone permission denied');
          setConnectionStatus('failed');
          setShouldKeepListening(false);
          setIsReconnecting(false);
          return;
        case 'no-speech':
          // This is normal - don't log as error, just continue
          break;
        case 'audio-capture':
          console.error('Audio capture error');
          setConnectionStatus('failed');
          setShouldKeepListening(false);
          setIsReconnecting(false);
          return;
        case 'aborted':
          console.warn('Recognition aborted');
          setIsReconnecting(false);
          break;
        default:
          console.warn('Speech recognition error:', event.error);
      }
      
      // Don't auto-restart on certain errors
      if (['not-allowed', 'audio-capture', 'service-not-allowed'].includes(event.error)) {
        setShouldKeepListening(false);
        setConnectionStatus('failed');
        setIsReconnecting(false);
      }
    };

    recognitionRef.current = recognition;
    return true;
  }, [shouldKeepListening, isConnected, isMuted, sendTextToAI, isProcessing]);

  // Start listening
  const startListening = useCallback(async () => {
    setIsConnecting(true);
    setConnectionStatus('connecting');

    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      mediaStreamRef.current = stream;
      streamTrackRef.current = stream.getAudioTracks()[0];

      // Clean up existing audio context properly
      if (audioContextRef.current) {
        try {
          if (audioContextRef.current.state !== 'closed') {
            await audioContextRef.current.close();
          }
        } catch (e) {
          console.warn('Error closing existing AudioContext:', e);
        }
        audioContextRef.current = null;
      }
      
      // Create new audio context for visualization
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        await audioContextRef.current.resume(); // Ensure context is running
        
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        analyserRef.current.smoothingTimeConstant = 0.8;
        
        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyserRef.current);
        
        // Start audio level monitoring
        animationRef.current = requestAnimationFrame(monitorAudioLevel);
      } catch (audioError) {
        console.warn('Audio visualization not available:', audioError);
        // Continue without audio visualization
      }

      // Initialize and start speech recognition
      setShouldKeepListening(true);
      if (!recognitionRef.current) {
        if (!initializeSpeechRecognition()) {
          throw new Error('Speech recognition not available');
        }
      }
      
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (recognitionError) {
          console.warn('Speech recognition start error:', recognitionError);
          // Try to reinitialize
          if (initializeSpeechRecognition()) {
            recognitionRef.current?.start();
          }
        }
      }
      
      setIsConnected(true);
      setConnectionStatus('connected');
      setIsMuted(false);
      
      // Add welcome message
      setMessages([{
        sender: "bot",
        text: "Hello! I'm ready to chat. What would you like to talk about?",
        loading: false,
        timestamp: new Date().toISOString(),
      }]);
      
      // Speak welcome message
      setTimeout(() => {
        speakWithBrowserTTS("Hello! I'm ready to chat. What would you like to talk about?");
      }, 500);
      
    } catch (err) {
      console.error('startListening error:', err);
      setConnectionStatus('failed');
      setShouldKeepListening(false);
      setIsReconnecting(false);
      
      // Add error message
      setMessages([{
        sender: "bot",
        text: "Sorry, I couldn't access your microphone. Please check your browser permissions and try again.",
        loading: false,
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsConnecting(false);
    }
  }, [initializeSpeechRecognition, monitorAudioLevel, speakWithBrowserTTS]);

  // Stop listening
  const stopListening = useCallback(async () => {
    console.log('Stopping voice assistant...');
    
    // Stop auto-restart behavior
    setShouldKeepListening(false);
    setIsReconnecting(false);
    setIsProcessing(false);
    
    // Clear any pending restarts
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    
    // Clean up animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    // Stop speech recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn('Error stopping speech recognition:', e);
      }
      recognitionRef.current = null;
    }
    
    // Stop media stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    if (streamTrackRef.current) {
      streamTrackRef.current.stop();
      streamTrackRef.current = null;
    }
    
    // Close audio context properly
    if (audioContextRef.current) {
      try {
        if (audioContextRef.current.state !== 'closed') {
          await audioContextRef.current.close();
        }
      } catch (e) {
        console.warn('Error closing AudioContext:', e);
      } finally {
        audioContextRef.current = null;
        analyserRef.current = null;
      }
    }
    
    // Clean up audio
    cleanupAudio();
    
    // Reset states
    setIsConnected(false);
    setConnectionStatus('disconnected');
    setTranscript('');
    setAgentResponse('');
    setAudioLevel(0);
    setIsMuted(false);
  }, [cleanupAudio]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (!isConnected) return;
    
    if (isMuted) {
      // Unmute: restart recognition
      console.log('Unmuting and restarting recognition...');
      setShouldKeepListening(true);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (error) {
          console.log('Recognition already running or failed to start:', error);
        }
      }
      setIsMuted(false);
    } else {
      // Mute: stop recognition but keep connection
      console.log('Muting and stopping recognition...');
      setShouldKeepListening(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsMuted(true);
    }
  }, [isMuted, isConnected]);

  // Handle voice change
  const handleVoiceChange = (voiceId) => {
    const selectedVoice = voiceOptions.find(v => v.id === voiceId);
    if (!selectedVoice) return;

    cleanupAudio();

    setVoiceSettings({
      voice: selectedVoice.id,
      model: "tts-1",
      speed: 1.0
    });
  };

  // Update voice settings ref
  useEffect(() => {
    voiceSettingsRef.current = voiceSettings;
  }, [voiceSettings]);

  // Load voices for browser TTS
  useEffect(() => {
    if (window.speechSynthesis) {
      // Load voices
      window.speechSynthesis.getVoices();
      // Some browsers need this event
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      console.log('VoiceAssistant unmounting, cleaning up...');
      
      // Stop auto-restart behavior
      setShouldKeepListening(false);
      setIsReconnecting(false);
      setIsProcessing(false);
      
      // Clear timeouts
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = null;
      }
      
      // Stop speech recognition
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.warn('Error stopping recognition on unmount:', e);
        }
        recognitionRef.current = null;
      }
      
      // Stop media stream
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }
      
      if (streamTrackRef.current) {
        streamTrackRef.current.stop();
        streamTrackRef.current = null;
      }
      
      // Clean up animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      
      // Clean up audio context
      if (audioContextRef.current) {
        try {
          if (audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
          }
        } catch (e) {
          console.warn('Error closing AudioContext on unmount:', e);
        } finally {
          audioContextRef.current = null;
          analyserRef.current = null;
        }
      }
      
      // Clean up audio
      cleanupAudio();
    };
  }, [cleanupAudio]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-6 max-w-2xl w-full mx-4 shadow-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 bg-gradient-to-br ${currentVoice.color} rounded-full flex items-center justify-center`}>
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Voice Assistant</h3>
              <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full ${statusInfo.bgColor} border ${statusInfo.borderColor}`}>
                <div className={`w-2 h-2 rounded-full ${statusInfo.color.replace('text-', 'bg-')} ${isReconnecting || connectionStatus === 'listening' ? 'animate-pulse' : ''}`} />
                <span className={`text-xs font-mono ${statusInfo.color}`}>
                  {statusInfo.text}
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Voice Selection */}
        <div className="mb-6">
          <h4 className="text-gray-600 text-sm font-mono mb-3">SELECT VOICE</h4>
          <div className="grid grid-cols-3 gap-3">
            {voiceOptions.map((voice) => (
              <button
                key={voice.id}
                onClick={() => handleVoiceChange(voice.id)}
                className={`relative p-3 rounded-xl border-2 transition-all duration-300 ${
                  voiceSettings.voice === voice.id
                    ? 'border-gray-400 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className={`w-8 h-8 mx-auto mb-2 rounded-full bg-gradient-to-br ${voice.color} flex items-center justify-center`}>
                  <User className="w-4 h-4 text-white" />
                </div>
                <h5 className="text-gray-900 font-bold text-sm">{voice.name}</h5>
                <p className="text-xs text-gray-500">{voice.personality}</p>
                
                {voiceSettings.voice === voice.id && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Zap className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Central Visualization */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div
              className={`w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all duration-200 ${
                isConnected ? 'border-blue-500' : 'border-gray-300'
              }`}
              style={{
                transform: `scale(${audioLevel > 20 ? 1.1 : 1})`,
                borderColor: audioLevel > 50 ? '#ef4444' : audioLevel > 20 ? '#3b82f6' : isConnected ? '#3b82f6' : '#d1d5db'
              }}
            >
              <div
                className={`w-16 h-16 rounded-full bg-gradient-to-br ${currentVoice.color} flex items-center justify-center transition-transform duration-300`}
                style={{
                  transform: `scale(${isAgentSpeaking ? 1.2 : isReconnecting ? 1.1 : 1})`,
                }}
              >
                {isAgentSpeaking ? (
                  <Volume2 className="w-6 h-6 text-white animate-pulse" />
                ) : isReconnecting ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : connectionStatus === 'listening' ? (
                  <Radio className="w-6 h-6 text-white animate-pulse" />
                ) : (
                  <Bot className="w-6 h-6 text-white" />
                )}
              </div>
            </div>

            {/* Audio Level Bars */}
            {isConnected && !isMuted && (
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-blue-500 rounded-full transition-all duration-100"
                    style={{
                      height: audioLevel > (i * 20) ? `${8 + i * 4}px` : '4px',
                      opacity: audioLevel > (i * 20) ? 1 : 0.3
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          {isConnected ? (
            <>
              <button
                onClick={toggleMute}
                className={`p-3 rounded-full transition-all hover:scale-110 ${
                  isMuted 
                    ? 'bg-red-100 border-2 border-red-300 text-red-600' 
                    : 'bg-blue-100 border-2 border-blue-300 text-blue-600'
                }`}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                onClick={stopListening}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold text-sm hover:from-red-600 hover:to-red-700 transition-all flex items-center gap-2 border border-red-400 hover:scale-105"
              >
                <PhoneOff className="w-4 h-4" />
                DISCONNECT
              </button>

              <button
                onClick={() => cleanupAudio()}
                disabled={!isAgentSpeaking}
                className="p-3 rounded-full bg-purple-100 border-2 border-purple-300 text-purple-600 hover:scale-110 disabled:opacity-50 disabled:hover:scale-100 transition-all"
              >
                {isAgentSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </>
          ) : (
            <button
              onClick={startListening}
              disabled={isConnecting}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl font-bold text-sm hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 disabled:opacity-50 transition-all flex items-center gap-2 border border-blue-400 hover:scale-105"
            >
              {isConnecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  CONNECTING...
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4" />
                  START CONVERSATION
                </>
              )}
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {messages.length === 0 && !isConnected && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm font-mono">
                Press "START CONVERSATION" to begin voice chat
              </p>
              <p className="text-gray-400 text-xs mt-2">
                This demo uses browser speech recognition and text-to-speech
              </p>
            </div>
          )}
          
          {messages.map((msg, i) => (
            <div
              key={`${msg.timestamp}-${i}`}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-2xl p-3 max-w-xs ${
                  msg.sender === "bot"
                    ? "bg-gray-50 text-gray-800"
                    : "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                }`}
              >
                {msg.loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Processing...</span>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    <div
                      className={`text-xs mt-1 flex items-center gap-1 ${
                        msg.sender === "bot"
                          ? "text-gray-500"
                          : "text-blue-200"
                      }`}
                    >
                      {msg.sender === "bot" && isAgentSpeaking && i === messages.length - 1 && (
                        <Volume2 className="w-3 h-3 animate-pulse" />
                      )}
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Current transcript indicator */}
          {transcript && !messages.some(msg => msg.text === transcript) && (
            <div className="flex justify-end">
              <div className="bg-blue-100 border border-blue-300 text-blue-800 rounded-2xl p-3 max-w-xs">
                <div className="flex items-center gap-2 mb-1">
                  <Radio className="w-3 h-3 animate-pulse" />
                  <span className="text-xs font-mono">LISTENING...</span>
                </div>
                <p className="text-sm">{transcript}</p>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <div className="mt-4 space-y-2">
          <p className="text-xs text-gray-500 text-center">
            Voice assistant demo using browser APIs. Works best in Chrome.
          </p>
          {!isConnected && (
            <p className="text-xs text-gray-400 text-center">
              Make sure to allow microphone permissions when prompted
            </p>
          )}
        </div>
      </div>
    </div>
  );
}