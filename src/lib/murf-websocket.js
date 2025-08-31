// lib/murf-websocket.js
class MurfWebSocketTTS {
  constructor() {
    this.ws = null;
    this.isConnected = false;
    this.audioContext = null;
    this.messageCallbacks = new Set();
  }

  async connect(voiceSettings = {}) {
    if (this.isConnected) return true;

    try {
      // Connect to our Next.js API WebSocket proxy
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      this.ws = new WebSocket(`${protocol}//${window.location.host}/api/murf-websocket-proxy`);

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('WebSocket connection timeout'));
        }, 5000);

        this.ws.onopen = () => {
          console.log('WebSocket connected to Murf proxy');
          clearTimeout(timeout);
          this.isConnected = true;
          
          // Send voice configuration
          this.sendVoiceConfig(voiceSettings);
          resolve(true);
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          clearTimeout(timeout);
          reject(error);
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          this.isConnected = false;
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };
      });
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      throw error;
    }
  }

  sendVoiceConfig(voiceSettings) {
    if (!this.isConnected) return;

    const voiceConfig = {
      type: 'voice_config',
      voice_config: {
        voiceId: voiceSettings.voiceId || "en-US-natalie",
        style: "Conversational",
        rate: voiceSettings.speed || 1.0,
        pitch: voiceSettings.pitch || 0,
        variation: 1
      }
    };

    this.ws.send(JSON.stringify(voiceConfig));
  }

  async speak(text, end = true) {
    if (!this.isConnected) {
      await this.connect();
    }

    const textMessage = {
      type: 'text',
      text: text,
      end: end
    };

    this.ws.send(JSON.stringify(textMessage));
  }

  handleMessage(data) {
    try {
      const message = JSON.parse(data);
      
      // Notify all message callbacks
      this.messageCallbacks.forEach(callback => callback(message));
      
      if (message.audio) {
        this.handleAudioData(message.audio);
      }
      
      if (message.final) {
        console.log('Final message received');
      }
      
      if (message.error) {
        console.error('WebSocket error:', message.error);
        throw new Error(message.error);
      }
      
    } catch (error) {
      console.error('Error parsing WebSocket message:', error, data);
    }
  }

  async handleAudioData(base64Audio) {
    try {
      // Decode base64 audio
      const audioData = Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0));
      
      // Create audio context if it doesn't exist
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      // Decode and play audio
      this.audioContext.decodeAudioData(audioData.buffer)
        .then(audioBuffer => {
          const source = this.audioContext.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(this.audioContext.destination);
          source.start();
        })
        .catch(error => {
          console.error('Error decoding audio:', error);
          this.fallbackAudioPlayback(base64Audio);
        });
        
    } catch (error) {
      console.error('Error processing audio data:', error);
      this.fallbackAudioPlayback(base64Audio);
    }
  }

  fallbackAudioPlayback(base64Audio) {
    try {
      const audioBlob = new Blob([
        Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0))
      ], { type: 'audio/wav' });
      
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.play().catch(error => {
        console.error('Fallback audio playback failed:', error);
        URL.revokeObjectURL(audioUrl);
      });
    } catch (error) {
      console.error('Fallback audio processing failed:', error);
    }
  }

  onMessage(callback) {
    this.messageCallbacks.add(callback);
    return () => this.messageCallbacks.delete(callback);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
    this.isConnected = false;
  }
}

export default MurfWebSocketTTS;