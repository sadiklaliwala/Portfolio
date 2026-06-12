"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FiCalendar, FiMapPin, FiArrowLeft, FiAward, FiUsers, FiTag, FiUser, FiFileText } from "react-icons/fi";
import { urlFor } from "@/sanity/lib/image";

interface EventDetailProps {
  event: {
    title: string;
    description: string;
    date: string;
    location: string;
    eventType: string;
    myRole: string;
    coverImage?: any;
    gallery?: any[];
    teamMembers?: string;
    award?: string;
    certificateImage?: any;
  };
}

function getEventTypeBadge(type?: string) {
  if (!type) return null;
  switch (type) {
    case 'Hackathon':
      return '🏆 Hackathon';
    case 'Conference':
      return '📢 Conference';
    case 'Meetup':
      return '👥 Meetup';
    case 'Workshop':
      return '💻 Workshop';
    case 'Other':
      return '💡 Other';
    default:
      return type;
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function EventDetail({ event }: EventDetailProps) {
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
          <Link href="/#events" className="back-btn">
            <FiArrowLeft size={16} />
            <span>Back to Events</span>
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
              {event.eventType && (
                <span className="badge">
                  {getEventTypeBadge(event.eventType)}
                </span>
              )}
              {event.myRole && (
                <span className="badge">
                  <FiUser size={12} style={{ marginRight: '4px' }} />
                  Role: {event.myRole}
                </span>
              )}
              {event.award && (
                <span className="badge award-badge-highlight">
                  <FiAward size={12} style={{ marginRight: '4px' }} />
                  {event.award}
                </span>
              )}
            </div>
            <h1 className="detail-title">{event.title}</h1>
            
            <div className="event-detail-subtitle-row">
              <span className="subtitle-item">
                <FiCalendar size={14} />
                {formatDate(event.date)}
              </span>
              <span className="subtitle-item">
                <FiMapPin size={14} />
                {event.location}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Hero Cover Image */}
        <div className="detail-hero-image-container">
          {event.coverImage ? (
            <Image
              src={urlFor(event.coverImage).width(1200).height(500).url()}
              alt={event.title}
              width={1200}
              height={500}
              className="detail-hero-image"
              priority
            />
          ) : (
            <div className="detail-hero-placeholder">
              <span>{event.title[0]}</span>
            </div>
          )}
        </div>
      </div>

      {/* Detail Main Content */}
      <div className="detail-main-content">
        <div className="container">
          <div className="detail-grid">
            {/* Left side: Bio/Description */}
            <div className="detail-left">
              <motion.div {...fadeInUp} className="detail-section">
                <h2 className="detail-section-title">Event Overview</h2>
                <p className="detail-body-text">{event.description}</p>
              </motion.div>

              {event.teamMembers && (
                <motion.div {...fadeInUp} className="detail-section">
                  <h2 className="detail-section-title">Team Members</h2>
                  <div className="team-members-container">
                    <FiUsers className="detail-body-icon" />
                    <p className="detail-body-text">{event.teamMembers}</p>
                  </div>
                </motion.div>
              )}

              {event.certificateImage && (
                <motion.div {...fadeInUp} className="detail-section">
                  <h2 className="detail-section-title">Certificate & Recognition</h2>
                  <div className="certificate-wrapper">
                    <Image
                      src={urlFor(event.certificateImage).width(800).url()}
                      alt={`${event.title} Certificate`}
                      width={800}
                      height={500}
                      className="certificate-image"
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right side: Event Specs Sidebar */}
            <div className="detail-right-sidebar">
              <div className="sticky-sidebar-card">
                <h3>Event Details</h3>
                <div className="sidebar-specs-list">
                  <div className="spec-item">
                    <FiTag className="spec-item-icon" />
                    <div>
                      <span>Event Type</span>
                      <strong>{event.eventType}</strong>
                    </div>
                  </div>
                  <div className="spec-item">
                    <FiUser className="spec-item-icon" />
                    <div>
                      <span>My Role</span>
                      <strong>{event.myRole}</strong>
                    </div>
                  </div>
                  <div className="spec-item">
                    <FiCalendar className="spec-item-icon" />
                    <div>
                      <span>Date</span>
                      <strong>{formatDate(event.date)}</strong>
                    </div>
                  </div>
                  <div className="spec-item">
                    <FiMapPin className="spec-item-icon" />
                    <div>
                      <span>Location</span>
                      <strong>{event.location}</strong>
                    </div>
                  </div>
                  {event.award && (
                    <div className="spec-item award-item">
                      <FiAward className="spec-item-icon" />
                      <div>
                        <span>Award Won</span>
                        <strong>{event.award}</strong>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Photo Gallery Grid */}
          {event.gallery && event.gallery.length > 0 && (
            <motion.div 
              className="detail-gallery-section"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="detail-section-title">Event Gallery</h2>
              <div className="gallery-grid">
                {event.gallery.map((img, i) => (
                  <div key={i} className="gallery-item">
                    <Image
                      src={urlFor(img).width(800).height(500).url()}
                      alt={`${event.title} Gallery Image ${i + 1}`}
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
            <Link href="/#events" className="back-btn">
              <FiArrowLeft size={16} />
              <span>Back to Events</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
