"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminClient({
  totalAnalyses,
  totalProducts,
  exhibited,
}: {
  totalAnalyses: number;
  totalProducts: number;
  exhibited: number;
}) {
  const router = useRouter();
  const [downloading, setDownloading] = useState(false);

  async function handleExport() {
    setDownloading(true);
    try {
      const res = await fetch("/api/export");
      if (!res.ok) { setDownloading(false); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `monitor-anaquel-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <main style={{ maxWidth: 480, margin: "0 auto", minHeight: "100dvh", background: "var(--c-bg)" }}>
      <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--c-border)", background: "var(--c-surface)" }}>
        <button onClick={() => router.push("/")} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--c-text-muted)" }}>←</button>
        <span style={{ fontFamily: "var(--f-display)", fontWeight: 600, fontSize: 15 }}>Administrador</span>
      </div>

      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            { label: "Análisis", value: totalAnalyses },
            { label: "Productos", value: totalProducts },
            { label: "Exhibidos", value: exhibited },
          ].map((s) => (
            <div key={s.label} style={{ background: "var(--c-surface)", borderRadius: "var(--r-md)", padding: "14px 12px", textAlign: "center", border: "1px solid var(--c-border)" }}>
              <div style={{ fontFamily: "var(--f-display)", fontSize: 28, fontWeight: 700, color: "var(--c-accent)" }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "var(--c-text-muted)", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Export */}
        <div style={{ background: "var(--c-surface)", borderRadius: "var(--r-md)", padding: 16, border: "1px solid var(--c-border)" }}>
          <div style={{ fontFamily: "var(--f-display)", fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Exportar datos</div>
          <p style={{ fontSize: 13, color: "var(--c-text-muted)", marginBottom: 14, lineHeight: 1.5 }}>
            Descarga todos los análisis como CSV. Ábrelo en Excel para filtrar por tienda, producto, precio o fecha.
          </p>
          <button
            onClick={handleExport}
            disabled={downloading}
            style={{
              width: "100%", height: 48,
              background: downloading ? "var(--c-border-strong)" : "var(--c-accent)",
              color: downloading ? "var(--c-text-muted)" : "#fff",
              border: "none", borderRadius: "var(--r-md)",
              fontFamily: "var(--f-body)", fontSize: 15, fontWeight: 600, cursor: downloading ? "default" : "pointer",
            }}
          >
            {downloading ? "Descargando…" : "⬇ Descargar CSV"}
          </button>
        </div>
      </div>
    </main>
  );
}
