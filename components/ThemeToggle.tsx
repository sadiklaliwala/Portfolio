"use client";

import { useEffect, useState, useRef } from "react";
import { FiSliders, FiCheck } from "react-icons/fi";

const themes = [
  { id: "midnight", name: "Midnight Code", color: "#00d4ff" },
  { id: "matrix", name: "Matrix Rain", color: "#00ff88" },
  { id: "cyberpunk", name: "Cyberpunk Hack", color: "#ff007f" },
  { id: "light", name: "Light Mode", color: "#0284c7" },
];

export default function ThemeToggle() {
  const [open, setOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("midnight");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Read initial theme from document attribute
    const theme = document.documentElement.getAttribute("data-theme") || "midnight";
    setCurrentTheme(theme);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeTheme = (themeId: string) => {
    setCurrentTheme(themeId);
    localStorage.setItem("portfolio-theme", themeId);
    document.documentElement.setAttribute("data-theme", themeId);
    setOpen(false);
  };

  return (
    <div className="theme-toggle-container" ref={menuRef}>
      <button 
        type="button"
        className={`theme-toggle-btn ${open ? "active" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label="Switch UI Theme"
      >
        <FiSliders size={18} />
      </button>

      {open && (
        <div className="theme-menu">
          <div className="theme-menu-header">UI Themes</div>
          <div className="theme-menu-list">
            {themes.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`theme-menu-item ${currentTheme === t.id ? "active" : ""}`}
                onClick={() => changeTheme(t.id)}
              >
                <span className="theme-color-dot" style={{ backgroundColor: t.color }} />
                <span className="theme-name">{t.name}</span>
                {currentTheme === t.id && <FiCheck className="theme-check-icon" size={14} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
