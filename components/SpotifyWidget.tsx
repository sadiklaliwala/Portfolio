"use client";

import React, { useEffect, useState, useRef } from "react";
import { FaSpotify } from "react-icons/fa";
import { FiExternalLink, FiMusic } from "react-icons/fi";

interface SpotifyData {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string | null;
  songUrl: string;
}

export default function SpotifyWidget() {
  const [data, setData] = useState<SpotifyData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Poll Spotify status
  const fetchSpotify = async () => {
    try {
      const res = await fetch("/api/spotify");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      // Ignore API errors
    }
  };

  useEffect(() => {
    fetchSpotify();
    const interval = setInterval(fetchSpotify, 15000); // Poll every 15 seconds
    return () => clearInterval(interval);
  }, []);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!data) return null;

  return (
    <div className="spotify-widget" ref={widgetRef}>
      {/* Detailed pop-up card */}
      {isOpen && (
        <div className="spotify-card">
          <div className="spotify-album-art">
            {data.albumImageUrl ? (
              <img
                src={data.albumImageUrl}
                alt={data.album}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div className="spotify-default-art">
                <FiMusic style={{ fontSize: "2rem", marginBottom: "6px" }} />
                <span>{data.album}</span>
              </div>
            )}
          </div>

          <div className="spotify-info">
            <div className="spotify-title" title={data.title}>
              {data.title}
            </div>
            <div className="spotify-artist" title={data.artist}>
              {data.artist}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "8px",
              }}
            >
              {/* Equalizer animation */}
              <div className="spotify-equalizer">
                <span className={`spotify-eq-bar ${data.isPlaying ? "active" : ""}`} />
                <span className={`spotify-eq-bar ${data.isPlaying ? "active" : ""}`} />
                <span className={`spotify-eq-bar ${data.isPlaying ? "active" : ""}`} />
                <span className={`spotify-eq-bar ${data.isPlaying ? "active" : ""}`} />
              </div>

              <a
                href={data.songUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="spotify-link"
              >
                Listen <FiExternalLink />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Floating pill button */}
      <button className="spotify-pill" onClick={() => setIsOpen(!isOpen)}>
        <span className={`spotify-logo ${data.isPlaying ? "active" : ""}`}>
          <FaSpotify />
        </span>
        <span>
          {data.isPlaying ? `Listening: ${data.title}` : `Offline: ${data.title}`}
        </span>
      </button>
    </div>
  );
}
