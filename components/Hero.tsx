'use client'

import { useState, useEffect, useRef } from 'react'
import { TypeAnimation } from 'react-type-animation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useAchievements } from '@/context/AchievementContext'

interface HeroData {
  name: string
  taglines: string[]
  subtext: string
  resumeLink: string
}

function getWeatherGreeting(code: number, temp: number): string {
  let condition = "have a wonderful day";
  let icon = "☀️";

  if (code === 0) {
    condition = "it's currently sunny";
    icon = "☀️";
  } else if ([1, 2, 3].includes(code)) {
    condition = "it's currently partly cloudy";
    icon = "⛅";
  } else if ([45, 48].includes(code)) {
    condition = "it's currently foggy";
    icon = "🌫️";
  } else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
    condition = "it's currently raining—grab a warm coffee and stay dry";
    icon = "🌧️";
  } else if ([71, 73, 75, 77, 85, 86].includes(code)) {
    condition = "it's currently snowing—stay warm out there";
    icon = "❄️";
  } else if ([95, 96, 99].includes(code)) {
    condition = "there's a thunderstorm—stay safe indoors";
    icon = "⛈️";
  }

  return `It's currently ${condition} (${temp}°C) ${icon}`;
}

const getTimeOfDayGreeting = (): { greeting: string; icon: string } => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return { greeting: "Good morning", icon: "🌅" };
  } else if (hour >= 12 && hour < 17) {
    return { greeting: "Good afternoon", icon: "🌤️" };
  } else if (hour >= 17 && hour < 22) {
    return { greeting: "Good evening", icon: "🌙" };
  } else {
    return { greeting: "Hope you're having a peaceful night", icon: "🦉" };
  }
};

