import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import CursorTrail from "@/components/CursorTrail";
import ClickRipple from "@/components/ClickRipple";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vybe | The Programming Language That Feels Alive",
  description: "A modern expressive language inspired by culture, creativity, and developer flow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <CursorTrail />
        <ClickRipple />
        <SmoothScroll>
          <Navbar />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
