'use client'

import { motion } from 'framer-motion'

interface Experience {
  _id: string
  company: string
  role: string
  startDate: string
  endDate: string
  description: string
}

function formatDate(dateStr: string) {
  if (!dateStr) return 'Present'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default function Experience({ data }: { data: Experience[] }) {
  const sorted = [...data].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  )

  return (
    <section id="experience">
      <div className="container">

        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="section-label">// where I've worked</p>
          <h2 className="section-title">Experience</h2>
        </motion.div>

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

      </div>
    </section>
  )
}