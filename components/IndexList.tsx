"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Project } from "@/data/projects";

const ROLE_ABBR: Record<string, string> = {
  Director: "DIR",
  Editor: "ED",
  Colorist: "COL",
  Color: "COL",
  DP: "DP",
  Sound: "SND",
  VFX: "VFX",
};

function abbreviateRoles(roles: string[]): string {
  return roles.map((r) => ROLE_ABBR[r] ?? r).join(", ");
}

interface RowContentProps {
  project: Project;
  displayIndex: number;
  inverted?: boolean;
}

function RowContent({ project, displayIndex, inverted = false }: RowContentProps) {
  const abbrevRoles = abbreviateRoles(project.roles);
  const displayNum = String(displayIndex + 1).padStart(2, "0");
  const primary = inverted ? "text-[#0B0A09]" : "text-[#EAE6E0]";
  const muted = inverted ? "text-[#0B0A09]" : "text-[#888880]";

  return (
    <>
      {/* Desktop: 5-column grid */}
      <div
        className="hidden md:grid items-center gap-x-8 h-14 px-6 md:px-12"
        style={{ gridTemplateColumns: "2.5rem 1fr 2fr 1.5fr 2.5rem" }}
      >
        <span className={`text-[12px] tracking-wider uppercase font-bold tabular-nums ${muted}`}>
          {displayNum}
        </span>
        <span className={`text-[12px] tracking-wider uppercase truncate ${primary}`}>
          {project.client}
        </span>
        <span className={`text-[12px] tracking-wider uppercase font-bold truncate ${primary}`}>
          {project.title}
        </span>
        <span className={`text-[12px] tracking-wider uppercase truncate ${primary}`}>
          {abbrevRoles}
        </span>
        <span className={`text-[12px] tracking-wider uppercase text-right tabular-nums ${primary}`}>
          {project.year}
        </span>
      </div>

      {/* Mobile: 2-line stack */}
      <div className={`md:hidden px-6 py-3 ${inverted ? "absolute inset-0" : ""}`}>
        <div className="flex items-baseline justify-between gap-3">
          <span className={`text-[12px] tracking-wider uppercase font-bold tabular-nums shrink-0 ${muted}`}>
            {displayNum}
          </span>
          <span className={`text-[12px] tracking-wider uppercase font-bold flex-1 truncate ${primary}`}>
            {project.title}
          </span>
          <span className={`text-[12px] tracking-wider uppercase tabular-nums shrink-0 ${primary}`}>
            {project.year}
          </span>
        </div>
        <div className="flex gap-4 mt-1">
          <span className={`text-[10px] tracking-wider uppercase ${muted}`}>
            {project.client}
          </span>
          <span className={`text-[10px] tracking-wider uppercase ${muted}`}>
            {abbrevRoles}
          </span>
        </div>
      </div>
    </>
  );
}

interface RowProps {
  project: Project;
  displayIndex: number;
  onHoverEnter: (slug: string) => void;
  onHoverLeave: () => void;
}

const SWEEP = "400ms ease-out";

function IndexRow({ project, displayIndex, onHoverEnter, onHoverLeave }: RowProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/work/${project.slug}`}
      className="block relative overflow-hidden"
      onMouseEnter={() => { setHovered(true); onHoverEnter(project.slug); }}
      onMouseLeave={() => { setHovered(false); onHoverLeave(); }}
    >
      {/* Layer 1: normal text — in flow, defines row height */}
      <RowContent project={project} displayIndex={displayIndex} />

      {/* Layer 2: solid sweep L→R */}
      <div
        className="absolute inset-0 bg-[#EAE6E0] pointer-events-none"
        style={{
          transform: hovered ? "translateX(0%)" : "translateX(-101%)",
          transition: `transform ${SWEEP}`,
        }}
      />

      {/* Layer 3: dark text clipped to swept region */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          clipPath: hovered ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
          transition: `clip-path ${SWEEP}`,
        }}
      >
        <RowContent project={project} displayIndex={displayIndex} inverted />
      </div>
    </Link>
  );
}

function IndexListInner({ projects }: { projects: Project[] }) {
  const searchParams = useSearchParams();
  const activeFilter = searchParams.get("filter") ?? "all";
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  useEffect(() => { setHoveredSlug(null); }, [activeFilter]);

  const sorted = [...projects].sort((a, b) => b.year - a.year);
  const filtered =
    activeFilter === "all"
      ? sorted
      : sorted.filter((p) => p.category === activeFilter);

  const hoveredProject = hoveredSlug ? projects.find((p) => p.slug === hoveredSlug) : null;
  const bgVideo = hoveredProject?.indexHoverVideo;

  const handleHoverEnter = useCallback((slug: string) => setHoveredSlug(slug), []);
  const handleHoverLeave = useCallback(() => setHoveredSlug(null), []);

  return (
    <>
      {/* Background: video if set, grey square placeholder otherwise */}
      {hoveredSlug && (
        <div
          className="fixed inset-0 z-[-1] pointer-events-none flex items-center justify-center"
          style={{ opacity: 1, transition: "opacity 200ms" }}
        >
          {bgVideo ? (
            <>
              <video
                key={bgVideo}
                src={bgVideo}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
            </>
          ) : (
            <div className="w-[60vmin] aspect-square bg-[#1E1C1A]" />
          )}
        </div>
      )}

      <div>
        {filtered.map((project, index) => (
          <IndexRow
            key={project.slug}
            project={project}
            displayIndex={index}
            onHoverEnter={handleHoverEnter}
            onHoverLeave={handleHoverLeave}
          />
        ))}
      </div>
    </>
  );
}

export default function IndexList({ projects }: { projects: Project[] }) {
  return (
    <Suspense fallback={null}>
      <IndexListInner projects={projects} />
    </Suspense>
  );
}
