export const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export async function initiateScan(repoUrl: string) {
    const res = await fetch(`${API_URL}/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo_url: repoUrl }),
    });
    
    if (!res.ok) {
        throw new Error("Failed to initiate scan");
    }
    
    return res.json();
}
