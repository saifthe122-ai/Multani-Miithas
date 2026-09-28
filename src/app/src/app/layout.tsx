
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Multani Mithas | Premium Pakistani Sweets",
  description:
    "Discover authentic Multani Sohan Halwa, traditional Pakistani sweets, bakery items and premium gift boxes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
