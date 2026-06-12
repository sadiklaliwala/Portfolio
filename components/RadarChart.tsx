"use client";

import React from "react";
import { motion } from "framer-motion";

interface RadarData {
  label: string;
  value: number; // 0 to 100
}

interface RadarChartProps {
  data: RadarData[];
  size?: number;
}

export default function RadarChart({ data, size = 400 }: RadarChartProps) {
  const padding = 60;
  const chartSize = size - padding * 2;
  const center = size / 2;
  const radius = chartSize / 2;

  const totalPoints = data.length;
  if (totalPoints < 3) return null; // A radar chart needs at least 3 axes

  // Generate coordinates for the grid levels (e.g. 20%, 40%, 60%, 80%, 100%)
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Helper to calculate X and Y coordinates on the circle
  const getCoordinates = (index: number, valPercent: number) => {
    const angle = (index * (2 * Math.PI)) / totalPoints - Math.PI / 2;
    const r = radius * (valPercent / 100);
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // 1. Grid level lines (concentric polygons)
  const gridPolygons = gridLevels.map((level) => {
    const points = Array.from({ length: totalPoints })
      .map((_, i) => {
        const { x, y } = getCoordinates(i, level * 100);
        return `${x},${y}`;
      })
      .join(" ");
    return points;
  });

  // 2. Radial axes lines (spokes from center to 100% radius)
  const axesLines = Array.from({ length: totalPoints }).map((_, i) => {
    const outer = getCoordinates(i, 100);
    return { x1: center, y1: center, x2: outer.x, y2: outer.y };
  });

  // 3. User data polygon points
  const dataPoints = data
    .map((d, i) => {
      const { x, y } = getCoordinates(i, d.value);
      return `${x},${y}`;
    })
    .join(" ");

  // 4. Label placements (slightly further than 100% radius)
  const labels = data.map((d, i) => {
    const angle = (i * (2 * Math.PI)) / totalPoints - Math.PI / 2;
    const offset = 22; // text offset from chart edge
    const r = radius + offset;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);

    // Anchor text adjustments
    let textAnchor: "inherit" | "end" | "start" | "middle" | undefined = "middle";
    if (Math.cos(angle) > 0.1) textAnchor = "start";
    else if (Math.cos(angle) < -0.1) textAnchor = "end";

    return { label: d.label, x, y, textAnchor };
  });

  return (
    <div style={{ width: "100%", maxWidth: `${size}px`, margin: "0 auto" }}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width="100%"
        height="100%"
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Radial glow gradient */}
          <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
          {/* Neon stroke filter for glowing effect */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Concentric background grids */}
        {gridPolygons.map((points, index) => (
          <polygon
            key={index}
            points={points}
            fill="none"
            stroke="var(--border)"
            strokeWidth="1"
            strokeDasharray={index === gridPolygons.length - 1 ? "0" : "4,4"}
          />
        ))}

        {/* Spokes (Axes lines) */}
        {axesLines.map((axis, index) => (
          <line
            key={index}
            x1={axis.x1}
            y1={axis.y1}
            x2={axis.x2}
            y2={axis.y2}
            stroke="var(--border)"
            strokeWidth="1"
          />
        ))}

        {/* Glowing background inside data area */}
        <motion.polygon
          points={dataPoints}
          fill="url(#radarGlow)"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ transformOrigin: `${center}px ${center}px` }}
        />

        {/* The data polygon stroke */}
        <motion.polygon
          points={dataPoints}
          fill="rgba(0, 212, 255, 0.1)"
          stroke="var(--accent)"
          strokeWidth="2.5"
          filter="url(#glow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />

        {/* Data points (small dots at the vertices) */}
        {data.map((d, i) => {
          const { x, y } = getCoordinates(i, d.value);
          return (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r="4.5"
              fill="var(--accent-green)"
              stroke="var(--bg-primary)"
              strokeWidth="2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              whileHover={{ scale: 1.5 }}
            />
          );
        })}

        {/* Labels */}
        {labels.map((l, i) => (
          <text
            key={i}
            x={l.x}
            y={l.y + 4} // small vertical correction
            fill="var(--text-secondary)"
            fontSize="12"
            fontFamily="JetBrains Mono, monospace"
            textAnchor={l.textAnchor}
            style={{ userSelect: "none" }}
          >
            {l.label}
          </text>
        ))}
      </svg>
    </div>
  );
}
