import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/config";
import JsonLd from "@/components/JsonLd";
import LiveChat from "@/components/LiveChat";
import CookieBanner from "@/components/CookieBanner";
import VisitorTracker from "@/components/VisitorTracker";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: [
    "belediye ilaçlama", "vektör mücadele", "haşere kontrol", "böcek ilaçlama", 
    "fare ilaçlama", "halk sağlığı", "bursa ilaçlama", "istanbul ilaçlama",
    "izmir ilaçlama", "apartman ilaçlama", "fabrika ilaçlama", "dezenfeksiyon"
  ],
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: '/',
  },
  manifest: "/manifest.json",
  themeColor: "#FDE047",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: siteConfig.name,
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="scroll-smooth">
      <body className={inter.className}>
        <JsonLd />
        {children}
        <LiveChat />
        <CookieBanner />
        <VisitorTracker />
      </body>
    </html>
  );
}
