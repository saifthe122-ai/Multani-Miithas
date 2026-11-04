
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://multani-mithas.vercel.app"),
  title: {
    default: "Multani Mithas | Authentic Multani Sweets & Sohan Halwa",
    template: "%s | Multani Mithas",
  },
  description:
    "Order authentic Multani Sohan Halwa, premium Pakistani mithai, traditional sweets, bakery items and beautifully packed gift boxes from Multani Mithas.",
  keywords: [
    "Multani Mithas",
    "Multani Sohan Halwa",
    "Multani sweets",
    "Pakistani mithai",
    "Buy Sohan Halwa online",
    "Pakistani sweets online",
    "Multan sweets delivery",
    "Mithai gift boxes",
  ],
  openGraph: {
    title: "Multani Mithas | Multan ki mithas, dil se",
    description:
      "Discover authentic Multani Sohan Halwa, traditional mithai and premium sweet gift boxes.",
    url: "https://multani-mithas.vercel.app",
    siteName: "Multani Mithas",
    locale: "en_PK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Multani Mithas | Authentic Multani Sweets",
    description:
      "Order authentic Multani Sohan Halwa and premium Pakistani sweets online.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <html lang="en-PK">
      <body>{children}</body>
    </html>
  );
}
