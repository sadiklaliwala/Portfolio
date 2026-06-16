import { NextResponse } from "next/server";
import { execSync } from "child_process";

const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "sadiklaliwala";
const REPO_NAME = "Portfolio";

export async function GET() {
  // 1. Try to fetch from local git history (fast local dev)
  try {
    const gitLog = execSync(
      'git log -n 12 --pretty=format:"%h|%s|%ad|%an|%ae" --date=short',
      { encoding: "utf-8", cwd: process.cwd() }
    );

    const commits = gitLog
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const [hash, message, date, author, email] = line.split("|");
        
        let branch = "main";
        let color = "#10b981";
        
        const lowerMsg = message.toLowerCase();
        if (lowerMsg.includes("feat") || lowerMsg.includes("ui") || lowerMsg.includes("terminal") || lowerMsg.includes("widget")) {
          branch = "feature/frontend";
          color = "#38bdf8";
        } else if (lowerMsg.includes("fix") || lowerMsg.includes("api") || lowerMsg.includes("spotify") || lowerMsg.includes("sanity")) {
          branch = "feature/backend";
          color = "#a855f7";
        } else if (lowerMsg.includes("refactor") || lowerMsg.includes("perf")) {
          branch = "feature/optimization";
          color = "#fbbf24";
        }

        return {
          id: `git-${hash}`,
          hash,
          branch,
          message,
          date,
          author: author || process.env.NEXT_PUBLIC_DEVELOPER_NAME || "Sadik Laliwala",
          email: email || process.env.NEXT_PUBLIC_DEVELOPER_EMAIL || "sadik.laliwala@gmail.com",
          details: `Commit made locally in this portfolio repository. Verified by repository logs.`,
          color,
        };
      });

    return NextResponse.json({ success: true, commits, source: "local" });
  } catch (localError: any) {
    console.log("Local git query failed. Fetching from GitHub API instead...");
    
    // 2. Fetch from GitHub API (production fallback)
    try {
      const headers: HeadersInit = {
        "User-Agent": "portfolio-app"
      };
      
      if (process.env.GITHUB_TOKEN) {
        headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
      }

      const response = await fetch(
        `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/commits?per_page=12`,
        { headers, next: { revalidate: 300 } }
      );

      if (!response.ok) {
        throw new Error(`GitHub API responded with status ${response.status}`);
      }

      const gitHubData = await response.json();
      
      if (!Array.isArray(gitHubData)) {
        throw new Error("Invalid response from GitHub API");
      }

      const commits = gitHubData.map((item: any) => {
        const hash = item.sha.substring(0, 7);
        const message = item.commit.message.split("\n")[0];
        const date = item.commit.author.date.split("T")[0];
        const author = item.commit.author.name;
        const email = item.commit.author.email;
        const details = item.commit.message;

        let branch = "main";
        let color = "#10b981";
        
        const lowerMsg = message.toLowerCase();
        if (lowerMsg.includes("feat") || lowerMsg.includes("ui") || lowerMsg.includes("terminal") || lowerMsg.includes("widget")) {
          branch = "feature/frontend";
          color = "#38bdf8";
        } else if (lowerMsg.includes("fix") || lowerMsg.includes("api") || lowerMsg.includes("spotify") || lowerMsg.includes("sanity")) {
          branch = "feature/backend";
          color = "#a855f7";
        } else if (lowerMsg.includes("refactor") || lowerMsg.includes("perf")) {
          branch = "feature/optimization";
          color = "#fbbf24";
        }

        return {
          id: `git-${hash}`,
          hash,
          branch,
          message,
          date,
          author: author || process.env.NEXT_PUBLIC_DEVELOPER_NAME || "Sadik Laliwala",
          email: email || process.env.NEXT_PUBLIC_DEVELOPER_EMAIL || "sadik.laliwala@gmail.com",
          details: details || `Commit verified via GitHub API.`,
          color,
        };
      });

      return NextResponse.json({ success: true, commits, source: "github-api" });
    } catch (apiError: any) {
      console.error("GitHub API fetch failed. Using static fallbacks...", apiError.message);
      
      const fallbacks = [
        {
          id: "fallback-1",
          hash: "9162793",
          branch: "main",
          message: "Phase 1 is Completed",
          date: "2026-06-12",
          author: process.env.NEXT_PUBLIC_DEVELOPER_NAME || "Sadik Laliwala",
          email: process.env.NEXT_PUBLIC_DEVELOPER_EMAIL || "sadik.laliwala@gmail.com",
          details: "Main branch commit: Completed visual structures.",
          color: "#10b981"
        },
        {
          id: "fallback-2",
          hash: "4f5aac5",
          branch: "feature/frontend",
          message: "Basic is Completed",
          date: "2026-06-12",
          author: process.env.NEXT_PUBLIC_DEVELOPER_NAME || "Sadik Laliwala",
          email: process.env.NEXT_PUBLIC_DEVELOPER_EMAIL || "sadik.laliwala@gmail.com",
          details: "Frontend branch commit: Set up interactive cards.",
          color: "#38bdf8"
        }
      ];

      return NextResponse.json({ 
        success: true, 
        isFallback: true,
        error: apiError.message,
        commits: fallbacks 
      });
    }
  }
}
