import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { Playfair_Display, Inter } from "next/font/google"; // Import fonts
import "./globals.css";
import ClientWrapper from "@/components/ClientWrapper";

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
  metadataBase: new URL('https://portfolio-website-lovat-seven.vercel.app'), // Update this to your actual production domain when you get one
  title: "Om Singh | Backend Software Engineer",
  description: "Portfolio of Om Singh, a Backend Software Engineer specializing in scalable architectures, system design, and AI integrations.",
  openGraph: {
    title: "Om Singh | Backend Software Engineer",
    description: "Portfolio of Om Singh, a Backend Software Engineer specializing in scalable architectures, system design, and AI integrations.",
    url: 'https://portfolio-website-lovat-seven.vercel.app',
    siteName: 'Om Singh Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Om Singh | Backend Software Engineer",
    description: "Portfolio of Om Singh, a Backend Software Engineer specializing in scalable architectures, system design, and AI integrations.",
    creator: '@omsingh8400',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${playfair.variable} ${inter.variable} font-sans antialiased bg-white text-neutral-900 dark:bg-black dark:text-neutral-50 transition-colors duration-300 selection:bg-neutral-200 dark:selection:bg-neutral-800`}
      >
        <ClientWrapper>
          {children}
          <Analytics />
        </ClientWrapper>
      </body>
    </html>
  );
}
