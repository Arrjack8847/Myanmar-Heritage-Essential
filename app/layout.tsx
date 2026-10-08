import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./card-hero.css";

export const metadata: Metadata = {
  title: "Myanmar Heritage | Wedding Invitation · JackNex Studio",
  description: "A modern ceremonial wedding invitation inspired by Myanmar heritage, with elegant layers and a warm ivory and antique gold palette.",
  applicationName: "Myanmar Heritage Essential",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f6f0e5",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}