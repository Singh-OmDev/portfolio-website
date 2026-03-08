# Minimal Portfolio website

  live -> https://portfoliowebsite-alpha-six.vercel.app/

<img width="1887" height="861" alt="image" src="https://github.com/user-attachments/assets/2ede6b19-7642-470e-bcf4-8678ab505bc3" />


A modern, fast, and interactive portfolio website built for showcasing projects, skills, and interactive backend architecture demonstrations.

## 🚀 Tech Stack

This project is built using modern web development tools:

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Library**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: Designed to be easily deployed on [Vercel](https://vercel.com/)

## ✨ Key Features

- **Interactive Playground**: Features a dedicated `/playground` route with dozens of interactive, visual demonstrations of complex backend and system design concepts (e.g., Load Balancers, Distributed Caching, Message Queues, etc.).
- **Server and Client Components**: Strategically uses Next.js `use client` directives for interactive widget animations while keeping the rest of the site blazing fast with Server-Side Rendering (SSR).
- **Responsive Design**: Fully responsive, mobile-first design leveraging Tailwind CSS.
- **Dark Mode Support**: Built-in support for light and dark themes.

## 🛠️ Getting Started

To run this project locally on your machine, follow these steps:

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone <your-github-repo-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd portfolio-website
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```
   *(or `yarn install` / `pnpm install` depending on your package manager)*

### Running the Development Server

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗️ Building for Production

To create an optimized production build, run:

```bash
npm run build
```

Then, to start the production server:

```bash
npm run start
```

## 📂 Project Structure

- `src/app/`: Contains the Next.js App Router pages (Home, Projects, Playground, Layouts).
- `src/components/`: Contains all reusable UI components and the interactive playground widgets.

## 📜 License

This project is open-source and available under the MIT License.
