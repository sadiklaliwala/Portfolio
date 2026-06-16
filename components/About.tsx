"use client";

import { motion } from "framer-motion";
import { FiMapPin, FiMail, FiGithub, FiLinkedin } from "react-icons/fi";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

import { useLanguage } from "@/context/LanguageContext";

interface AboutData {
  bio: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  photo: any;
  stats: { number: string; label: string }[];
}

export default function About({ data }: { data: AboutData }) {
  const { t } = useLanguage();
  const developerName = process.env.NEXT_PUBLIC_DEVELOPER_NAME || "Sadik Laliwala";
  const initials = developerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section id="about">
      <div className="container">
        {/* Section Header */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="section-label">{t("about_label")}</p>
          <h2 className="section-title">{t("about_title")}</h2>
        </motion.div>

        <div className="about-content">
          {/* Left — Photo */}
          <motion.div
            className="about-left"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="about-photo-wrapper">
              {data.photo ? (
                <Image
                  src={urlFor(data.photo).width(400).height(400).url()}
                  alt={`${developerName} - Full Stack Software Engineer Profile Photo`}
                  width={400}
                  height={400}
                  className="about-photo"
                />
              ) : (
                <div className="about-photo-placeholder">
                  <span>{initials}</span>
                </div>
              )}
              <div className="photo-glow" />
            </div>

            {/* Social Links */}
            <div className="about-socials">
              {data.github && (
                <a href={data.github} target="_blank" className="social-link">
                  <FiGithub size={18} />
                  GitHub
                </a>
              )}
              {data.linkedin && (
                <a href={data.linkedin} target="_blank" className="social-link">
                  <FiLinkedin size={18} />
                  LinkedIn
                </a>
              )}
            </div>
          </motion.div>

          {/* Right — Text */}
          <motion.div
            className="about-right"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="about-bio">{data.bio}</p>

            {/* Info Pills */}
            <div className="about-info">
              {data.location && (
                <div className="info-pill">
                  <FiMapPin size={14} />
                  <span>{data.location}</span>
                </div>
              )}
              {data.email && (
                <div className="info-pill">
                  <FiMail size={14} />
                  <span>{data.email}</span>
                </div>
              )}
            </div>

            {/* Stats Grid */}
            <div className="about-stats">
              {data.stats?.map((stat, i) => (
                <motion.div
                  key={i}
                  className="about-stat-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <span className="about-stat-number">{stat.number}</span>
                  <span className="about-stat-label">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
