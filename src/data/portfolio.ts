export const portfolioData = {
    profile: {
        name: "Om Singh",
        role: "Backend Engineer",

        tagline:
            "Backend-focused engineer building scalable systems, high-performance APIs, and production-ready applications.",

        bio: `I’m a backend-focused developer with a strong foundation in computer science and a deep interest in building scalable, reliable systems. I primarily work within the JavaScript and TypeScript ecosystem, designing APIs, structuring databases, and developing backend services that are efficient, maintainable, and production-ready.

I enjoy solving complex engineering problems, whether it’s optimizing performance, designing authentication flows, or implementing caching strategies. Through my projects, I focus on writing clean, modular code and building systems that handle real-world usage rather than just academic scenarios.

Recently, I’ve been investing time in system design and distributed architecture to better understand how large-scale applications operate. My focus is on continuously improving my engineering depth while shipping software that delivers practical value.

I build impactful systems, embrace challenging problems, and maintain a high standard for the software I create.`,

        avatar: "/profile.jpg",
    },

    socials: {
        github: "https://github.com/Singh-OmDev",
        linkedin: "https://linkedin.com/in/yourusername",
        twitter: "https://twitter.com/omsingh8400",
        email: "mailto:omsingh8400@gmail.com",
        website: "https://yourportfolio.com", // fix later
        resume: "/resume.pdf",
        medium: "https://medium.com/@omsingh8400",
    },

    skills: [
        {
            category: "Backend Engineering",
            items: [
                "Node.js",
                "Express.js",
                "REST APIs",
                "Redis",
                "API Design",
                "Authentication (JWT, Cookies)",
            ],
        },
        {
            category: "Databases",
            items: ["MongoDB", "MySQL", "Prisma ORM"],
        },
        {
            category: "DevOps & Cloud",
            items: ["Docker", "AWS (Basics)", "Vercel", "Git", "Postman"],
        },
        {
            category: "Frontend (Working Knowledge)",
            items: ["React.js", "Next.js", "Redux Toolkit", "Tailwind CSS"],
        },
        {
            category: "Languages",
            items: ["TypeScript", "JavaScript", "Java", "C++"],
        },
    ],

    experience: [
        {
            company: "Panipat Institute of Engineering and Technology",
            role: "B.Tech in Computer Science Engineering",
            period: "2023 — 2027",
            description:
                "Building a strong foundation in algorithms, data structures, and software engineering principles through a comprehensive computer science curriculum.",
            logo:
                "https://ui-avatars.com/api/?name=PIET&background=fff&color=000&rounded=true",
        },
    ],

    projects: [
        {
            id: "study-buddy",
            title: "Study Buddy",
            description:
                "A full-stack AI-powered study assistant that improves learning retention through smart scheduling, personalized AI feedback, and immersive focus tools.",
            tech: [
                "React.js (Vite)",
                "Tailwind CSS",
                "Framer Motion",
                "Node.js",
                "Express.js",
                "MongoDB",
                "OpenAI SDK",
                "Clerk",
                "Recharts",
            ],
            link: "https://ai-study-buddy-inky.vercel.app/",
            github:
                "https://github.com/Singh-OmDev/AI-Study-Buddy?tab=readme-ov-file",
            image: "/project.png",
            role: "Full Stack Developer",
            timeline: "2025",
            team: "Solo",
            status: "Completed",
            overview: "Study Buddy is a full-stack, AI-powered study assistant designed to optimize learning retention through smart scheduling, personalized AI feedback, and immersive focus tools. It solves the problem of fragmented study workflows by integrating task management, focus timers, and AI tutoring into a single cohesive platform.",
            features: [
                "**AI Study Chat (RAG)**: Context-aware chat that helps you answer questions based on your study history and notes.",
                "**Smart Quiz Generator**: Automatically creates revision questions to test your knowledge.",
                "**Visual Calendar**: Interactive contribution graph to track study consistency.",
                "**Confidence-Based Revision**: Uses Spaced Repetition logic to suggest optimal revision times.",
                "**Zen Mode**: Minimalist full-screen clock with ambient backgrounds for flow state.",
                "**Pro Dashboard**: Data-rich 'Bento Grid' style dashboard for tracking progress at a glance."
            ],
            challenges: "Implementing **Context-Aware RAG (Retrieval-Augmented Generation)** for the AI chat was the biggest technical hurdle. I had to efficiently chunk and index user notes to ensure the AI provided relevant answers without hallucinating.",
            learnings: [
                "Mastered **RAG architectures** for personalized AI experiences.",
                "Deepened knowledge of **Spaced Repetition Algorithms** for educational tech.",
                "Built complex data visualizations using **Recharts**.",
                "Implemented secure authentication flows with **Clerk**."
            ],
            future: [
                "Mobile App using React Native.",
                "Group study rooms with real-time whiteboard.",
                "Integration with Canvas/Blackboard LMS."
            ]
        },
        {
            id: "ai-government-scheme-advisor",
            title: "AI Government Scheme Advisor",
            description:
                "An AI-powered platform that helps Indian citizens discover relevant government welfare schemes by analyzing user profiles and explaining eligibility, documents, and application steps in simple language.",
            tech: [
                "React.js (Vite)",
                "Tailwind CSS",
                "Framer Motion",
                "Node.js",
                "Express.js",
                "MongoDB",
                "Groq API (Llama 3.3)",
                "Clerk",
            ],
            link: "https://ai-government-scheme-advisor.vercel.app/",
            github: "https://github.com/Singh-OmDev/AI-Government-Scheme-Advisor",
            image: "/project2.png",
            role: "Lead Developer",
            timeline: "2024",
            team: "Hackathon Team",
            status: "Prototype",
            overview: "AI Government Scheme Advisor is a comprehensive web application designed to bridge the gap between Indian citizens and government welfare schemes. Using advanced AI (Llama 3.3 via Groq), it analyzes user profiles to discover relevant Central and State government schemes, explaining eligibility criteria, required documents, and application processes in simple, easy-to-understand language.",
            features: [
                "**AI-Powered Recommendations**: Utilizes Llama 3.3 (via Groq) to analyze user data and suggest highly relevant schemes.",
                "**Multi-Language Support**: Provides scheme details in both English and Hindi.",
                "**Interactive AI Chat**: Users can ask specific questions about any scheme and get instant, context-aware answers.",
                "**Secure Authentication**: Integrated with Clerk for secure and seamless user sign-up and login.",
                "**Saved Schemes**: Users can bookmark schemes to their profile for easy access later.",
                "**Smart Search**: Search functionality to find schemes by keywords."
            ],
            challenges: "The biggest hurdle was the latency of standard LLMs. We switched to **Groq's LPU inference engine**, which accelerated our response times by 10x, making the chat experience feel instantaneous. Handling multi-language support (English/Hindi) dynamically for complex government terminology was also a key challenge.",
            learnings: [
                "First-hand experience with **Groq and Llama 3** for high-speed inference.",
                "Learned to structure **unstructured government data** into a queryable format.",
                "Importance of **Accessibility (a11y)** in government-facing tech."
            ],
            future: [
                "Voice-first interface for rural users.",
                "Direct integration with government API Setu.",
                "WhatsApp bot version for wider reach."
            ]
        },
        {
            id: "workqueue",
            title: "WorkQueue",
            description:
                "A distributed background job processing system powered by Redis, enabling reliable asynchronous task execution at scale.",
            tech: ["Go", "Redis", "REST APIs"],
            link: "#",
            github: "#",
            image:
                "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
            role: "Backend Engineer",
            timeline: "2023",
            team: "Solo",
            status: "In Progress",
            overview: "WorkQueue is a lightweight alternative to systems like BullMQ or Sidekiq, written in Go. It allows applications to offload heavy tasks (image processing, email sending) to background workers, ensuring the main API remains responsive.",
            features: [
                "**Reliable Queuing**: Uses Redis lists for atomic push/pop operations.",
                "**Retry Mechanism**: Exponential backoff strategies for failed jobs.",
                "**Worker Pools**: Concurrency control to prevent system overload.",
                "**Dashboard**: Simple UI to monitor queue depth and job status."
            ],
            challenges: "Handling **race conditions** when multiple workers try to claim the same job was tricky. I implemented Lua scripts in Redis to ensure atomicity of the 'claim' operation.",
            learnings: [
                "Mastered **Go concurrency patterns** (Goroutines, Channels).",
                "Deep dive into **Redis data structures** beyond simple Key-Value.",
                "Understanding of **Distributed System guarantees** (At-least-once delivery)."
            ],
            future: [
                "Support for priority queues.",
                "Scheduled/Cron jobs.",
                "gRPC interface for lower latency."
            ]
        },
        {
            id: "clipx",
            title: "ClipX",
            description:
                "A minimal platform for downloading and clipping X (Twitter) videos, optimized for speed and simplicity.",
            tech: ["Next.js", "React", "REST APIs"],
            link: "#",
            github: "#",
            image:
                "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80",
            role: "Frontend Engineer",
            timeline: "2023",
            team: "Solo",
            status: "Completed",
            overview: "ClipX was born out of frustration with ad-heavy, slow video downloaders. It uses a reverse-engineered internal API to fetch video variants and provides a clean, one-click interface to download them without watermarks.",
            features: [
                "**Instant Fetch**: Resolves video URLs in under 200ms.",
                "**Quality Selection**: Choose between 1080p, 720p, or mobile-optimized versions.",
                "**PWA Support**: Installable as a native-like app on mobile.",
                "**No Ads**: Strictly utility-focused design."
            ],
            challenges: "Twitter/X frequently changes their DOM structure and API signatures. Maintaining the scraper required setting up **automated integration tests** that run daily to detect breakage early.",
            learnings: [
                "Reverse engineering **private APIs** and network traffic analysis.",
                "Building **PWAs (Progressive Web Apps)** with Next.js.",
                "Handling binary data blobs in the browser."
            ],
            future: [
                "Support for Instagram Reels and TikTok.",
                "Server-side caching for popular videos.",
                "Browser extension for quick access."
            ]
        },
    ],
};
