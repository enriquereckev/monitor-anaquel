export default function Home() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--c-bg)",
        padding: "24px",
        gap: "32px",
      }}
    >
      <img src="/logo.svg" alt="monitor anaquel" style={{ width: 200, height: "auto" }} />
      <p
        style={{
          fontFamily: "var(--f-body)",
          fontSize: 15,
          color: "var(--c-text-muted)",
          textAlign: "center",
        }}
      >
        Configurando base de datos…
      </p>
    </main>
  );
}
