import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Sparkles } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Options Academy",
  description: "Learn options trading with paper money",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f5f5f7]">
        <header className="apple-blur border-b border-black/5 px-8 py-3 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-6">
              <Link href="/" className="text-[22px] font-semibold tracking-tight text-[#1d1d1f]">OptionsAcademy</Link>
              <span className="bg-black/5 text-black/60 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border border-black/5">
                Paper Trading
              </span>
            </div>
            <nav className="flex gap-10 text-[14px] font-medium text-[#1d1d1f]/60">
              <Link href="/bot" className="hover:text-[#007aff] transition-colors duration-200 font-bold flex items-center gap-1">
                <Sparkles size={14} className="text-[#007aff]" /> Smart Advisor
              </Link>
              <Link href="/tutorials" className="hover:text-[#007aff] transition-colors duration-200">Tutorials</Link>
              <Link href="/market" className="hover:text-[#007aff] transition-colors duration-200">Market Explorer</Link>
              <Link href="/portfolio" className="hover:text-[#007aff] transition-colors duration-200">Portfolio</Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
