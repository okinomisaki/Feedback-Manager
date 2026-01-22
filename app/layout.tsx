import React from "react";
import type { Metadata } from "next";
import { Zen_Maru_Gothic } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const zenMaruGothic = Zen_Maru_Gothic({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Feedback Manager",
  description: "GitHub課題提出のフィードバック管理ツール",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${zenMaruGothic.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
