

// // /src/app/api/analyze-mood/route.js
// import { initializeApp, getApps } from "firebase/app";
// import { getDatabase, ref, push } from "firebase/database";

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
// };

// // Initialize Firebase only if it hasn't been initialized
// const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
// const rtdb = getDatabase(app);

// export async function POST(req) {
//   try {
//     const { text, userId = "guest", mood } = await req.json();

//     if (!text || text.trim().length === 0) {
//       return new Response(
//         JSON.stringify({ error: "Text is required" }), 
//         { status: 400, headers: { "Content-Type": "application/json" } }
//       );
//     }

//     const messages = [
//       {
//         role: "system",
//         content: `You are a compassionate mental health assistant.

// Based on the user's journal entry, analyze their emotional state and return a JSON response with personalized recommendations for:

// 1. An exercise/activity
// 2. A song
// 3. A movie/video content

// Each should have:
// - title (string)
// - description (string, max 50 words)
// - duration (string, e.g., "15 minutes", "3 hours")

// CRITICAL INSTRUCTIONS:
// - Return ONLY valid JSON, no markdown, no backticks, no extra text
// - Ensure all fields are present and properly formatted
// - Keep descriptions concise and supportive
// - Choose content that matches the user's emotional state

// Example format:
// {
//   "exercise": {
//     "title": "Morning Yoga Flow",
//     "description": "Gentle stretches to energize your body and calm your mind",
//     "duration": "15 minutes"
//   },
//   "song": {
//     "title": "Here Comes the Sun - The Beatles",
//     "description": "An uplifting classic to brighten your mood and inspire positivity",
//     "duration": "3 minutes"
//   },
//   "movie": {
//     "title": "The Secret Life of Walter Mitty",
//     "description": "An inspiring adventure about following your dreams and finding courage",
//     "duration": "114 minutes"
//   }
// }`,
//       },
//       {
//         role: "user",
//         content: text,
//       },
//     ];

//     console.log("🤖 Sending request to OpenRouter...");
    
//     const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//         "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
//         "X-Title": "Mood Analyzer App",
//       },
//       body: JSON.stringify({
//         model: "anthropic/claude-3-haiku",
//         messages,
//         temperature: 0.7,
//         max_tokens: 1000,
//       }),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("❌ OpenRouter API Error:", response.status, errorText);
//       throw new Error(`OpenRouter API failed: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log("✅ OpenRouter Response:", data);

//     const content = data.choices?.[0]?.message?.content?.trim();

//     if (!content) {
//       console.error("❌ No content in OpenRouter response");
//       return new Response(
//         JSON.stringify({ error: "No response from AI" }), 
//         { status: 500, headers: { "Content-Type": "application/json" } }
//       );
//     }

//     let parsed;
//     try {
//       // Clean the content to remove any potential markdown formatting
//       const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
//       parsed = JSON.parse(cleanContent);
      
//       // Validate the response structure
//       if (!parsed.exercise || !parsed.song || !parsed.movie) {
//         throw new Error("Missing required fields in AI response");
//       }

//       // Validate each recommendation has required fields
//       const requiredFields = ['title', 'description', 'duration'];
//       for (const category of ['exercise', 'song', 'movie']) {
//         for (const field of requiredFields) {
//           if (!parsed[category][field]) {
//             throw new Error(`Missing ${field} in ${category}`);
//           }
//         }
//       }

//     } catch (parseError) {
//       console.error("❌ JSON Parse Error:", parseError);
//       console.error("❌ Raw content:", content);
//       return new Response(
//         JSON.stringify({ 
//           error: "Invalid AI response format", 
//           details: parseError.message,
//           raw: content 
//         }), 
//         { status: 500, headers: { "Content-Type": "application/json" } }
//       );
//     }

//     // Save to Firebase Realtime Database
//     try {
//       const timestamp = new Date().toISOString();
      
//       // Save mood data if provided
//       if (mood) {
//         const moodRef = ref(rtdb, `moods/${userId}`);
//         await push(moodRef, {
//           date: timestamp,
//           mood: mood,
//         });
//       }

//       // Save recommendations
//       const recRef = ref(rtdb, `recommendations/${userId}`);
//       await push(recRef, {
//         timestamp: Date.now(),
//         date: timestamp,
//         journal: text,
//         mood: mood || null,
//         ...parsed,
//       });

//       console.log("✅ Data saved to Firebase");
//     } catch (firebaseError) {
//       console.error("❌ Firebase Error:", firebaseError);
//       // Don't fail the request if Firebase fails, just log it
//     }

//     return new Response(JSON.stringify(parsed), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });

//   } catch (error) {
//     console.error("🔥 API Route Error:", error);
//     return new Response(
//       JSON.stringify({ 
//         error: "Internal server error", 
//         details: error.message 
//       }), 
//       { status: 500, headers: { "Content-Type": "application/json" } }
//     );
//   }
// }



// /src/app/api/analyze-mood/route.js
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const rtdb = getDatabase(app);

