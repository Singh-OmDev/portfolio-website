import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const namespace = "minimal-portfolio-omsingh";
    const key = "visits";

    const apiUrl = action === "up"
        ? `https://abacus.jasoncameron.dev/hit/${namespace}/${key}`
        : `https://abacus.jasoncameron.dev/get/${namespace}/${key}`;

    try {
        const res = await fetch(apiUrl);
        if (!res.ok) {
            throw new Error(`Upstream API failed: ${res.status}`);
        }
        const data = await res.json();
        return NextResponse.json({ count: data.value || 0 });
    } catch (error) {
        console.error("Error in visitor proxy:", error);
        return NextResponse.json({ count: 0, error: "Failed to fetch count" }, { status: 500 });
    }
}
