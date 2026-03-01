"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, Send, User, ServerCog, Plug, Unplug } from "lucide-react";

interface ChatMessage {
    id: string;
    sender: "client" | "server" | "info";
    text: string;
    type: "http" | "ws" | "info";
}

export default function WebSocketDemo() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [isConnecting, setIsConnecting] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleConnect = () => {
        setIsConnecting(true);
        // Step 1: Client sends HTTP Upgrade Request
        setMessages(prev => [...prev, { id: crypto.randomUUID(), sender: "client", text: "GET /chat HTTP/1.1\nUpgrade: websocket\nConnection: Upgrade", type: "http" }]);

        // Step 2: Server Responds with 101 Switching Protocols
        setTimeout(() => {
            setMessages(prev => [...prev, { id: crypto.randomUUID(), sender: "server", text: "HTTP/1.1 101 Switching Protocols\nUpgrade: websocket\nConnection: Upgrade", type: "http" }]);

            // Connected!
            setTimeout(() => {
                setIsConnected(true);
                setIsConnecting(false);
                setMessages(prev => [...prev, { id: crypto.randomUUID(), sender: "info", text: "Persistent TCP Connection Established (ws://)", type: "info" }]);
            }, 600);
        }, 800);
    };

    const handleDisconnect = () => {
        setIsConnected(false);
        setMessages(prev => [...prev, { id: crypto.randomUUID(), sender: "info", text: "Connection closed by client.", type: "info" }]);
    };

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim() || !isConnected) return;

        const text = inputValue;
        setInputValue("");

        // Client instantly pushes payload over open pipe
        setMessages(prev => [...prev, { id: crypto.randomUUID(), sender: "client", text, type: "ws" }]);

        // Server instantly pushes back without new handshake
        setTimeout(() => {
            let reply = "Message received loud and clear.";
            if (text.toLowerCase().includes("ping")) reply = "Pong!";
            if (text.toLowerCase().includes("hello")) reply = "Hello! WebSockets make this fast.";

            setMessages(prev => [...prev, { id: crypto.randomUUID(), sender: "server", text: reply, type: "ws" }]);
        }, 400); // Super fast simulated RTT
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Control Panel / Client View */}
            <div className="bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm p-8 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-medium text-neutral-900 dark:text-white flex items-center gap-2">
                            <User size={20} className="text-neutral-500" />
                            Client App
                        </h3>
                        <div className={`px-3 py-1 text-xs font-bold rounded-full border tracking-wide flex items-center gap-1.5
                            ${isConnected
                                ? "bg-green-500/20 text-green-600 border-green-500/30"
                                : "bg-neutral-500/20 text-neutral-600 border-neutral-500/30"}`}
                        >
                            {isConnected ? <Plug size={12} /> : <Unplug size={12} />}
                            {isConnected ? "CONNECTED" : "OFFLINE"}
                        </div>
                    </div>

                    {/* Connection Controls */}
                    {!isConnected && (
                        <div className="mb-8 flex flex-col items-center justify-center p-6 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-900/50">
                            <Network size={32} className="text-neutral-400 mb-4" />
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center mb-4">
                                WebSockets require an initial HTTP handshake to "Upgrade" the connection protocol.
                            </p>
                            <button
                                onClick={handleConnect}
                                disabled={isConnecting}
                                className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                            >
                                {isConnecting ? "Negotiating..." : "Initiate Handshake"}
                            </button>
                        </div>
                    )}

                    {isConnected && (
                        <div className="mb-8 flex flex-col items-center justify-center p-6 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900/50">
                            <button
                                onClick={handleDisconnect}
                                className="px-6 py-2 rounded-lg border border-red-500/50 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 font-medium transition-colors text-sm cursor-pointer"
                            >
                                Close Connection
                            </button>
                        </div>
                    )}
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendMessage} className="relative">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={isConnected ? "Send message via ws://..." : "Connect first to chat"}
                        disabled={!isConnected}
                        className="w-full bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-full py-4 pl-6 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-900 dark:text-neutral-100"
                    />
                    <button
                        type="submit"
                        disabled={!isConnected || !inputValue.trim()}
                        className="absolute right-2 top-2 bottom-2 aspect-square bg-indigo-500 text-white rounded-full flex items-center justify-center hover:bg-indigo-600 disabled:opacity-50 disabled:hover:bg-indigo-500 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                        <Send size={16} className="-ml-0.5" />
                    </button>
                </form>
            </div>

            {/* Server Console / Network Layer */}
            <div className="bg-neutral-900 dark:bg-black p-6 rounded-[2rem] border border-neutral-800 shadow-inner flex flex-col font-mono relative overflow-hidden h-[350px]">
                <div className={`absolute top-0 left-0 w-full h-1 transition-colors duration-1000 ${isConnected ? 'bg-gradient-to-r from-indigo-500/20 via-indigo-500 to-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-neutral-800'}`}></div>

                <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-800">
                    <h3 className="text-neutral-300 text-sm flex items-center gap-2">
                        <ServerCog size={16} className="text-neutral-500" />
                        Network Inspector
                    </h3>
                </div>

                <div className="flex-1 overflow-hidden relative">
                    <div ref={scrollRef} className="absolute inset-0 overflow-y-auto pr-2 space-y-4 pb-4 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent flex flex-col">
                        <AnimatePresence initial={false}>
                            {messages.length === 0 && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-neutral-600 text-sm italic m-auto"
                                >
                                    No network activity...
                                </motion.p>
                            )}

                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className={`flex flex-col max-w-[85%] ${msg.sender === "client" ? "self-end items-end" : msg.sender === "server" ? "self-start items-start" : "self-center my-2"}`}
                                >
                                    {msg.type === "info" ? (
                                        <div className="px-3 py-1 rounded-full bg-neutral-800/50 text-[10px] text-neutral-400 uppercase tracking-widest border border-neutral-700">
                                            {msg.text}
                                        </div>
                                    ) : (
                                        <>
                                            <span className="text-[10px] text-neutral-500 uppercase mb-1 px-1">
                                                {msg.sender === "client" ? "Client ➔ Server" : "Server ➔ Client"}
                                            </span>
                                            <div className={`p-3 rounded-2xl text-xs whitespace-pre-wrap
                                                ${msg.type === "http" ? "bg-neutral-800 text-neutral-300 border border-neutral-700" : ""}
                                                ${msg.type === "ws" && msg.sender === "client" ? "bg-indigo-600 text-white rounded-tr-sm" : ""}
                                                ${msg.type === "ws" && msg.sender === "server" ? "bg-neutral-800 border border-indigo-500/30 text-indigo-100 rounded-tl-sm" : ""}
                                            `}>
                                                {msg.text}
                                            </div>
                                        </>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
