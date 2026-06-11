'use client'

import { TypeAnimation } from 'react-type-animation'
import { motion } from 'framer-motion'

interface HeroData {
  name: string
  taglines: string[]
  subtext: string
  resumeLink: string
}

export default function Hero({ data }: { data: HeroData }) {
  const sequence = data.taglines.flatMap(t => [t, 2000])

  return (
    <section className="hero-section">
      <DotGrid />
      <div className="container">
        <div className="hero-content">

          {/* Left Side */}
          <motion.div
            className="hero-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="hero-greeting">Hi, I'm</p>
            <h1 className="hero-name">{data.name}</h1>
            <div className="hero-typewriter">
              <span className="accent-text">&lt;</span>
              <TypeAnimation
                sequence={sequence}
                wrapper="span"
                speed={50}
                repeat={Infinity}
                className="typewriter-text"
              />
              <span className="accent-text"> /&gt;</span>
            </div>
            <p className="hero-subtext">{data.subtext}</p>

            <div className="hero-buttons">
              <a href="#projects" className="btn-primary">
                View Projects
              </a>
              {data.resumeLink && (
                <a href={data.resumeLink} target="_blank" className="btn-secondary">
                  Download Resume
                </a>
              )}
            </div>

            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">10+</span>
                <span className="stat-label">Projects</span>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <span className="stat-number">2+</span>
                <span className="stat-label">Years Exp</span>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <span className="stat-number">15+</span>
                <span className="stat-label">Technologies</span>
              </div>
            </div>
          </motion.div>

          {/* Right Side — Terminal Card */}
          <motion.div
            className="hero-right"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <TerminalCard name={data.name} />
          </motion.div>

        </div>
      </div>
    </section>
  )
}

function TerminalCard({ name }: { name: string }) {
  return (
    <div className="terminal">
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        <span className="terminal-title">portfolio.exe</span>
      </div>
      <div className="terminal-body">
        <div className="terminal-line">
          <span className="terminal-prompt">$ </span>
          <span className="terminal-cmd">whoami</span>
        </div>
        <div className="terminal-output">{name}</div>

        <div className="terminal-line mt">
          <span className="terminal-prompt">$ </span>
          <span className="terminal-cmd">cat skills.txt</span>
        </div>
        <div className="terminal-output">React, Next.js, Node.js,</div>
        <div className="terminal-output">TypeScript, Tailwind, MongoDB</div>

        <div className="terminal-line mt">
          <span className="terminal-prompt">$ </span>
          <span className="terminal-cmd">cat status.txt</span>
        </div>
        <div className="terminal-output accent">
          Available for opportunities ✓
        </div>

        <div className="terminal-line mt">
          <span className="terminal-prompt">$ </span>
          <span className="terminal-cursor">█</span>
        </div>
      </div>
    </div>
  )
}

function DotGrid() {
  return (
    <div className="dot-grid" aria-hidden="true" />
  )
}