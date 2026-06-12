"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FiGithub, FiExternalLink, FiArrowLeft, FiClock, FiTag, FiUser } from "react-icons/fi";
import { urlFor } from "@/sanity/lib/image";

interface ProjectDetailProps {
  project: {
    title: string;
    description: string;
    fullDescription?: string;
    problem?: string;
    solution?: string;
    outcome?: string;
    myRole?: string;
    duration?: string;
    projectType?: string;
    techStack?: string[];
    liveUrl?: string;
    githubUrl?: string;
    image?: any;
    gallery?: any[];
    challenges?: string;
    improvements?: string;
  };
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

export default function ProjectDetail({ project }: ProjectDetailProps) {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="detail-page-wrapper">
      {/* Top Navigation */}
      <div className="container">
        <div className="detail-nav">
          <Link href="/#projects" className="back-btn">
            <FiArrowLeft size={16} />
            <span>Back to Projects</span>
          </Link>
        </div>
      </div>

      {/* Hero Header */}
      <div className="detail-hero-section">
        <div className="container">
          <motion.div 
            className="detail-hero-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="detail-meta-badges">
              {project.projectType && (
                <span className="badge">
                  {getProjectTypeBadge(project.projectType)}
                </span>
              )}
              {project.duration && (
                <span className="badge">
                  <FiClock size={12} style={{ marginRight: '4px' }} />
                  {project.duration}
                </span>
              )}
            </div>
            <h1 className="detail-title">{project.title}</h1>
            <p className="detail-short-desc">{project.description}</p>

            <div className="detail-links">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  <FiExternalLink size={16} style={{ marginRight: '8px' }} />
                  Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  <FiGithub size={16} style={{ marginRight: '8px' }} />
                  Source Code
                </a>
              )}
            </div>
          </motion.div>
        </div>

        {/* Hero Image */}
        <div className="detail-hero-image-container">
          {project.image ? (
            <Image
              src={urlFor(project.image).width(1200).height(500).url()}
              alt={project.title}
              width={1200}
              height={500}
              className="detail-hero-image"
              priority
            />
          ) : (
            <div className="detail-hero-placeholder">
              <span>{project.title[0]}</span>
            </div>
          )}
        </div>
      </div>

      {/* Info Row (3 columns) */}
      <div className="detail-info-strip" style={{ background: "var(--bg-secondary)" }}>
        <div className="container">
          <div className="info-strip-grid">
            <div className="info-strip-col">
              <FiUser className="info-strip-icon" />
              <div>
                <h4>My Role</h4>
                <p>{project.myRole || "Developer"}</p>
              </div>
            </div>
            <div className="info-strip-col">
              <FiClock className="info-strip-icon" />
              <div>
                <h4>Duration</h4>
                <p>{project.duration || "N/A"}</p>
              </div>
            </div>
            <div className="info-strip-col">
              <FiTag className="info-strip-icon" />
              <div>
                <h4>Project Type</h4>
                <p>{project.projectType || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="detail-main-content">
        <div className="container">
          <div className="detail-grid">
            {/* Left side: Tech Stack & About */}
            <div className="detail-left">
              <motion.div {...fadeInUp} className="detail-section">
                <h2 className="detail-section-title">About the Project</h2>
                <p className="detail-body-text">
                  {project.fullDescription || project.description}
                </p>
              </motion.div>

              {project.problem && (
                <motion.div {...fadeInUp} className="detail-section">
                  <h2 className="detail-section-title">The Problem</h2>
                  <p className="detail-body-text">{project.problem}</p>
                </motion.div>
              )}

              {project.solution && (
                <motion.div {...fadeInUp} className="detail-section">
                  <h2 className="detail-section-title">The Solution</h2>
                  <p className="detail-body-text">{project.solution}</p>
                </motion.div>
              )}

              {project.outcome && (
                <motion.div {...fadeInUp} className="detail-section">
                  <h2 className="detail-section-title">Outcome & Results</h2>
                  <p className="detail-body-text">{project.outcome}</p>
                </motion.div>
              )}

              {project.challenges && (
                <motion.div {...fadeInUp} className="detail-section">
                  <h2 className="detail-section-title">Challenges Faced</h2>
                  <p className="detail-body-text">{project.challenges}</p>
                </motion.div>
              )}

              {project.improvements && (
                <motion.div {...fadeInUp} className="detail-section">
                  <h2 className="detail-section-title">What I'd Do Differently</h2>
                  <p className="detail-body-text">{project.improvements}</p>
                </motion.div>
              )}
            </div>

            {/* Right side: Tech Stack Sticky */}
            <div className="detail-right-sidebar">
              {project.techStack && project.techStack.length > 0 && (
                <div className="sticky-sidebar-card">
                  <h3>Technologies Used</h3>
                  <div className="sidebar-techs">
                    {project.techStack.map((tech, i) => (
                      <span key={i} className="sidebar-tech">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Photo Gallery Grid */}
          {project.gallery && project.gallery.length > 0 && (
            <motion.div 
              className="detail-gallery-section"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="detail-section-title">Project Gallery</h2>
              <div className="gallery-grid">
                {project.gallery.map((img, i) => (
                  <div key={i} className="gallery-item">
                    <Image
                      src={urlFor(img).width(800).height(500).url()}
                      alt={`${project.title} Gallery Image ${i + 1}`}
                      width={800}
                      height={500}
                      className="gallery-image"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Back button at the bottom */}
          <div className="detail-footer-nav">
            <Link href="/#projects" className="back-btn">
              <FiArrowLeft size={16} />
              <span>Back to Projects</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
