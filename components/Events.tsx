"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FiCalendar, FiMapPin, FiAward } from "react-icons/fi";
import { urlFor } from "@/sanity/lib/image";

interface Event {
  _id: string;
  title: string;
  date: string;
  location: string;
  eventType: string;
  award?: string;
  coverImage?: any;
  slug?: { current: string };
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
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Events({ data = [] }: { data: Event[] }) {
  return (
    <section id="events" style={{ background: "var(--bg-primary)" }}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="section-label">// events & activities</p>
          <h2 className="section-title">Events</h2>
        </motion.div>

        {data.length === 0 ? (
          <div className="no-data-msg">
            <p>No events found. Check back later!</p>
          </div>
        ) : (
          <div className="events-grid">
            {data.map((event, i) => (
              <motion.div
                key={event._id}
                className="event-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                {/* Image */}
                <div className="event-image-wrapper">
                  {event.coverImage ? (
                    <Link href={`/events/${event.slug?.current || '#'}`}>
                      <Image
                        src={urlFor(event.coverImage).width(600).height(340).url()}
                        alt={event.title}
                        width={600}
                        height={340}
                        className="event-image"
                      />
                    </Link>
                  ) : (
                    <Link href={`/events/${event.slug?.current || '#'}`}>
                      <div className="event-image-placeholder">
                        <span>{event.title[0]}</span>
                      </div>
                    </Link>
                  )}
                  {event.eventType && (
                    <span className="event-type-badge-overlay">
                      {getEventTypeBadge(event.eventType)}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="event-content">
                  <div className="event-meta">
                    <span className="event-meta-item">
                      <FiCalendar size={12} />
                      {formatDate(event.date)}
                    </span>
                    <span className="event-meta-item">
                      <FiMapPin size={12} />
                      {event.location}
                    </span>
                  </div>

                  <h3 className="event-title">
                    <Link href={`/events/${event.slug?.current || '#'}`} className="event-title-link">
                      {event.title}
                    </Link>
                  </h3>

                  {event.award && (
                    <div className="event-award-badge">
                      <FiAward size={14} />
                      <span>{event.award}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
