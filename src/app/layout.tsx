// src/app/layout.tsx

import type { Metadata } from "next";
import { barlow } from '../utils/fonts';
import "./globals.css";

export const metadata: Metadata = {
  title: "Folk Devils Presentation",
  description: "Folk Devils Interactive Presentation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={barlow.variable}>
      <body className="bg-black">
        <main className="min-h-screen w-screen overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
