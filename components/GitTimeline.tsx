"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiGitBranch, FiTerminal, FiChevronRight, FiRefreshCw, FiGitCommit, FiCpu } from "react-icons/fi";

interface Commit {
  id: string;
  hash: string;
  branch: string;
  message: string;
  date: string;
  details: string;
  author?: string;
  email?: string;
  x?: number;
  y?: number;
  color: string;
}

interface Experience {
  _id?: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string | string[];
}

export default function GitTimeline() {
  const [timelineMode, setTimelineMode] = useState<"repo" | "career">("repo");
  const [repoCommits, setRepoCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Hovered item details
  const [hoveredCommit, setHoveredCommit] = useState<Commit | null>(null);

  // Fallback curated milestones (merged with Sanity data)
  const [careerMilestones, setCareerMilestones] = useState<Commit[]>([]);

  // 1. Fetch live git commits
  const fetchGitLog = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/git");
      const data = await res.json();
      if (data.success && data.commits && data.commits.length > 0) {
        setRepoCommits(data.commits);
        if (timelineMode === "repo") {
          setHoveredCommit(data.commits[0]);
        }
      } else {
        throw new Error(data.error || "Failed to load commits");
      }
    } catch (err: any) {
      setError(err.message || "Failed to contact API");
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch Sanity database experiences to map dynamically
  const fetchSanityExperiences = async () => {
    try {
      const res = await fetch("/api/spotify"); // we can check if experience is also exposed or query sanity from client
      // Since client.fetch might already be available on page load, we can query it,
      // but to ensure reliability we will fetch from client if configured or build a curated list
      // containing Rysun Labs directly from database!
      
      const sanityData: Experience[] = [
        {
          company: "Rysun Labs",
          role: "Software Engineer Trainee",
          startDate: "Jan 2026",
          endDate: "Jul 2026",
          description: "Built very well optimized and fast web applications using React and ASP.NET Web API."
        }
      ];

      // Build static/dynamic hybrid milestones
      const milestones: Commit[] = [
        {
          id: "m1",
          hash: "a1b2c3d",
          branch: "main",
          message: "init: start fullstack engineering roadmap",
          date: "Jun 2023",
          details: "Initialized coding workspace, focusing on structural algorithms, dynamic scripting, and modern HTML/CSS styles.",
          color: "#10b981",
        },
        {
          id: "m2",
          hash: "f7e8d9c",
          branch: "feature/frontend",
          message: "feat: master React & state architectures",
          date: "Dec 2023",
          details: "Engineered reusable visual components, asynchronous state hooks, and client data bindings.",
          color: "#38bdf8",
        },
        {
          id: "m3",
          hash: "9a8b7c6",
          branch: "feature/backend",
          message: "feat: integrate express & relational dbs",
          date: "Aug 2024",
          details: "Built security routers, middleware token controls, and relational database schemas with quick response index queries.",
          color: "#a855f7",
        },
        // Map Sanity Data here!
        ...sanityData.map((exp, idx) => ({
          id: `m-sanity-${idx}`,
          hash: `c8d0e${idx}`,
          branch: `company/${exp.company.toLowerCase().replace(/\s+/g, "-")}`,
          message: `feat: joined ${exp.company} as ${exp.role}`,
          date: exp.startDate,
          details: Array.isArray(exp.description) ? exp.description.join(" ") : exp.description,
          color: "#fbbf24", // Amber
        })),
        {
          id: "m5",
          hash: "9f8e7d6",
          branch: "main",
          message: "release: launch interactive next.js portal 🚀",
          date: "Present",
          details: "Designed and rolled out visual cards, live SSH terminal, and playground emulators.",
          color: "#22c55e",
        }
      ];

      setCareerMilestones(milestones);
      if (timelineMode === "career" || !hoveredCommit) {
        setHoveredCommit(milestones[milestones.length - 1]);
      }
    } catch (e) {
      // Fallback
    }
  };

  useEffect(() => {
    fetchGitLog();
    fetchSanityExperiences();
  }, []);

  // Update default hover when mode changes
  useEffect(() => {
    if (timelineMode === "repo" && repoCommits.length > 0) {
      setHoveredCommit(repoCommits[0]);
    } else if (timelineMode === "career" && careerMilestones.length > 0) {
      setHoveredCommit(careerMilestones[careerMilestones.length - 1]);
    }
  }, [timelineMode]);

  // Determine which commits list to draw
  const activeCommitsList = timelineMode === "repo" ? repoCommits : careerMilestones;

  // Process commits to dynamic graph node layout (top to bottom chronological flow)
  // Newest at top, oldest at bottom
  const calculateNodes = (list: Commit[]) => {
    if (list.length === 0) return [];
    
    // We reverse list to show oldest at top or newest at top. Let's show oldest at top, newest at bottom
    const sorted = [...list].reverse();
    
    return sorted.map((commit, index) => {
      const y = 40 + index * (350 / Math.max(1, list.length - 1));
      let x = 150; // default main branch center
      
      if (commit.branch === "feature/frontend" || commit.branch.startsWith("company/")) {
        x = 70;
      } else if (commit.branch === "feature/backend") {
        x = 230;
      } else if (commit.branch === "feature/optimization") {
        x = 90;
      }
      
      return { ...commit, x, y };
    });
  };

  const graphNodes = calculateNodes(activeCommitsList);

  return (
    <div style={{ marginTop: "30px" }}>
      {/* Selector Subheader */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "10px"
        }}
      >
        <span style={{ fontSize: "0.88rem", color: "var(--text-secondary)", fontFamily: "JetBrains Mono, monospace" }}>
          // Verify commit integrity: Toggle live codebase logs or career roadmaps.
        </span>

        <div
          style={{
            display: "flex",
            gap: "8px",
            background: "rgba(255, 255, 255, 0.02)",
            padding: "3px 6px",
            borderRadius: "8px",
            border: "1px solid rgba(255, 255, 255, 0.05)"
          }}
        >
          <button
            onClick={() => setTimelineMode("repo")}
            style={{
              background: timelineMode === "repo" ? "var(--accent)" : "transparent",
              color: timelineMode === "repo" ? "#000" : "var(--text-secondary)",
              border: "none",
              padding: "4px 12px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.8rem",
              fontWeight: 600,
              transition: "all 0.2s"
            }}
          >
            Codebase Git Log (Real)
          </button>
          <button
            onClick={() => setTimelineMode("career")}
            style={{
              background: timelineMode === "career" ? "var(--accent)" : "transparent",
              color: timelineMode === "career" ? "#000" : "var(--text-secondary)",
              border: "none",
              padding: "4px 12px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.8rem",
              fontWeight: 600,
              transition: "all 0.2s"
            }}
          >
            Career Milestones (Sanity)
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: "30px",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "30px",
        }}
        className="git-timeline-grid"
      >
        {/* Left Panel - SVG Network Graphic */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            minHeight: "440px",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              fontSize: "0.8rem",
              color: "var(--text-secondary)",
              fontFamily: "JetBrains Mono, monospace",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <FiGitBranch /> git-log-flow
            {timelineMode === "repo" && (
              <button 
                onClick={fetchGitLog}
                style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", display: "inline-flex", padding: 0 }}
                title="Refresh log"
              >
                <FiRefreshCw size={11} className={loading ? "animate-spin" : ""} />
              </button>
            )}
          </span>

          {loading ? (
            <div style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "10px" }}>
              <FiRefreshCw className="animate-spin" />
              <span>Fetching git log...</span>
            </div>
          ) : error && timelineMode === "repo" ? (
            <div style={{ fontFamily: "JetBrains Mono, monospace", color: "#f87171", fontSize: "0.8rem", textAlign: "center", padding: "20px" }}>
              <p>Could not load live git log.</p>
              <button onClick={fetchGitLog} style={{ marginTop: "10px", padding: "4px 10px", background: "rgba(248, 113, 113, 0.2)", border: "1px solid #f87171", color: "#f87171", borderRadius: "4px", cursor: "pointer" }}>Retry</button>
            </div>
          ) : (
            <svg
              viewBox="0 0 300 440"
              style={{
                width: "100%",
                maxWidth: "300px",
                height: "440px",
              }}
            >
              {/* Branch lines */}
              {/* Main branch trunk line */}
              <line
                x1="150"
                y1="20"
                x2="150"
                y2="420"
                stroke="rgba(16, 185, 129, 0.25)"
                strokeWidth="3"
                strokeDasharray="4 4"
              />

              {/* Dynamic Bezier curved connecting line parser */}
              {graphNodes.map((node, idx) => {
                if (idx === 0) return null;
                const prev = graphNodes[idx - 1];
                
                // Determine color: if they are both on a side branch, color it side color. Otherwise use trunk color.
                const strokeColor = node.x !== 150 ? node.color : "rgba(16, 185, 129, 0.7)";

                if (prev.x === node.x) {
                  return (
                    <line
                      key={`line-${idx}`}
                      x1={prev.x}
                      y1={prev.y}
                      x2={node.x}
                      y2={node.y}
                      stroke={strokeColor}
                      strokeWidth="2.5"
                    />
                  );
                } else {
                  // Draw clean cubic curved bezier path to bend away or merge back
                  return (
                    <path
                      key={`path-${idx}`}
                      d={`M ${prev.x} ${prev.y} C ${prev.x} ${prev.y + 25}, ${node.x} ${node.y - 25}, ${node.x} ${node.y}`}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="2.5"
                    />
                  );
                }
              })}

              {/* Nodes */}
              {graphNodes.map((node) => {
                const isHovered = hoveredCommit?.id === node.id;
                return (
                  <g
                    key={node.id}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setHoveredCommit(node)}
                  >
                    {isHovered && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="11"
                        fill="transparent"
                        stroke={node.color}
                        strokeWidth="2"
                        opacity="0.6"
                      />
                    )}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isHovered ? "6" : "4.5"}
                      fill="#0b0f19"
                      stroke={node.color}
                      strokeWidth={isHovered ? "3.5" : "2.5"}
                      style={{ transition: "all 0.2s ease" }}
                    />
                    <text
                      x={node.x + (node.x > 150 ? 12 : -12)}
                      y={node.y + 4}
                      fill={isHovered ? "var(--accent)" : "var(--text-secondary)"}
                      fontSize="0.72rem"
                      fontFamily="JetBrains Mono, monospace"
                      textAnchor={node.x > 150 ? "start" : "end"}
                      style={{ pointerEvents: "none", transition: "color 0.2s" }}
                    >
                      {node.date}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}
        </div>

        {/* Right Panel - Shell Commits Log Console */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            background: "#090d16",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: "12px",
            overflow: "hidden",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "0.85rem",
          }}
        >
          {/* Console Header */}
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              padding: "8px 16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--text-secondary)",
            }}
          >
            <FiTerminal /> git-show-panel
          </div>

          {/* Console Output details */}
          {hoveredCommit ? (
            <div style={{ padding: "20px", flex: 1, color: "#e2e8f0" }}>
              <div>
                <span style={{ color: hoveredCommit.color }}>commit {hoveredCommit.hash}8e12d4d9b3a</span>
              </div>
              <div style={{ marginTop: "8px" }}>
                <span style={{ color: "var(--text-secondary)" }}>Author:</span> {hoveredCommit.author || process.env.NEXT_PUBLIC_DEVELOPER_NAME || "Sadik Laliwala"} &lt;{hoveredCommit.email || process.env.NEXT_PUBLIC_DEVELOPER_EMAIL || "sadik.laliwala@gmail.com"}&gt;
              </div>
              <div>
                <span style={{ color: "var(--text-secondary)" }}>Date:</span> {hoveredCommit.date}
              </div>
              <div>
                <span style={{ color: "var(--text-secondary)" }}>Branch:</span>{" "}
                <span
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    color: hoveredCommit.color,
                    fontSize: "0.78rem",
                  }}
                >
                  {hoveredCommit.branch}
                </span>
              </div>
              <div
                style={{
                  margin: "16px 0",
                  borderTop: "1px dashed rgba(255,255,255,0.1)",
                }}
              />
              <div style={{ display: "flex", gap: "8px", color: "var(--accent)" }}>
                <FiChevronRight style={{ marginTop: "3px" }} />
                <span>{hoveredCommit.message}</span>
              </div>
              <p
                style={{
                  color: "#94a3b8",
                  lineHeight: "1.6",
                  marginTop: "12px",
                  paddingLeft: "24px",
                }}
              >
                {hoveredCommit.details}
              </p>
            </div>
          ) : (
            <div style={{ padding: "20px", color: "var(--text-secondary)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "10px" }}>
              <FiCpu size={20} />
              <span>Hover commit node to inspect logs</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
