"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolio";
import { Send, Phone, Mail, User, MessageSquare, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_wsgvkdq";
const TEMPLATE_ID = "template_8jvbees";
const PUBLIC_KEY = "SfcZ7ClRYlzgXod91";


export default function Contact() {
    const { socials } = portfolioData;
    const formRef = useRef<HTMLFormElement>(null);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        message: ""
    });

    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
            alert("EmailJS keys are missing! Please check your configuration.");
            return;
        }

        setStatus("submitting");

        try {
            await emailjs.sendForm(
                SERVICE_ID,
                TEMPLATE_ID,
                formRef.current!,
                PUBLIC_KEY
            );
            setStatus("success");
            setFormData({ name: "", phone: "", email: "", message: "" });

            // Reset status after 3 seconds
            setTimeout(() => setStatus("idle"), 3000);

        } catch (error) {
            console.error("EmailJS Error:", error);
            setStatus("error");
            setTimeout(() => setStatus("idle"), 3000);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const inputClasses = "w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 transition-all placeholder:text-neutral-500 dark:placeholder:text-neutral-500 pl-10 text-neutral-900 dark:text-white [&:-webkit-autofill]:bg-neutral-100 dark:[&:-webkit-autofill]:bg-neutral-900 [&:-webkit-autofill]:shadow-[0_0_0_100px_#f5f5f5_inset] dark:[&:-webkit-autofill]:shadow-[0_0_0_100px_#171717_inset] [&:-webkit-autofill]:text-neutral-900 dark:[&:-webkit-autofill]:text-white";

    return (
        <section id="contact" className="py-32 flex justify-center w-full overflow-hidden relative">
            {/* Background Gradient */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neutral-200/20 dark:bg-neutral-800/20 rounded-full blur-[100px] -z-10" />

            <div className="max-w-4xl w-full px-6">

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12 text-center"
                >
                    <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider uppercase bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-600 dark:text-neutral-300 mb-4">
                        Contact
                    </span>
                    <h2 className="text-4xl md:text-5xl font-serif font-medium mb-6 text-neutral-900 dark:text-neutral-50">
                        Let's Work Together
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto text-lg">
                        Have a project in mind or just want to say hello? Fill out the form below and I'll get back to you as soon as possible.
                    </p>
                </motion.div>

                <motion.form
                    ref={formRef}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm p-8 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm"
                >
                    {/* Name */}
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-2 ml-1">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group">
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Om Singh"
                                className={inputClasses}
                            />
                            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-neutral-900 dark:group-focus-within:text-white transition-colors" />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-2 ml-1">
                            Phone <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group">
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91 9876543210"
                                className={inputClasses}
                            />
                            <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-neutral-900 dark:group-focus-within:text-white transition-colors" />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2 md:col-span-2">
                        <label htmlFor="email" className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-2 ml-1">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="omsingh8400@gmail.com"
                                className={inputClasses}
                            />
                            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-neutral-900 dark:group-focus-within:text-white transition-colors" />
                        </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2 md:col-span-2">
                        <label htmlFor="message" className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-2 ml-1">
                            Message <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group">
                            <textarea
                                id="message"
                                name="message"
                                required
                                rows={5}
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Tell me about your project..."
                                className={inputClasses.replace("rounded-full", "rounded-2xl").replace("pl-10", "pl-10 pt-3 resize-none")}
                            />
                            <MessageSquare size={18} className="absolute left-3 top-4 text-neutral-400 group-focus-within:text-neutral-900 dark:group-focus-within:text-white transition-colors" />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="md:col-span-2 mt-2">
                        <button
                            type="submit"
                            disabled={status === "submitting" || status === "success"}
                            className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-full font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
                        >
                            {status === "idle" && (
                                <>
                                    <Send size={18} />
                                    Send Message
                                </>
                            )}
                            {status === "submitting" && (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Sending...
                                </>
                            )}
                            {status === "success" && (
                                <>
                                    <CheckCircle2 size={18} className="text-green-600 dark:text-green-500" />
                                    Message Sent!
                                </>
                            )}
                            {status === "error" && (
                                <>
                                    <AlertCircle size={18} className="text-red-600 dark:text-red-500" />
                                    Failed to Send
                                </>
                            )}
                        </button>
                    </div>

                </motion.form>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="mt-20 text-center text-neutral-400 text-sm"
                >
                    &copy; {new Date().getFullYear()} Om Singh. All rights reserved.
                </motion.div>

            </div>
        </section>
    );
}
