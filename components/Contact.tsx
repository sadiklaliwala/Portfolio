"use client";

import { useState, useEffect, useRef } from "react";
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
  const [linkedinTheme, setLinkedinTheme] = useState<"light" | "dark">("dark");
  const badgeRef = useRef<HTMLDivElement>(null);

  const emailVal = data?.email || process.env.NEXT_PUBLIC_DEVELOPER_EMAIL || "sadik.laliwala@gmail.com";
  const locationVal = data?.location || "Gujarat, India";
  const githubVal = data?.github || (process.env.NEXT_PUBLIC_GITHUB_USERNAME ? `https://github.com/${process.env.NEXT_PUBLIC_GITHUB_USERNAME}` : "https://github.com/sadiklaliwala");
  const linkedinVal = data?.linkedin || (process.env.NEXT_PUBLIC_LINKEDIN_USERNAME ? `https://linkedin.com/in/${process.env.NEXT_PUBLIC_LINKEDIN_USERNAME}` : "https://linkedin.com/in/sadiklaliwala");

  useEffect(() => {
    const getTheme = () => {
      const theme = document.documentElement.getAttribute("data-theme") || "midnight";
      return theme === "light" ? "light" : "dark";
    };

    setLinkedinTheme(getTheme());

    const observer = new MutationObserver(() => {
      setLinkedinTheme(getTheme());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (badgeRef.current) {
      badgeRef.current.innerHTML = "";
      
      const badgeDiv = document.createElement("div");
      badgeDiv.className = "badge-base LI-profile-badge";
      badgeDiv.setAttribute("data-locale", "en_US");
      badgeDiv.setAttribute("data-size", "medium");
      badgeDiv.setAttribute("data-theme", linkedinTheme);
      badgeDiv.setAttribute("data-type", "VERTICAL");
      badgeDiv.setAttribute("data-vanity", process.env.NEXT_PUBLIC_LINKEDIN_USERNAME || "sadiklaliwala");
      badgeDiv.setAttribute("data-version", "v1");
      
      const anchor = document.createElement("a");
      anchor.className = "badge-base__link LI-simple-link";
      anchor.href = `https://in.linkedin.com/in/${process.env.NEXT_PUBLIC_LINKEDIN_USERNAME || "sadiklaliwala"}?trk=profile-badge`;
      anchor.style.position = "absolute";
      anchor.style.opacity = "0";
      anchor.style.pointerEvents = "none";
      anchor.style.width = "1px";
      anchor.style.height = "1px";
      anchor.style.overflow = "hidden";
      anchor.innerText = process.env.NEXT_PUBLIC_DEVELOPER_NAME || "Sadik Laliwala";
      
      badgeDiv.appendChild(anchor);
      badgeRef.current.appendChild(badgeDiv);
    }

    let script = document.querySelector('script[src="https://platform.linkedin.com/badges/js/profile.js"]') as HTMLScriptElement;
    
    const runLIRender = () => {
      if (typeof window !== "undefined" && (window as any).LIRenderAll) {
        try {
          (window as any).LIRenderAll();
        } catch (e) {}
      }
    };

    if (!script) {
      script = document.createElement("script");
      script.src = "https://platform.linkedin.com/badges/js/profile.js";
      script.async = true;
      script.defer = true;
      script.type = "text/javascript";
      script.onload = () => {
        setTimeout(runLIRender, 100);
      };
      document.body.appendChild(script);
    } else {
      const timer = setTimeout(runLIRender, 150);
      return () => clearTimeout(timer);
    }
  }, [linkedinTheme]);

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
              {emailVal && (
                <a href={`mailto:${emailVal}`} className="contact-detail">
                  <div className="contact-detail-icon">
                    <FiMail size={18} />
                  </div>
                  <div>
                    <p className="contact-detail-label">Email</p>
                    <p className="contact-detail-value">{emailVal}</p>
                  </div>
                </a>
              )}
              {locationVal && (
                <div className="contact-detail">
                  <div className="contact-detail-icon">
                    <FiMapPin size={18} />
                  </div>
                  <div>
                    <p className="contact-detail-label">Location</p>
                    <p className="contact-detail-value">{locationVal}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="contact-socials">
              {githubVal && (
                <a
                  href={githubVal}
                  target="_blank"
                  className="contact-social"
                  aria-label="GitHub Profile"
                >
                  <FiGithub size={20} />
                </a>
              )}
              {linkedinVal && (
                <a
                  href={linkedinVal}
                  target="_blank"
                  className="contact-social"
                  aria-label="LinkedIn Profile"
                >
                  <FiLinkedin size={20} />
                </a>
              )}
            </div>

            <div className="linkedin-badge-card">
              <div className="linkedin-badge-title">
                <FiLinkedin size={14} />
                <span>LinkedIn Badge</span>
              </div>
              <div ref={badgeRef} className="linkedin-badge-container" />
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
