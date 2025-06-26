// /src/app/api/analyze-mood/route.js
// Save recommendations to Firebase RTDB after AI generation

import { initializeApp } from "firebase/app";
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

const app = initializeApp(firebaseConfig);
const rtdb = getDatabase(app);

export async function POST(req) {
  const { text, userId = "guest" } = await req.json();

  const messages = [
    {
      role: "system",
      content: `You are a compassionate mental health assistant.

Based on the user's journal entry, analyze their emotional state and return a JSON response with personalized recommendations for:

1. An exercise
2. A song
3. A movie

Each should have:
- title
- description
- duration

IMPORTANT:
- Return ONLY valid JSON.
- DO NOT include any extra text or markdown (like \`\`\`json).
- Format exactly like:
{
  "exercise": {
    "title": "...",
    "description": "...",
    "duration": "..."
  },
  "song": {
    "title": "...",
    "description": "...",
    "duration": "..."
  },
  "movie": {
    "title": "...",
    "description": "...",
    "duration": "..."
  }
}`,
    },
    {
      role: "user",
      content: text,
    },
  ];

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku",
        messages,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();

    if (!content) {
      return new Response(JSON.stringify({ error: "No response from AI" }), { status: 500 });
    }

    try {
      const parsed = JSON.parse(content);

      // 🔥 Save to Firebase Realtime DB
      const recRef = ref(rtdb, `recommendations/${userId}`);
      await push(recRef, {
        timestamp: Date.now(),
        journal: text,
        ...parsed,
      });

      return new Response(JSON.stringify(parsed), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("❌ JSON Parse Error:", content);
      return new Response(JSON.stringify({ error: "Invalid AI JSON.", raw: content }), { status: 500 });
    }
  } catch (error) {
    console.error("🔥 Chat API Error:", error);
    return new Response(JSON.stringify({ error: "AI fetch failed." }), { status: 500 });
  }
}
