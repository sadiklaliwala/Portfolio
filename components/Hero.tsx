'use client'

import { useState, useEffect } from 'react'
import { TypeAnimation } from 'react-type-animation'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface HeroData {
  name: string
  taglines: string[]
  subtext: string
  resumeLink: string
}

export default function Hero({ data }: { data: HeroData }) {
  const sequence = data.taglines.flatMap(t => [t, 2000])
  const [personalGreeting, setPersonalGreeting] = useState("")

  useEffect(() => {
    // 1. Get UTM/Referrer info
    const params = new URLSearchParams(window.location.search)
    const utmSource = params.get("utm_source")?.toLowerCase() || ""
    const ref = params.get("ref")?.toLowerCase() || ""
    const source = utmSource || ref

    let sourceText = ""
    if (source === "linkedin") {
      sourceText = "LinkedIn network member 💼"
    } else if (source === "github") {
      sourceText = "GitHub explorer 🐙"
    } else if (source === "twitter" || source === "x") {
      sourceText = "Twitter/X friend 🐦"
    } else if (source === "devto") {
      sourceText = "Dev.to reader ✍️"
    } else if (source) {
      sourceText = `${source} visitor`
    }

    // 2. Fetch location client-side
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((geoData) => {
        if (geoData && geoData.city && geoData.country_name) {
          const locationText = `from ${geoData.city}, ${geoData.country_name} 🌍`
          if (sourceText) {
            setPersonalGreeting(`Special welcome to my ${sourceText} ${locationText}!`)
          } else {
            setPersonalGreeting(`Hello visitor ${locationText}! Thanks for stopping by.`)
          }
        } else if (sourceText) {
          setPersonalGreeting(`Special welcome to my ${sourceText}!`)
        }
      })
      .catch(() => {
        if (sourceText) {
          setPersonalGreeting(`Special welcome to my ${sourceText}!`)
        }
      })
  }, [])

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
            {personalGreeting && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="personalized-greeting"
              >
                {personalGreeting}
              </motion.div>
            )}
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

            <div className="hero-buttons" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a href="#projects" className="btn-primary">
                View Projects
              </a>
              <Link href="/blog" className="btn-secondary">
                Read Blog
              </Link>
              {data.resumeLink && (
                <a href={data.resumeLink} target="_blank" className="btn-secondary" style={{ opacity: 0.8 }}>
                  Resume
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
  const [time, setTime] = useState("")
  const [status, setStatus] = useState("")

  useEffect(() => {
    const updateClock = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }
      const kolkataTime = new Date().toLocaleString("en-US", options)
      setTime(kolkataTime)

      const currentHour = parseInt(
        new Date().toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "numeric",
          hour12: false,
        }),
        10
      )

      if (currentHour >= 9 && currentHour < 18) {
        setStatus("Coding & Building 💻")
      } else if (currentHour >= 18 && currentHour < 23) {
        setStatus("Learning & Experimenting 🚀")
      } else {
        setStatus("Sleeping & Charging batteries 😴")
      }
    }

    updateClock()
    const timer = setInterval(updateClock, 1000)
    return () => clearInterval(timer)
  }, [])

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
          <span className="terminal-cmd">curl -s time.api</span>
        </div>
        <div className="terminal-output">
          IST Time: {time || "Loading..."}
        </div>
        <div className="terminal-output">
          Activity: {status || "Loading..."}
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