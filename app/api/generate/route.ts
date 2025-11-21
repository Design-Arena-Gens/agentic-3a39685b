import OpenAI from "openai";
import { NextRequest } from "next/server";

type Payload = {
  prompt: string;
  aspect?: "3:4" | "4:3" | "1:1";
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type OpenAISize =
  | "256x256"
  | "512x512"
  | "1024x1024"
  | "1792x1024"
  | "1024x1792";

function aspectToOpenAISize(aspect: string | undefined): {
  size: OpenAISize;
  width: number;
  height: number;
} {
  switch (aspect) {
    case "3:4":
      return { size: "1024x1792", width: 1024, height: 1792 };
    case "4:3":
      return { size: "1792x1024", width: 1792, height: 1024 };
    case "1:1":
      return { size: "1024x1024", width: 1024, height: 1024 };
    default:
      return { size: "1024x1792", width: 1024, height: 1792 };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Payload;
    const prompt = (body?.prompt || "").toString().slice(0, 2000);
    const { size, width } = aspectToOpenAISize(body.aspect);

    if (!prompt) {
      return new Response("Missing prompt", { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // Graceful fallback: return a themed placeholder image
      const placeholder = `https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=${Math.min(
        width,
        1200
      )}&auto=format&fit=crop`;
      return Response.json({ imageUrl: placeholder });
    }

    const openai = new OpenAI({ apiKey });
    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size,
      quality: "hd"
    });
    const b64 = result.data?.[0]?.b64_json;
    if (!b64) {
      throw new Error("No image from OpenAI");
    }
    // Return a data URL so it displays immediately
    const imageUrl = `data:image/png;base64,${b64}`;
    return Response.json({ imageUrl });
  } catch (err: any) {
    return new Response(String(err?.message || err), { status: 500 });
  }
}

