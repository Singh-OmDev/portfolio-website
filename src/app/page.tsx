import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import GithubGraph from "@/components/GithubGraph";
import Link from "next/link";
import { ArrowRight, TerminalSquare } from "lucide-react";
import { Metadata } from "next";
import { portfolioData } from "@/data/portfolio";

export const metadata: Metadata = {
  title: `${portfolioData.profile.name} | ${portfolioData.profile.role}`,
  description: portfolioData.profile.tagline,
  openGraph: {
    title: `${portfolioData.profile.name} | ${portfolioData.profile.role}`,
    description: portfolioData.profile.tagline,
    url: portfolioData.socials.website,
    siteName: `${portfolioData.profile.name} Portfolio`,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${portfolioData.profile.name} | ${portfolioData.profile.role}`,
    description: portfolioData.profile.tagline,
  },
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <GithubGraph />

      {/* Backend Playground CTA */}
      <section className="py-24 flex justify-center w-full px-6 relative z-10 w-full overflow-hidden bg-white dark:bg-black">
        <div className="max-w-4xl w-full text-center flex flex-col items-center">
          <div className="p-4 bg-neutral-200/50 dark:bg-neutral-800/50 rounded-2xl mb-6">
            <TerminalSquare size={32} className="text-neutral-700 dark:text-neutral-300" />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4 text-neutral-900 dark:text-neutral-50 tracking-tight">
            Backend Playground
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto text-lg leading-relaxed mb-8">
            Explore interactive visualizers for core system design concepts like Rate Limiting, Load Balancing, and Distributed Caching.
          </p>
          <Link
            href="/playground"
            className="inline-flex items-center gap-2 px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 group"
          >
            Enter Playground
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <Contact />
    </main>
  );
}