export async function POST(req) {
  try {
    const { text, userId = "guest", mood, mediaLanguage = "en" } = await req.json();

    if (!text || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Text is required" }), 
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get language name for the prompt
    const languageNames = {
      en: "English",
      es: "Spanish",
      fr: "French",
      de: "German",
      it: "Italian",
      pt: "Portuguese",
      ja: "Japanese",
      ko: "Korean",
      zh: "Chinese",
      hi: "Hindi",
      ru: "Russian",
      ar: "Arabic"
    };
    
    const languageName = languageNames[mediaLanguage] || "English";

//     const messages = [

//       {
//         role: "system",
//         content: `You are a compassionate mental health assistant.

// Based on the user's journal entry, analyze their emotional state and return a JSON response with personalized recommendations for:

// 1. An exercise/activity
// 2. A song (in ${languageName} language)
// 3. A movie/video content (in ${languageName} language)

// Each should have:
// - title (string)
// - description (string, max 50 words)
// - duration (string, e.g., "15 minutes", "3 hours")

// CRITICAL INSTRUCTIONS:
// - Return ONLY valid JSON, no markdown, no backticks, no extra text
// - Ensure all fields are present and properly formatted
// - Keep descriptions concise and supportive
// - Choose content that matches the user's emotional state
// - For song and movie recommendations, select content originally in ${languageName} language
// - If you can't find content in the requested language, suggest similar content in English but note this in the description

// Example format:
// {
//   "exercise": {
//     "title": "Morning Yoga Flow",
//     "description": "Gentle stretches to energize your body and calm your mind",
//     "duration": "15 minutes"
//   },
//   "song": {
//     "title": "Here Comes the Sun - The Beatles",
//     "description": "An uplifting classic to brighten your mood and inspire positivity",
//     "duration": "3 minutes"
//   },
//   "movie": {
//     "title": "The Secret Life of Walter Mitty",
//     "description": "An inspiring adventure about following your dreams and finding courage",
//     "duration": "114 minutes"
//   }
// }`,
//       },
//       {
//         role: "user",
//         content: text,
//       },
//     ];


const messages = [
  {
    role: "system",
    content: `You are a compassionate mental health assistant.

Based on the user's journal entry, analyze their emotional state and return a JSON response with personalized recommendations for:

1. An exercise/activity
2. A song (in ${languageName} language)
3. A movie/video content (in ${languageName} language)

Each should have:
- title (string)
- description (string, max 50 words)
- duration (string, e.g., "15 minutes", "3 minutes", "114 minutes") - THIS FIELD IS REQUIRED FOR ALL CATEGORIES

CRITICAL INSTRUCTIONS:
- Return ONLY valid JSON, no markdown, no backticks, no extra text
- Ensure ALL fields are present including duration for ALL categories
- For songs, estimate duration as "X minutes" (most songs are 3-5 minutes)
- For movies, estimate duration as "X minutes" or "X hours Y minutes"
- Keep descriptions concise and supportive
- Choose content that matches the user's emotional state
- For song and movie recommendations, select content originally in ${languageName} language
- If you can't find content in the requested language, suggest similar content in English but note this in the description

Example format:
{
  "exercise": {
    "title": "Morning Yoga Flow",
    "description": "Gentle stretches to energize your body and calm your mind",
    "duration": "15 minutes"
  },
  "song": {
    "title": "Here Comes the Sun - The Beatles",
    "description": "An uplifting classic to brighten your mood and inspire positivity",
    "duration": "3 minutes"
  },
  "movie": {
    "title": "The Secret Life of Walter Mitty",
    "description": "An inspiring adventure about following your dreams and finding courage",
    "duration": "114 minutes"
  }
}`,
  },
 {
     role: "user",
     content: text,
     },
];

    console.log("🤖 Sending request to OpenRouter...");
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "Mood Analyzer App",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku",
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ OpenRouter API Error:", response.status, errorText);
      throw new Error(`OpenRouter API failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ OpenRouter Response:", data);

    const content = data.choices?.[0]?.message?.content?.trim();

    if (!content) {
      console.error("❌ No content in OpenRouter response");
      return new Response(
        JSON.stringify({ error: "No response from AI" }), 
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    let parsed;
    try {
      // Clean the content to remove any potential markdown formatting
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      parsed = JSON.parse(cleanContent);
      
      // Validate the response structure
      if (!parsed.exercise || !parsed.song || !parsed.movie) {
        throw new Error("Missing required fields in AI response");
      }

      // Validate each recommendation has required fields
      const requiredFields = ['title', 'description', 'duration'];
      for (const category of ['exercise', 'song', 'movie']) {
        for (const field of requiredFields) {
          if (!parsed[category][field]) {
            throw new Error(`Missing ${field} in ${category}`);
          }
        }
      }

    } catch (parseError) {
      console.error("❌ JSON Parse Error:", parseError);
      console.error("❌ Raw content:", content);
      return new Response(
        JSON.stringify({ 
          error: "Invalid AI response format", 
          details: parseError.message,
          raw: content 
        }), 
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Save to Firebase Realtime Database
    try {
      const timestamp = new Date().toISOString();
      
      // Save mood data if provided
      if (mood) {
        const moodRef = ref(rtdb, `moods/${userId}`);
        await push(moodRef, {
          date: timestamp,
          mood: mood,
        });
      }

      // Save recommendations
      const recRef = ref(rtdb, `recommendations/${userId}`);
      await push(recRef, {
        timestamp: Date.now(),
        date: timestamp,
        journal: text,
        mood: mood || null,
        mediaLanguage: mediaLanguage,
        ...parsed,
      });

      console.log("✅ Data saved to Firebase");
    } catch (firebaseError) {
      console.error("❌ Firebase Error:", firebaseError);
      // Don't fail the request if Firebase fails, just log it
    }

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("🔥 API Route Error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        details: error.message 
      }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}