import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600", "700"] });

export const metadata: Metadata = {
  title: "Constellate",
  description: "Find your orientation. Matches you with mentors who sharpen your direction.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable}`}>
      <body className="min-h-screen bg-[#0B0F14] font-sans text-[#F4F4F2] antialiased">
        <SessionProvider>
          <div className="flex min-h-screen flex-col">
            {children}
            <Footer />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
