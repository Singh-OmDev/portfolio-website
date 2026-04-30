export const portfolioData = {
    profile: {
        name: "Om Singh",
        role: "Backend Engineer",

        tagline:
            "Backend-focused engineering student building scalable systems and high-performance APIs, with a strong interest in system design and production-grade backend development.",

        bio: `I bridge the gap between complex CS theory and **production-grade software**. As a Backend Engineer, I am passionate about creating **modular services** that are easy to test, scale, and evolve.
 
 I thrive in the **MERN stack**, constantly refining my skills in **API Design** and database optimization. My goal is to build impactful digital products that solve real problems, maintaining a high standard for **code quality** and system integrity in every project I touch.`,

        avatar: "/profile.gif",
    },

    socials: {
        github: "https://github.com/Singh-OmDev",
        linkedin: "https://linkedin.com/in/yourusername",
        twitter: "https://twitter.com/omsingh8400",
        email: "mailto:omsingh8400@gmail.com",
        website: "https://yourportfolio.com", // fix later
        resume: "/resume.pdf?v=3",
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
            items: ["Docker", "AWS", "Vercel", "Git", "Postman"],
        },
        {
            category: "Frontend",
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
            audio: "/Study_Buddy_Anthem.mp3",
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
            audio: "/Scheme_Dreams.mp3",
            link: "https://ai-government-scheme-advisor.vercel.app/",
            github: "https://github.com/Singh-OmDev/AI-Government-Scheme-Advisor",
            image: "/project2.png",
            role: "Lead Developer",
            timeline: "2024",
            team: "Hackathon Team",
            status: "Completed",
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
            id: "dev-companion",
            title: "Dev Companion Platform (DevOS)",
            description: "A centralized, AI-powered command center for developers integrating standup generation, repository visualization, and daily task tracking.",
            tech: [
                "React 19",
                "Node.js",
                "Express",
                "MongoDB",
                "Tailwind CSS",
                "Clerk Auth",
                "React Flow",
                "Groq AI",
                "Google Generative AI"
            ],
            link: "#",
            github: "#", // Add your repo link here
            image: "/devos.png", // Ensure the uploaded photo is saved as devos.png in the public folder
            role: "Full-Stack Developer",
            timeline: "2026",
            team: "Solo",
            status: "Building",
            overview: "Dev Companion Platform (DevOS) was built to solve developer tool fragmentation by providing a single, unified dashboard. It actively tracks Leetcode progress, interfaces with GitHub for real-time statistics, maps out repository architectures visually, and leverages LLMs to generate daily technical standup reports and missions.",
            features: [
                "AI-Powered Automation: Generates daily technical standups and missions using Groq and Google Generative AI.",
                "Interactive Architecture Maps: Uses React Flow to visually document and explore complex Node/React repository structures.",
                "Centralized Developer Dashboard: Real-time tracking of GitHub activity, LeetCode progress, and personal goals.",
                "Secure Identity Management: Implements robust authentication via Clerk and GitHub OAuth.",
                "Modern, Responsive UI: Constructed with React 19, styled natively with Tailwind CSS, and animated via Framer Motion."
            ],
            challenges: "Managing complex, modular global state across varied dashboard widgets without performance degradation. Additionally, orchestrating multiple asynchronous data streams from third-party APIs (GitHub, Clerk, AI SDKs) while ensuring the React Flow architectural visualizations rendered smoothly on large codebases.",
            learnings: [
                "Mastered global state management and modular architecture using Zustand in React 19.",
                "Gained deep experience in constructing interactive, node-based visual interfaces with React Flow.",
                "Learned to effectively orchestrate multi-model AI workflows for developer productivity (Groq/Gemini).",
                "Strengthened full-stack OAuth implementation and JWT session handling securely within a MERN environment."
            ],
            future: [
                "Real-time collaborative diagramming for team architecture reviews.",
                "Direct integration with Jira/Linear for bi-directional task synchronization.",
                "Developing a VS Code extension for seamless, side-by-side companion access."
            ]
        },
        {
            id: "mini-rest-countries-explorer",
            title: "Mini REST Countries Explorer",
            description:
                "A cool, interactive web application that lets you explore country data using the new React Router V7 framework.",
            tech: [
                "React",
                "React Router V7",
                "TypeScript",
                "Tailwind CSS",
                "Vite",
                "REST APIs"
            ],
            link: "https://react-router-v7-countries-app-seven.vercel.app",
            github: "https://github.com/Singh-OmDev/-React-Router-V7-Countries-App",
            image: "/countries-app.png",
            role: "Frontend Developer",
            timeline: "2024",
            team: "Solo",
            status: "Completed",
            overview:
                "Mini REST Countries Explorer is an interactive web application that leverages the new React Router V7 framework to fetch and display country data from the REST Countries API. It allows users to dynamically search, filter, and view detailed information about countries, including their names, capitals, regions, populations, and flags.",
            features: [
                "**Dynamic Routing**: Leverages React Router V7 for handling multiple routes and dynamic URL parameters.",
                "**Data Fetching**: Uses modern route loaders to retrieve real-time country data from the REST API.",
                "**Search & Filter**: Users can instantly search for countries by name and filter them by region.",
                "**Responsive UI**: Fully styled with Tailwind CSS to create a modern, performant, and responsive interface."
            ],
            challenges:
                "Migrating and adapting data loading patterns to the newly released React Router V7 data APIs required careful architectural planning to ensure optimal performance and user experience.",
            learnings: [
                "Mastered **React Router V7** core concepts including nested routing and data loaders.",
                "Improved proficiency in **TypeScript** for robust component property definitions.",
                "Gained experience managing external API rate limits and rendering logic for large datasets."
            ],
            future: [
                "Add a dark mode toggle.",
                "Implement a detailed border-countries navigation feature.",
                "Add interactive maps for each country."
            ]
        },
    ],
};
