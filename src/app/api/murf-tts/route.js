

import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { text, voiceId = 'en-US-natalie' } = await req.json();

    // Validate input
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    if (text.length > 3000) {
      return NextResponse.json(
        { error: "Text is too long. Maximum 3000 characters allowed." },
        { status: 400 }
      );
    }

    // Debug environment variables
    console.log('=== DEBUGGING MURF API ===');
    console.log('Environment check:');
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    console.log('- MURF_API_KEY exists:', !!process.env.MURF_API_KEY);
    console.log('- MURF_API_KEY length:', process.env.MURF_API_KEY?.length);
    console.log('- MURF_API_KEY prefix:', process.env.MURF_API_KEY?.substring(0, 15));
    console.log('- Full env keys:', Object.keys(process.env).filter(key => key.includes('MURF')));

    const apiKey = process.env.MURF_API_KEY;
    
    if (!apiKey) {
      console.error('CRITICAL: MURF_API_KEY is not set in environment');
      return NextResponse.json(
        { error: "Server configuration error: API key not found" },
        { status: 500 }
      );
    }

    // Try multiple header approaches
    const headerAttempts = [
      // Attempt 1: Standard api-key header
      {
        'api-key': apiKey,
        'Content-Type': 'application/json'
      },
      // Attempt 2: Add more headers
      {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'NextJS-Murf-Client/1.0'
      },
      // Attempt 3: Different case
      {
        'API-Key': apiKey,
        'Content-Type': 'application/json'
      },
      // Attempt 4: Token header
      {
        'token': apiKey,
        'Content-Type': 'application/json'
      },
      // Attempt 5: Both headers
      {
        'api-key': apiKey,
        'token': apiKey,
        'Content-Type': 'application/json'
      }
    ];

    const requestBody = {
      text: text.trim(),
      voiceId: voiceId,
      format: 'MP3'
    };

    console.log('Request body:', requestBody);

    for (let i = 0; i < headerAttempts.length; i++) {
      console.log(`\n--- Attempt ${i + 1} ---`);
      console.log('Headers:', headerAttempts[i]);

      try {
        const murfResponse = await fetch('https://api.murf.ai/v1/speech/generate-with-key', {
          method: 'POST',
          headers: headerAttempts[i],
          body: JSON.stringify(requestBody)
        });

        console.log(`Attempt ${i + 1} Response:`, {
          status: murfResponse.status,
          statusText: murfResponse.statusText,
          contentType: murfResponse.headers.get('content-type')
        });

        if (murfResponse.ok) {
          console.log(`SUCCESS with attempt ${i + 1}!`);
          
          const jsonData = await murfResponse.json();
          console.log('Response data keys:', Object.keys(jsonData));
          
          if (jsonData.audioFile) {
            console.log('Audio file URL received:', jsonData.audioFile.substring(0, 50) + '...');
            
            // Fetch the audio file
            const audioResponse = await fetch(jsonData.audioFile);
            
            if (!audioResponse.ok) {
              throw new Error(`Failed to fetch audio file: ${audioResponse.status}`);
            }
            
            const audioBuffer = await audioResponse.arrayBuffer();
            console.log('Audio buffer size:', audioBuffer.byteLength);
            
            return new NextResponse(audioBuffer, {
              status: 200,
              headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Length': audioBuffer.byteLength.toString(),
                'Cache-Control': 'public, max-age=300',
              },
            });
          } else {
            console.log('No audioFile in response:', jsonData);
            return NextResponse.json(
              { error: 'No audio file URL in Murf response' },
              { status: 500 }
            );
          }
        } else {
          const errorText = await murfResponse.text();
          console.error(`Attempt ${i + 1} failed:`, {
            status: murfResponse.status,
            error: errorText
          });
          
          // Continue to next attempt unless this is the last one
          if (i === headerAttempts.length - 1) {
            return NextResponse.json(
              { 
                error: `All header attempts failed. Last error: ${murfResponse.status} - ${errorText}`,
              },
              { status: 500 }
            );
          }
        }
      } catch (attemptError) {
        console.error(`Attempt ${i + 1} threw error:`, attemptError.message);
        
        // Continue to next attempt unless this is the last one
        if (i === headerAttempts.length - 1) {
          return NextResponse.json(
            { error: `All attempts failed. Last error: ${attemptError.message}` },
            { status: 500 }
          );
        }
      }
    }

  } catch (error) {
    console.error('TTS processing error:', error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'Murf TTS API is running (Debug Version)',
    provider: 'Murf AI',
    supportedFormats: ['MP3'],
    maxTextLength: 3000,
    apiKeySet: !!process.env.MURF_API_KEY,
    apiKeyLength: process.env.MURF_API_KEY?.length,
    apiKeyPrefix: process.env.MURF_API_KEY?.substring(0, 15),
    endpoint: 'https://api.murf.ai/v1/speech/generate-with-key'
  });
}