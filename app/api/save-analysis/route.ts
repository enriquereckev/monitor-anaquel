import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const SaveSchema = z.object({
  storeName: z.string().nullable(),
  photoUrl: z.string().nullable(),
  products: z.array(z.object({
    name: z.string(),
    price_cents: z.number().int().nullable(),
    currency: z.string().nullable(),
    is_own_brand: z.boolean(),
  })),
  brand_exhibited: z.boolean(),
  confidence: z.enum(["alta", "media", "baja"]),
  reasoning: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const validated = SaveSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ errorCode: "api_failure" }, { status: 400 });
    }

    const { storeName, photoUrl, products, brand_exhibited, confidence, reasoning } = validated.data;

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
        raw_response: null,
      })
      .select("id")
      .single();

    if (dbError) {
      console.error("DB insert error:", dbError);
      return NextResponse.json({ errorCode: "api_failure" }, { status: 500 });
    }

    return NextResponse.json({ id: analysis.id });
  } catch (err) {
    console.error("Save analysis error:", err);
    return NextResponse.json({ errorCode: "network" }, { status: 500 });
  }
}
