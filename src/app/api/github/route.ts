import { NextResponse } from "next/server";

export async function GET() {
    try {
        // We use GitHub's public events API to get the latest push event.
        // It does not require authentication for public data, but rate limits apply.
        // Using fetch with Next.js revalidate option caches the response.
        const res = await fetch("https://api.github.com/users/Singh-OmDev/events/public", {
            next: { revalidate: 60 }, // Cache for 60 seconds
            headers: {
                "Accept": "application/vnd.github.v3+json",
                // Add a dummy user agent as GitHub API requires it
                "User-Agent": "Portfolio-Live-Widget"
            }
        });

        if (!res.ok) {
            throw new Error(`GitHub API responded with ${res.status}`);
        }

        const data = await res.json();

        // Find the most recent PushEvent
        const pushEvent = data.find((event: any) => event.type === "PushEvent");

        if (!pushEvent) {
            return NextResponse.json({ error: "No recent pushes found." }, { status: 404 });
        }

        const repoName = pushEvent.repo.name.replace("Singh-OmDev/", "");
        const commitMsg = pushEvent.payload.commits[0]?.message || "Made a commit";
        const createdAt = pushEvent.created_at;

        return NextResponse.json({
            repo: repoName,
            message: commitMsg,
            createdAt: createdAt,
            url: `https://github.com/${pushEvent.repo.name}`
        });

    } catch (error) {
        console.error("Error fetching GitHub events:", error);
        return NextResponse.json({ error: "Failed to fetch GitHub data" }, { status: 500 });
    }
}
