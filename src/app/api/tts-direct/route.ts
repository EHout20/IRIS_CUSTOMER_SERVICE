import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;
    
    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const voiceId = "OYTbf65OHHFELVut7v2H";
    const apiKey = "sk_c0a42e9ae2e343c48ad83406736f9d7582c2610949168865";
    
    if (!apiKey) {
      return NextResponse.json({ error: "ElevenLabs API key not configured" }, { status: 500 });
    }

    console.log("[tts] calling ElevenLabs directly", { voiceId, hasApiKey: !!apiKey });
    
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      { text },
      {
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      }
    );

    const arrayBuffer = response.data;
    const uint8 = new Uint8Array(arrayBuffer);

    return new NextResponse(uint8, {
      status: 200,
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch (err) {
    console.error("TTS error", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "TTS failed", message }, { status: 500 });
  }
}
