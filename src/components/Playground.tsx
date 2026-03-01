"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TerminalSquare, Server, Database, ListOrdered, ShieldCheck, Activity, Network, Users, CreditCard, Hash, ArrowRightCircle, Info } from "lucide-react";
import RateLimiterDemo from "./RateLimiterDemo";
import LoadBalancerDemo from "./LoadBalancerDemo";
import CacheDemo from "./CacheDemo";
import MessageQueueDemo from "./MessageQueueDemo";
import JwtDemo from "./JwtDemo";
import CircuitBreakerDemo from "./CircuitBreakerDemo";
import WebSocketDemo from "./WebSocketDemo";
import ConnectionPoolDemo from "./ConnectionPoolDemo";
import IdempotencyDemo from "./IdempotencyDemo";
import HashingDemo from "./HashingDemo";
import GraphqlDemo from "./GraphqlDemo";
import ReplicationDemo from "./ReplicationDemo";
import EventSourcingDemo from "./EventSourcingDemo";
import TracingDemo from "./TracingDemo";
import { GitBranch, Fingerprint, BarChart } from "lucide-react";

export default function Playground() {
    const [activeTab, setActiveTab] = useState<"rate" | "load" | "cache" | "queue" | "jwt" | "circuit" | "ws" | "pool" | "idempotency" | "hash" | "graphql" | "replication" | "events" | "trace">("rate");

    const tabs = [
        { id: "rate", label: "Rate Limiter", icon: TerminalSquare, color: "text-green-500", bg: "bg-green-500/10" },
        { id: "load", label: "Load Balancer", icon: Server, color: "text-blue-500", bg: "bg-blue-500/10" },
        { id: "cache", label: "Distributed Cache", icon: Database, color: "text-red-500", bg: "bg-red-500/10" },
        { id: "queue", label: "Message Queue", icon: ListOrdered, color: "text-indigo-500", bg: "bg-indigo-500/10" },
        { id: "jwt", label: "JWT Auth", icon: ShieldCheck, color: "text-purple-500", bg: "bg-purple-500/10" },
        { id: "circuit", label: "Circuit Breaker", icon: Activity, color: "text-orange-500", bg: "bg-orange-500/10" },
        { id: "ws", label: "WebSockets", icon: Network, color: "text-cyan-500", bg: "bg-cyan-500/10" },
        { id: "pool", label: "Connection Pool", icon: Users, color: "text-rose-500", bg: "bg-rose-500/10" },
        { id: "idempotency", label: "API Idempotency", icon: CreditCard, color: "text-yellow-500", bg: "bg-yellow-500/10" },
        { id: "hash", label: "Consistent Hashing", icon: Hash, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { id: "graphql", label: "GraphQL vs REST", icon: ArrowRightCircle, color: "text-[#E10098]", bg: "bg-[#E10098]/10" },
        { id: "replication", label: "DB Replication", icon: GitBranch, color: "text-blue-400", bg: "bg-blue-400/10" },
        { id: "events", label: "Event Sourcing", icon: Fingerprint, color: "text-rose-400", bg: "bg-rose-400/10" },
        { id: "trace", label: "Distributed Tracing", icon: BarChart, color: "text-indigo-400", bg: "bg-indigo-400/10" },
    ] as const;

    const DESCRIPTIONS: Record<string, string> = {
        rate: "APIs use Token Buckets to protect against traffic spikes. Imagine your API has 5 tokens. Every user request costs 1 token. When a user runs out of tokens, they are temporarily blocked (HTTP 429). The bucket slowly refills over time.",
        load: "When building scalable backend systems, a single server cannot handle all the traffic. A Load Balancer sits in front of multiple servers (nodes) and distributes incoming routing evenly using algorithms like Round Robin.",
        cache: "Database queries are slow and expensive, taking hundreds of milliseconds. Caching layers (like Redis) store frequent query results in memory (RAM). Secondary lookups skip the database entirely, dropping response times to under 10ms.",
        queue: "Message Queues completely separate users from workers using asynchronous Pub/Sub patterns. A Producer puts a massive job onto the queue and instantly returns an HTTP 200 Success to the user, while hidden background Worker Nodes pull tasks off the queue as fast as they can handle them.",
        jwt: "Authentication protocols use JSON Web Tokens to securely verify users without hitting a database every time. The token is split into three parts: The Header (Algorithm), the Payload (User ID data), and the cryptographic Signature (Verifies nobody spoofed the token).",
        circuit: "A crucial resilience pattern in microservices. If your downstream database is failing, you don't want to keep sending it traffic and making it worse. We 'Open' the circuit to instantly fail-fast all traffic, giving the downstream server time to recover, before 'Half-Opening' to test it.",
        ws: "Traditional REST APIs process requests blindly—a client asks, the server answers, and the pipe closes. WebSockets perform an initial HTTP handshake to open a persistent connection, allowing real-time, low-latency, bidirectional ping-pong messaging.",
        pool: "Opening a connection to a database is an astronomically heavy network process. Connection Pools pre-open a fixed amount of connections across a cluster. When high traffic hits, queries wait in line for an active connection to become free, preventing crashes.",
        idempotency: "In flaky distributed systems, users often submit payments twice. An Idempotency system assigns a unique cryptographic key to a given checkout transaction. If the user hits 'Pay' a second time while it's processing, the cache hits successfully and protects them from being double-charged.",
        hash: "In massive scale deployments, Consistent Hashing determines which server node owns which specific piece of data. If you add or remove nodes dynamically, the ring guarantees that only an absolute minimum fraction of data needs to be reshuffled across the network.",
        graphql: "REST APIs suffer from the 'N+1 Waterfall' problem—you have to wait for the first request to finish before triggering the second. GraphQL elegantly allows the client to request precisely all the nested data it needs in a single trip.",
        replication: "Scale dictates that a single Database cannot handle all SELECT and INSERT traffic. We separate the architecture into a 'Leader' database that only takes heavy writes, and asynchronously replicates that state to multiple read-only 'Follower' databases.",
        events: "Instead of storing a volatile state like 'Current Balance: $50', CQRS Event Sourcing stores an immutable, append-only JSON log of every transaction ever made. The system dynamically reads the logs to project a state, allowing developers to literally 'Rewind Time'.",
        trace: "In a Microservice architecture, a single user click might spider out to hit 10 different APIs simultaneously. Datadog/Jaeger-style Distributed Tracing attaches a 'Trace ID' to the request, graphing an exact bottleneck waterfall chart of network latency."
    };

    return (
        <section id="playground" className="py-12 flex justify-center w-full px-6 relative z-10 w-full overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-200/10 dark:bg-blue-900/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

            <div className="max-w-5xl w-full">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12 text-center"
                >
                    <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider uppercase bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-600 dark:text-neutral-300 mb-4">
                        Backend Playground
                    </span>
                    <h2 className="text-4xl md:text-5xl font-serif font-medium mb-6 text-neutral-900 dark:text-neutral-50 tracking-tight">
                        Interactive Architecture
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto text-lg leading-relaxed">
                        Explore core backend concepts visually. Switch between the tabs below to test different mechanisms like rate limiting, load balancing, caching, and more.
                    </p>
                </motion.div>

                {/* Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 cursor-pointer ${isActive
                                    ? `bg-white dark:bg-neutral-800 shadow-md ${tab.color} border border-neutral-200 dark:border-neutral-700`
                                    : "bg-neutral-100 dark:bg-neutral-900/50 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300 border border-transparent"
                                    }`}
                            >
                                <div className={`p-1.5 rounded-md ${isActive ? tab.bg : "bg-transparent"}`}>
                                    <Icon size={16} />
                                </div>
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Demo Descriptions */}
                <div className="mb-8 w-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.2 }}
                            className="bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex gap-4 items-start shadow-sm"
                        >
                            <Info size={20} className="text-neutral-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                                {DESCRIPTIONS[activeTab]}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Demo Container */}
                <div className="relative min-h-[500px]">
                    <AnimatePresence mode="wait">
                        {activeTab === "rate" && (
                            <motion.div
                                key="rate"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <RateLimiterDemo />
                            </motion.div>
                        )}
                        {activeTab === "load" && (
                            <motion.div
                                key="load"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <LoadBalancerDemo />
                            </motion.div>
                        )}
                        {activeTab === "cache" && (
                            <motion.div
                                key="cache"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <CacheDemo />
                            </motion.div>
                        )}
                        {activeTab === "queue" && (
                            <motion.div
                                key="queue"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <MessageQueueDemo />
                            </motion.div>
                        )}
                        {activeTab === "jwt" && (
                            <motion.div
                                key="jwt"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <JwtDemo />
                            </motion.div>
                        )}
                        {activeTab === "circuit" && (
                            <motion.div
                                key="circuit"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <CircuitBreakerDemo />
                            </motion.div>
                        )}
                        {activeTab === "ws" && (
                            <motion.div
                                key="ws"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <WebSocketDemo />
                            </motion.div>
                        )}
                        {activeTab === "pool" && (
                            <motion.div
                                key="pool"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ConnectionPoolDemo />
                            </motion.div>
                        )}
                        {activeTab === "idempotency" && (
                            <motion.div
                                key="idempotency"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <IdempotencyDemo />
                            </motion.div>
                        )}
                        {activeTab === "hash" && (
                            <motion.div
                                key="hash"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <HashingDemo />
                            </motion.div>
                        )}
                        {activeTab === "graphql" && (
                            <motion.div
                                key="graphql"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <GraphqlDemo />
                            </motion.div>
                        )}
                        {activeTab === "replication" && (
                            <motion.div
                                key="replication"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ReplicationDemo />
                            </motion.div>
                        )}
                        {activeTab === "events" && (
                            <motion.div
                                key="events"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <EventSourcingDemo />
                            </motion.div>
                        )}
                        {activeTab === "trace" && (
                            <motion.div
                                key="trace"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <TracingDemo />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
