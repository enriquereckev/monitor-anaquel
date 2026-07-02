"use client";
import { useRouter } from "next/navigation";

type Product = {
  name: string;
  price_cents: number | null;
  currency: string | null;
  is_own_brand: boolean;
};

type Analysis = {
  id: string;
  store_name: string | null;
  brand_exhibited: boolean;
  confidence: string;
  reasoning: string | null;
  products: Product[];
  created_at: string;
};

function formatPrice(cents: number | null, currency: string | null) {
  if (cents === null) return "—";
  const amount = (cents / 100).toFixed(2);
  return `≈ $${amount} ${currency ?? ""}`.trim();
}

export default function ResultClient({ analysis }: { analysis: Analysis }) {
  const router = useRouter();

  function handleShare() {
    const products = analysis.products.filter((p) => p.is_own_brand);
    const text = [
      `📊 Análisis de anaquel — ${analysis.store_name ?? "tienda"}`,
      analysis.brand_exhibited ? "✅ Marca EXHIBIDA" : "⚠️ Marca NO EXHIBIDA",
      `Confianza: ${analysis.confidence}`,
      products.length > 0 ? `Productos propios detectados: ${products.map((p) => p.name).join(", ")}` : "",
    ].filter(Boolean).join("\n");

    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      alert("Copiado al portapapeles");
    }
  }

  return (
    <main style={{ maxWidth: 480, margin: "0 auto", minHeight: "100dvh", background: "var(--c-bg)", display: "flex", flexDirection: "column" }}>
      {/* Back bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
        borderBottom: "1px solid var(--c-border)", background: "var(--c-surface)",
      }}>
        <button onClick={() => router.push("/")} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--c-text-muted)" }}>
          ←
        </button>
        <span style={{ fontFamily: "var(--f-display)", fontWeight: 600, fontSize: 14, color: "var(--c-text)" }}>
          {analysis.store_name ?? "Sin nombre de tienda"}
        </span>
      </div>

      {/* Indicator */}
      <div style={{ padding: "28px 16px 20px", textAlign: "center" }}>
        <div style={{
          fontFamily: "var(--f-display)", fontSize: 36, fontWeight: 800, letterSpacing: "-0.5px",
          color: analysis.brand_exhibited ? "var(--c-success)" : "var(--c-warning)",
          marginBottom: 10,
        }}>
          {analysis.brand_exhibited ? "EXHIBIDA" : "NO EXHIBIDA"}
        </div>
        <span style={{
          display: "inline-block", padding: "3px 12px", borderRadius: 9999,
          background: "var(--c-accent-subtle)", color: "var(--c-accent)",
          fontSize: 12, fontWeight: 500,
        }}>
          Confianza: {analysis.confidence.charAt(0).toUpperCase() + analysis.confidence.slice(1)}
        </span>
        {analysis.reasoning && (
          <p style={{ fontSize: 13, color: "var(--c-text-muted)", marginTop: 12, lineHeight: 1.5 }}>
            {analysis.reasoning}
          </p>
        )}
      </div>

      {/* Products */}
      <div style={{ padding: "0 16px", flex: 1 }}>
        <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--c-text-muted)", fontWeight: 600, marginBottom: 8 }}>
          Productos detectados
        </p>
        {analysis.products.map((p, i) => (
          <div key={i} style={{
            padding: "12px 0", borderBottom: "1px solid var(--c-border)",
            display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, color: "var(--c-text)" }}>{p.name}</div>
              <span style={{
                display: "inline-block", padding: "2px 8px", borderRadius: 9999, fontSize: 11, fontWeight: 500,
                background: p.is_own_brand ? "var(--c-accent-subtle)" : "var(--c-surface)",
                color: p.is_own_brand ? "var(--c-accent)" : "var(--c-text-muted)",
                border: p.is_own_brand ? "none" : "1px solid var(--c-border)",
              }}>
                {p.is_own_brand ? "Tu marca" : "Competencia"}
              </span>
            </div>
            <div style={{ fontSize: 13, color: "var(--c-text-muted)", fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>
              {formatPrice(p.price_cents, p.currency)}
            </div>
          </div>
        ))}
      </div>

      {/* Action bar */}
      <div style={{
        padding: "12px 16px", background: "var(--c-surface)",
        borderTop: "1px solid var(--c-border)", display: "flex", gap: 10,
      }}>
        <button
          onClick={handleShare}
          style={{
            flex: 1, height: 48, background: "var(--c-accent)", color: "#fff",
            border: "none", borderRadius: "var(--r-md)",
            fontFamily: "var(--f-body)", fontSize: 15, fontWeight: 600, cursor: "pointer",
          }}
        >
          Compartir
        </button>
        <button
          onClick={() => router.push("/analyze")}
          style={{
            height: 48, padding: "0 20px", background: "var(--c-surface)",
            color: "var(--c-text)", border: "1.5px solid var(--c-border-strong)",
            borderRadius: "var(--r-md)", fontFamily: "var(--f-body)", fontSize: 15, fontWeight: 500, cursor: "pointer",
          }}
        >
          Nueva foto
        </button>
      </div>
    </main>
  );
}
