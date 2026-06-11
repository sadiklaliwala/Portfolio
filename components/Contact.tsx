"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { FiMail, FiMapPin, FiGithub, FiLinkedin, FiSend } from "react-icons/fi";

interface ContactInfo {
  email: string;
  location: string;
  github: string;
  linkedin: string;
}

export default function Contact({ data }: { data: ContactInfo }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
      );
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" style={{ background: "var(--bg-section)" }}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="section-label">// get in touch</p>
          <h2 className="section-title">Contact Me</h2>
        </motion.div>

        <div className="contact-content">
          {/* Left — Info */}
          <motion.div
            className="contact-left"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="contact-intro">
              I'm currently open to new opportunities. Whether you have a
              project in mind, a question, or just want to say hi — my inbox is
              always open!
            </p>

            <div className="contact-details">
              {data?.email && (
                <a href={`mailto:${data.email}`} className="contact-detail">
                  <div className="contact-detail-icon">
                    <FiMail size={18} />
                  </div>
                  <div>
                    <p className="contact-detail-label">Email</p>
                    <p className="contact-detail-value">{data.email}</p>
                  </div>
                </a>
              )}
              {data?.location && (
                <div className="contact-detail">
                  <div className="contact-detail-icon">
                    <FiMapPin size={18} />
                  </div>
                  <div>
                    <p className="contact-detail-label">Location</p>
                    <p className="contact-detail-value">{data.location}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="contact-socials">
              {data?.github && (
                <a
                  href={data.github}
                  target="_blank"
                  className="contact-social"
                >
                  <FiGithub size={20} />
                </a>
              )}
              {data?.linkedin && (
                <a
                  href={data.linkedin}
                  target="_blank"
                  className="contact-social"
                >
                  <FiLinkedin size={20} />
                </a>
              )}
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            className="contact-right"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="contact-form-card">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="What's on your mind?"
                  className="form-input form-textarea"
                  rows={5}
                  required
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={status === "sending"}
                className={`form-submit ${status}`}
              >
                {status === "sending" ? (
                  <span>Sending...</span>
                ) : status === "success" ? (
                  <span>Message Sent ✓</span>
                ) : (
                  <>
                    <FiSend size={16} />
                    <span>Send Message</span>
                  </>
                )}
              </button>

              {status === "error" && (
                <p className="form-error">
                  Something went wrong. Please try again.
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
