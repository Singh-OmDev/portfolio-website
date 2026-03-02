"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import SagaPatternDemo from "./SagaPatternDemo";
import VectorSearchDemo from "./VectorSearchDemo";
import ServerlessColdStartDemo from "./ServerlessColdStartDemo";
import ShardingDemo from "./ShardingDemo";
import ServiceMeshDemo from "./ServiceMeshDemo";
import CdcDemo from "./CdcDemo";
import BloomFilterDemo from "./BloomFilterDemo";
import BlueGreenDeployDemo from "./BlueGreenDeployDemo";
import ApiGatewayDemo from "./ApiGatewayDemo";
import CdnDemo from "./CdnDemo";
import OAuthDemo from "./OAuthDemo";
import SnowflakeIdDemo from "./SnowflakeIdDemo";
import LeaderElectionDemo from "./LeaderElectionDemo";
import GossipProtocolDemo from "./GossipProtocolDemo";
import TwoPhaseCommitDemo from "./TwoPhaseCommitDemo";
import MerkleTreeDemo from "./MerkleTreeDemo";
import GeohashingDemo from "./GeohashingDemo";
import MapReduceDemo from "./MapReduceDemo";
import DatabaseIndexingDemo from "./DatabaseIndexingDemo";
import DnsResolutionDemo from "./DnsResolutionDemo";
import SseDemo from "./SseDemo";
import EncryptionDemo from "./EncryptionDemo";
import KafkaStreamsDemo from "./KafkaStreamsDemo";
import { GitBranch, Fingerprint, BarChart, Brain, CloudLightning, Layers, Shield, DatabaseZap, Filter, SplitSquareHorizontal, Globe, Lock, UserSquare2, MessageCircle, ShieldCheck, GitMerge, Map, Blocks, TerminalSquare, Server, Database, ListOrdered, Activity, Network, Users, CreditCard, Hash, ArrowRightCircle, Info, Binary, Zap, ShieldAlert } from "lucide-react";

