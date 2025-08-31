// // // // src/app/api/ai-reply/route.js
// // // import { NextResponse } from "next/server";

// // // export async function POST(req) {
// // //   try {
// // //     const { text, language } = await req.json();

// // //     const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
// // //       method: "POST",
// // //       headers: {
// // //         "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
// // //         "Content-Type": "application/json",
// // //       },
// // //       body: JSON.stringify({
// // //         model: "openai/gpt-4o-mini", // you can swap models here
// // //         messages: [
// // //           { role: "system", content: "You are a helpful, multilingual voice assistant." },
// // //           { role: "user", content: text },
// // //         ],
// // //       }),
// // //     });

// // //     if (!res.ok) {
// // //       const errorText = await res.text();
// // //       console.error("OpenRouter error:", errorText);
// // //       return NextResponse.json({ reply: "⚠️ AI request failed" }, { status: 500 });
// // //     }

// // //     const data = await res.json();
// // //     const reply = data.choices?.[0]?.message?.content || "⚠️ No reply generated";

// // //     return NextResponse.json({ reply, language });
// // //   } catch (err) {
// // //     console.error("API error:", err);
// // //     return NextResponse.json({ reply: "⚠️ Server error" }, { status: 500 });
// // //   }
// // // }



// // // src/app/api/ai-reply/route.js



// // import { NextResponse } from "next/server";

// // export async function POST(req) {
// //   try {
// //     const { text, language, voiceSettings } = await req.json();

// //     // Validate input
// //     if (!text || typeof text !== 'string') {
// //       return NextResponse.json(
// //         { error: "Invalid text input" },
// //         { status: 400 }
// //       );
// //     }

// //     // Prepare the system message based on voice settings
// //     const systemMessage = {
// //       role: "system",
// //       content: `You are a helpful, multilingual voice assistant. 
// //                 Respond in a ${voiceSettings?.stability > 0.7 ? 'calm and measured' : 'natural'} tone.
// //                 Keep responses concise, under 3 sentences.`
// //     };

// //     const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
// //       method: "POST",
// //       headers: {
// //         "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
// //         "Content-Type": "application/json",
// //         "HTTP-Referer": process.env.SITE_URL, // Required for OpenRouter
// //         "X-Title": "Voice Assistant" // Recommended for OpenRouter
// //       },
// //       body: JSON.stringify({
// //         model: "openai/gpt-4o", // Updated to gpt-4o
// //         messages: [
// //           systemMessage,
// //           { role: "user", content: text },
// //         ],
// //         max_tokens: 150, // Limit response length for voice
// //         temperature: voiceSettings?.clarity || 0.7, // Adjust based on clarity setting
// //       }),
// //       timeout: 10000 // 10 second timeout
// //     });

// //     if (!response.ok) {
// //       const errorData = await response.json().catch(() => ({}));
// //       console.error("OpenRouter error:", {
// //         status: response.status,
// //         error: errorData.error?.message || "Unknown error"
// //       });
      
// //       return NextResponse.json(
// //         { reply: "Sorry, I'm having trouble responding right now.", language },
// //         { status: 200 } // Still return 200 to keep the conversation flowing
// //       );
// //     }

// //     const data = await response.json();
// //     const reply = data.choices?.[0]?.message?.content?.trim() || "I didn't get that, could you repeat?";

// //     // Clean up the response for voice output
// //     const cleanedReply = reply
// //       .replace(/\[.*?\]/g, '') // Remove any markdown or annotations
// //       .replace(/\n/g, ' '); // Convert newlines to spaces

// //     return NextResponse.json({ 
// //       reply: cleanedReply, 
// //       language: language || 'en-US' 
// //     });

// //   } catch (err) {
// //     console.error("API processing error:", err);
// //     return NextResponse.json(
// //       { reply: "I'm experiencing technical difficulties. Please try again later.", language: 'en-US' },
// //       { status: 200 } // Return 200 to prevent client-side errors
// //     );
// //   }
// // }

// // app/api/ai-reply/route.js (for Next.js 13+ App Router)
// // OR pages/api/ai-reply.js (for Pages Router)




// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const { text, language, voiceSettings, } = await req.json();

//     // Validate input
//     if (!text || typeof text !== 'string') {
//       return NextResponse.json(
//         { error: "Invalid text input" },
//         { status: 400 }
//       );
//     }

//     console.log('Processing AI request:', { text: text.substring(0, 50) + '...', voiceSettings });

//     // Check if OpenRouter API key exists
//     if (!process.env.OPENROUTER_API_KEY) {
//       console.warn('OpenRouter API key not found, using fallback responses');
//       return getFallbackResponse(text, language);
//     }

//     // Prepare the system message
//     const systemMessage = {
//       role: "system",
//       content: `You are a helpful, friendly voice assistant. Keep responses conversational, concise, and under 3 sentences. Respond naturally as if speaking to someone in person. Avoid technical jargon and be engaging.`
//     };

