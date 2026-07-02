"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    sessionStorage.setItem("otp_email", email);
    window.location.href = "/login/verify";
  }

  return (
    <main style={{
      minHeight: "100dvh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "var(--c-bg)", padding: "24px",
    }}>
      <div style={{ width: "100%", maxWidth: 360 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <img src="/logo.svg" alt="monitor anaquel" style={{ width: 180, height: "auto", marginBottom: 12 }} />
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: "var(--c-text)" }}>
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              required
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
              background: "var(--c-error-bg)", color: "var(--c-error)", fontSize: 14,
            }}>
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              height: 52, background: loading ? "var(--c-border-strong)" : "var(--c-accent)",
              color: "#fff", border: "none", borderRadius: "var(--r-md)",
              fontFamily: "var(--f-body)", fontSize: 16, fontWeight: 600, cursor: "pointer",
            }}
          >
            {loading ? "Enviando código…" : "Continuar"}
          </button>
          <p style={{ fontSize: 12, color: "var(--c-text-muted)", textAlign: "center", lineHeight: 1.5 }}>
            Te enviamos un código de 6 dígitos a tu correo.<br />
            No necesitas contraseña.
          </p>
        </form>
      </div>
    </main>
  );
}
