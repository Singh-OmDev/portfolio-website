"use client";
import { Analytics } from '@vercel/analytics/next';

import { useState, useEffect } from "react";
import { Playfair_Display, Inter } from "next/font/google"; // Import fonts
import "./globals.css";
import Mascot from "@/components/Mascot";
import MatrixRain from "@/components/MatrixRain";
import CommandPalette from "@/components/CommandPalette";
import IntroScreen from "@/components/IntroScreen";
import RobotMenu from "@/components/RobotMenu";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMatrixMode, setIsMatrixMode] = useState(false);

  useEffect(() => {
    const handleMatrixActivation = () => {
      setIsMatrixMode(true);
      document.documentElement.classList.add("matrix-mode");

      // Turn off after 8 seconds
      setTimeout(() => {
        setIsMatrixMode(false);
        document.documentElement.classList.remove("matrix-mode");
      }, 8000);
    };

    window.addEventListener("matrix-mode-activated", handleMatrixActivation);
    return () => window.removeEventListener("matrix-mode-activated", handleMatrixActivation);
  }, []);

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <title>Om Singh | Minimal Portfolio</title>
        <meta name="description" content="Backend Software Engineer Portfolio" />
        <link rel="icon" href="/icon.svg" />
      </head>
      <body
        className={`${playfair.variable} ${inter.variable} font-sans antialiased bg-white text-neutral-900 dark:bg-black dark:text-neutral-50 transition-colors duration-300 selection:bg-neutral-200 dark:selection:bg-neutral-800 ${isMatrixMode ? "matrix-active" : ""}`}
      >
        <IntroScreen />
        <RobotMenu />
        <MatrixRain active={isMatrixMode} />
        <Mascot />
        <CommandPalette />
        {children}
        <Analytics />

      </body>
    </html>
  );
}
