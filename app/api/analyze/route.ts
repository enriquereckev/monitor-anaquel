import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const MAGIC_BYTES: Record<string, number[]> = {
  jpeg: [0xff, 0xd8, 0xff],
  png:  [0x89, 0x50, 0x4e, 0x47],
  webp: [0x52, 0x49, 0x46, 0x46],
};

function validateImageBytes(base64: string): boolean {
  const bin = atob(base64.slice(0, 12));
  const bytes = Array.from(bin).map((c) => c.charCodeAt(0));
  return Object.values(MAGIC_BYTES).some((sig) =>
    sig.every((b, i) => bytes[i] === b)
  );
}

const ProductSchema = z.object({
  name: z.string(),
  price_cents: z.number().int().nullable(),
  currency: z.string().nullable(),
  is_own_brand: z.boolean(),
});

const VisionOutputSchema = z.object({
  products: z.array(ProductSchema),
  brand_exhibited: z.boolean(),
  confidence: z.enum(["alta", "media", "baja"]),
  reasoning: z.string(),
});

const VISION_PROMPT = `Analiza esta foto de un anaquel de tienda. La marca propia que debes identificar es **Flor de la Paz** — una marca de tés e infusiones. Cualquier producto que diga "Flor de la Paz" en su empaque es marca propia (is_own_brand: true). Todo lo demás es competencia (is_own_brand: false).

Responde SOLO con JSON válido puro, sin bloques de código markdown, sin comillas de código, sin texto adicional antes o después:
{
  "products": [
    {
      "name": "nombre exacto del producto visible",
      "price_cents": <precio en centavos como entero, o null si no se ve>,
      "currency": "<moneda, ej 'MXN', o null>",
      "is_own_brand": <true si es té/infusión de la marca propia, false si es competencia>
    }
  ],
  "brand_exhibited": <true si hay al menos un producto de la marca propia visible en exhibición en el anaquel>,
  "confidence": "<'alta' si la foto es clara y los productos son legibles, 'media' si hay algo borroso, 'baja' si la foto es muy difícil de leer>",
  "reasoning": "<una frase breve explicando tu conclusión sobre la exhibición>"
}

Si la imagen no es un anaquel o está demasiado borrosa para analizar, responde:
{"error": "blurry_image"}`;

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { image, storeName } = body as { image: string; storeName: string | null };

    if (!image || typeof image !== "string") {
      return NextResponse.json({ errorCode: "api_failure" }, { status: 400 });
    }

    if (!validateImageBytes(image)) {
      return NextResponse.json({ errorCode: "api_failure" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ errorCode: "api_failure", message: "Missing ANTHROPIC_API_KEY" }, { status: 500 });
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const [visionResult, storageResult] = await Promise.allSettled([
      client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 4096,
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: "image/jpeg", data: image } },
            { type: "text", text: VISION_PROMPT },
          ],
        }],
      }),
      supabase.storage.from("shelf-photos").upload(
        `${user.id}/${Date.now()}.jpg`,
        Buffer.from(image, "base64"),
        { contentType: "image/jpeg", upsert: false }
      ),
    ]);

    if (visionResult.status === "rejected") {
      const errMsg = visionResult.reason?.message ?? String(visionResult.reason);
      console.error("Claude Vision error:", errMsg);
      return NextResponse.json({ errorCode: "api_failure" }, { status: 502 });
    }

    const rawText = visionResult.value.content[0].type === "text"
      ? visionResult.value.content[0].text.trim()
      : "";

    // Strip markdown code fences (```json ... ``` or ``` ... ```)
    const cleanText = rawText.replace(/^```[a-z]*\s*/i, "").replace(/\s*```\s*$/i, "").trim();

    let parsed: unknown;
    try {
      parsed = JSON.parse(cleanText);
    } catch {
      console.error("JSON parse failed. Raw text:", rawText.slice(0, 500));
      return NextResponse.json({ errorCode: "api_failure" }, { status: 502 });
    }

    if ((parsed as { error?: string }).error === "blurry_image") {
      return NextResponse.json({ errorCode: "blurry_image" }, { status: 422 });
    }

    const validated = VisionOutputSchema.safeParse(parsed);
    if (!validated.success) {
      console.error("Schema validation failed:", validated.error);
      return NextResponse.json({ errorCode: "api_failure" }, { status: 502 });
    }

    const { products, brand_exhibited, confidence, reasoning } = validated.data;

    const photoUrl = storageResult.status === "fulfilled" && !storageResult.value.error
      ? storageResult.value.data?.path ?? null
      : null;

    const { data: analysis, error: dbError } = await supabase
      .from("analyses")
      .insert({
        user_id: user.id,
        store_name: storeName,
        photo_url: photoUrl,
        products,
        brand_exhibited,
        confidence,
        reasoning,
        raw_response: parsed,
      })
      .select("id")
      .single();

    if (dbError) {
      console.error("DB insert error:", dbError);
      return NextResponse.json({ errorCode: "api_failure" }, { status: 500 });
    }

    return NextResponse.json({ id: analysis.id });
  } catch (err) {
    console.error("Analyze route error:", err);
    return NextResponse.json({ errorCode: "network" }, { status: 500 });
  }
}
