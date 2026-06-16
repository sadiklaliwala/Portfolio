"use client";

import { useState, useRef, useEffect } from "react";
import { FiGlobe, FiCheck } from "react-icons/fi";
import { useLanguage, Language } from "@/context/LanguageContext";

const languagesList = [
  { id: "en" as Language, name: "English", flag: "🇬🇧" },
  { id: "hi" as Language, name: "हिंदी", flag: "🇮🇳" },
  { id: "es" as Language, name: "Español", flag: "🇪🇸" },
];

export default function LanguageToggle() {
  const [open, setOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectLanguage = (langId: Language) => {
    setLanguage(langId);
    setOpen(false);
  };

  return (
    <div className="lang-toggle-container" ref={menuRef}>
      <button
        type="button"
        className={`lang-toggle-btn ${open ? "active" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label="Select Language"
      >
        <FiGlobe size={18} />
      </button>

      {open && (
        <div className="lang-menu">
          <div className="lang-menu-header">Language / भाषा</div>
          <div className="lang-menu-list">
            {languagesList.map((lang) => (
              <button
                key={lang.id}
                type="button"
                className={`lang-menu-item ${language === lang.id ? "active" : ""}`}
                onClick={() => handleSelectLanguage(lang.id)}
              >
                <span className="lang-flag">{lang.flag}</span>
                <span className="lang-name">{lang.name}</span>
                {language === lang.id && <FiCheck className="lang-check-icon" size={14} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
