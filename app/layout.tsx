import type { Metadata } from "next";
import { Fraunces, Poppins, Space_Grotesk, Gochi_Hand } from "next/font/google";
import "./globals.css";

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
  title: "Molida — café de especialidad, ya llega",
  description:
    "Café de especialidad argentino, en grano y molido, pensado para tomar en casa.",
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