export default function Hero({ data }: { data: HeroData }) {
  const sequence = data.taglines.flatMap(t => [t, 2000])
  const [personalGreeting, setPersonalGreeting] = useState("")
  const { unlockAchievement } = useAchievements()

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

    // Check for Night Owl achievement (12 AM - 5 AM local time)
    const hour = new Date().getHours()
    if (hour >= 0 && hour < 5) {
      unlockAchievement("night_owl")
    }

    // 2. Fetch location client-side
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((geoData) => {
        if (geoData && geoData.city && geoData.country_name) {
          const timeInfo = getTimeOfDayGreeting()
          const lat = geoData.latitude
          const lon = geoData.longitude

          if (lat && lon) {
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
              .then((res) => res.json())
              .then((weatherData) => {
                const current = weatherData.current_weather
                if (current) {
                  const weatherText = getWeatherGreeting(current.weathercode, current.temperature)
                  if (sourceText) {
                    setPersonalGreeting(`Special welcome to my ${sourceText} from ${geoData.city}, ${geoData.country_name}! ${weatherText}!`)
                  } else {
                    setPersonalGreeting(`${timeInfo.greeting} visitor from ${geoData.city}, ${geoData.country_name}! ${weatherText}!`)
                  }
                } else {
                  // Fallback if no current weather
                  if (sourceText) {
                    setPersonalGreeting(`Special welcome to my ${sourceText} from ${geoData.city}, ${geoData.country_name}! ${timeInfo.icon}`)
                  } else {
                    setPersonalGreeting(`${timeInfo.greeting} visitor from ${geoData.city}, ${geoData.country_name}! Thanks for stopping by ${timeInfo.icon}`)
                  }
                }
              })
              .catch(() => {
                // Fallback on weather fetch error
                if (sourceText) {
                  setPersonalGreeting(`Special welcome to my ${sourceText} from ${geoData.city}, ${geoData.country_name}! ${timeInfo.icon}`)
                } else {
                  setPersonalGreeting(`${timeInfo.greeting} visitor from ${geoData.city}, ${geoData.country_name}! Thanks for stopping by ${timeInfo.icon}`)
                }
              })
          } else {
            // Fallback if no latitude/longitude
            if (sourceText) {
              setPersonalGreeting(`Special welcome to my ${sourceText} from ${geoData.city}, ${geoData.country_name}! ${timeInfo.icon}`)
            } else {
              setPersonalGreeting(`${timeInfo.greeting} visitor from ${geoData.city}, ${geoData.country_name}! Thanks for stopping by ${timeInfo.icon}`)
            }
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
  const [input, setInput] = useState("")
  const [visitorCity, setVisitorCity] = useState("")
  const [visitorIp, setVisitorIp] = useState("")
  const [matrixActive, setMatrixActive] = useState(false)
  const [history, setHistory] = useState<{ command: string; output: string | string[] }[]>([])
  
  const { unlockAchievement, incrementProgress } = useAchievements()
  const inputRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Focus terminal input after hydration/mount
    const timer = setTimeout(() => {
      inputRef.current?.focus()
    }, 100)

    // Fetch location
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data.city) {
          setVisitorCity(data.city)
          setVisitorIp(data.ip)
        }
      })
      .catch(() => {})

    return () => clearTimeout(timer)
  }, [])

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

  // Auto scroll to bottom
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [history, input])

  const handleTerminalClick = (e: React.MouseEvent | React.TouchEvent) => {
    if ((e.target as HTMLElement).tagName !== "A" && (e.target as HTMLElement).tagName !== "BUTTON") {
      inputRef.current?.focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const args = input.trim().split(" ")
    const cmd = args[0].toLowerCase()
    if (!cmd) return

    let output: string | string[] = ""

    switch (cmd) {
      case "help":
        output = [
          "Available commands:",
          "  whoami   - Display identity & visitor info",
          "  skills   - List technical core skills",
          "  status   - View current learning/coding status",
          "  time     - Show current IST clock time",
          "  theme    - Switch color themes (usage: theme [name])",
          "  matrix   - Trigger a digital rain effect",
          "  clear    - Clear terminal history",
        ]
        break
      case "whoami":
        output = [
          `Identity: ${name}`,
          `Role: Full Stack Software Engineer`,
          `Visitor IP: ${visitorIp || "127.0.0.1"}`,
          `Visitor Location: ${visitorCity || "Unknown Location"}`,
        ]
        break
      case "skills":
        output = [
          "Languages: TypeScript, JavaScript, HTML, CSS",
          "Frameworks: React 19, Next.js 16, Node.js, Express",
          "Databases & Tools: Sanity CMS, PostgreSQL, MongoDB, Git",
        ]
        break
      case "status":
        output = [
          `Current Activity: ${status}`,
          "Availability: Open to Full-Time roles and freelance contracts.",
        ]
        break
      case "time":
        output = `Kolkata Time (IST): ${time}`
        break
      case "theme": {
        const themeName = args[1]?.toLowerCase()
        if (!themeName) {
          output = [
            "Usage: theme [midnight | matrix | cyberpunk | light]",
            "Example: theme matrix"
          ]
        } else if (["midnight", "matrix", "cyberpunk", "light"].includes(themeName)) {
          localStorage.setItem("portfolio-theme", themeName)
          document.documentElement.setAttribute("data-theme", themeName)
          output = `Theme switched to '${themeName}' successfully!`
        } else {
          output = `Unknown theme: '${themeName}'. Available: midnight, matrix, cyberpunk, light.`
        }
        break
      }
      case "matrix":
        setMatrixActive(true)
        setTimeout(() => setMatrixActive(false), 5000)
        unlockAchievement("time_traveler")
        output = "Matrix simulation initialized for 5s..."
        break
      case "clear":
        setHistory([])
        setInput("")
        return
      default:
        output = `command not found: '${cmd}'. Type "help" for instructions.`
    }

    setHistory((prev) => [...prev, { command: input, output }])
    incrementProgress("terminal_hacker")
    setInput("")
  }

  return (
    <div 
      className="terminal" 
      onClick={handleTerminalClick} 
      onTouchEnd={handleTerminalClick}
      style={{ cursor: "text", position: "relative" }}
    >
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        <span className="terminal-title">portfolio.exe</span>
      </div>
      <div 
        className="terminal-body" 
        ref={bodyRef}
        style={{ 
          maxHeight: "320px", 
          overflowY: "auto", 
          position: "relative",
          scrollbarWidth: "none" 
        }}
      >
        {matrixActive && <MatrixRain />}

        {/* Initial welcome lines shown before any user commands */}
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

        {/* User run history */}
        {history.map((item, idx) => (
          <div key={idx} style={{ marginTop: "12px" }}>
            <div className="terminal-line">
              <span className="terminal-prompt">$ </span>
              <span className="terminal-cmd">{item.command}</span>
            </div>
            {Array.isArray(item.output) ? (
              item.output.map((line, lIdx) => (
                <div key={lIdx} className="terminal-output">
                  {line}
                </div>
              ))
            ) : (
              <div className="terminal-output">{item.output}</div>
            )}
          </div>
        ))}

        {/* Input line */}
        <form onSubmit={handleSubmit} style={{ marginTop: "12px", display: "flex", alignItems: "center" }}>
          <span className="terminal-prompt" style={{ marginRight: "6px" }}>$ </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--accent-green)",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.9rem",
              flex: 1,
              width: "100%",
              minWidth: "0px",
              padding: 0,
              margin: 0
            }}
            autoCapitalize="off"
            autoComplete="off"
            spellCheck={false}
          />
        </form>
      </div>
    </div>
  )
}

function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.parentElement?.clientWidth || 400
    canvas.height = canvas.parentElement?.clientHeight || 250

    const columns = Math.floor(canvas.width / 14)
    const rainDrops = Array(columns).fill(1)
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*+-/="

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#00ff88"
      ctx.font = "13px monospace"

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length))
        ctx.fillText(text, i * 14, rainDrops[i] * 14)

        if (rainDrops[i] * 14 > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0
        }
        rainDrops[i]++
      }
    }

    const interval = setInterval(draw, 35)
    return () => clearInterval(interval)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 5,
        borderRadius: "0 0 8px 8px"
      }}
    />
  )
}

function DotGrid() {
  return (
    <div className="dot-grid" aria-hidden="true" />
  )
}