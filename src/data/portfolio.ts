export const portfolioData = {
    profile: {
        name: "Om Singh",
        role: "Backend-Focused Software Engineer",
        tagline:
            "I build scalable web applications, design efficient APIs, and turn complex problems into reliable software.",

        bio: `I’m a backend-focused developer with a strong foundation in computer science and a passion for building scalable web applications. I specialize in the JavaScript and TypeScript ecosystem, developing systems with Node.js, modern frontend frameworks, and efficient database design.

I enjoy working on products that require thoughtful architecture — from authentication flows and API design to caching and performance optimization. Recently, I’ve been deepening my understanding of system design and distributed systems to build software that is both reliable and scalable.

Beyond writing code, I care deeply about simplicity, maintainability, and creating technology that delivers real value. I’m continuously pushing myself to grow as an engineer and take on more complex technical challenges.`,
    
        avatar: "/om.webp",
    },

    socials: {
        github: "https://github.com/Singh-OmDev",
        twitter: "https://twitter.com/", // optional
        linkedin: "https://linkedin.com/in/YOUR-ID",
        email: "mailto:yourmail@gmail.com",
        website: "", // remove if not needed
    },

    // ⭐ ORDERED FOR RECRUITER PSYCHOLOGY
    skills: [
        // Backend (core identity)
        "Node.js",
        "Express.js",
        "TypeScript",
        "REST APIs",
        "Redis",
        "MongoDB",
        "MySQL",

        // Frontend
        "React",
        "Next.js",
        "Tailwind CSS",
        "Redux Toolkit",

        // Tools
        "Docker",
        "Git",
        "Postman",

        // Languages (keep last)
        "JavaScript",
        "Java"
    ],

    experience: [
        {
            company: "Xlancr",
            role: "Software Engineer",
            period: "Aug 2024 — Mar 2025",
            description:
                "Developed scalable backend services and REST APIs, improving system reliability and performance while collaborating in an agile environment.",
            logo: "https://ui-avatars.com/api/?name=X&background=fff&color=000&rounded=true",
        },
        {
            company: "RoverX",
            role: "Software & Autonomous Systems Engineer",
            period: "Mar 2023 — Feb 2024",
            description:
                "Worked on autonomous system modules and contributed to path-planning logic, focusing on performance and real-time decision workflows.",
            logo: "https://ui-avatars.com/api/?name=RX&background=000&color=fff&rounded=true",
        },
    ],

    projects: [
        {
            title: "DisasterNet",
            description:
                "A peer-to-peer emergency communication platform that works without internet connectivity, enabling resilient communication during network outages.",
            tech: ["Go", "libp2p", "mDNS", "React", "REST APIs"],
            link: "#",
            github: "#",
            image:
                "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
        },
        {
            title: "Noginx",
            description:
                "Real-time NGINX anomaly detection system leveraging machine learning to identify traffic irregularities and trigger alerts.",
            tech: ["Python", "FastAPI", "NGINX", "Isolation Forest"],
            link: "#",
            github: "#",
            image:
                "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
        },
        {
            title: "WorkQueue",
            description:
                "A distributed background job processing system powered by Redis for reliable task execution at scale.",
            tech: ["Go", "Redis", "REST APIs"],
            link: "#",
            github: "#",
            image:
                "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
        },
        {
            title: "ClipX",
            description:
                "One-click platform to download and clip X (Twitter) videos with a fast and minimal user experience.",
            tech: ["Next.js", "React", "REST APIs"],
            link: "#",
            github: "#",
            image:
                "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80",
        },
    ],
};