export default function Playground() {
    const [activeTab, setActiveTab] = useState<"rate" | "load" | "cache" | "queue" | "jwt" | "circuit" | "ws" | "pool" | "idempotency" | "hash" | "graphql" | "replication" | "events" | "trace" | "saga" | "vector" | "serverless" | "sharding" | "mesh" | "cdc" | "bloom" | "bluegreen" | "gateway" | "cdn" | "oauth" | "snowflake" | "leader" | "gossip" | "twopc" | "merkle" | "geohash" | "mapreduce" | "btree" | "dns" | "sse" | "encrypt" | "kafka">("rate");

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
        { id: "saga", label: "Saga Pattern", icon: Network, color: "text-yellow-400", bg: "bg-yellow-400/10" },
        { id: "vector", label: "Vector Search", icon: Brain, color: "text-purple-400", bg: "bg-purple-400/10" },
        { id: "serverless", label: "Serverless", icon: CloudLightning, color: "text-orange-400", bg: "bg-orange-400/10" },
        { id: "sharding", label: "Database Sharding", icon: Layers, color: "text-blue-500", bg: "bg-blue-500/10" },
        { id: "mesh", label: "Service Mesh", icon: Shield, color: "text-green-500", bg: "bg-green-500/10" },
        { id: "cdc", label: "Change Data Capture", icon: DatabaseZap, color: "text-yellow-500", bg: "bg-yellow-500/10" },
        { id: "bloom", label: "Bloom Filters", icon: Filter, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { id: "bluegreen", label: "Blue/Green", icon: SplitSquareHorizontal, color: "text-blue-400", bg: "bg-blue-400/10" },
        { id: "gateway", label: "API Gateway", icon: Network, color: "text-indigo-500", bg: "bg-indigo-500/10" },
        { id: "cdn", label: "CDN (Edge Caches)", icon: Globe, color: "text-blue-500", bg: "bg-blue-500/10" },
        { id: "oauth", label: "OAuth 2.0 (Code)", icon: Lock, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { id: "snowflake", label: "Snowflake ID", icon: Hash, color: "text-indigo-400", bg: "bg-indigo-400/10" },
        { id: "leader", label: "Leader Election", icon: UserSquare2, color: "text-yellow-500", bg: "bg-yellow-500/10" },
        { id: "gossip", label: "Gossip Protocol", icon: MessageCircle, color: "text-purple-400", bg: "bg-purple-400/10" },
        { id: "twopc", label: "2-Phase Commit", icon: ShieldCheck, color: "text-green-500", bg: "bg-green-500/10" },
        { id: "merkle", label: "Merkle Trees", icon: GitMerge, color: "text-emerald-400", bg: "bg-emerald-400/10" },
        { id: "geohash", label: "Geohashing", icon: Map, color: "text-blue-400", bg: "bg-blue-400/10" },
        { id: "mapreduce", label: "MapReduce", icon: Blocks, color: "text-orange-500", bg: "bg-orange-500/10" },
        { id: "btree", label: "DB Indexing (B-Tree)", icon: Binary, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { id: "dns", label: "DNS Resolution", icon: Globe, color: "text-indigo-400", bg: "bg-indigo-400/10" },
        { id: "sse", label: "SSE vs Polling", icon: Zap, color: "text-yellow-400", bg: "bg-yellow-400/10" },
        { id: "encrypt", label: "Cryptography", icon: Lock, color: "text-rose-500", bg: "bg-rose-500/10" },
        { id: "kafka", label: "Event Streams", icon: Layers, color: "text-emerald-400", bg: "bg-emerald-400/10" },
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
        trace: "In a Microservice architecture, a single user click might spider out to hit 10 different APIs simultaneously. Datadog/Jaeger-style Distributed Tracing attaches a 'Trace ID' to the request, graphing an exact bottleneck waterfall chart of network latency.",
        saga: "The Saga Pattern manages distributed transactions across multiple microservices. If one service fails in a multi-step workflow (like a payment failure during checkout), compensating transactions are triggered backwards to roll back the previous steps.",
        vector: "Vector Search replaces exact keyword matching by converting text ('dog') into mathematical coordinates (embeddings). When searching, it uses geometry (like K-Nearest Neighbors) to find semantically similar concepts (like 'puppy' or 'pet').",
        serverless: "Serverless functions automatically scale down to 0 instances when idle to save money. Consequently, the first request sent to a sleeping function incurs a 1-3 second 'Cold Start' latency penalty while the cloud provider provisions a new environment.",
        sharding: "Split massive datasets across multiple servers (shards) so no single database node forms a bottleneck. Data is partitioned based on a 'Shard Key' like User ID or Region.",
        mesh: "A dedicated infrastructure layer that handles secure service-to-service communication, making encryption (mTLS) and retries invisible to the application code.",
        cdc: "Rather than polling the database for changes (which is slow and resource-heavy), CDC listens to the database's internal transaction log (WAL) and instantly streams every row-level change to downstream systems like Search Indexes or Data Warehouses.",
        bloom: "A memory-efficient probabilistic data structure used to test if an element is a member of a set. It can definitively tell you 'No', but can only say 'Probably Yes' (false positives are possible, false negatives are not).",
        bluegreen: "A release pattern that reduces downtime and risk by running two identical production environments. Traffic is gradually shifted to the new environment, allowing for instant zero-downtime rollbacks if issues occur.",
        gateway: "An API Gateway is a central entry point for all client requests. It handles cross-cutting concerns like Auth, Rate Limiting, and WAF at the edge, routes requests to internal microservices, and aggregates responses.",
        cdn: "A Content Delivery Network (CDN) copies static assets directly to servers geographically closest to the user (Edge Nodes). This prevents overseas users from suffering massive cross-ocean latency on every request.",
        oauth: "The industry-standard protocol for authorization (Auth Code Flow). It allows a Third-Party Application to obtain limited access to a user's account on an HTTP service without the user exposing their password.",
        snowflake: "In distributed systems, standard auto-incrementing database IDs limit scalability. Snowflake generates unique, roughly-sortable 64-bit IDs independently across thousands of machines without centralized DB coordination.",
        leader: "In distributed databases, nodes must agree on who handles writes using consensus algorithms. Raft uses a randomized 'Election Timeout' and voting. If a Follower stops hearing heartbeats, it becomes a Candidate and requests votes to become Leader.",
        gossip: "Masterless distributed databases (like Cassandra) don't have a central leader. Instead, nodes randomly select a peer every second to 'gossip' with, trading state updates. Like a viral infection, data synchronizes exponentially fast.",
        twopc: "A distributed algorithm that ensures all nodes in a cluster commit a transaction... or none do. It prevents partial writes, ensuring ACID properties. Unlike the Saga Pattern which compensates after failures, 2PC locks everything first.",
        merkle: "How do databases quickly check if millions of rows are out of sync without comparing raw gigabytes of data? They build a tree of Hashes. If a single row changes at the bottom, the single 'Root Hash' at the top changes instantly.",
        geohash: "How do Uber or Tinder find people near you without calculating the math distance between every single user? They chop the world map into a grid, assigning a short string to each square for ultra-fast spatial indexing.",
        mapreduce: "How do you process 50 Terabytes of text? You can't fit it on one machine. MapReduce splits the data, maps (transforms) chunks in parallel across hundreds of workers, shuffles identical keys, and reduces them into a final answer.",
        btree: "If you don't use an Index, searching for a row requires a Full Table Scan (checking every single row). An Index builds a balanced B-Tree structure in memory, allowing logarithmic O(log n) lookups.",
        dns: "What happens when you type google.com into your browser? Computers only understand IP addresses. The Domain Name System (DNS) is the phonebook of the internet, recursively querying servers across the globe to find an address.",
        sse: "Polling wastes CPU/Bandwidth. Long Polling holds connections open but still requires reconnection. SSE (Server-Sent Events) keeps a single persistent HTTP connection open, allowing the server to push data downward anytime.",
        encrypt: "Symmetric encryption uses the same key to lock and unlock data. Asymmetric encryption uses a mathematically linked Public/Private key pair. Anyone can lock data with the Public Key, but only the Private Key can unlock it.",
        kafka: "Unlike traditional databases that overwrite state, Kafka is an Append-Only Log. Producers blindly dump events onto the end of the log. Independent Consumers read the log at their own pace, tracking their own 'Offset'.",
    };

    return (
        <section id="playground" className="py-12 flex justify-center w-full px-6 relative z-10 w-full overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-200/10 dark:bg-blue-900/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

            <div className="max-w-6xl mx-auto w-full">
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
                    <p className="text-neutral-800 dark:text-neutral-200 max-w-xl mx-auto text-lg font-medium leading-relaxed">
                        Explore core backend concepts visually. Select a mechanism from the menu to test concepts like rate limiting, load balancing, caching, and more.
                    </p>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-4 xl:gap-8 items-start justify-center">
                    {/* Sidebar Tabs */}
                    <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24 z-20">
                        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:max-h-[75vh] pb-4 lg:pb-0 lg:pr-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 cursor-pointer whitespace-nowrap lg:whitespace-normal text-left w-full ${isActive
                                            ? `bg-white dark:bg-neutral-800 shadow-sm ${tab.color} border border-neutral-200/50 dark:border-neutral-700/50`
                                            : "bg-transparent text-neutral-500 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-neutral-300 border border-transparent"
                                            }`}
                                    >
                                        <div className={`p-1.5 rounded-lg shrink-0 ${isActive ? tab.bg : "bg-neutral-100 dark:bg-neutral-800"}`}>
                                            <Icon size={16} className={isActive ? "" : "opacity-70"} />
                                        </div>
                                        <span className="text-[13px] leading-tight">{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <div className="flex-1 min-w-0 w-full">
                        {/* Demo Descriptions */}
                        <div className="mb-8 w-full">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    transition={{ duration: 0.2 }}
                                    className="bg-neutral-50/80 dark:bg-neutral-900/40 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl p-6 flex gap-4 items-start shadow-sm"
                                >
                                    <Info size={22} className="text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" />
                                    <p className="text-[15px] font-medium text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                        {DESCRIPTIONS[activeTab]}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Demo Container */}
                        <div className="relative min-h-[500px] w-full">
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
                                {activeTab === "saga" && (
                                    <motion.div
                                        key="saga"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <SagaPatternDemo />
                                    </motion.div>
                                )}
                                {activeTab === "vector" && (
                                    <motion.div
                                        key="vector"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <VectorSearchDemo />
                                    </motion.div>
                                )}
                                {activeTab === "serverless" && (
                                    <motion.div
                                        key="serverless"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ServerlessColdStartDemo />
                                    </motion.div>
                                )}
                                {activeTab === "sharding" && (
                                    <motion.div
                                        key="sharding"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ShardingDemo />
                                    </motion.div>
                                )}
                                {activeTab === "mesh" && (
                                    <motion.div
                                        key="mesh"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ServiceMeshDemo />
                                    </motion.div>
                                )}
                                {activeTab === "cdc" && (
                                    <motion.div
                                        key="cdc"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <CdcDemo />
                                    </motion.div>
                                )}
                                {activeTab === "bloom" && (
                                    <motion.div
                                        key="bloom"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <BloomFilterDemo />
                                    </motion.div>
                                )}
                                {activeTab === "bluegreen" && (
                                    <motion.div
                                        key="bluegreen"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <BlueGreenDeployDemo />
                                    </motion.div>
                                )}
                                {activeTab === "gateway" && (
                                    <motion.div key="gateway" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}><ApiGatewayDemo /></motion.div>
                                )}
                                {activeTab === "cdn" && (
                                    <motion.div key="cdn" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}><CdnDemo /></motion.div>
                                )}
                                {activeTab === "oauth" && (
                                    <motion.div key="oauth" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}><OAuthDemo /></motion.div>
                                )}
                                {activeTab === "snowflake" && (
                                    <motion.div key="snowflake" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}><SnowflakeIdDemo /></motion.div>
                                )}
                                {activeTab === "leader" && (
                                    <motion.div key="leader" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}><LeaderElectionDemo /></motion.div>
                                )}
                                {activeTab === "gossip" && (
                                    <motion.div key="gossip" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}><GossipProtocolDemo /></motion.div>
                                )}
                                {activeTab === "twopc" && (
                                    <motion.div key="twopc" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}><TwoPhaseCommitDemo /></motion.div>
                                )}
                                {activeTab === "merkle" && (
                                    <motion.div key="merkle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}><MerkleTreeDemo /></motion.div>
                                )}
                                {activeTab === "geohash" && (
                                    <motion.div key="geohash" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}><GeohashingDemo /></motion.div>
                                )}
                                {activeTab === "mapreduce" && (
                                    <motion.div key="mapreduce" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}><MapReduceDemo /></motion.div>
                                )}
                                {activeTab === "btree" && (
                                    <motion.div key="btree" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}><DatabaseIndexingDemo /></motion.div>
                                )}
                                {activeTab === "dns" && (
                                    <motion.div key="dns" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}><DnsResolutionDemo /></motion.div>
                                )}
                                {activeTab === "sse" && (
                                    <motion.div key="sse" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}><SseDemo /></motion.div>
                                )}
                                {activeTab === "encrypt" && (
                                    <motion.div key="encrypt" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}><EncryptionDemo /></motion.div>
                                )}
                                {activeTab === "kafka" && (
                                    <motion.div key="kafka" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}><KafkaStreamsDemo /></motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
