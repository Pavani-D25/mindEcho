
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const { entry } = await req.json();
    
//     console.log("Received entry:", entry ? "Yes" : "No"); // Debug log
    
//     if (!entry || !entry.trim()) {
//       return NextResponse.json({ error: "Missing or empty journal entry" }, { status: 400 });
//     }

//     const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    
//     if (!OPENROUTER_API_KEY) {
//       console.error("OPENROUTER_API_KEY not found in environment variables");
//       return NextResponse.json({ error: "API key not configured" }, { status: 500 });
//     }

//     console.log("Making request to OpenRouter API..."); // Debug log

//     const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${OPENROUTER_API_KEY}`,
//         "Content-Type": "application/json",
//         "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000", // Add referer
//         "X-Title": "Journal Analysis App", // Add title
//       },
//       body: JSON.stringify({
//         model: "anthropic/claude-3-sonnet-20240229",
//         messages: [
//           {
//             role: "system",
//             content: "You are a supportive AI assistant for mental health and wellness. Provide gentle, empathetic, and constructive responses to journal entries. Keep responses concise but meaningful, around 2-3 sentences. Focus on validation, insights, and gentle encouragement.",
//           },
//           {
//             role: "user",
//             content: `Please analyze this journal entry and provide supportive feedback:\n\n${entry.trim()}`,
//           },
//         ],
//         max_tokens: 200,
//         temperature: 0.7,
//       }),
//     });

//     console.log("OpenRouter API response status:", res.status); // Debug log

//     if (!res.ok) {
//       const errorText = await res.text();
//       console.error("OpenRouter API error:", res.status, errorText);
//       return NextResponse.json(
//         { error: `AI service error: ${res.status}` },
//         { status: 500 }
//       );
//     }

//     const json = await res.json();
//     console.log("OpenRouter API response:", json); // Debug log

//     if (json.error) {
//       console.error("OpenRouter API returned error:", json.error);
//       return NextResponse.json(
//         { error: `AI service error: ${json.error.message || json.error}` },
//         { status: 500 }
//       );
//     }

//     const recommendation = json?.choices?.[0]?.message?.content;
    
//     if (!recommendation) {
//       console.error("No content in AI response:", json);
//       return NextResponse.json(
//         { error: "AI service returned empty response" },
//         { status: 500 }
//       );
//     }

//     console.log("Sending recommendation:", recommendation); // Debug log
    
//     return NextResponse.json({ recommendation: recommendation.trim() });
    
//   } catch (err) {
//     console.error("API Error:", err);
//     return NextResponse.json(
//       { error: `Server error: ${err.message}` },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { entry } = await req.json();
    
    console.log("Received entry:", entry ? "Yes" : "No");
    
    if (!entry || !entry.trim()) {
      return NextResponse.json({ error: "Missing or empty journal entry" }, { status: 400 });
    }

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    
    if (!OPENROUTER_API_KEY) {
      console.error("OPENROUTER_API_KEY not found in environment variables");
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    console.log("Making request to OpenRouter API...");

    // Updated API endpoint and model
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "Journal Analysis App",
      },
      body: JSON.stringify({
        // Use correct OpenRouter model name
        model: "anthropic/claude-3.5-sonnet", // Try this first
        messages: [
          {
            role: "system",
            content: "You are a supportive AI assistant for mental health and wellness. Provide gentle, empathetic, and constructive responses to journal entries. Keep responses concise but meaningful, around 2-3 sentences. Focus on validation, insights, and gentle encouragement.",
          },
          {
            role: "user",
            content: `Please analyze this journal entry and provide supportive feedback:\n\n${entry.trim()}`,
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    console.log("OpenRouter API response status:", res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("OpenRouter API error:", res.status, errorText);
      
      // More specific error handling
      if (res.status === 401) {
        return NextResponse.json(
          { error: "Invalid API key" },
          { status: 500 }
        );
      } else if (res.status === 404) {
        return NextResponse.json(
          { error: "Model not found - please check model name" },
          { status: 500 }
        );
      } else if (res.status === 429) {
        return NextResponse.json(
          { error: "Rate limit exceeded - please try again later" },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: `AI service error: ${res.status} - ${errorText}` },
        { status: 500 }
      );
    }

    const json = await res.json();
    console.log("OpenRouter API response:", json);

    if (json.error) {
      console.error("OpenRouter API returned error:", json.error);
      return NextResponse.json(
        { error: `AI service error: ${json.error.message || json.error}` },
        { status: 500 }
      );
    }

    const recommendation = json?.choices?.[0]?.message?.content;
    
    if (!recommendation) {
      console.error("No content in AI response:", json);
      return NextResponse.json(
        { error: "AI service returned empty response" },
        { status: 500 }
      );
    }

    console.log("Sending recommendation:", recommendation);
    
    return NextResponse.json({ recommendation: recommendation.trim() });
    
  } catch (err) {
    console.error("API Error:", err);
    
    // Handle network errors
    if (err.code === 'ENOTFOUND' || err.message.includes('fetch')) {
      return NextResponse.json(
        { error: "Network error - unable to reach AI service" },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: `Server error: ${err.message}` },
      { status: 500 }
    );
  }
}