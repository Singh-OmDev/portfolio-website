export const portfolioData = {
    profile: {
        name: "Om Singh",
        role: "Backend Software Engineer",

        tagline:
            "Backend-focused engineer building scalable systems, high-performance APIs, and production-ready applications.",

        bio:
            "I’m a backend-focused developer with a strong foundation in computer science and a passion for building scalable, reliable web applications. I specialize in the JavaScript and TypeScript ecosystem, designing high-performance APIs, efficient database architectures, and maintainable backend services.\n\nI enjoy tackling complex engineering challenges — from authentication design to caching strategies and performance optimization. Recently, I’ve been deepening my knowledge of system design and distributed architectures to build software that scales with real-world demand.\n\nMy goal is to grow into a high-impact engineer by consistently shipping production-ready systems and solving meaningful technical problems.",

        avatar: "/profile.jpg",
    },

    socials: {
        github: "https://github.com/yourusername",
        linkedin: "https://linkedin.com/in/yourusername",
        twitter: "https://twitter.com/yourusername",
        email: "mailto:youremail@gmail.com",
        website: "https://yourportfolio.com",
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
                "Authentication (JWT, Cookies)"
            ]
        },
        {
            category: "Databases",
            items: [
                "MongoDB",
                "MySQL",
                "Prisma ORM"
            ]
        },
        {
            category: "DevOps & Cloud",
            items: [
                "Docker",
                "AWS (Basics)",
                "Vercel",
                "Git",
                "Postman"
            ]
        },
        {
            category: "Frontend (Working Knowledge)",
            items: [
                "React.js",
                "Next.js",
                "Redux Toolkit",
                "Tailwind CSS"
            ]
        },
        {
            category: "Languages",
            items: [
                "TypeScript",
                "JavaScript",
                "Java",
                "C++"
            ]
        }
    ],


    experience: [
        {
            company: "Panipat Institute of Engineering and Technology",
            role: "B.Tech in Computer Science Engineering",
            period: "2023 — 2027",
            description:
                "Pursuing a comprehensive curriculum in Computer Science, building a strong foundation in algorithms, data structures, and software engineering principles.",
            logo: "https://ui-avatars.com/api/?name=PIET&background=fff&color=000&rounded=true",
        },
    ],

    projects: [
        {
            title: "DisasterNet",
            description:
                "A peer-to-peer emergency communication platform designed to function without internet connectivity, enabling resilient communication during network outages.",
            tech: ["Go", "libp2p", "mDNS", "React", "REST APIs"],
            link: "#",
            github: "#",
            image:
                "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
        },
        {
            title: "Noginx",
            description:
                "Real-time NGINX anomaly detection system leveraging machine learning to identify traffic irregularities and trigger automated alerts.",
            tech: ["Python", "FastAPI", "NGINX", "Isolation Forest"],
            link: "#",
            github: "#",
            image:
                "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
        },
        {
            title: "WorkQueue",
            description:
                "Distributed background job processing system powered by Redis, enabling reliable asynchronous task execution at scale.",
            tech: ["Go", "Redis", "REST APIs"],
            link: "#",
            github: "#",
            image:
                "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
        },
        {
            title: "ClipX",
            description:
                "Minimal platform for downloading and clipping X (Twitter) videos, optimized for speed and simplicity.",
            tech: ["Next.js", "React", "REST APIs"],
            link: "#",
            github: "#",
            image:
                "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80",
        },
    ],
};
