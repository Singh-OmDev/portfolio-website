"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, BookOpen, Calendar } from "lucide-react";

interface MediumArticle {
    title: string;
    pubDate: string;
    link: string;
    thumbnail: string;
    description: string;
    categories: string[];
}

export default function MediumArticles() {
    const [articles, setArticles] = useState<MediumArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Hardcode the Medium profile name or pass it via props/data
    const username = "@omsingh8400";
    const rssUrl = `https://medium.com/feed/${username}`;
    // We use rss2json to convert the XML feed to JSON
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`;

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error("Failed to fetch Medium articles");
                }
                const data = await response.json();

                // Extract only the top 3 articles
                const latestArticles = data.items.slice(0, 3).map((item: any) => {
                    // Remove HTML tags from the description for a cleaner snippet
                    const plainTextDescription = item.description
                        .replace(/<[^>]+>/g, '')
                        .replace(/&nbsp;/g, ' ')
                        .trim();

                    return {
                        title: item.title,
                        pubDate: new Date(item.pubDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        }),
                        link: item.link,
                        thumbnail: item.thumbnail,
                        // Provide a short fallback if the description is weird
                        description: plainTextDescription.substring(0, 150) + "...",
                        categories: item.categories || [],
                    };
                });

                setArticles(latestArticles);
                setLoading(false);
            } catch (err: any) {
                console.error(err);
                setError(err.message || "Something went wrong");
                setLoading(false);
            }
        };

        fetchArticles();
    }, [apiUrl]);

    if (error || (articles.length === 0 && !loading)) {
        return null; // Silently hide the section if there's no data or an error
    }

    return (
        <section id="articles" className="py-24 md:py-32 flex justify-center bg-white dark:bg-black overflow-hidden relative w-full">
            <div className="max-w-6xl w-full px-6 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 items-center">
                <div className="md:col-span-12 max-w-4xl mx-auto w-full">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-center mb-16"
                    >
                        <div className="flex items-center justify-center gap-4 mb-12">
                            <div className="h-px w-12 bg-neutral-900 dark:bg-white" />
                            <span className="text-sm font-medium tracking-widest uppercase text-neutral-900 dark:text-white">
                                Latest Articles
                            </span>
                            <div className="h-px w-12 bg-neutral-900 dark:bg-white" />
                        </div>
                    </motion.div>

                    {/* Articles Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {loading
                            ? // Skeletons
                            Array.from({ length: 3 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-96 w-full animate-pulse bg-neutral-100 dark:bg-neutral-900 rounded-[2rem]"
                                />
                            ))
                            : articles.map((article, idx) => (
                                <motion.a
                                    key={idx}
                                    href={article.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                    className="group relative flex flex-col justify-between h-full bg-neutral-50 dark:bg-neutral-900/50 rounded-[2rem] p-8 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all duration-500 overflow-hidden border border-neutral-200/50 dark:border-neutral-800/50 hover:border-neutral-300 dark:hover:border-neutral-700"
                                >
                                    {/* Hover Glow */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-neutral-200/0 via-neutral-100/0 to-neutral-200/50 dark:from-neutral-800/0 dark:via-neutral-900/0 dark:to-neutral-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]" />

                                    <div className="relative z-10">
                                        {/* Fallback pattern if thumbnail is missing */}
                                        {article.thumbnail ? (
                                            <div className="w-full h-40 mb-6 rounded-xl overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                                                <img
                                                    src={article.thumbnail}
                                                    alt={article.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-12 h-12 bg-neutral-200 dark:bg-neutral-800 rounded-xl flex items-center justify-center mb-6">
                                                <BookOpen className="text-neutral-500 dark:text-neutral-400" size={24} />
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-4">
                                            <Calendar size={14} />
                                            <span>{article.pubDate}</span>
                                        </div>

                                        <h3 className="text-xl font-serif font-bold text-neutral-900 dark:text-white mb-3 leading-tight group-hover:text-black dark:group-hover:text-white/90 transition-colors">
                                            {article.title}
                                        </h3>

                                        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6 line-clamp-3">
                                            {article.description}
                                        </p>
                                    </div>

                                    <div className="relative z-10 flex items-center gap-2 text-sm font-medium text-black dark:text-white group/btn mt-auto pt-4 border-t border-neutral-200 dark:border-neutral-800">
                                        <span>Read Article</span>
                                        <ExternalLink size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                    </div>
                                </motion.a>
                            ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
