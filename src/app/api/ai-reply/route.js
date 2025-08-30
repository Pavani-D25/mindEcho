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



// // pages/api/ai-reply.js
// import { NextResponse } from "next/server";
// import { getUserProfile } from "@/lib/firebase";

// export async function POST(req) {
//   try {
//     const { text, language, voiceSettings, userId } = await req.json();

//     // Validate input
//     if (!text || typeof text !== 'string') {
//       return NextResponse.json(
//         { error: "Invalid text input" },
//         { status: 400 }
//       );
//     }

//     // Get user profile and previous conversations
//     let context = "";
//     if (userId) {
//       const userProfile = await getUserProfile(userId);
//       if (userProfile) {
//         context = `User preferences: ${JSON.stringify(userProfile.preferences || {})}. `;
//         context += `Previous interactions suggest the user prefers ${userProfile.preferences?.tone || 'a professional'} tone.`;
//       }
//     }

//     // Prepare the system message with context
//     const systemMessage = {
//       role: "system",
//       content: `You are a helpful, multilingual voice assistant. 
//                 ${context}
//                 Respond in a ${voiceSettings?.stability > 0.7 ? 'calm and measured' : 'natural'} tone.
//                 Keep responses concise, under 3 sentences.`
//     };

//     const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
//         "Content-Type": "application/json",
//         "HTTP-Referer": process.env.SITE_URL,
//         "X-Title": "Voice Assistant"
//       },
//       body: JSON.stringify({
//         model: "openai/gpt-4o",
//         messages: [
//           systemMessage,
//           { role: "user", content: text },
//         ],
//         max_tokens: 150,
//         temperature: voiceSettings?.clarity || 0.7,
//       }),
//       timeout: 10000
//     });

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       console.error("OpenRouter error:", {
//         status: response.status,
//         error: errorData.error?.message || "Unknown error"
//       });
      
//       return NextResponse.json(
//         { reply: "Sorry, I'm having trouble responding right now.", language },
//         { status: 200 }
//       );
//     }

//     const data = await response.json();
//     const reply = data.choices?.[0]?.message?.content?.trim() || "I didn't get that, could you repeat?";

//     // Clean up the response for voice output
//     const cleanedReply = reply
//       .replace(/\[.*?\]/g, '')
//       .replace(/\n/g, ' ');

//     return NextResponse.json({ 
//       reply: cleanedReply, 
//       language: language || 'en-US' 
//     });

//   } catch (err) {
//     console.error("API processing error:", err);
//     return NextResponse.json(
//       { reply: "I'm experiencing technical difficulties. Please try again later.", language: 'en-US' },
//       { status: 200 }
//     );
//   }
// }


// pages/api/ai-reply.js
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { text, voiceSettings, userId } = await req.json();

    // Validate input
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: "Invalid text input" },
        { status: 400 }
      );
    }

    // Prepare the system message
    const systemMessage = {
      role: "system",
      content: `You are a helpful, friendly voice assistant. 
                Keep responses conversational and concise, under 3 sentences.
                Be natural and engaging in your tone.
                If asked about your capabilities, mention that you can help with questions, provide information, and have conversations.`
    };

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        systemMessage,
        { role: "user", content: text },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    if (!completion.choices || completion.choices.length === 0) {
      throw new Error('No response from OpenAI');
    }

    const reply = completion.choices[0].message.content.trim() || "I didn't get that, could you repeat?";

    // Clean up the response for voice output
    const cleanedReply = reply
      .replace(/\[.*?\]/g, '')
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return NextResponse.json({ 
      reply: cleanedReply
    });

  } catch (err) {
    console.error("AI Reply processing error:", err);
    return NextResponse.json(
      { reply: "I'm experiencing technical difficulties. Please try again later." },
      { status: 200 }
    );
  }
}