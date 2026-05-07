"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Project } from "@/data/projects";

interface Props {
  project: Project;
  index: number;
}

const SWEEP_DURATION = "400ms ease-out";

interface MetaRowProps {
  index: number;
  title: string;
  client: string;
  inverted?: boolean;
}

function MetaRow({ index, title, client, inverted = false }: MetaRowProps) {
  const muted = inverted ? "#0B0A09" : "#888880";
  const primary = inverted ? "#0B0A09" : "#EAE6E0";

  return (
    <div className="flex items-baseline gap-6 py-3 pl-3">
      <span
        className="tabular-nums shrink-0 text-[12px] tracking-wider uppercase font-bold"
        style={{ color: muted }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      {/* Title in Newsreader 300, sentence case */}
      <span
        className="text-[13px]"
        style={{
          fontFamily: "var(--font-serif)",
          fontWeight: 300,
          color: primary,
          letterSpacing: "0.01em",
        }}
      >
        {title}
      </span>
      <span
        className="text-[12px] tracking-wider uppercase"
        style={{ color: muted }}
      >
        {client}
      </span>
    </div>
  );
}

export default function ThumbnailHover({ project, index }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const isTouchRef = useRef(false);

  useEffect(() => {
    isTouchRef.current = window.matchMedia(
      "(hover: none) and (pointer: coarse)"
    ).matches;
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (isTouchRef.current) return;
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (isTouchRef.current) return;
    setIsHovered(false);
  }, []);

  return (
    <div
      className="transform-gpu will-change-transform"
      style={{
        transform: isHovered ? "scale(1.008)" : "scale(1)",
        transition: "transform 300ms ease",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden bg-[#1E1C1A]">
        <div className="absolute inset-0 bg-[#1E1C1A]" />
      </div>

      {/* Metadata bar — flush below thumbnail, invert on hover */}
      <div className="relative overflow-hidden">
        {/* Layer 1: normal state */}
        <MetaRow index={index} title={project.title} client={project.client} />

        {/* Layer 2: off-white sweep L→R */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundColor: "#EAE6E0",
            transform: isHovered ? "translateX(0%)" : "translateX(-101%)",
            transition: `transform ${SWEEP_DURATION}`,
          }}
        />

        {/* Layer 3: dark text clipped to swept region */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            clipPath: isHovered ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
            transition: `clip-path ${SWEEP_DURATION}`,
          }}
        >
          <MetaRow
            index={index}
            title={project.title}
            client={project.client}
            inverted
          />
        </div>
      </div>
    </div>
  );
}
