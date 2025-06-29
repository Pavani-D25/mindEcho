// import { NextResponse } from "next/server";
// import { AccessToken } from "livekit-server-sdk";

// const apiKey = process.env.LIVEKIT_API_KEY;
// const apiSecret = process.env.LIVEKIT_API_SECRET;

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const { identity, roomName } = body;

//     if (!identity || !roomName) {
//       return NextResponse.json({ error: "Missing identity or roomName" }, { status: 400 });
//     }

//     const token = new AccessToken(apiKey, apiSecret, { identity });
//     token.addGrant({ roomJoin: true, room: roomName });

//     const jwt = await token.toJwt();
//     return NextResponse.json({ token: jwt });

//   } catch (error) {
//     console.error("Token API error:", error.message);
//     return NextResponse.json({ error: "Invalid request" }, { status: 500 });
//   }
// }



import { NextResponse } from "next/server";
import { AccessToken, RoomGrant } from "livekit-server-sdk";

const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;

export async function POST(req) {
  try {
    const { identity, roomName, language } = await req.json();

    if (!identity || !roomName) {
      return NextResponse.json(
        { error: "Missing identity or roomName" },
        { status: 400 }
      );
    }

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "LiveKit API key/secret not configured" },
        { status: 500 }
      );
    }

    const token = new AccessToken(apiKey, apiSecret, { identity });
    const grant = new RoomGrant({ room: roomName, roomJoin: true });
    token.addGrant(grant);

    const jwt = token.toJwt();

    // Return token AND the language requested
    return NextResponse.json({ token: jwt, language: language || "en" });
  } catch (error) {
    console.error("Token API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
