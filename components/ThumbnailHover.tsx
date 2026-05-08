"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Project, getDisplayTitle } from "@/data/projects";

interface Props {
  project: Project;
  index: number;
  /** When set, forces the thumbnail to this width/height ratio (e.g. 16/9) using object-cover */
  constrainAspect?: number;
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
        className="tabular-nums shrink-0 text-[15px] tracking-wider uppercase font-bold"
        style={{ color: muted }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <span
        className="text-[15px] uppercase"
        style={{
          fontFamily: "var(--font-serif)",
          fontWeight: 400,
          color: primary,
          letterSpacing: "0.05em",
        }}
      >
        {title}
      </span>
      <span
        className="text-[15px] tracking-wider uppercase"
        style={{ color: muted }}
      >
        {client}
      </span>
    </div>
  );
}

export default function ThumbnailHover({ project, index, constrainAspect }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const isTouchRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const displayTitle = getDisplayTitle(project);

  useEffect(() => {
    isTouchRef.current = window.matchMedia(
      "(hover: none) and (pointer: coarse)"
    ).matches;
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (isTouchRef.current) return;
    setIsHovered(true);
    videoRef.current?.play();
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (isTouchRef.current) return;
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {/* Thumbnail */}
      {project.thumbnail ? (
        <div
          className="relative block w-full overflow-hidden"
          style={constrainAspect ? { aspectRatio: constrainAspect } : undefined}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.thumbnail}
            alt=""
            className={constrainAspect ? "absolute inset-0 w-full h-full" : "block w-full h-auto"}
            style={{
              objectFit: constrainAspect ? "cover" : undefined,
              objectPosition: constrainAspect ? (project.thumbnailObjectPosition ?? "center") : undefined,
              filter: project.isUnreleased ? "url(#mosaic-pixelate)" : undefined,
              opacity: isHovered && project.indexHoverVideo ? 0 : 1,
              transition: "opacity 200ms",
            }}
          />
          {project.indexHoverVideo && (
            <video
              ref={videoRef}
              src={project.indexHoverVideo}
              preload="auto"
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full"
              style={{
                objectFit: "contain",
                filter: project.isUnreleased ? "url(#mosaic-pixelate)" : undefined,
                opacity: isHovered ? 1 : 0,
                transition: "opacity 200ms",
              }}
            />
          )}
        </div>
      ) : (
        <div className="w-full aspect-[4/3] bg-[#1A1A1A]" />
      )}

      {/* Metadata bar — flush below thumbnail, invert on hover */}
      <div className="relative overflow-hidden">
        {/* Layer 1: normal state */}
        <MetaRow index={index} title={displayTitle} client={project.client} />

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
          <MetaRow index={index} title={displayTitle} client={project.client} inverted />
        </div>
      </div>
    </div>
  );
}
