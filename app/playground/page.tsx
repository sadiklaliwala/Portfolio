"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  FiPlay,
  FiRefreshCw,
  FiCode,
  FiLayers,
  FiMaximize2,
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

export default function PlaygroundPage() {
  const [activeTab, setActiveTab] = useState<"jsx" | "css">("jsx");
  const [jsxCode, setJsxCode] = useState(DEFAULT_JSX);
  const [cssCode, setCssCode] = useState(DEFAULT_CSS);
  const [iframeSrcDoc, setIframeSrcDoc] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  return (
    <main
      className="min-h-screen py-16 relative z-10"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="container" style={{ maxWidth: "1280px" }}>
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
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
            Live Code Playground
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              marginTop: "8px",
              maxWidth: "800px",
            }}
          >
            Test your ideas in a React sandbox. Write JSX components and vanilla
            CSS to see immediate results rendered in a secured environment.
          </p>
        </header>

        {/* Split Editor Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            height: "70vh",
            minHeight: "550px",
          }}
          className="playground-grid"
        >
          {/* Left panel - Editors */}
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
                padding: "4px 8px",
              }}
            >
              <button
                onClick={() => setActiveTab("jsx")}
                style={{
                  background:
                    activeTab === "jsx" ? "var(--bg-card)" : "transparent",
                  color:
                    activeTab === "jsx"
                      ? "var(--accent)"
                      : "var(--text-secondary)",
                  border: "none",
                  borderBottom:
                    activeTab === "jsx" ? "2px solid var(--accent)" : "none",
                  padding: "10px 16px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontFamily: "JetBrains Mono, monospace",
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  borderRadius: "4px 4px 0 0",
                }}
              >
                <FiCode /> App.jsx
              </button>
              <button
                onClick={() => setActiveTab("css")}
                style={{
                  background:
                    activeTab === "css" ? "var(--bg-card)" : "transparent",
                  color:
                    activeTab === "css"
                      ? "var(--accent)"
                      : "var(--text-secondary)",
                  border: "none",
                  borderBottom:
                    activeTab === "css" ? "2px solid var(--accent)" : "none",
                  padding: "10px 16px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontFamily: "JetBrains Mono, monospace",
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  borderRadius: "4px 4px 0 0",
                }}
              >
                <FiLayers /> index.css
              </button>
            </div>

            {/* Code inputs */}
            <div style={{ flex: 1, position: "relative" }}>
              {activeTab === "jsx" ? (
                <textarea
                  value={jsxCode}
                  onChange={(e) => setJsxCode(e.target.value)}
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    outline: "none",
                    background: "#090d16",
                    color: "#e2e8f0",
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "0.95rem",
                    padding: "20px",
                    resize: "none",
                    lineHeight: "1.6",
                  }}
                  spellCheck={false}
                />
              ) : (
                <textarea
                  value={cssCode}
                  onChange={(e) => setCssCode(e.target.value)}
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    outline: "none",
                    background: "#090d16",
                    color: "#e2e8f0",
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "0.95rem",
                    padding: "20px",
                    resize: "none",
                    lineHeight: "1.6",
                  }}
                  spellCheck={false}
                />
              )}
            </div>
          </div>

          {/* Right panel - Sandbox Preview */}
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
            {/* Browser-like header */}
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
              {/* Emulator Dots */}
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
