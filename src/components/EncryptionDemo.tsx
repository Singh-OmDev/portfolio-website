"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Key, KeyRound, ShieldCheck, ArrowRight, Play, RotateCcw } from "lucide-react";

type Stage = "idle" | "encrypting" | "transit" | "decrypting" | "done";
type Mode = "symmetric" | "asymmetric";

export default function EncryptionDemo() {
    const [mode, setMode] = useState<Mode>("asymmetric");
    const [stage, setStage] = useState<Stage>("idle");

    const runSimulation = async () => {
        if (stage !== "idle" && stage !== "done") return;

        setStage("idle");
        await new Promise(r => setTimeout(r, 400));

        // 1. Encrypt
        setStage("encrypting");
        await new Promise(r => setTimeout(r, 1500));

        // 2. Transit over network
        setStage("transit");
        await new Promise(r => setTimeout(r, 2000));

        // 3. Decrypt
        setStage("decrypting");
        await new Promise(r => setTimeout(r, 1500));

        // 4. Done
        setStage("done");
    };

    const isRunning = stage !== "idle" && stage !== "done";

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full min-h-[500px]">
            {/* Control Panel */}
            <div className="md:col-span-4 bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm p-6 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between h-full">
                <div>
                    <h3 className="text-xl font-medium text-neutral-900 dark:text-white flex items-center gap-2 mb-4">
                        <Lock size={20} className="text-neutral-500" />
                        Symmetric vs Asymmetric
                    </h3>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                        <strong>Symmetric</strong> encryption (like AES) uses the <em>same</em> key to lock and unlock data. It's extremely fast but hard to share the key safely.
                        <br /><br />
                        <strong>Asymmetric</strong> encryption (like RSA) uses a mathematically linked Public/Private key pair. Anyone can lock data with the Public Key, but <em>only</em> the Private Key can unlock it.
                    </p>

                    <div className="flex flex-col gap-2 mb-6">
                        {(["symmetric", "asymmetric"] as Mode[]).map(m => (
                            <button
                                key={m}
                                onClick={() => { setMode(m); setStage("idle"); }}
                                disabled={isRunning}
                                className={`px-4 py-3 rounded-xl text-left text-sm font-bold transition-colors border capitalize ${mode === m
                                        ? m === 'symmetric' ? 'bg-orange-500 text-white border-orange-600' : 'bg-indigo-500 text-white border-indigo-600'
                                        : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-500 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                    }`}
                            >
                                {m} Encryption
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={runSimulation}
                        disabled={isRunning}
                        className={`flex-1 ${mode === 'symmetric' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-indigo-500 hover:bg-indigo-600'} text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 active:scale-95 transition-all outline-none disabled:opacity-50 cursor-pointer text-sm`}
                    >
                        <Play size={16} /> Send Secure Message
                    </button>
                    <button
                        onClick={() => setStage("idle")}
                        disabled={isRunning}
                        className="px-6 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-xl font-medium border border-neutral-800 dark:border-neutral-200 hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-95 transition-all outline-none cursor-pointer flex items-center justify-center disabled:opacity-50 text-sm"
                        title="Reset"
                    >
                        <RotateCcw size={16} />
                    </button>
                </div>
            </div>

            {/* Visualization Layer */}
            <div className="md:col-span-8 bg-neutral-900 dark:bg-black p-6 rounded-[2rem] border border-neutral-800 shadow-inner flex flex-col items-center justify-center relative overflow-hidden font-mono min-h-[450px]">

                {/* Keys Display Section */}
                <div className="absolute top-6 left-6 right-6 flex justify-between px-8">
                    {/* Client Profile */}
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-neutral-500">Sender (Alice)</span>
                        {mode === 'symmetric' ? (
                            <div className="px-3 py-1.5 rounded-full border border-orange-500/50 bg-orange-500/10 text-orange-400 text-xs flex items-center gap-1">
                                <Key size={12} /> Key "XYZ"
                            </div>
                        ) : (
                            <div className="px-3 py-1.5 rounded-full border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 text-xs flex items-center gap-1 shadow-[0_0_10px_rgba(52,211,153,0.2)]">
                                <KeyRound size={12} /> Bob's Public Key
                            </div>
                        )}
                    </div>

                    {/* Server Profile */}
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-neutral-500">Receiver (Bob)</span>
                        {mode === 'symmetric' ? (
                            <div className="px-3 py-1.5 rounded-full border border-orange-500/50 bg-orange-500/10 text-orange-400 text-xs flex items-center gap-1">
                                <Key size={12} /> Key "XYZ"
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <div className="px-3 py-1.5 rounded-full border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 text-xs flex items-center gap-1">
                                    <KeyRound size={12} /> Public Key
                                </div>
                                <div className="px-3 py-1.5 rounded-full border border-red-500/50 bg-red-500/10 text-red-400 text-xs flex items-center gap-1 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                                    <Key size={12} /> Private Key
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* The Interactive Payload */}
                <div className="w-full h-40 relative mt-20 flex px-12 items-center">

                    {/* Safe Zone (Client) */}
                    <div className="w-1/4 h-full border-r-2 border-dashed border-neutral-700 relative flex items-center" />
                    {/* Danger Zone (Internet) */}
                    <div className="w-2/4 h-full relative" />
                    {/* Safe Zone (Server) */}
                    <div className="w-1/4 h-full border-l-2 border-dashed border-neutral-700 relative flex items-center justify-end" />

                    {/* The Message Object */}
                    <AnimatePresence>
                        <motion.div
                            className={`absolute top-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-32 h-24 rounded-xl border-2 transition-colors z-20 shadow-2xl ${['encrypting', 'decrypting'].includes(stage) ? 'border-yellow-500 bg-yellow-500/20 text-yellow-300 backdrop-blur-md' :
                                    ['transit'].includes(stage) ? 'border-red-500 bg-neutral-900 text-red-400 backdrop-blur-md' :
                                        'border-emerald-500 bg-emerald-500/20 text-emerald-300 backdrop-blur-md'
                                }`}
                            initial={{ left: "10%" }}
                            animate={{
                                left: stage === 'idle' ? "10%" :
                                    stage === 'encrypting' ? "10%" :
                                        stage === 'transit' ? "50%" :
                                            stage === 'decrypting' ? "85%" : "85%",
                                rotate: ['transit'].includes(stage) ? [0, -5, 5, -5, 5, 0] : 0
                            }}
                            transition={{ duration: stage === 'transit' ? 2 : 0.5, ease: "easeInOut" }}
                        >
                            {/* Content of Message */}
                            {stage === 'idle' && (
                                <>
                                    <Unlock size={24} className="mb-2" />
                                    <span className="text-[10px] font-bold">"HELLO BOB"</span>
                                </>
                            )}
                            {stage === 'encrypting' && (
                                <>
                                    <Lock size={24} className="mb-2 animate-pulse" />
                                    <span className="text-[10px] font-bold text-center">LOCKING WITH<br />{mode === 'symmetric' ? 'KEY "XYZ"' : 'PUB KEY'}</span>
                                </>
                            )}
                            {stage === 'transit' && (
                                <>
                                    <Lock size={24} className="mb-2" />
                                    <span className="text-[10px] font-bold opacity-50 break-all px-2 text-center overflow-hidden">
                                        8F2a9B1c...
                                    </span>
                                </>
                            )}
                            {stage === 'decrypting' && (
                                <>
                                    <Unlock size={24} className="mb-2 animate-pulse" />
                                    <span className="text-[10px] font-bold text-center">UNLOCKING WITH<br />{mode === 'symmetric' ? 'KEY "XYZ"' : 'PRIV KEY'}</span>
                                </>
                            )}
                            {stage === 'done' && (
                                <>
                                    <ShieldCheck size={24} className="mb-2" />
                                    <span className="text-[10px] font-bold">"HELLO BOB"</span>
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Explanation Text */}
                <div className="absolute bottom-8 text-center px-12 w-full">
                    <div className="h-16 flex items-center justify-center text-xs text-neutral-400">
                        {stage === 'idle' && "1. Plaintext data ready to be sent securely."}
                        {stage === 'encrypting' && (mode === 'symmetric' ? "2. Encrypting with the shared secret key." : "2. Encrypting with Bob's Public Key (anyone can do this).")}
                        {stage === 'transit' && "3. Secure transit over the public internet. Hackers only see gibberish."}
                        {stage === 'decrypting' && (mode === 'symmetric' ? "4. Unlocking with the SAME shared secret." : "4. Unlocking with Bob's Private Key (ONLY Bob can do this).")}
                        {stage === 'done' && "5. Decryption successful. Message secured."}
                    </div>
                </div>

            </div>
        </div>
    );
}
