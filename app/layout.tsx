import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";

export const metadata: Metadata = {
  title: "দাওয়াই | Dawai - Medicine Delivery in Gazipur-Mymensingh",
  description: "Order medicines online with exact quantities. Fast delivery from Gazipur to Mymensingh corridor.",
  keywords: "medicine delivery, pharmacy, Bangladesh, Gazipur, Mymensingh, prescription",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
