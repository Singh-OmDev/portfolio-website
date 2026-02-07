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
      ],
      link: "https://ai-study-buddy-inky.vercel.app/",
      github:
        "https://github.com/Singh-OmDev/AI-Study-Buddy?tab=readme-ov-file",
      image: "/project.png",
    },
    {
      title: "AI Government Scheme Advisor",
      description:
        "An AI-powered platform that helps Indian citizens discover relevant government welfare schemes by analyzing user profiles and explaining eligibility, documents, and application steps in simple language.",
      tech: [
        "Node.js",
        "Express.js",
        "MongoDB",
        "Groq API",
        "Clerk",
        "React.js",
        "Tailwind CSS",
        "Framer Motion",
      ],
      link: "https://ai-government-scheme-advisor.vercel.app/",
      github: "https://github.com/Singh-OmDev/AI-Government-Scheme-Advisor",
      image: "/project2.png",
    },
    {
      title: "WorkQueue",
      description:
        "A distributed background job processing system powered by Redis, enabling reliable asynchronous task execution at scale.",
      tech: ["Go", "Redis", "REST APIs"],
      link: "#",
      github: "#",
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "ClipX",
      description:
        "A minimal platform for downloading and clipping X (Twitter) videos, optimized for speed and simplicity.",
      tech: ["Next.js", "React", "REST APIs"],
      link: "#",
      github: "#",
      image:
        "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80",
    },
  ],
};
