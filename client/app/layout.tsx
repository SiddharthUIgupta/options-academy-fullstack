import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

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
      <body className="min-h-full flex flex-col bg-slate-50">
        <header className="bg-white border-b px-8 py-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">OptionsAcademy</Link>
            <nav className="flex gap-8 font-medium text-gray-600">
              <Link href="/tutorials" className="hover:text-blue-600 transition">Tutorials</Link>
              <Link href="/market" className="hover:text-blue-600 transition">Market Explorer</Link>
              <Link href="/portfolio" className="hover:text-blue-600 transition">Portfolio</Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
