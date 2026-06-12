"use client";

import React, { useEffect, useState } from "react";
import { Command } from "cmdk";
import { client } from "@/sanity/lib/client";
import { useRouter } from "next/navigation";
import {
  FiSearch,
  FiUser,
  FiCpu,
  FiFolder,
  FiCalendar,
  FiMail,
  FiGithub,
  FiLinkedin,
  FiCopy,
  FiClock,
  FiExternalLink,
} from "react-icons/fi";

interface ProjectLink {
  title: string;
  slug: string;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<ProjectLink[]>([]);
  const router = useRouter();

  // Toggle the menu when pressing Cmd+K or Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Fetch projects list for searching
  useEffect(() => {
    client
      .fetch<ProjectLink[]>(`*[_type == "project"]{title, "slug": slug.current}`)
      .then((data) => setProjects(data || []))
      .catch(() => {});
  }, []);

  const navigateTo = (selector: string) => {
    setOpen(false);
    // If not on home page, navigate to home first, then scroll
    if (window.location.pathname !== "/") {
      router.push("/" + selector);
      return;
    }
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const copyEmail = () => {
    // We can fetch contact info or use standard email
    navigator.clipboard.writeText("sadik.laliwala@example.com");
    alert("Email copied to clipboard! 📋");
    setOpen(false);
  };

  return (
    <>
      <button className="cmdk-trigger-btn" onClick={() => setOpen(true)}>
        <span>Command Menu</span>
        <kbd className="cmdk-kbd">⌘K</kbd>
      </button>

      {open && (
        <div className="cmdk-overlay" onClick={() => setOpen(false)}>
          <div className="cmdk-dialog" onClick={(e) => e.stopPropagation()}>
            <Command label="Command Menu">
              <div style={{ display: "flex", alignItems: "center" }}>
                <Command.Input
                  placeholder="Type a command or search projects..."
                  className="cmdk-input"
                  autoFocus
                />
              </div>

              <Command.List className="cmdk-list">
                <Command.Empty className="cmdk-item" style={{ justifyContent: "center" }}>
                  No results found.
                </Command.Empty>

                <Command.Group heading="Navigation" className="cmdk-group-heading">
                  <Command.Item
                    onSelect={() => navigateTo("#projects")}
                    className="cmdk-item"
                  >
                    <FiFolder />
                    <span>Go to Projects</span>
                    <kbd className="cmdk-item-shortcut">P</kbd>
                  </Command.Item>
                  <Command.Item
                    onSelect={() => navigateTo("#skills")}
                    className="cmdk-item"
                  >
                    <FiCpu />
                    <span>Go to Skills</span>
                    <kbd className="cmdk-item-shortcut">S</kbd>
                  </Command.Item>
                  <Command.Item
                    onSelect={() => navigateTo("#experience")}
                    className="cmdk-item"
                  >
                    <FiClock />
                    <span>Go to Experience</span>
                    <kbd className="cmdk-item-shortcut">E</kbd>
                  </Command.Item>
                  <Command.Item
                    onSelect={() => navigateTo("#events")}
                    className="cmdk-item"
                  >
                    <FiCalendar />
                    <span>Go to Events</span>
                    <kbd className="cmdk-item-shortcut">V</kbd>
                  </Command.Item>
                  <Command.Item
                    onSelect={() => navigateTo("#contact")}
                    className="cmdk-item"
                  >
                    <FiMail />
                    <span>Go to Contact</span>
                    <kbd className="cmdk-item-shortcut">C</kbd>
                  </Command.Item>
                </Command.Group>

                {projects.length > 0 && (
                  <Command.Group heading="Search Projects" className="cmdk-group-heading">
                    {projects.map((p) => (
                      <Command.Item
                        key={p.slug}
                        onSelect={() => {
                          setOpen(false);
                          router.push(`/projects/${p.slug}`);
                        }}
                        className="cmdk-item"
                      >
                        <FiFolder />
                        <span>{p.title}</span>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                <Command.Group heading="Actions" className="cmdk-group-heading">
                  <Command.Item onSelect={copyEmail} className="cmdk-item">
                    <FiCopy />
                    <span>Copy Email Address</span>
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Socials" className="cmdk-group-heading">
                  <Command.Item
                    onSelect={() => {
                      window.open("https://github.com", "_blank");
                      setOpen(false);
                    }}
                    className="cmdk-item"
                  >
                    <FiGithub />
                    <span>GitHub Profile</span>
                    <FiExternalLink style={{ marginLeft: "auto" }} />
                  </Command.Item>
                  <Command.Item
                    onSelect={() => {
                      window.open("https://linkedin.com", "_blank");
                      setOpen(false);
                    }}
                    className="cmdk-item"
                  >
                    <FiLinkedin />
                    <span>LinkedIn Profile</span>
                    <FiExternalLink style={{ marginLeft: "auto" }} />
                  </Command.Item>
                </Command.Group>
              </Command.List>

              <div className="cmdk-footer">
                <span>
                  Use <kbd className="cmdk-kbd">↑</kbd> <kbd className="cmdk-kbd">↓</kbd> to navigate
                </span>
                <span>
                  Press <kbd className="cmdk-kbd">Enter</kbd> to select
                </span>
              </div>
            </Command>
          </div>
        </div>
      )}
    </>
  );
}
