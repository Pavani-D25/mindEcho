
// components/VoiceSelector.js - Reusable voice selection component

import React from 'react';
import { User, Zap } from 'lucide-react';
import { MURF_VOICES } from '../utils/murfConfig';

const VoiceSelector = ({ 
  selectedVoiceId, 
  onVoiceChange, 
  showDetails = true,
  layout = 'grid' // 'grid' or 'list'
}) => {
  const selectedVoice = MURF_VOICES.find(v => v.id === selectedVoiceId) || MURF_VOICES[0];

  if (layout === 'list') {
    return (
      <div className="space-y-2">
        {MURF_VOICES.map((voice) => (
          <button
            key={voice.id}
            onClick={() => onVoiceChange(voice.id)}
            className={`w-full p-3 rounded-lg border-2 transition-all duration-200 flex items-center gap-3 ${
              selectedVoiceId === voice.id
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${voice.color} flex items-center justify-center flex-shrink-0`}>
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="text-left flex-1">
              <h4 className="font-bold text-sm text-gray-900">{voice.name}</h4>
              <p className="text-xs text-gray-500">{voice.personality}</p>
              {showDetails && (
                <p className="text-xs text-gray-400">{voice.gender} • {voice.accent}</p>
              )}
            </div>
            {selectedVoiceId === voice.id && (
              <Zap className="w-4 h-4 text-blue-500 flex-shrink-0" />
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {MURF_VOICES.map((voice) => (
        <button
          key={voice.id}
          onClick={() => onVoiceChange(voice.id)}
          className={`relative p-3 rounded-xl border-2 transition-all duration-300 ${
            selectedVoiceId === voice.id
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          <div className={`w-8 h-8 mx-auto mb-2 rounded-full bg-gradient-to-br ${voice.color} flex items-center justify-center`}>
            <User className="w-4 h-4 text-white" />
          </div>
          <h5 className="text-gray-900 font-bold text-sm">{voice.name}</h5>
          <p className="text-xs text-gray-500">{voice.personality}</p>
          {showDetails && (
            <p className="text-xs text-gray-400">{voice.gender} • {voice.accent}</p>
          )}
          {selectedVoiceId === voice.id && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <Zap className="w-2.5 h-2.5 text-white" />
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default VoiceSelector;
