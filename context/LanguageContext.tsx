"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "hi" | "es";

const DICTIONARIES = {
  en: {
    // Navigation
    projects: "Projects",
    about: "About",
    skills: "Skills",
    experience: "Experience",
    contact: "Contact",
    blog: "Blog",
    playground: "Playground",
    // Hero titles
    tagline_prefix: "Hi, I'm",
    view_projects: "View Projects",
    read_blog: "Read Blog",
    resume: "Resume",
    years_exp: "Years Exp",
    technologies: "Technologies",
    projects_stat: "Projects",
    // Sections
    about_title: "About Me",
    skills_title: "Core Stack",
    projects_title: "Projects",
    events_title: "Timeline Events",
    experience_title: "Work Experience",
    contact_title: "Get In Touch",
    github_title: "GitHub Activity",
    // Sub-labels
    about_label: "// who I am",
    skills_label: "// my toolkit",
    projects_label: "// what I've built",
    events_label: "// my history",
    experience_label: "// where I've worked",
    contact_label: "// let's talk",
    github_label: "// live feed",
  },
  hi: {
    // Navigation
    projects: "परियोजनाएं",
    about: "मेरे बारे में",
    skills: "कौशल",
    experience: "अनुभव",
    contact: "संपर्क",
    blog: "ब्लॉग",
    playground: "प्लेग्राउंड",
    // Hero titles
    tagline_prefix: "नमस्ते, मैं हूँ",
    view_projects: "परियोजनाएं देखें",
    read_blog: "ब्लॉग पढ़ें",
    resume: "बायोडाटा",
    years_exp: "वर्षों का अनुभव",
    technologies: "तकनीकें",
    projects_stat: "परियोजनाएं",
    // Sections
    about_title: "मेरे बारे में",
    skills_title: "मुख्य कौशल",
    projects_title: "परियोजनाएं",
    events_title: "समयरेखा",
    experience_title: "कार्य अनुभव",
    contact_title: "संपर्क करें",
    github_title: "गिटहब गतिविधि",
    // Sub-labels
    about_label: "// मैं कौन हूँ",
    skills_label: "// मेरी टoolkit",
    projects_label: "// जो मैंने बनाया",
    events_label: "// मेरा इतिहास",
    experience_label: "// जहां मैंने काम किया",
    contact_label: "// बात करते हैं",
    github_label: "// लाइव फीड",
  },
  es: {
    // Navigation
    projects: "Proyectos",
    about: "Sobre mí",
    skills: "Habilidades",
    experience: "Experiencia",
    contact: "Contacto",
    blog: "Blog",
    playground: "Playground",
    // Hero titles
    tagline_prefix: "Hola, soy",
    view_projects: "Ver Proyectos",
    read_blog: "Leer Blog",
    resume: "Currículum",
    years_exp: "Años de Exp",
    technologies: "Tecnologías",
    projects_stat: "Proyectos",
    // Sections
    about_title: "Sobre Mí",
    skills_title: "Habilidades Clave",
    projects_title: "Proyectos",
    events_title: "Línea de Tiempo",
    experience_title: "Experiencia Laboral",
    contact_title: "Contacto",
    github_title: "Actividad de GitHub",
    // Sub-labels
    about_label: "// quién soy",
    skills_label: "// mi caja de herramientas",
    projects_label: "// lo que he construido",
    events_label: "// mi historial",
    experience_label: "// donde he trabajado",
    contact_label: "// hablemos",
    github_label: "// feed en vivo",
  }
};

type DictionaryKey = keyof typeof DICTIONARIES.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: DictionaryKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("portfolio-language") as Language;
      if (stored === "en" || stored === "hi" || stored === "es") {
        setLanguageState(stored);
      }
    } catch (e) {}
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("portfolio-language", lang);
    } catch (e) {}
  };

  const t = (key: DictionaryKey): string => {
    const dict = DICTIONARIES[language] || DICTIONARIES.en;
    return dict[key] || DICTIONARIES.en[key] || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
