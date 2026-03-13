import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import CursorTrail from "@/components/CursorTrail";
import ClickRipple from "@/components/ClickRipple";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vybe Lang",
  description: "A modern, expressive scripting language designed for clarity, creativity, and elite developer workflows.",
  icons: {
    icon: [
      {
        url: "/logo.png",
        href: "/logo.png",
      },
    ],
  },
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
