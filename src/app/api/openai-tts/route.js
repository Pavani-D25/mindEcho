// pages/api/openai-tts.js
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { 
      text, 
      voice = "alloy", 
      model = "tts-1",
      speed = 1.0 
    } = await req.json();

    // Log the request for debugging
    console.log('OpenAI TTS Request:', { voice, model, text: text.substring(0, 50) + '...' });

    // Validate input
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ error: "Invalid text input" }, { status: 400 });
    }

    // Truncate text if too long (OpenAI TTS has a 4096 character limit)
    const truncatedText = text.substring(0, 4000);

    const response = await openai.audio.speech.create({
      model,
      voice,
      input: truncatedText,
      speed,
    });

    if (!response) {
      throw new Error('No response from OpenAI TTS');
    }

    // Convert the response to an array buffer
    const arrayBuffer = await response.arrayBuffer();
    
    return new NextResponse(Buffer.from(arrayBuffer), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "X-Voice": voice,
        "X-Model": model,
      },
    });
    
  } catch (err) {
    console.error("OpenAI TTS processing error:", err);
    return NextResponse.json(
      { error: "TTS generation failed", details: err.message },
      { status: 500 }
    );
  }
}