//     const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
//         "Content-Type": "application/json",
//         "HTTP-Referer": process.env.SITE_URL || 'http://localhost:3000',
//         "X-Title": "Voice Assistant"
//       },
//       body: JSON.stringify({
//         model: "openai/gpt-4o-mini", // More cost-effective model
//         messages: [
//           systemMessage,
//           { role: "user", content: text },
//         ],
//         max_tokens: 150,
//         temperature: 0.7,
//         stream: false
//       }),
//     });

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       console.error("OpenRouter error:", {
//         status: response.status,
//         error: errorData.error?.message || "Unknown error"
//       });
      
//       return getFallbackResponse(text, language);
//     }

//     const data = await response.json();
//     const reply = data.choices?.[0]?.message?.content?.trim();

//     if (!reply) {
//       console.warn('No reply from AI model');
//       return getFallbackResponse(text, language);
//     }

//     // Clean up the response for voice output
//     const cleanedReply = reply
//       .replace(/\[.*?\]/g, '') // Remove bracketed content
//       .replace(/\*.*?\*/g, '') // Remove asterisk content
//       .replace(/\n/g, ' ') // Replace newlines with spaces
//       .replace(/\s+/g, ' ') // Normalize whitespace
//       .trim();

//     return NextResponse.json({ 
//       reply: cleanedReply, 
//       language: language || 'en-US' 
//     });

//   } catch (err) {
//     console.error("API processing error:", err);
//     return getFallbackResponse(text, language || 'en-US');
//   }
// }

// // Fallback responses when API fails
// function getFallbackResponse(text, language) {
//   const fallbackResponses = [
//     "That's really interesting! Tell me more about that.",
//     "I understand what you're saying. That's a great point.",
//     "Thanks for sharing that with me. What else would you like to discuss?",
//     "That's fascinating! I'd love to hear your thoughts on that topic.",
//     "Great question! That's definitely something worth talking about.",
//     "I appreciate you bringing that up. What's your take on it?",
//     "That's an intriguing perspective. How did you come to think about that?",
//     "Interesting! That reminds me of something similar I've been considering."
//   ];

//   // Simple keyword-based responses
//   const lowerText = text.toLowerCase();
//   let reply;

//   if (lowerText.includes('hello') || lowerText.includes('hi')) {
//     reply = "Hello! It's great to chat with you. What's on your mind today?";
//   } else if (lowerText.includes('how are you')) {
//     reply = "I'm doing well, thank you for asking! How are you doing?";
//   } else if (lowerText.includes('weather')) {
//     reply = "I don't have access to current weather data, but I'd love to chat about whatever's on your mind!";
//   } else if (lowerText.includes('time')) {
//     reply = "I don't have access to the current time, but we can talk about anything else you'd like!";
//   } else if (lowerText.includes('help')) {
//     reply = "I'm here to help! What would you like to talk about or learn more about?";
//   } else if (lowerText.includes('bye') || lowerText.includes('goodbye')) {
//     reply = "It was great talking with you! Have a wonderful day!";
//   } else {
//     // Random fallback response
//     reply = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
//   }

//   return NextResponse.json({ 
//     reply, 
//     language: language || 'en-US' 
//   });
// }


// app/api/ai-reply/route.js (for Next.js 13+ App Router)
// OR pages/api/ai-reply.js (for Pages Router)

import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { text, language, voiceSettings } = await req.json();

    // Validate input
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: "Invalid text input" },
        { status: 400 }
      );
    }

    // Prepare the system message based on voice settings
    const systemMessage = {
      role: "system",
      content: `You are a helpful, multilingual voice assistant. 
      Respond in a ${voiceSettings?.speed > 1.2 ? 'energetic and quick' : voiceSettings?.speed < 0.8 ? 'calm and measured' : 'natural'} tone. 
      Keep responses concise, under 3 sentences. 
      Focus on being conversational and engaging for voice interaction.`
    };

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.SITE_URL, // Required for OpenRouter
        "X-Title": "Murf AI Voice Assistant" // Recommended for OpenRouter
      },
      body: JSON.stringify({
        model: "openai/gpt-4o", // Using GPT-4o for better responses
        messages: [
          systemMessage,
          { role: "user", content: text },
        ],
        max_tokens: 150, // Limit response length for voice
        temperature: 0.7,
        stream: false
      }),
      signal: AbortSignal.timeout(15000) // 15 second timeout
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenRouter error:", {
        status: response.status,
        error: errorData.error?.message || "Unknown error"
      });
      
      return NextResponse.json(
        { 
          reply: "Sorry, I'm having trouble responding right now. Could you try again?", 
          language: language || 'en-US' 
        },
        { status: 200 } // Still return 200 to keep the conversation flowing
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || "I didn't catch that, could you repeat?";

    // Clean up the response for voice output
    const cleanedReply = reply
      .replace(/\[.*?\]/g, '') // Remove any markdown or annotations
      .replace(/\n/g, ' ') // Convert newlines to spaces
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
      .trim();

    return NextResponse.json({
      reply: cleanedReply,
      language: language || 'en-US'
    });

  } catch (err) {
    console.error("AI reply processing error:", err);
    return NextResponse.json(
      { 
        reply: "I'm experiencing technical difficulties. Please try again in a moment.", 
        language: 'en-US' 
      },
      { status: 200 } // Return 200 to prevent client-side errors
    );
  }
}

// Handle GET requests (health check)
export async function GET() {
  return NextResponse.json({ 
    status: 'AI Reply API is running',
    model: 'openai/gpt-4o',
    provider: 'OpenRouter'
  });
}

// -------------------------------------------------------------------
