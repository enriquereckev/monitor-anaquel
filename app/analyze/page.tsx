"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function AnalyzePage() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [storeName, setStoreName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function handleFile(file: File) {
    setPhoto(file);
    setError("");
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSubmit() {
    if (!photo) return;
    setLoading(true);
    setError("");

    try {
      // Resize client-side: max 800px, quality 0.75
      const base64 = await resizeImage(photo, 1200, 0.85);

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, storeName: storeName.trim() || null }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msgs: Record<string, string> = {
          blurry_image: "La foto no es clara. Intenta con más luz y desde más cerca.",
          api_failure: "Error al analizar. Intenta de nuevo.",
          timeout: "El análisis tardó demasiado. Intenta de nuevo.",
          network: "Error de conexión. Verifica tu internet.",
        };
        setError(msgs[data.errorCode] ?? "Error inesperado. Intenta de nuevo.");
        setLoading(false);
        return;
      }

      router.push(`/result/${data.id}`);
    } catch {
      setError("Error de conexión. Verifica tu internet.");
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 480, margin: "0 auto", minHeight: "100dvh", background: "var(--c-bg)" }}>
      <div style={{
        padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
        borderBottom: "1px solid var(--c-border)", background: "var(--c-surface)",
      }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--c-text-muted)" }}>
          ←
        </button>
        <span style={{ fontFamily: "var(--f-display)", fontWeight: 600, fontSize: 15 }}>
          Nuevo análisis
        </span>
      </div>

      <div style={{ padding: 16 }}>
        {/* Photo selector */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: "none" }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />

        {preview ? (
          <div style={{ marginBottom: 16 }}>
            <img
              src={preview}
              alt="Vista previa"
              style={{ width: "100%", borderRadius: "var(--r-lg)", maxHeight: 280, objectFit: "cover" }}
            />
            <button
              onClick={() => { setPhoto(null); setPreview(null); inputRef.current?.click(); }}
              style={{
                marginTop: 8, width: "100%", height: 40, background: "transparent",
                border: "1.5px solid var(--c-border-strong)", borderRadius: "var(--r-md)",
                fontFamily: "var(--f-body)", fontSize: 14, color: "var(--c-text-muted)", cursor: "pointer",
              }}
            >
              Cambiar foto
            </button>
          </div>
        ) : (
          <button
            onClick={() => inputRef.current?.click()}
            style={{
              width: "100%", height: 180, borderRadius: "var(--r-lg)",
              border: "2px dashed var(--c-border-strong)", background: "var(--c-surface)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: 8, cursor: "pointer", marginBottom: 16, color: "var(--c-text-muted)",
              fontFamily: "var(--f-body)", fontSize: 15,
            }}
          >
            <span style={{ fontSize: 36 }}>📷</span>
            Tomar foto del anaquel
          </button>
        )}

        {/* Store name */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: "var(--c-text)" }}>
            Nombre de tienda (opcional)
          </label>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="Ej. Walmart Insurgentes"
            style={{
              height: 48, padding: "0 12px", borderRadius: "var(--r-md)",
              border: "1.5px solid var(--c-border-strong)",
              background: "var(--c-surface)", color: "var(--c-text)",
              fontFamily: "var(--f-body)", fontSize: 15,
            }}
          />
        </div>

        {error && (
          <div style={{
            padding: "10px 14px", borderRadius: "var(--r-md)",
            background: "var(--c-error-bg)", color: "var(--c-error)", fontSize: 14, marginBottom: 16,
          }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{ fontFamily: "var(--f-display)", fontSize: 17, fontWeight: 700, marginBottom: 6 }}>
              Analizando anaquel…
            </div>
            <div style={{ fontSize: 13, color: "var(--c-text-muted)" }}>~10 segundos</div>
            <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
              {[85, 65, 80, 50].map((w, i) => (
                <div key={i} style={{
                  height: 16, width: `${w}%`, borderRadius: 4,
                  background: "linear-gradient(90deg, var(--c-border) 25%, var(--c-border-strong) 50%, var(--c-border) 75%)",
                  backgroundSize: "400% 100%",
                  animation: `shimmer 1.5s infinite ${i * 0.1}s`,
                }} />
              ))}
            </div>
          </div>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!photo}
            style={{
              width: "100%", height: 52,
              background: photo ? "var(--c-accent)" : "var(--c-border-strong)",
              color: photo ? "#fff" : "var(--c-text-muted)",
              border: "none", borderRadius: "var(--r-md)",
              fontFamily: "var(--f-body)", fontSize: 16, fontWeight: 600,
              cursor: photo ? "pointer" : "default",
            }}
          >
            Analizar
          </button>
        )}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
      `}</style>
    </main>
  );
}

async function resizeImage(file: File, maxPx: number, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      // Return only the base64 data (without the data:image/jpeg;base64, prefix)
      const dataUrl = canvas.toDataURL("image/jpeg", quality);
      resolve(dataUrl.split(",")[1]);
    };
    img.onerror = reject;
    img.src = url;
  });
}
