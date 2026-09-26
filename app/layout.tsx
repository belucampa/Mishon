import type { Metadata, Viewport } from "next";
import { Fraunces, Poppins, Space_Grotesk, Gochi_Hand } from "next/font/google";
import "./globals.css";
import { sitio } from "@/lib/sitio";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const body = Poppins({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const button = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-button",
  weight: ["400", "500", "600", "700"],
});

const wordmark = Gochi_Hand({
  subsets: ["latin"],
  variable: "--font-wordmark",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: sitio.general.tituloPestana,
  description: sitio.general.descripcion,
};

// "only light": los navegadores del celu no oscurecen la página por su cuenta.
// themeColor pinta la barra del navegador con el crema de la página.
export const viewport: Viewport = {
  colorScheme: "only light",
  themeColor: sitio.colores.crema,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es-AR"
      className={`${display.variable} ${body.variable} ${button.variable} ${wordmark.variable}`}
    >
      <body className="font-body">{children}</body>
    </html>
  );
}
