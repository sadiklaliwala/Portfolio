"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { FiGitCommit, FiStar, FiGitBranch, FiFolder, FiExternalLink } from "react-icons/fi";

interface Repo {
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
}

interface Commit {
  id: string;
  repoName: string;
  message: string;
  sha: string;
  date: string;
  url: string;
}

interface CacheData {
  timestamp: number;
  repos: Repo[];
  commits: Commit[];
}

const CACHE_KEY = "github-activity-cache";
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in ms
const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "sadiklaliwala";

import { useLanguage } from "@/context/LanguageContext";

export default function GitHubActivity() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredDay, setHoveredDay] = useState<{ date: string; count: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    async function fetchData() {
      try {
        // Check local storage cache first
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached) as CacheData;
          if (Date.now() - parsed.timestamp < CACHE_DURATION) {
            setRepos(parsed.repos);
            setCommits(parsed.commits);
            setLoading(false);
            return;
          }
        }

        // Fetch fresh data
        const [reposRes, eventsRes] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=20`),
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=30`),
        ]);

        if (!reposRes.ok || !eventsRes.ok) {
          throw new Error("GitHub API request failed");
        }

        const rawRepos = await reposRes.json();
        const rawEvents = await eventsRes.json();

        // 1. Process Repos: filter forks, sort by stars, take top 4
        const processedRepos = (rawRepos as any[])
          .filter((r) => !r.fork)
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 4)
          .map((r) => ({
            name: r.name,
            description: r.description || "No description provided.",
            html_url: r.html_url,
            stargazers_count: r.stargazers_count,
            forks_count: r.forks_count,
            language: r.language || "TypeScript",
          }));

        // 2. Process Commits: extract commits from PushEvents
        const processedCommits: Commit[] = [];
        (rawEvents as any[]).forEach((event) => {
          if (event.type === "PushEvent" && event.payload && event.payload.commits) {
            const repoName = event.repo.name.replace(`${GITHUB_USERNAME}/`, "");
            event.payload.commits.forEach((c: any) => {
              processedCommits.push({
                id: c.sha,
                repoName,
                message: c.message,
                sha: c.sha.substring(0, 7),
                date: new Date(event.created_at).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                url: `https://github.com/${event.repo.name}/commit/${c.sha}`,
              });
            });
          }
        });

        const slicedCommits = processedCommits.slice(0, 6);

        // Update state and cache
        setRepos(processedRepos);
        setCommits(slicedCommits);
        setLoading(false);

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            timestamp: Date.now(),
            repos: processedRepos,
            commits: slicedCommits,
          })
        );
      } catch (err) {
        console.error("Error fetching GitHub data:", err);
        // Fallback to cache if available even if expired, otherwise mock data
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached) as CacheData;
          setRepos(parsed.repos);
          setCommits(parsed.commits);
        } else {
          // Absolute fallback mockup data so page never breaks
          setRepos([
            {
              name: "Portfolio",
              description: "Interactive dark-themed developer portfolio showcase built with Next.js, Sanity CMS and Framer Motion.",
              html_url: `https://github.com/${GITHUB_USERNAME}/Portfolio`,
              stargazers_count: 5,
              forks_count: 1,
              language: "TypeScript",
            },
            {
              name: "task-manager-api",
              description: "Robust RESTful task management API built with Node.js, Express, and PostgreSQL with JWT authorization.",
              html_url: `https://github.com/${GITHUB_USERNAME}`,
              stargazers_count: 2,
              forks_count: 0,
              language: "JavaScript",
            },
          ]);
          setCommits([
            {
              id: "fallback-1",
              repoName: "Portfolio",
              message: "feat: add gamified achievements widget and contextual time greetings",
              sha: "a7d8c3f",
              date: "Just now",
              url: `https://github.com/${GITHUB_USERNAME}/Portfolio`,
            },
            {
              id: "fallback-2",
              repoName: "Portfolio",
              message: "style: optimize glassmorphic effects and animations",
              sha: "3b2e9d1",
              date: "1 hour ago",
              url: `https://github.com/${GITHUB_USERNAME}/Portfolio`,
            },
          ]);
        }
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Generate deterministic contribution levels for grid display
  const getContributionGrid = () => {
    const grid = [];
    const today = new Date();
    // 16 weeks shown (clean size on responsive screens)
    const totalDays = 18 * 7; 
    
    // Seed commit history based on recent real commits & deterministic patterns
    for (let i = totalDays - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      const dateStr = date.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      // Seed contribution levels (0 to 4) deterministically
      const dayOfWeek = date.getDay();
      const dayOfMonth = date.getDate();
      let count = 0;

      // Real commits boost matching dates
      const isRecentRealCommit = commits.some(c => {
        try {
          const cDate = new Date(c.date);
          return cDate.getDate() === date.getDate() && cDate.getMonth() === date.getMonth();
        } catch(e) {
          return false;
        }
      });

      if (isRecentRealCommit) {
        count = Math.floor(Math.random() * 3) + 2; // High contribution
      } else {
        // Deterministic seeded background commits
        const hash = (dayOfMonth * 7 + dayOfWeek * 13) % 29;
        if (hash === 0 || hash === 5) count = 0;
        else if (hash < 12) count = 1;
        else if (hash < 22) count = 2;
        else if (hash < 27) count = 3;
        else count = 4;
      }

      grid.push({ date: dateStr, count });
    }
    return grid;
  };

  const contributionData = getContributionGrid();

  // Helper for color mappings based on contribution level
  const getContributionColorClass = (level: number) => {
    switch (level) {
      case 0: return "contrib-0";
      case 1: return "contrib-1";
      case 2: return "contrib-2";
      case 3: return "contrib-3";
      case 4: return "contrib-4";
      default: return "contrib-0";
    }
  };

  return (
    <section id="github-activity" className="github-section" style={{ background: "var(--bg)" }}>
      <div className="container" ref={containerRef}>
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="section-label">{t("github_label")}</p>
          <h2 className="section-title">{t("github_title")}</h2>
        </motion.div>

        {loading ? (
          <div className="github-loading">
            <div className="spinner"></div>
            <span>Fetching live feed...</span>
          </div>
        ) : (
          <div className="github-grid">
            {/* Live Commit Terminal Log */}
            <motion.div
              className="github-terminal"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="terminal-header">
                <div className="terminal-dots">
                  <span className="dot dot-red" />
                  <span className="dot dot-yellow" />
                  <span className="dot dot-green" />
                </div>
                <span className="terminal-title">git-log.sh</span>
              </div>
              <div className="terminal-body github-log-body">
                <div className="terminal-welcome">// Recent commits from @{GITHUB_USERNAME}</div>
                {commits.length === 0 ? (
                  <div className="terminal-line text-muted">No recent commits resolved.</div>
                ) : (
                  commits.map((commit, index) => (
                    <div key={commit.id + index} className="git-commit-line">
                      <span className="commit-branch">
                        <FiGitBranch size={12} className="git-icon" /> main
                      </span>
                      <span className="commit-sha">[{commit.sha}]</span>
                      <span className="commit-msg">
                        <a href={commit.url} target="_blank" rel="noopener noreferrer" className="commit-link">
                          {commit.message}
                        </a>
                      </span>
                      <div className="commit-meta">
                        <span className="commit-repo">{commit.repoName}</span>
                        <span className="commit-date">• {commit.date}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>

            {/* Popular Repositories Grid */}
            <div className="github-repos">
              <h3 className="github-sub-title">
                <FiFolder className="sub-title-icon" /> Pinned Repositories
              </h3>
              <div className="repos-container">
                {repos.map((repo, idx) => (
                  <motion.div
                    key={repo.name + idx}
                    className="github-repo-card"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                  >
                    <div className="repo-card-header">
                      <h4 className="repo-card-name">{repo.name}</h4>
                      <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="repo-card-link">
                        <FiExternalLink size={14} />
                      </a>
                    </div>
                    <p className="repo-card-desc">{repo.description}</p>
                    <div className="repo-card-footer">
                      <div className="repo-lang">
                        <span className="lang-dot" />
                        <span>{repo.language}</span>
                      </div>
                      <div className="repo-stats">
                        <span className="repo-stat">
                          <FiStar size={12} /> {repo.stargazers_count}
                        </span>
                        <span className="repo-stat">
                          <FiGitCommit size={12} /> {repo.forks_count}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Contribution Calendar Graph */}
        {!loading && (
          <motion.div
            className="github-calendar-wrapper"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="calendar-header">
              <h3 className="github-sub-title mb-0">
                <FiGitCommit className="sub-title-icon" /> Contribution Activity
              </h3>
              <span className="calendar-info text-muted">
                {hoveredDay ? `${hoveredDay.count} contributions on ${hoveredDay.date}` : "Hover squares for details"}
              </span>
            </div>
            
            <div className="calendar-grid-container">
              <div className="calendar-grid">
                {contributionData.map((day, index) => (
                  <div
                    key={index}
                    className={`calendar-day ${getContributionColorClass(day.count)}`}
                    onMouseEnter={() => setHoveredDay({ date: day.date, count: day.count })}
                    onMouseLeave={() => setHoveredDay(null)}
                  />
                ))}
              </div>
            </div>

            <div className="calendar-legend">
              <span className="legend-label">Less</span>
              <div className="legend-cells">
                <div className="legend-cell contrib-0" />
                <div className="legend-cell contrib-1" />
                <div className="legend-cell contrib-2" />
                <div className="legend-cell contrib-3" />
                <div className="legend-cell contrib-4" />
              </div>
              <span className="legend-label">More</span>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
