import { useState, useCallback, useRef } from 'react';
import { murfUtils,  } from '../utils/murfConfig';

export const useMurfTTS = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const generateSpeech = useCallback(async (text, voiceSettings = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const cleanedText = murfUtils.prepareTextForTTS(text);
      
      const settingsValidation = murfUtils.validateVoiceSettings(voiceSettings);
      if (!settingsValidation.valid) {
        throw new Error(settingsValidation.errors.join(', '));
      }

      // Call your API endpoint (server will handle API key)
      const response = await fetch('/api/murf-tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: cleanedText,
          ...voiceSettings
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      return result;

    } catch (err) {
      const formattedError = murfUtils.formatErrorMessage(err);
      setError(formattedError);
      console.error('Murf TTS Error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const playAudio = useCallback(async (audioData, audioFormat) => {
    try {
      setIsPlaying(true);
      
      // Stop any existing audio
      if (audioRef.current) {
        audioRef.current.pause();
        if (audioRef.current.src.startsWith('blob:')) {
          URL.revokeObjectURL(audioRef.current.src);
        }
      }

      // Create audio blob
      const audioBlob = new Blob([
        Uint8Array.from(atob(audioData), c => c.charCodeAt(0))
      ], { type: `audio/${audioFormat.toLowerCase()}` });
      
      const audioUrl = URL.createObjectURL(audioBlob);
      
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      audioRef.current.onerror = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
        setError('Audio playback failed');
      };
      
      await audioRef.current.play();
      
    } catch (err) {
      setIsPlaying(false);
      setError('Failed to play audio');
      console.error('Audio playback error:', err);
    }
  }, []);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      if (audioRef.current.src.startsWith('blob:')) {
        URL.revokeObjectURL(audioRef.current.src);
      }
    }
    setIsPlaying(false);
  }, []);

  return {
    generateSpeech,
    playAudio,
    stopAudio,
    isLoading,
    isPlaying,
    error,
    clearError: () => setError(null)
  };
};