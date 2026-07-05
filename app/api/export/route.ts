import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ADMIN_EMAIL = "enriquereckev@gmail.com";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.email !== ADMIN_EMAIL) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { data: analyses, error } = await supabase
      .from("analyses")
      .select("id, created_at, store_name, brand_exhibited, confidence, reasoning, products")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: "DB error" }, { status: 500 });

    const rows: string[] = [
      ["Fecha", "Tienda", "Marca exhibida", "Confianza", "Conclusión", "Producto", "Es marca propia", "Precio", "Moneda"].join(",")
    ];

    for (const a of analyses ?? []) {
      const date = new Date(a.created_at).toLocaleString("es-MX", { timeZone: "America/Mexico_City" });
      const exhibited = a.brand_exhibited ? "Sí" : "No";
      const products = Array.isArray(a.products) ? a.products : [];

      if (products.length === 0) {
        rows.push([
          csv(date), csv(a.store_name ?? ""), exhibited, csv(a.confidence), csv(a.reasoning ?? ""),
          "", "", "", ""
        ].join(","));
      } else {
        for (const p of products) {
          const price = p.price_cents !== null ? (p.price_cents / 100).toFixed(2) : "";
          rows.push([
            csv(date), csv(a.store_name ?? ""), exhibited, csv(a.confidence), csv(a.reasoning ?? ""),
            csv(p.name ?? ""), p.is_own_brand ? "Sí" : "No", price, csv(p.currency ?? "MXN")
          ].join(","));
        }
      }
    }

    const csvContent = "﻿" + rows.join("\n"); // BOM for Excel to detect UTF-8
    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="monitor-anaquel-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (err) {
    console.error("Export error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

function csv(val: string): string {
  if (val.includes(",") || val.includes('"') || val.includes("\n")) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}
