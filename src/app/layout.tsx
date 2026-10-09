import type { Metadata } from "next";
import "./globals.css";
import { ShopProvider } from "@/context/ShopContext";

export const metadata: Metadata = {
  title: "Minakshi Arts | Handcrafted Festive Luxe & Sacred Art",
  description:
    "Luxury Indian Diwali artisanal showcase featuring handcrafted architectural soy candles, textured clay wall murals, floating brass urlis, and sacred Ganesha sculptures.",
  keywords: [
    "Diwali luxury gifts",
    "Handcrafted soy candles",
    "Textured wall murals",
    "Sacred Ganesha idols",
    "Bespoke Diwali hampers",
    "Minakshi Arts",
    "Brass urlis",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="antialiased bg-obsidian text-sand-100 min-h-screen overflow-x-hidden w-full max-w-full">
        <ShopProvider>{children}</ShopProvider>
      </body>
    </html>
  );
}
