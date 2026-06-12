"use client";

import React, { useRef, useState } from "react";

interface TiltProps {
  children: React.ReactNode;
  className?: string;
  max?: number;
  perspective?: number;
  scale?: number;
  speed?: number;
}

export default function Tilt({
  children,
  className = "",
  max = 10, // Max rotation angle in degrees
  perspective = 1000,
  scale = 1.02,
  speed = 400,
}: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({
    transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
    transition: `transform ${speed}ms cubic-bezier(.03,.98,.52,.99)`,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    const rX = (mouseY / (height / 2)) * -max;
    const rY = (mouseX / (width / 2)) * max;

    setStyle({
      transform: `perspective(${perspective}px) rotateX(${rX}deg) rotateY(${rY}deg) scale3d(${scale}, ${scale}, ${scale})`,
      transition: "transform 100ms ease-out",
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
      transition: `transform ${speed}ms cubic-bezier(.03,.98,.52,.99)`,
    });
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </div>
  );
}
