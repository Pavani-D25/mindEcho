// utils/murfConfig.js - Murf AI Configuration and Utilities

export const MURF_CONFIG = {
  BASE_URL: 'https://api.murf.ai/v1',
  ENDPOINTS: {
    GENERATE: '/speech/generate',
    VOICES: '/speech/voices',
    USAGE: '/usage'
  },
  LIMITS: {
    MAX_TEXT_LENGTH: 3000,
    MAX_REQUEST_TIMEOUT: 30000,
    RATE_LIMIT_PER_MINUTE: 60
  }
};

// Popular Murf AI voices with detailed metadata
export const MURF_VOICES = [
  {
    id: "en-US-natalie",
    name: "NATALIE",
    personality: "Professional & Clear",
    accent: "American",
    gender: "Female",
    language: "en-US",
    color: "from-blue-500 to-cyan-500",
    description: "Perfect for business and professional content",
    useCase: ["business", "education", "news"]
  },
  {
    id: "en-US-adrian",
    name: "ADRIAN",
    personality: "Warm & Friendly",
    accent: "American",
    gender: "Male",
    language: "en-US",
    color: "from-green-500 to-emerald-500",
    description: "Great for conversational and casual content",
    useCase: ["conversation", "storytelling", "tutorials"]
  },
  {
    id: "en-UK-hazel",
    name: "HAZEL",
    personality: "Sophisticated & Elegant",
    accent: "British",
    gender: "Female",
    language: "en-UK",
    color: "from-purple-500 to-violet-500",
    description: "Ideal for luxury brands and premium content",
    useCase: ["luxury", "documentary", "audiobooks"]
  },
  {
    id: "en-US-marcus",
    name: "MARCUS",
    personality: "Deep & Authoritative",
    accent: "American",
    gender: "Male",
    language: "en-US",
    color: "from-gray-600 to-gray-800",
    description: "Perfect for serious and authoritative content",
    useCase: ["news", "documentary", "corporate"]
  },
  {
    id: "en-US-aria",
    name: "ARIA",
    personality: "Energetic & Bright",
    accent: "American",
    gender: "Female",
    language: "en-US",
    color: "from-pink-500 to-rose-500",
    description: "Great for upbeat and engaging content",
    useCase: ["advertising", "children", "entertainment"]
  },
  {
    id: "en-US-sarah",
    name: "SARAH",
    personality: "Gentle & Soothing",
    accent: "American",
    gender: "Female",
    language: "en-US",
    color: "from-yellow-400 to-orange-500",
    description: "Perfect for meditation and calming content",
    useCase: ["meditation", "wellness", "bedtime"]
  }
];

// Audio format configurations
export const AUDIO_FORMATS = {
  MP3: {
    extension: 'mp3',
    mimeType: 'audio/mpeg',
    quality: 'good',
    size: 'small'
  },
  WAV: {
    extension: 'wav',
    mimeType: 'audio/wav',
    quality: 'excellent',
    size: 'large'
  },
  FLAC: {
    extension: 'flac',
    mimeType: 'audio/flac',
    quality: 'lossless',
    size: 'medium'
  },
  OGG: {
    extension: 'ogg',
    mimeType: 'audio/ogg',
    quality: 'good',
    size: 'small'
  }
};

// Utility functions
export const murfUtils = {
  // Validate API key format
  validateApiKey: (apiKey) => {
    if (!apiKey || typeof apiKey !== 'string') {
      return { valid: false, error: 'API key is required' };
    }
    if (apiKey.length < 20) {
      return { valid: false, error: 'API key appears to be too short' };
    }
    return { valid: true };
  },

  // Prepare text for TTS (cleanup and validation)
  prepareTextForTTS: (text) => {
    if (!text || typeof text !== 'string') {
      throw new Error('Invalid text input');
    }

    // Clean up text
    const cleaned = text
      .trim()
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/[^\w\s.,!?;:\-'"()]/g, '') // Remove problematic characters
      .substring(0, MURF_CONFIG.LIMITS.MAX_TEXT_LENGTH); // Truncate if too long

    if (cleaned.length === 0) {
      throw new Error('Text is empty after cleanup');
    }

    return cleaned;
  },

  // Get voice by ID
  getVoiceById: (voiceId) => {
    return MURF_VOICES.find(voice => voice.id === voiceId) || MURF_VOICES[0];
  },

  // Filter voices by criteria
  filterVoices: (criteria = {}) => {
    return MURF_VOICES.filter(voice => {
      if (criteria.gender && voice.gender !== criteria.gender) return false;
      if (criteria.accent && voice.accent !== criteria.accent) return false;
      if (criteria.language && voice.language !== criteria.language) return false;
      if (criteria.useCase && !voice.useCase.includes(criteria.useCase)) return false;
      return true;
    });
  },

  // Validate voice settings
  validateVoiceSettings: (settings) => {
    const errors = [];

    if (settings.speed < 0.5 || settings.speed > 2.0) {
      errors.push('Speed must be between 0.5 and 2.0');
    }

    if (settings.pitch < -20 || settings.pitch > 20) {
      errors.push('Pitch must be between -20 and 20');
    }

    if (!Object.keys(AUDIO_FORMATS).includes(settings.audioFormat)) {
      errors.push('Invalid audio format');
    }

    if (!MURF_VOICES.find(v => v.id === settings.voiceId)) {
      errors.push('Invalid voice ID');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  },

  // Format error messages for user display
  formatErrorMessage: (error) => {
    const errorMap = {
      401: 'Invalid API key. Please check your Murf AI credentials.',
      403: 'Access forbidden. Please check your Murf AI subscription.',
      429: 'Rate limit exceeded. Please try again in a moment.',
      500: 'Server error. Please try again later.',
      timeout: 'Request timed out. The text might be too long.'
    };

    if (typeof error === 'string') {
      return error;
    }

    if (error.status) {
      return errorMap[error.status] || `Error ${error.status}: ${error.message}`;
    }

    return error.message || 'An unexpected error occurred';
  }
};
