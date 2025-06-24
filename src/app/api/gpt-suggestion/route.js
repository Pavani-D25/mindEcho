import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ message: "Prompt is required" }, { status: 400 });
    }

    const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful and empathetic mental health coach." },
          { role: "user", content: prompt },
        ],
        max_tokens: 60,
        temperature: 0.7,
      }),
    });

    const data = await apiRes.json();

    const suggestion = data?.choices?.[0]?.message?.content?.trim() || "Take a deep breath and smile 😊";

    return NextResponse.json({ response: suggestion });
  } catch (error) {
    console.error("GPT API Error:", error.message);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
