"use client";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Analysis = {
  id: string;
  store_name: string | null;
  brand_exhibited: boolean;
  confidence: string;
  created_at: string;
  products: unknown[];
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `Hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `Hace ${days} día${days > 1 ? "s" : ""}`;
}

export default function HomeClient({ user, analyses }: { user: User; analyses: Analysis[] }) {
  const latest = analyses[0];
  const initials = (user.email ?? "?")[0].toUpperCase();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <main style={{ maxWidth: 480, margin: "0 auto", minHeight: "100dvh", background: "var(--c-bg)" }}>
      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "16px 16px 0",
      }}>
        <img src="/logo.svg" alt="monitor anaquel" style={{ width: 120, height: "auto" }} />
        <button
          onClick={handleLogout}
          style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "var(--c-accent)", color: "#fff", border: "none",
            fontFamily: "var(--f-display)", fontSize: 14, fontWeight: 700, cursor: "pointer",
          }}
          title={user.email}
        >
          {initials}
        </button>
      </div>

      {/* Last analysis */}
      <div style={{ padding: "20px 16px 16px" }}>
        <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--c-text-muted)", fontWeight: 600, marginBottom: 8 }}>
          Último análisis
        </p>
        {latest ? (
          <Link href={`/result/${latest.id}`} style={{ textDecoration: "none" }}>
            <div style={{
              background: "var(--c-surface)", borderRadius: "var(--r-lg)",
              border: "1px solid var(--c-border)", padding: 16,
            }}>
              <div style={{ fontFamily: "var(--f-display)", fontWeight: 700, fontSize: 15, marginBottom: 4, color: "var(--c-text)" }}>
                {latest.store_name ?? "Sin nombre de tienda"}
              </div>
              <div style={{ fontSize: 12, color: "var(--c-text-muted)", marginBottom: 12 }}>
                {timeAgo(latest.created_at)} · {(latest.products as unknown[]).length} productos
              </div>
              <div style={{
                fontFamily: "var(--f-display)", fontSize: 22, fontWeight: 800,
                color: latest.brand_exhibited ? "var(--c-success)" : "var(--c-warning)",
              }}>
                {latest.brand_exhibited ? "EXHIBIDA" : "NO EXHIBIDA"}
              </div>
            </div>
          </Link>
        ) : (
          <div style={{
            background: "var(--c-surface)", borderRadius: "var(--r-lg)",
            border: "1px solid var(--c-border)", padding: 16,
            color: "var(--c-text-muted)", fontSize: 14,
          }}>
            Aún no tienes análisis. ¡Toma tu primera foto!
          </div>
        )}
      </div>

      {/* CTA */}
      <div style={{ padding: "0 16px 16px" }}>
        <Link href="/analyze">
          <button style={{
            width: "100%", height: 52, background: "var(--c-accent)", color: "#fff",
            border: "none", borderRadius: "var(--r-md)",
            fontFamily: "var(--f-body)", fontSize: 16, fontWeight: 600, cursor: "pointer",
          }}>
            Analizar anaquel
          </button>
        </Link>
      </div>

      {/* History */}
      {analyses.length > 1 && (
        <div style={{ padding: "0 16px 32px" }}>
          <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--c-text-muted)", fontWeight: 600, marginBottom: 8 }}>
            Historial
          </p>
          {analyses.slice(1).map((a) => (
            <Link key={a.id} href={`/result/${a.id}`} style={{ textDecoration: "none" }}>
              <div style={{
                padding: "12px 0", borderBottom: "1px solid var(--c-border)",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "var(--c-text)", marginBottom: 2 }}>
                    {a.store_name ?? "Sin nombre"}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--c-text-muted)" }}>
                    {timeAgo(a.created_at)} · {(a.products as unknown[]).length} productos
                  </div>
                </div>
                <div style={{
                  fontFamily: "var(--f-display)", fontSize: 12, fontWeight: 700,
                  color: a.brand_exhibited ? "var(--c-success)" : "var(--c-warning)",
                }}>
                  {a.brand_exhibited ? "EXHIBIDA" : "NO EXHIBIDA"}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
