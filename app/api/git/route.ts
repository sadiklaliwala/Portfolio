import { NextResponse } from "next/server";
import { execSync } from "child_process";

export async function GET() {
  try {
    // Fetch last 12 commits from local git history
    const gitLog = execSync(
      'git log -n 12 --pretty=format:"%h|%s|%ad|%an|%ae" --date=short',
      { encoding: "utf-8", cwd: process.cwd() }
    );

    const commits = gitLog
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((line, index) => {
        const [hash, message, date, author, email] = line.split("|");
        
        // Determine branch dynamically based on message contents for interactive visualization
        let branch = "main";
        let color = "#10b981"; // Emerald for main
        
        const lowerMsg = message.toLowerCase();
        if (lowerMsg.includes("feat") || lowerMsg.includes("ui") || lowerMsg.includes("terminal") || lowerMsg.includes("widget")) {
          branch = "feature/frontend";
          color = "#38bdf8"; // Sky blue
        } else if (lowerMsg.includes("fix") || lowerMsg.includes("api") || lowerMsg.includes("spotify") || lowerMsg.includes("sanity")) {
          branch = "feature/backend";
          color = "#a855f7"; // Purple
        } else if (lowerMsg.includes("refactor") || lowerMsg.includes("perf")) {
          branch = "feature/optimization";
          color = "#fbbf24"; // Amber
        }

        return {
          id: `git-${hash}`,
          hash,
          branch,
          message,
          date,
          author: author || "Sadik Laliwala",
          email: email || "sadik.laliwala@gmail.com",
          details: `Commit made locally in this portfolio repository. Verified by repository logs.`,
          color,
        };
      });

    return NextResponse.json({ success: true, commits });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      commits: [
        {
          id: "fallback-1",
          hash: "9162793",
          branch: "main",
          message: "Phase 1 is Completed",
          date: "2026-06-12",
          author: "Sadik Laliwala",
          email: "sadik.laliwala@gmail.com",
          details: "Main branch commit: Completed visual structures.",
          color: "#10b981"
        },
        {
          id: "fallback-2",
          hash: "4f5aac5",
          branch: "feature/frontend",
          message: "Basic is Completed",
          date: "2026-06-12",
          author: "Sadik Laliwala",
          email: "sadik.laliwala@gmail.com",
          details: "Frontend branch commit: Set up interactive cards.",
          color: "#38bdf8"
        }
      ] 
    });
  }
}
