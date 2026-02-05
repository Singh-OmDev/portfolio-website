import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google"; // Import fonts
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Om Singh | Minimal Portfolio",
  description: "Backend Software Engineer Portfolio",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${playfair.variable} ${inter.variable} font-sans antialiased bg-white text-neutral-900 dark:bg-black dark:text-neutral-50 transition-colors duration-300 selection:bg-neutral-200 dark:selection:bg-neutral-800`}
      >
        {children}
      </body>
    </html>
  );
}
