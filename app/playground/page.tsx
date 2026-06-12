"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  FiPlay,
  FiRefreshCw,
  FiCode,
  FiLayers,
  FiMaximize2,
  FiFolder,
  FiFileText,
  FiLock,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";

const DEFAULT_JSX = `// Write your React code here!
// Make sure to define an "App" component.

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="card">
      <h2>Hello from the Playground! 🚀</h2>
      <p>This is a live React environment executing client-side.</p>
      
      <div className="counter-box">
        <p>Button clicked: <strong>{count}</strong> times</p>
        <button onClick={() => setCount(count + 1)}>
          Click Me
        </button>
      </div>
      
      <p className="footer-note">
        Edit App.jsx or index.css on the left to see instant updates.
      </p>
    </div>
  );
}
`;

const DEFAULT_CSS = `/* Custom Styles */
body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 85vh;
  margin: 0;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
  color: #f8fafc;
  font-family: 'Outfit', system-ui, -apple-system, sans-serif;
}

.card {
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 16px;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

h2 {
  color: #38bdf8;
  margin-top: 0;
}

.counter-box {
  margin: 24px 0;
  background: rgba(15, 23, 42, 0.6);
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

button {
  background: #38bdf8;
  color: #0f172a;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

button:hover {
  background: #0ea5e9;
  transform: translateY(-1px);
}

.footer-note {
  font-size: 0.85rem;
  color: #94a3b8;
  margin-bottom: 0;
}
`;

const CODE_SPOTIFY_WIDGET = `// components/SpotifyWidget.tsx
// Renders the floating music indicator and full audio playback controls

import React, { useState, useEffect } from "react";
import { FiMusic, FiPlay, FiPause, FiChevronUp, FiExternalLink } from "react-icons/fi";

export default function SpotifyWidget() {
  const [track, setTrack] = useState({
    isPlaying: false,
    title: "Dil Diyan Gallan",
    artist: "Atif Aslam",
    albumArt: "/images/atif-aslam.jpg",
    songUrl: "https://open.spotify.com/track/..."
  });

  useEffect(() => {
    const pollSpotify = async () => {
      const res = await fetch("/api/spotify");
      const data = await res.json();
      setTrack(data);
    };
    pollSpotify();
    const interval = setInterval(pollSpotify, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="spotify-widget-container">
      {/* Floating capsule with spinning vinyl audio equalizer... */}
      <span className="track-title">{track.title}</span>
      <span className="track-artist">{track.artist}</span>
    </div>
  );
}`;

const CODE_RADAR_CHART = `// components/RadarChart.tsx
// Renders technical skills coordinates on responsive trigonometric SVG circles

import React from "react";

export default function RadarChart({ data }) {
  const LEVEL_COUNT = 4;
  const ANGLE_STEP = (Math.PI * 2) / data.length;

  const getCoordinates = (index: number, value: number) => {
    const angle = index * ANGLE_STEP - Math.PI / 2;
    const r = (value / 100) * 120;
    return {
      x: 150 + Math.cos(angle) * r,
      y: 150 + Math.sin(angle) * r
    };
  };

  return (
    <svg viewBox="0 0 300 300" className="radar-chart">
      {/* Dynamic multi-layered coordinates rendered as custom SVG shapes... */}
    </svg>
  );
}`;

const CODE_INTERACTIVE_TERMINAL = `// components/InteractiveTerminal.tsx
// Stateful terminal shell command parser and matrix rain rendering

import React, { useState, useRef } from "react";

export default function InteractiveTerminal() {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");

  const handleRunCommand = (cmd) => {
    // Parser for help, whoami, skills, status, time, matrix, clear...
  };

  return (
    <div className="terminal">
      <div className="console-prompt">$ {input}</div>
    </div>
  );
}`;

