import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "monitor anaquel",
  description: "Analiza anaqueles con AI — identifica productos, precios y exhibición de marca",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Plus+Jakarta+Sans:wght@700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
