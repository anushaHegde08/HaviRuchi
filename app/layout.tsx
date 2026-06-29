import RootProvider from "@/providers/rootProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "HaviRuchi — Authentic Havyaka Recipes",
    template: "%s | HaviRuchi",
  },
  description:
    "Discover, save and share authentic Havyaka cuisine recipes. Traditional Karnataka recipes passed down through generations.",
  keywords: [
    "Havyaka recipes",
    "Karnataka cuisine",
    "Indian recipes",
    "traditional recipes",
  ],
  authors: [{ name: "HaviRuchi" }],
  creator: "HaviRuchi",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "HaviRuchi",
    title: "HaviRuchi — Authentic Havyaka Recipes",
    description: "Discover and share authentic Havyaka recipes",
  },
  twitter: {
    card: "summary_large_image",
    title: "HaviRuchi — Authentic Havyaka Recipes",
    description: "Discover and share authentic Havyaka recipes",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