const CODE_SPOTIFY_ROUTE = `// app/api/spotify/route.ts
// Proxy endpoint to handle OAuth refreshing and secure API keys

import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  // Request refreshed Access Token from Spotify Accounts API...
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": \`Basic \${Buffer.from(clientId + ":" + clientSecret).toString("base64")}\`
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken
    })
  });

  const tokens = await response.json();

  // Query Spotify Web API with access token...
  return NextResponse.json({ ...trackDetails });
}`;

interface FileItem {
  name: string;
  path: string;
  type: "file" | "folder";
  isReadOnly?: boolean;
  content?: string;
  children?: FileItem[];
}

export default function PlaygroundPage() {
  const [selectedFile, setSelectedFile] = useState("root/App.jsx");
  const [jsxCode, setJsxCode] = useState(DEFAULT_JSX);
  const [cssCode, setCssCode] = useState(DEFAULT_CSS);
  const [iframeSrcDoc, setIframeSrcDoc] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    "root": true,
    "root/app": true,
    "root/app/api": false,
    "root/app/api/spotify": false,
    "root/components": true,
  });

  const EXPLORER_DATA: FileItem[] = [
    {
      name: "portfolio-workspace",
      path: "root",
      type: "folder" as const,
      children: [
        {
          name: "app",
          path: "root/app",
          type: "folder" as const,
          children: [
            {
              name: "api",
              path: "root/app/api",
              type: "folder" as const,
              children: [
                {
                  name: "spotify",
                  path: "root/app/api/spotify",
                  type: "folder" as const,
                  children: [
                    {
                      name: "route.ts",
                      path: "root/app/api/spotify/route.ts",
                      type: "file" as const,
                      isReadOnly: true,
                      content: CODE_SPOTIFY_ROUTE,
                    },
                  ],
                },
              ],
            },
            {
              name: "playground",
              path: "root/app/playground",
              type: "folder" as const,
              children: [
                {
                  name: "page.tsx",
                  path: "root/app/playground/page.tsx",
                  type: "file" as const,
                  isReadOnly: true,
                  content: "// Live IDE code preview you are exploring right now!",
                },
              ],
            },
          ],
        },
        {
          name: "components",
          path: "root/components",
          type: "folder" as const,
          children: [
            {
              name: "SpotifyWidget.tsx",
              path: "root/components/SpotifyWidget.tsx",
              type: "file" as const,
              isReadOnly: true,
              content: CODE_SPOTIFY_WIDGET,
            },
            {
              name: "RadarChart.tsx",
              path: "root/components/RadarChart.tsx",
              type: "file" as const,
              isReadOnly: true,
              content: CODE_RADAR_CHART,
            },
            {
              name: "InteractiveTerminal.tsx",
              path: "root/components/InteractiveTerminal.tsx",
              type: "file" as const,
              isReadOnly: true,
              content: CODE_INTERACTIVE_TERMINAL,
            },
          ],
        },
        {
          name: "App.jsx",
          path: "root/App.jsx",
          type: "file" as const,
          isReadOnly: false,
          content: jsxCode,
        },
        {
          name: "index.css",
          path: "root/index.css",
          type: "file" as const,
          isReadOnly: false,
          content: cssCode,
        },
      ],
    },
  ];

  // Compile code into iframe template
  const compile = () => {
    const srcDoc = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <style>
          ${cssCode}
        </style>
      </head>
      <body>
        <div id="root"></div>
        <script type="text/babel">
          const { useState, useEffect } = React;

          try {
            ${jsxCode}

            if (typeof App !== 'undefined') {
              const root = ReactDOM.createRoot(document.getElementById('root'));
              root.render(<App />);
            } else {
              document.getElementById('root').innerHTML = '<div style="color: #f87171; padding: 20px; font-family: monospace;">Error: Make sure to define an "App" component.</div>';
            }
          } catch (err) {
            document.getElementById('root').innerHTML = \`
              <div style="color: #f87171; padding: 20px; font-family: monospace;">
                <h3>Compilation Error</h3>
                <pre style="white-space: pre-wrap; background: rgba(248, 113, 113, 0.1); padding: 12px; border-radius: 6px;">\${err.message}</pre>
              </div>
            \`;
          }
        </script>
      </body>
      </html>
    `;
    setIframeSrcDoc(srcDoc);
  };

  // Compile automatically as the user types (with a 600ms debounce)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      compile();
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [jsxCode, cssCode]);

  const handleRefresh = () => {
    compile();
  };

  const toggleFolder = (path: string) => {
    setOpenFolders((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const handleFileClick = (file: any) => {
    setSelectedFile(file.path);
  };

  const getActiveFileContent = () => {
    if (selectedFile === "root/App.jsx") return jsxCode;
    if (selectedFile === "root/index.css") return cssCode;

    // Search file data
    const findFile = (items: FileItem[]): string => {
      for (const item of items) {
        if (item.path === selectedFile) return item.content || "";
        if (item.children) {
          const res = findFile(item.children);
          if (res) return res;
        }
      }
      return "";
    };
    return findFile(EXPLORER_DATA);
  };

  const handleCodeChange = (val: string) => {
    if (selectedFile === "root/App.jsx") {
      setJsxCode(val);
    } else if (selectedFile === "root/index.css") {
      setCssCode(val);
    }
  };

  const isReadOnlyActive = selectedFile !== "root/App.jsx" && selectedFile !== "root/index.css";

  const renderTree = (items: FileItem[]) => {
    return items.map((item) => {
      const isFolder = item.type === "folder";
      const isOpen = openFolders[item.path];
      const isSelected = selectedFile === item.path;

      if (isFolder) {
        return (
          <div key={item.path} style={{ marginLeft: "10px" }}>
            <div
              onClick={() => toggleFolder(item.path)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 8px",
                cursor: "pointer",
                borderRadius: "4px",
                fontSize: "0.82rem",
                color: "var(--text-secondary)",
                transition: "background 0.2s ease",
              }}
              className="explorer-item"
            >
              {isOpen ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
              <FiFolder size={14} style={{ color: "#38bdf8" }} />
              <span style={{ fontFamily: "JetBrains Mono, monospace" }}>{item.name}</span>
            </div>
            {isOpen && item.children && (
              <div style={{ borderLeft: "1px dashed rgba(255, 255, 255, 0.08)", marginLeft: "6px" }}>
                {renderTree(item.children)}
              </div>
            )}
          </div>
        );
      } else {
        return (
          <div
            key={item.path}
            onClick={() => handleFileClick(item)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 8px",
              cursor: "pointer",
              borderRadius: "4px",
              fontSize: "0.82rem",
              color: isSelected ? "var(--accent)" : "var(--text-secondary)",
              background: isSelected ? "rgba(56, 189, 248, 0.08)" : "transparent",
              marginLeft: "10px",
              transition: "all 0.2s ease",
            }}
            className="explorer-item"
          >
            <span style={{ width: "14px", display: "inline-flex", justifyContent: "center" }}>
              <FiFileText size={14} style={{ color: item.isReadOnly ? "#64748b" : "#22c55e" }} />
            </span>
            <span style={{ flex: 1, fontFamily: "JetBrains Mono, monospace" }}>{item.name}</span>
            {item.isReadOnly && <FiLock size={12} style={{ opacity: 0.5 }} />}
          </div>
        );
      }
    });
  };

  return (
    <main
      className="min-h-screen py-16 relative z-10"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="container" style={{ maxWidth: "1440px", padding: "0 24px" }}>
        {/* Header navigation */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <Link
              href="/"
              className="btn-secondary"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              ← Back to Home
            </Link>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span
              style={{
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              sandbox: active 🟢
            </span>
            <button
              onClick={handleRefresh}
              style={{
                background: "rgba(0, 212, 255, 0.1)",
                color: "var(--accent)",
                border: "1px solid rgba(0, 212, 255, 0.2)",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              <FiRefreshCw /> Run & Refresh
            </button>
          </div>
        </div>

        {/* Info Header */}
        <header className="mb-10">
          <p
            className="section-label"
            style={{
              fontFamily: "JetBrains Mono, monospace",
              color: "var(--accent)",
            }}
          >
            // developer tools
          </p>
          <h1
            className="section-title"
            style={{ fontSize: "2.4rem", marginTop: "6px", fontWeight: 700 }}
          >
            Interactive Workspace & Sandbox
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              marginTop: "8px",
              maxWidth: "800px",
            }}
          >
            Explore live snapshots of real components source code directly from this repository on the explorer pane. Edit <code style={{ color: "var(--accent-green)" }}>App.jsx</code> or <code style={{ color: "var(--accent-green)" }}>index.css</code> below to see sandbox compilation results rendered instantly on the emulator.
          </p>
        </header>

        {/* 3-Pane Editor Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "250px 1fr 1.1fr",
            gap: "20px",
            height: "75vh",
            minHeight: "600px",
          }}
          className="playground-grid"
        >
          {/* Pane 1 - Explorer Sidebar */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: "var(--bg-secondary)",
                borderBottom: "1px solid var(--border)",
                padding: "14px 16px",
                fontSize: "0.8rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontWeight: 600,
                color: "var(--text-secondary)",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              Workspace Explorer
            </div>
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "12px 6px",
              }}
            >
              {renderTree(EXPLORER_DATA)}
            </div>
          </div>

          {/* Pane 2 - Code Editor */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Editor Tab Headers */}
            <div
              style={{
                background: "var(--bg-secondary)",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                padding: "0 8px",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    background: "var(--bg-card)",
                    color: "var(--accent)",
                    borderBottom: "2px solid var(--accent)",
                    padding: "10px 16px",
                    fontSize: "0.85rem",
                    fontFamily: "JetBrains Mono, monospace",
                    fontWeight: 600,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <FiCode /> {selectedFile.split("/").pop()}
                </div>
              </div>
              {isReadOnlyActive && (
                <span
                  style={{
                    fontSize: "0.75rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    color: "var(--text-secondary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    marginRight: "8px",
                  }}
                >
                  <FiLock size={10} /> Read-only
                </span>
              )}
            </div>

            {/* Code Input Textarea */}
            <div style={{ flex: 1, position: "relative" }}>
              <textarea
                value={getActiveFileContent()}
                onChange={(e) => handleCodeChange(e.target.value)}
                readOnly={isReadOnlyActive}
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  outline: "none",
                  background: "#090d16",
                  color: isReadOnlyActive ? "#8ba1b5" : "#e2e8f0",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.95rem",
                  padding: "20px",
                  resize: "none",
                  lineHeight: "1.6",
                  opacity: isReadOnlyActive ? 0.85 : 1,
                }}
                spellCheck={false}
              />
            </div>
          </div>

          {/* Pane 3 - Sandbox Preview */}
          <div
            style={{
              background: "#0f172a",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Browser Emulator header */}
            <div
              style={{
                background: "var(--bg-secondary)",
                borderBottom: "1px solid var(--border)",
                padding: "8px 16px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              {/* Dots */}
              <div style={{ display: "flex", gap: "6px" }}>
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "#ef4444",
                  }}
                />
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "#eab308",
                  }}
                />
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "#22c55e",
                  }}
                />
              </div>

              {/* URL Address Bar */}
              <div
                style={{
                  flex: 1,
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: "6px",
                  padding: "4px 12px",
                  fontSize: "0.78rem",
                  fontFamily: "JetBrains Mono, monospace",
                  color: "#64748b",
                  border: "1px solid rgba(255,255,255,0.05)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                https://localhost:3000/sandbox
              </div>
            </div>

            {/* Sandbox iframe */}
            <div style={{ flex: 1, background: "#0f172a" }}>
              <iframe
                ref={iframeRef}
                srcDoc={iframeSrcDoc}
                title="Code Sandbox"
                sandbox="allow-scripts"
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  background: "#0f172a",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
