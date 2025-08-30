// app/api/openai-tts/route.js (for Next.js 13+ App Router)
// OR pages/api/openai-tts.js (for Pages Router)

import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { 
      text, 
      voice = "alloy", 
      model = "tts-1",
      speed = 1.0 
    } = await req.json();

    console.log('OpenAI TTS Request:', { 
      voice, 
      model, 
      textLength: text?.length,
      speed
    });

    // Validate input
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ error: "Invalid text input" }, { status: 400 });
    }

    // Check if OpenAI API key exists
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not found');
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    // Validate voice parameter
    const validVoices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
    if (!validVoices.includes(voice)) {
      console.warn(`Invalid voice "${voice}", using "alloy"`);
    }

    // Truncate text if too long (OpenAI TTS has a 4096 character limit)
    const truncatedText = text.length > 4000 ? text.substring(0, 4000) + '...' : text;

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        input: truncatedText,
        voice: validVoices.includes(voice) ? voice : 'alloy',
        speed: Math.max(0.25, Math.min(4.0, speed)), // Clamp speed between 0.25 and 4.0
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('OpenAI TTS API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      return NextResponse.json(
        { error: `OpenAI TTS failed: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    // Get the audio data as array buffer
    const audioBuffer = await response.arrayBuffer();
    
    if (!audioBuffer || audioBuffer.byteLength === 0) {
      console.error('Received empty audio buffer from OpenAI');
      return NextResponse.json(
        { error: "Received empty audio response" },
        { status: 500 }
      );
    }

    console.log('Successfully generated TTS audio:', {
      audioSize: audioBuffer.byteLength,
      voice,
      textLength: truncatedText.length
    });

    // Return the audio data with proper headers
    return new NextResponse(Buffer.from(audioBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Voice': voice,
        'X-Model': model,
        'X-Speed': speed.toString(),
      },
    });
    
  } catch (err) {
    console.error("OpenAI TTS processing error:", err);
    
    return NextResponse.json(
      { 
        error: "TTS generation failed", 
        details: err.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Handle GET requests (optional - for health check)
export async function GET() {
  return NextResponse.json({
    status: 'OpenAI TTS API is running',
    supportedVoices: ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'],
    supportedModels: ['tts-1', 'tts-1-hd'],
    speedRange: '0.25 - 4.0',
    maxTextLength: 4096
  });
}