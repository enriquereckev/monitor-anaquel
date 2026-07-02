"use client";
import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const CODE_LENGTH = 6;

export default function VerifyPage() {
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("otp_email");
    if (!stored) { window.location.href = "/login"; return; }
    setEmail(stored);
    refs.current[0]?.focus();
  }, []);

  function handleChange(i: number, val: string) {
    const cleaned = val.replace(/\D/g, "").slice(0, 1);
    const next = [...digits];
    next[i] = cleaned;
    setDigits(next);
    if (cleaned && i < CODE_LENGTH - 1) refs.current[i + 1]?.focus();
    if (next.every((d) => d !== "")) verifyCode(next.join(""));
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (text.length === CODE_LENGTH) {
      const next = text.split("");
      setDigits(next);
      refs.current[CODE_LENGTH - 1]?.focus();
      verifyCode(text);
    }
  }

  async function verifyCode(token: string) {
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({ email, token, type: "email" });
    if (error) {
      setError("Código incorrecto o expirado. Revisa tu correo o vuelve a intentar.");
      setDigits(Array(CODE_LENGTH).fill(""));
      setLoading(false);
      refs.current[0]?.focus();
      return;
    }
    sessionStorage.removeItem("otp_email");
    window.location.href = "/";
  }

  return (
    <main style={{
      minHeight: "100dvh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "var(--c-bg)", padding: "24px",
    }}>
      <div style={{ width: "100%", maxWidth: 360 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <img src="/logo.svg" alt="monitor anaquel" style={{ width: 160, height: "auto", marginBottom: 16 }} />
          <p style={{ fontFamily: "var(--f-display)", fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
            Revisa tu correo
          </p>
          <p style={{ fontSize: 14, color: "var(--c-text-muted)", lineHeight: 1.5 }}>
            Enviamos un código de 6 dígitos a<br />
            <strong style={{ color: "var(--c-text)" }}>{email}</strong>
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 20 }}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => { refs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              disabled={loading}
              style={{
                width: 48, height: 56, textAlign: "center",
                fontSize: 22, fontWeight: 700,
                border: `2px solid ${d ? "var(--c-accent)" : "var(--c-border-strong)"}`,
                borderRadius: "var(--r-md)",
                background: "var(--c-surface)", color: "var(--c-text)",
                fontFamily: "var(--f-body)",
              }}
            />
          ))}
        </div>

        {loading && (
          <p style={{ textAlign: "center", color: "var(--c-text-muted)", fontSize: 14 }}>
            Verificando…
          </p>
        )}
        {error && (
          <div style={{
            padding: "10px 14px", borderRadius: "var(--r-md)",
            background: "var(--c-error-bg)", color: "var(--c-error)", fontSize: 14, marginBottom: 16,
          }}>
            {error}
          </div>
        )}

        <button
          onClick={() => { window.location.href = "/login"; }}
          style={{
            width: "100%", height: 44, background: "transparent",
            border: "none", color: "var(--c-text-muted)", fontSize: 14,
            fontFamily: "var(--f-body)", cursor: "pointer",
          }}
        >
          ← Usar otro correo
        </button>

        <p style={{ fontSize: 11, color: "var(--c-text-muted)", textAlign: "center", marginTop: 16, lineHeight: 1.6 }}>
          ⚠️ El código expira en 10 minutos.<br />
          Si no llega en 2 min, revisa tu carpeta de spam.<br />
          Límite: ~2 correos por hora en esta etapa.
        </p>
      </div>
    </main>
  );
}
