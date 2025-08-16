

"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Bot
} from "lucide-react";

export default function VoiceAssistant({ onClose }) {
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

  // Voice settings with model pairing
  const [voiceSettings, setVoiceSettings] = useState({
    voiceId: "pNInz6obpgDQGcFmaJgB",
    model: "eleven_monolingual_v1",
    stability: 0.5,
    clarity: 0.5,
  });

  // Enhanced voice options with personalities
  const voiceOptions = [
    { 
      id: "pNInz6obpgDQGcFmaJgB", 
      name: "ADAM", 
      model: "eleven_monolingual_v1",
      personality: "Professional Assistant",
      accent: "American",
      color: "from-blue-500 to-cyan-500"
    },
    { 
      id: "21m00Tcm4TlvDq8ikWAM", 
      name: "RACHEL", 
      model: "eleven_turbo_v2",
      personality: "Friendly Companion",
      accent: "American",
      color: "from-pink-500 to-rose-500"
    },
    { 
      id: "AZnzlk1XvdvUeBnXmlld", 
      name: "DOMI", 
      model: "eleven_multilingual_v1",
      personality: "Global Communicator",
      accent: "Multi-lingual",
      color: "from-purple-500 to-violet-500"
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

  // Get current voice info
  const currentVoice = voiceOptions.find(v => v.id === voiceSettings.voiceId) || voiceOptions[0];

  // Audio level monitor
  const monitorAudioLevel = useCallback(() => {
    if (analyserRef.current && !isMuted && isConnected) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((s, v) => s + v, 0) / dataArray.length;
      setAudioLevel(average);
      animationRef.current = requestAnimationFrame(monitorAudioLevel);
    } else {
      setAudioLevel(0);
    }
  }, [isMuted, isConnected]);

  // Clean up audio function
  const cleanupAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      if (audioRef.current.src) {
        URL.revokeObjectURL(audioRef.current.src);
      }
      audioRef.current = null;
    }
    
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    setIsAgentSpeaking(false);
  }, []);

  // Browser TTS fallback
  const fallbackToBrowserTTS = useCallback((text) => {
    if (!window.speechSynthesis) {
      setIsAgentSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = 1;
    utterance.lang = 'en-US';
    
    utterance.onend = () => setIsAgentSpeaking(false);
    utterance.onerror = () => setIsAgentSpeaking(false);
    
    setIsAgentSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, []);

  // Send text to AI and handle TTS
  const sendTextToAI = useCallback(async (text) => {
    try {
      setAgentResponse("PROCESSING...");
      
      cleanupAudio();

      // Get AI reply
      const res = await fetch('/api/ai-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const { reply } = await res.json();
      setAgentResponse(reply);

      // Use a ref to get the latest voice settings
      const latestVoiceSettings = voiceSettingsRef.current;

      // Generate TTS with current voice settings
      try {
        setIsAgentSpeaking(true);
        const ttsRes = await fetch(`/api/elevenlabs-tts?t=${Date.now()}`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          },
          body: JSON.stringify({
            text: reply,
            voice_id: latestVoiceSettings.voiceId,
            model_id: latestVoiceSettings.model,
            stability: latestVoiceSettings.stability,
            similarity_boost: latestVoiceSettings.clarity
          })
        });

        if (!ttsRes.ok) throw new Error('TTS request failed');

        const audioBlob = await ttsRes.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.onended = () => {
          setIsAgentSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };

        audio.onerror = (e) => {
          setIsAgentSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          fallbackToBrowserTTS(reply);
        };

        await audio.play();
      } catch (ttsError) {
        console.error('ElevenLabs TTS failed:', ttsError);
        fallbackToBrowserTTS(reply);
      }
    } catch (err) {
      console.error('Error:', err);
      setAgentResponse("ERROR: UNABLE TO PROCESS REQUEST");
      setIsAgentSpeaking(false);
    }
  }, [fallbackToBrowserTTS, cleanupAudio]);

  // Initialize speech recognition with auto-restart
  const initializeSpeechRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return;
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
      if (shouldKeepListening && isConnected && !isMuted) {
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
                  initializeSpeechRecognition();
                  if (recognitionRef.current) {
                    recognitionRef.current.start();
                  }
                }
              }, 1000);
            }
          } else {
            setIsReconnecting(false);
          }
        }, 100); // Small delay to prevent rapid restart issues
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
      
      if (final.trim()) {
        console.log('Final transcript:', final);
        setTranscript(final);
        sendTextToAI(final);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      
      // Handle different error types
      switch (event.error) {
        case 'network':
          console.log('Network error, will retry...');
          break;
        case 'not-allowed':
          console.log('Microphone permission denied');
          setConnectionStatus('failed');
          setShouldKeepListening(false);
          setIsReconnecting(false);
          return;
        case 'no-speech':
          console.log('No speech detected, continuing...');
          break;
        case 'audio-capture':
          console.log('Audio capture error');
          setConnectionStatus('failed');
          setShouldKeepListening(false);
          setIsReconnecting(false);
          return;
        case 'aborted':
          console.log('Recognition aborted');
          setIsReconnecting(false);
          break;
        default:
          console.log('Other error:', event.error);
      }
      
      // Don't auto-restart on certain errors
      if (['not-allowed', 'audio-capture', 'service-not-allowed'].includes(event.error)) {
        setShouldKeepListening(false);
        setConnectionStatus('failed');
        setIsReconnecting(false);
      }
    };

    recognitionRef.current = recognition;
  }, [shouldKeepListening, isConnected, isMuted, sendTextToAI]);

  // Start listening
  const startListening = useCallback(async () => {
    setIsConnecting(true);
    setConnectionStatus('connecting');

    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Set up audio context for visualization
      if (audioContextRef.current) {
        await audioContextRef.current.close();
      }
      
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      // Start audio level monitoring
      animationRef.current = requestAnimationFrame(monitorAudioLevel);

      // Initialize and start speech recognition
      setShouldKeepListening(true); // Enable auto-restart
      if (!recognitionRef.current) {
        initializeSpeechRecognition();
      }
      
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
      
      setIsConnected(true);
      setConnectionStatus('connected');
      setIsMuted(false);
      
    } catch (err) {
      console.error('startListening error:', err);
      setConnectionStatus('failed');
      setShouldKeepListening(false);
      setIsReconnecting(false);
    } finally {
      setIsConnecting(false);
    }
  }, [initializeSpeechRecognition, monitorAudioLevel]);

  // Stop listening
  const stopListening = useCallback(async () => {
    console.log('Stopping voice assistant...');
    
    // Stop auto-restart behavior
    setShouldKeepListening(false);
    setIsReconnecting(false);
    
    // Clear any pending restarts
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
    }
    
    // Clean up animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    // Stop speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    // Close audio context
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      await audioContextRef.current.close();
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
      voiceId: selectedVoice.id,
      model: selectedVoice.model,
      stability: 0.5,
      clarity: 0.5
    });
  };

  // Update voice settings ref
  useEffect(() => {
    voiceSettingsRef.current = voiceSettings;
  }, [voiceSettings]);

  // Connection health check
  useEffect(() => {
    if (!isConnected || !shouldKeepListening || isMuted) return;
    
    const healthCheck = setInterval(() => {
      if (recognitionRef.current && !isReconnecting) {
        // Check if recognition is inactive and should be active
        if (shouldKeepListening && isConnected && !isMuted) {
          console.log('Health check: Recognition might be inactive, checking...');
          // The recognition will auto-restart via the onend handler if needed
        }
      }
    }, 5000); // Check every 5 seconds
    
    return () => clearInterval(healthCheck);
  }, [isConnected, shouldKeepListening, isMuted, isReconnecting]);

  // Auto-reconnect logic
  useEffect(() => {
    if (isConnected && !shouldKeepListening && !isMuted && connectionStatus === 'disconnected') {
      // If we're connected but not listening and not muted, something went wrong
      console.log('Detected disconnected state, attempting to reconnect...');
      setShouldKeepListening(true);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (error) {
          console.log('Failed to restart recognition:', error);
          // Reinitialize if needed
          initializeSpeechRecognition();
          setTimeout(() => {
            if (recognitionRef.current) {
              recognitionRef.current.start();
            }
          }, 500);
        }
      }
    }
  }, [isConnected, shouldKeepListening, isMuted, connectionStatus, initializeSpeechRecognition]);

  // Cleanup on component unmount
  useEffect(() => {
    initializeSpeechRecognition();
    
    return () => {
      setShouldKeepListening(false);
      setIsReconnecting(false);
      
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      cleanupAudio();
    };
  }, [initializeSpeechRecognition, cleanupAudio]);

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 w-full max-w-4xl shadow-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0,0,0,0.05)'
        }}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Main Content - Split Layout */}
        <div className="flex flex-col md:flex-row flex-1 gap-6 overflow-hidden">
          {/* Left Side - Controls and Visualization */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                VOICE ASSISTANT
              </h1>
              <div className={`inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-full ${statusInfo.bgColor} border ${statusInfo.borderColor}`}>
                <div className={`w-2 h-2 rounded-full ${statusInfo.color.replace('text-', 'bg-')} ${isReconnecting || connectionStatus === 'listening' ? 'animate-pulse' : ''}`} />
                <span className={`text-xs font-mono ${statusInfo.color}`}>{statusInfo.text}</span>
              </div>
            </div>

            {/* Voice Selection Grid */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-gray-600 text-sm font-mono mb-3 sm:mb-4 text-center">SELECT VOICE PERSONALITY</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {voiceOptions.map((voice) => (
                  <motion.button
                    key={voice.id}
                    onClick={() => handleVoiceChange(voice.id)}
                    className={`relative p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 ${
                      voiceSettings.voiceId === voice.id
                        ? 'border-gray-400 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-full bg-gradient-to-br ${voice.color} flex items-center justify-center`}>
                      <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h4 className="text-gray-900 font-bold text-base sm:text-lg">{voice.name}</h4>
                    
                    
                    {voiceSettings.voiceId === voice.id && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Central Visualization */}
            <div className="flex-1 flex flex-col items-center justify-center mb-6 sm:mb-8">
              {/* Audio Visualizer */}
              <div className="relative mb-4 sm:mb-6">
                <motion.div
                  className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 flex items-center justify-center ${
                    isConnected ? 'border-blue-500' : 'border-gray-300'
                  }`}
                  animate={{
                    scale: audioLevel > 20 ? 1.1 : 1,
                    borderColor: audioLevel > 50 ? '#ef4444' : audioLevel > 20 ? '#3b82f6' : isConnected ? '#3b82f6' : '#d1d5db'
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${currentVoice.color} flex items-center justify-center`}
                    animate={{
                      scale: isAgentSpeaking ? [1, 1.2, 1] : isReconnecting ? [1, 1.1, 1] : 1,
                    }}
                    transition={{
                      duration: isAgentSpeaking ? 1 : 0.5,
                      repeat: isAgentSpeaking || isReconnecting ? Infinity : 0,
                    }}
                  >
                    {isAgentSpeaking ? (
                      <Volume2 className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-pulse" />
                    ) : isReconnecting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : connectionStatus === 'listening' ? (
                      <Radio className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-pulse" />
                    ) : (
                      <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    )}
                  </motion.div>
                </motion.div>

                {/* Audio Level Bars */}
                {isConnected && !isMuted && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-blue-500 rounded-full"
                        animate={{
                          height: audioLevel > (i * 20) ? `${6 + i * 2}px` : '3px',
                          opacity: audioLevel > (i * 20) ? 1 : 0.3
                        }}
                        transition={{ duration: 0.1 }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {!transcript && !agentResponse && !isConnected && (
                <div className="text-center ">
                  <p className="text-gray-500 text-sm font-mono">PRESS START TO BEGIN VOICE CONVERSATION</p>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3 sm:gap-6">
              {isConnected ? (
                <>
                  <motion.button
                    onClick={toggleMute}
                    className={`p-3 sm:p-4 rounded-full transition-all ${
                      isMuted 
                        ? 'bg-red-100 border-2 border-red-300 text-red-600' 
                        : 'bg-blue-100 border-2 border-blue-300 text-blue-600'
                    } hover:scale-110`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isMuted ? <MicOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Mic className="w-5 h-5 sm:w-6 sm:h-6" />}
                  </motion.button>

                  <motion.button
                    onClick={stopListening}
                    className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl sm:rounded-2xl font-bold text-sm hover:from-red-600 hover:to-red-700 transition-all flex items-center gap-2 sm:gap-3 border border-red-400"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <PhoneOff className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">DISCONNECT</span>
                    <span className="sm:hidden">STOP</span>
                  </motion.button>

                  <motion.button
                    onClick={() => cleanupAudio()}
                    disabled={!isAgentSpeaking}
                    className="p-3 sm:p-4 rounded-full bg-purple-100 border-2 border-purple-300 text-purple-600 hover:scale-110 disabled:opacity-50 disabled:hover:scale-100 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isAgentSpeaking ? <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" /> : <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />}
                  </motion.button>
                </>
              ) : (
                <motion.button
                  onClick={startListening}
                  disabled={isConnecting}
                  className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl sm:rounded-2xl font-bold text-sm hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 disabled:opacity-50 transition-all flex items-center gap-2 sm:gap-3 border border-blue-400"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isConnecting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span className="hidden sm:inline">CONNECTING...</span>
                      <span className="sm:hidden">WAIT...</span>
                    </>
                  ) : (
                    <>
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">START CONVERSATION</span>
                      <span className="sm:hidden">START</span>
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </div>

          {/* Right Side - Transcript and Responses */}
          <div className="hidden md:flex flex-col w-full md:w-1/2 border-l border-gray-200 pl-6 overflow-y-auto">
            {/* User Input */}
            {transcript && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl"
              >
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-600 text-xs font-mono">USER INPUT</span>
                  {isReconnecting && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full"
                    />
                  )}
                </div>
                <p className="text-gray-800 text-sm leading-relaxed">{transcript}</p>
              </motion.div>
            )}

            {/* AI Response */}
            {agentResponse && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 border rounded-xl ${
                  agentResponse.includes('ERROR') 
                    ? 'bg-red-50 border-red-200' 
                    : 'bg-purple-50 border-purple-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-4 h-4 text-purple-600" />
                  <span className="text-purple-600 text-xs font-mono">{currentVoice.name} RESPONSE</span>
                  {isAgentSpeaking && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-3 h-3 border border-purple-600 border-t-transparent rounded-full"
                    />
                  )}
                </div>
                <p className="text-gray-800 text-sm leading-relaxed">{agentResponse}</p>
              </motion.div>
            )}

            {!transcript && !agentResponse && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500 text-sm font-mono mb-2">
                    CONVERSATION LOG WILL APPEAR HERE
                  </p>
                  {isConnected && (
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span>Listening for your voice...</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Transcript - Only show on mobile when there's content */}
          <div className="md:hidden">
            {(transcript || agentResponse) && (
              <div className="border-t border-gray-200 pt-4 space-y-3 max-h-40 overflow-y-auto">
                {transcript && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-3 h-3 text-blue-600" />
                      <span className="text-blue-600 text-xs font-mono">YOU</span>
                    </div>
                    <p className="text-gray-800 text-xs leading-relaxed">{transcript}</p>
                  </div>
                )}

                {agentResponse && (
                  <div className={`p-3 border rounded-lg ${
                    agentResponse.includes('ERROR') 
                      ? 'bg-red-50 border-red-200' 
                      : 'bg-purple-50 border-purple-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Bot className="w-3 h-3 text-purple-600" />
                      <span className="text-purple-600 text-xs font-mono">{currentVoice.name}</span>
                      {isAgentSpeaking && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="w-2 h-2 border border-purple-600 border-t-transparent rounded-full"
                        />
                      )}
                    </div>
                    <p className="text-gray-800 text-xs leading-relaxed">{agentResponse}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </motion.div>
    </motion.div>
  );
}