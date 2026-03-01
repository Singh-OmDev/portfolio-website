"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KeyRound, ShieldCheck, LockOpen, ArrowRight } from "lucide-react";

export default function JwtDemo() {
    const [step, setStep] = useState<0 | 1 | 2>(0);
    const [isHovering, setIsHovering] = useState<"header" | "payload" | "signature" | null>(null);

    const mockupJwt = {
        header: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
        payload: "eyJ1c2VyX2lkIjoiMTIzNDU2IiwibmFtZSI6IkJydWNlIFdheW5lIiwiYWRtaW4iOnRydWV9",
        signature: "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    };

    const handleNext = () => setStep((s) => (s + 1) % 3 as 0 | 1 | 2);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Interactive Flow Panel */}
            <div className="bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm p-8 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-medium text-neutral-900 dark:text-white flex items-center gap-2">
                            <KeyRound size={20} className="text-neutral-500" />
                            Authentication Flow
                        </h3>
                        <span className="text-xs font-mono bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded text-neutral-500">
                            Step {step + 1} of 3
                        </span>
                    </div>

                    <div className="space-y-6 mb-8 min-h-[150px]">
                        {step === 0 && (
                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col items-center text-center gap-4">
                                <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-full">
                                    <LockOpen size={24} className="text-neutral-600 dark:text-neutral-400" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-neutral-900 dark:text-white mb-1">1. User Login</h4>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Client sends credentials to the server. Server verifies and generates a signed token.</p>
                                </div>
                            </motion.div>
                        )}
                        {step === 1 && (
                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col items-center text-center gap-4">
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full border border-blue-200 dark:border-blue-800/50">
                                    <KeyRound size={24} className="text-blue-500" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-neutral-900 dark:text-white mb-1">2. Token Issued</h4>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Server returns a stateless JWT. Client stores it to authorize future requests.</p>
                                </div>
                            </motion.div>
                        )}
                        {step === 2 && (
                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col items-center text-center gap-4">
                                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-full border border-green-200 dark:border-green-800/50">
                                    <ShieldCheck size={24} className="text-green-500" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-neutral-900 dark:text-white mb-1">3. Server Validation</h4>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Client sends the JWT in the Authorization header. Server verifies the signature mathematically.</p>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                <button
                    onClick={handleNext}
                    className="w-full bg-neutral-900 dark:bg-white text-white dark:text-black py-4 px-6 rounded-full font-medium transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm hover:shadow-md cursor-pointer"
                >
                    <span>{step === 2 ? "Restart Example" : "Next Step"}</span>
                    <ArrowRight size={18} />
                </button>
            </div>

            {/* Token Visualization */}
            <div className="bg-neutral-900 dark:bg-black p-6 rounded-[2rem] border border-neutral-800 shadow-inner flex flex-col font-mono relative overflow-hidden h-[350px]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 opacity-50"></div>

                <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-800">
                    <span className="text-neutral-400 text-sm">Decoding JSON Web Token</span>
                </div>

                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Raw Token String */}
                    <div className="text-xs break-all leading-relaxed mb-6 p-4 bg-neutral-950 rounded-xl border border-neutral-800">
                        <span
                            onMouseEnter={() => setIsHovering("header")}
                            onMouseLeave={() => setIsHovering(null)}
                            className={`cursor-pointer transition-opacity duration-300 font-bold ${isHovering === "payload" || isHovering === "signature" ? "opacity-30" : "text-red-400"}`}
                        >
                            {mockupJwt.header}
                        </span>
                        <span className="text-neutral-600">.</span>
                        <span
                            onMouseEnter={() => setIsHovering("payload")}
                            onMouseLeave={() => setIsHovering(null)}
                            className={`cursor-pointer transition-opacity duration-300 font-bold ${isHovering === "header" || isHovering === "signature" ? "opacity-30" : "text-purple-400"}`}
                        >
                            {mockupJwt.payload}
                        </span>
                        <span className="text-neutral-600">.</span>
                        <span
                            onMouseEnter={() => setIsHovering("signature")}
                            onMouseLeave={() => setIsHovering(null)}
                            className={`cursor-pointer transition-opacity duration-300 font-bold ${isHovering === "header" || isHovering === "payload" ? "opacity-30" : "text-blue-400"}`}
                        >
                            {mockupJwt.signature}
                        </span>
                    </div>

                    {/* Breakdown Area */}
                    <div className="flex-1 relative">
                        <AnimatePresence mode="wait">
                            {(!isHovering || isHovering === "header") && (
                                <motion.div key="header" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                                    <span className="text-red-400 text-xs font-bold uppercase tracking-wider mb-2 block">Header (Algorithm & Type)</span>
                                    <pre className="text-xs text-neutral-300 bg-neutral-800/40 p-3 rounded-lg border border-neutral-800">
                                        {`{
  "alg": "HS256",
  "typ": "JWT"
}`}
                                    </pre>
                                </motion.div>
                            )}

                            {isHovering === "payload" && (
                                <motion.div key="payload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                                    <span className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-2 block">Payload (Data Claims)</span>
                                    <pre className="text-xs text-neutral-300 bg-neutral-800/40 p-3 rounded-lg border border-neutral-800">
                                        {`{
  "user_id": "123456",
  "name": "Bruce Wayne",
  "admin": true
}`}
                                    </pre>
                                </motion.div>
                            )}

                            {isHovering === "signature" && (
                                <motion.div key="signature" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                                    <span className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-2 block">Signature (Verification)</span>
                                    <pre className="text-xs text-neutral-300 bg-neutral-800/40 p-3 rounded-lg border border-neutral-800 break-words whitespace-pre-wrap">
                                        {`HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  your-256-bit-secret
)`}
                                    </pre>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
