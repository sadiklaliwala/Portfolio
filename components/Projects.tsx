"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
  image: any;
  slug?: { current: string };
  projectType?: string;
}

function getProjectTypeBadge(type?: string) {
  if (!type) return null;
  switch (type) {
    case 'Solo Project':
      return '👤 Solo Project';
    case 'Team Project':
      return '👥 Team Project';
    case 'Freelance Project':
      return '💼 Freelance Project';
    case 'Open Source Contribution':
      return '🌐 Open Source';
    case 'Helped Friend':
      return '🤝 Helped Friend';
    default:
      return type;
  }
}

export default function Projects({ data = [] }: { data: Project[] }) {
  const [filter, setFilter] = useState("All");

  const allTechs = [
    "All",
    ...Array.from(new Set((data || []).flatMap((p) => p.techStack || []))),
  ];

  const filtered =
    filter === "All" ? data : (data || []).filter((p) => p.techStack?.includes(filter));

  return (
    <section id="projects" style={{ background: "var(--bg-section)" }}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="section-label">// what I've built</p>
          <h2 className="section-title">Projects</h2>
        </motion.div>

        {/* Filter Bar */}
        <div className="filter-bar">
          {allTechs.slice(0, 7).map((tech) => (
            <button
              key={tech}
              className={`filter-btn ${filter === tech ? "active" : ""}`}
              onClick={() => setFilter(tech)}
            >
              {tech}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div className="projects-grid" layout>
          <AnimatePresence>
            {filtered.map((project, i) => (
              <motion.div
                key={project._id}
                className="project-card"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                layout
              >
                {/* Image */}
                <div className="project-image-wrapper">
                  {project.image ? (
                    <Link href={`/projects/${project.slug?.current || '#'}`} className="project-image-link">
                      <Image
                        src={urlFor(project.image).width(600).height(340).url()}
                        alt={project.title}
                        width={600}
                        height={340}
                        className="project-image"
                      />
                    </Link>
                  ) : (
                    <Link href={`/projects/${project.slug?.current || '#'}`} className="project-image-link">
                      <div className="project-image-placeholder">
                        <span>{project.title[0]}</span>
                      </div>
                    </Link>
                  )}
                  <div className="project-image-overlay">
                    <div className="project-links">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          className="project-link"
                          rel="noopener noreferrer"
                        >
                          <FiGithub size={18} />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          className="project-link"
                          rel="noopener noreferrer"
                        >
                          <FiExternalLink size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="project-content">
                  {project.projectType && (
                    <div className="project-type-badge-container">
                      <span className="project-type-badge">
                        {getProjectTypeBadge(project.projectType)}
                      </span>
                    </div>
                  )}
                  <h3 className="project-title">
                    <Link href={`/projects/${project.slug?.current || '#'}`} className="project-title-link">
                      {project.title}
                    </Link>
                  </h3>
                  <p className="project-desc">{project.description}</p>
                  <div className="project-techs">
                    {project.techStack?.map((tech, j) => (
                      <span key={j} className="project-tech">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
