import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";

export async function POST(req) {
  try {
    const { identity, roomName } = await req.json();

    if (!identity || !roomName) {
      return NextResponse.json({ error: "Missing identity or roomName" }, { status: 400 });
    }

    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      { identity }
    );

    // grant permission to join the room
    at.addGrant({ roomJoin: true, room: roomName });

    const token = await at.toJwt();

    return NextResponse.json({ token });
  } catch (err) {
    console.error("Token generation failed:", err);
    return NextResponse.json({ error: "Failed to generate token" }, { status: 500 });
  }
}
