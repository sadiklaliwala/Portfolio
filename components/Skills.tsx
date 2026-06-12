'use client'

import { motion } from 'framer-motion'
import RadarChart from './RadarChart'

interface SkillCategory {
  _id: string
  category: string
  technologies: string[]
}

const categoryIcons: Record<string, string> = {
  Frontend: '🎨',
  Backend: '⚙️',
  'Tools & Others': '🛠️',
}

const categoryRatings: Record<string, number> = {
  Frontend: 92,
  Backend: 88,
  'Tools & Others': 80,
}

export default function Skills({ data }: { data: SkillCategory[] }) {
  // Map categories for the Radar Chart, ensuring we have at least 3 points
  let radarData = data.map((item) => ({
    label: item.category,
    value: categoryRatings[item.category] ?? 85,
  }))

  if (radarData.length === 2) {
    radarData.push({ label: 'DevOps & Cloud', value: 75 })
  } else if (radarData.length === 1) {
    radarData.push({ label: 'Backend', value: 80 })
    radarData.push({ label: 'DevOps & Cloud', value: 70 })
  }

  return (
    <section id="skills" style={{ background: 'var(--bg-section)' }}>
      <div className="container">

        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="section-label">// what I know</p>
          <h2 className="section-title">Skills & Technologies</h2>
        </motion.div>

        <div className="skills-container">
          <motion.div
            className="skills-chart-side"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {radarData.length >= 3 && <RadarChart data={radarData} />}
          </motion.div>

          <div className="skills-grid">
            {data.map((skillGroup, i) => (
              <motion.div
                key={skillGroup._id}
                className="skill-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <div className="skill-card-header">
                  <span className="skill-icon">
                    {categoryIcons[skillGroup.category] ?? '💡'}
                  </span>
                  <h3 className="skill-category">{skillGroup.category}</h3>
                </div>

                <div className="skill-pills">
                  {skillGroup.technologies.map((tech, j) => (
                    <motion.span
                      key={j}
                      className="skill-pill"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.1 + j * 0.05 }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}