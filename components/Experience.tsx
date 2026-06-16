'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import GitTimeline from './GitTimeline'

interface Experience {
  _id: string
  company: string
  role: string
  startDate: string
  endDate: string
  description: string
}

function parseDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  return new Date(dateStr);
}

function formatDate(dateStr: string) {
  if (!dateStr) return 'Present';
  if (dateStr.toLowerCase() === 'present') return 'Present';
  const date = parseDate(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

import { useLanguage } from "@/context/LanguageContext";

export default function Experience({ data }: { data: Experience[] }) {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<'list' | 'git'>('list');
  const sorted = [...data].sort(
    (a, b) => parseDate(b.startDate).getTime() - parseDate(a.startDate).getTime()
  );

  return (
    <section id="experience">
      <div className="container">

        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}
        >
          <div>
            <p className="section-label">{t("experience_label")}</p>
            <h2 className="section-title" style={{ marginBottom: 0 }}>{t("experience_title")}</h2>
          </div>
          
          {/* Switcher tabs */}
          <div style={{ display: "flex", gap: "10px", background: "var(--bg-secondary)", padding: "4px", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <button
              onClick={() => setViewMode('list')}
              style={{
                background: viewMode === 'list' ? 'var(--bg-card)' : 'transparent',
                color: viewMode === 'list' ? 'var(--accent)' : 'var(--text-secondary)',
                border: 'none',
                padding: '6px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('git')}
              style={{
                background: viewMode === 'git' ? 'var(--bg-card)' : 'transparent',
                color: viewMode === 'git' ? 'var(--accent)' : 'var(--text-secondary)',
                border: 'none',
                padding: '6px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
            >
              Git Graph
            </button>
          </div>
        </motion.div>

        {viewMode === 'list' ? (
          <div className="timeline">
            {sorted.map((exp, i) => (
              <motion.div
                key={exp._id}
                className="timeline-item"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                {/* Left — Date */}
                <div className="timeline-date">
                  <span>{formatDate(exp.startDate)}</span>
                  <span className="timeline-date-sep">—</span>
                  <span>{formatDate(exp.endDate)}</span>
                </div>

                {/* Center — Line + Dot */}
                <div className="timeline-center">
                  <div className="timeline-dot" />
                  <div className="timeline-line" />
                </div>

                {/* Right — Card */}
                <div className="timeline-card">
                  <h3 className="timeline-role">{exp.role}</h3>
                  <p className="timeline-company">{exp.company}</p>
                  <p className="timeline-desc">{exp.description}</p>
                </div>

              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <GitTimeline />
          </motion.div>
        )}

      </div>
    </section>
  )
}