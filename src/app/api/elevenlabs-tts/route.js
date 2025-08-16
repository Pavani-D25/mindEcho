

import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { text, voice_id, model_id = "eleven_monolingual_v1", stability = 0.5, similarity_boost = 0.5 } = await req.json();

    // Log the request for debugging
    console.log('TTS Request:', { voice_id, model_id, text: text.substring(0, 50) + '...' });

    // Validate input
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ error: "Invalid text input" }, { status: 400 });
    }

    if (!voice_id) {
      return NextResponse.json({ error: "Voice ID is required" }, { status: 400 });
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
          "accept": "audio/mpeg",
        },
        body: JSON.stringify({
          text: text.substring(0, 5000),
          model_id,
          voice_settings: {
            stability,
            similarity_boost,
          },
        }),
        signal: AbortSignal.timeout(15000) // Increased timeout
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API Error:', response.status, errorText);
      return NextResponse.json(
        { error: "TTS generation failed", details: errorText },
        { status: response.status }
      );
    }

    const audioArrayBuffer = await response.arrayBuffer();
    
    return new NextResponse(Buffer.from(audioArrayBuffer), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "X-Voice-ID": voice_id,
        "X-Model-ID": model_id,
      },
    });
    
  } catch (err) {
    console.error("TTS processing error:", err);
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}