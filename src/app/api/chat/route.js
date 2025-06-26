import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req) {
  try {
    const { prompt, history = [] } = await req.json()

    // Validate input
    if (!prompt || typeof prompt !== 'string') {
      throw new Error('Invalid prompt provided')
    }

    // Ensure history is always an array
    const safeHistory = Array.isArray(history) ? history : []

    const messages = [
      {
        role: "system",
        content: "You are a supportive mental health assistant. Be kind, empathetic, and helpful."
      },
      ...safeHistory,
      { role: "user", content: prompt }
    ]

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
        "X-Title": "MindBloom Chat"
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku", // Recommended alternative
        // model: "openai/gpt-3.5-turbo", // Sometimes unavailable
        messages,
        temperature: 0.7,
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('OpenRouter API Error:', errorData)
      throw new Error(errorData.error?.message || "Failed to get response from AI")
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || "I couldn't generate a response."

    return NextResponse.json({ reply })

  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      { 
        error: error.message.includes('endpoints') 
          ? "The AI model is currently unavailable. Please try again later."
          : error.message || "Internal server error" 
      },
      { status: 500 }
    )
  }
}