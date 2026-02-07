# Portfolio Website

A minimalist, high-performance developer portfolio built with **Next.js 16**, **Tailwind CSS v4**, and **Framer Motion**. Features real-time music tracking via Last.fm, dynamic dark mode, and smooth page transitions.

## 🚀 Features

-   **Minimalist Design**: Clean, typography-focused UI inspired by modern aesthetics.
-   **Dark/Light Mode**: Fully responsive theme toggling with system preference detection.
-   **Real-time Music**: "Now Playing" widget integrated with Last.fm API.
-   **Dynamic Projects**: Detailed project pages with deep linking and rich metadata.
-   **Animations**: Smooth entry/exit animations using Framer Motion.
-   **Interactive Elements**: "Oneko" mascot, visitor counter, and interactive skills pills.
-   **Contact Form**: Functional contact form powered by EmailJS.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
-   **Animation**: [Framer Motion](https://www.framer.com/motion/)
-   **Data Fetching**: [SWR](https://swr.vercel.app/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Deployment**: [Vercel](https://vercel.com/)

## 📦 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Singh-OmDev/portfolio-website.git
cd portfolio-website
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory and add your keys:

```bash
# Last.fm Configuration
LASTFM_API_KEY=your_lastfm_api_key
LASTFM_USERNAME=your_lastfm_username

# (Optional) EmailJS Keys are currently hardcoded in src/components/Contact.tsx
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🚀 Deployment (Vercel)

The easiest way to deploy is using [Vercel](https://vercel.com).

1.  Push your code to concise GitHub repository.
2.  Import the project into Vercel.
3.  Add the **Environment Variables** (`LASTFM_API_KEY`, `LASTFM_USERNAME`) in the Vercel dashboard.
4.  **Note:** Ensure your **Project Name** uses underscores (e.g., `portfolio_website`) if you encounter naming errors.
5.  Click **Deploy**.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
