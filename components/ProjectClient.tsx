"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Project, getDisplayTitle } from "@/data/projects";

// ─── Utilities ────────────────────────────────────────────────────────────────

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

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function getStillSpans(count: number): number[] {
  if (count === 1) return [12];
  if (count === 2) return [6, 6];
  if (count === 3) return [4, 4, 4];
  const patterns = [[8, 4], [4, 4, 4], [6, 6]];
  const spans: number[] = [];
  let i = 0;
  let row = 0;
  while (i < count) {
    for (const span of patterns[row % 3]) {
      if (i < count) { spans.push(span); i++; }
    }
    row++;
  }
  return spans;
}

const STILL_SPAN: Record<number, string> = {
  4: "col-span-12 md:col-span-4",
  6: "col-span-12 md:col-span-6",
  8: "col-span-12 md:col-span-8",
  12: "col-span-12",
};

// ─── Framer Motion variants ───────────────────────────────────────────────────

const overlayVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { delay: 0.4, duration: 0.2 } },
};

// ─── VimeoControls ────────────────────────────────────────────────────────────

function VimeoControls({
  iframeRef,
  onClose,
}: {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  onClose: () => void;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const [videoStarted, setVideoStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [uiVisible, setUiVisible] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrubberRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const resetHideTimer = useCallback(() => {
    setUiVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setUiVisible(false), 2000);
  }, []);

  useEffect(() => {
    resetHideTimer();
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [resetHideTimer]);

  // Suppress the @vimeo/player SDK bug where it tries to read .chapters on a null
  // response (happens on password-protected and some private videos during init).
  useEffect(() => {
    function suppress(e: ErrorEvent) {
      if (e.message?.includes("chapters")) e.preventDefault();
    }
    window.addEventListener("error", suppress, true);
    return () => window.removeEventListener("error", suppress, true);
  }, []);

  useEffect(() => {
    if (!iframeRef.current) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let player: any;

    import("@vimeo/player").then(({ default: Player }) => {
      try {
        player = new Player(iframeRef.current!);
        playerRef.current = player;

        player.on("play", () => { setIsPlaying(true); setVideoStarted(true); });
        player.on("pause", () => setIsPlaying(false));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        player.on("timeupdate", ({ seconds, duration: d }: any) => {
          if (!isDraggingRef.current) {
            setCurrentTime(seconds);
            setDuration(d);
          }
        });
        // Suppress SDK-internal errors (e.g. chapters fetch on password-protected videos)
        player.on("error", () => {});
      } catch {
        // SDK may throw during init on restricted videos before password is entered
      }
    }).catch(() => {});

    return () => {
      player?.destroy();
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTogglePlay = useCallback(() => {
    if (!playerRef.current) return;
    if (isPlaying) playerRef.current.pause();
    else playerRef.current.play();
  }, [isPlaying]);

  // Spacebar play/pause
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        handleTogglePlay();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleTogglePlay]);

  const getScrubberProgress = (clientX: number) => {
    if (!scrubberRef.current) return 0;
    const rect = scrubberRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  };

  const handleScrubberMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const wasPlaying = isPlaying;
    isDraggingRef.current = true;
    setIsDragging(true);
    setDragProgress(getScrubberProgress(e.clientX));
    document.body.dataset.cursor = "scrub";

    const onMove = (ev: MouseEvent) => setDragProgress(getScrubberProgress(ev.clientX));

    const onUp = (ev: MouseEvent) => {
      const p = getScrubberProgress(ev.clientX);
      const seekTime = p * duration;
      playerRef.current?.setCurrentTime(seekTime).then(() => {
        if (wasPlaying) playerRef.current?.play();
        else playerRef.current?.pause();
      });
      setCurrentTime(seekTime);
      isDraggingRef.current = false;
      setIsDragging(false);
      delete document.body.dataset.cursor;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      // Absorb the click that follows this mouseup so it can't close the lightbox
      const absorbClick = (e: MouseEvent) => e.stopPropagation();
      document.addEventListener("click", absorbClick, { capture: true, once: true });
      setTimeout(() => document.removeEventListener("click", absorbClick, true), 300);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  const progress = isDragging
    ? dragProgress
    : duration > 0
    ? currentTime / duration
    : 0;

  return (
    <div
      className="absolute inset-0"
      style={{
        opacity: uiVisible ? 1 : 0,
        pointerEvents: "auto",
        transition: "opacity 200ms ease",
      }}
      onMouseMove={resetHideTimer}
      onClick={handleTogglePlay}
    >
      {/* Close — top right, always pointer-events-auto so it works before video starts */}
      <button
        className="absolute top-5 right-6 text-[11px] tracking-wider uppercase text-[#EAE6E0] font-medium pointer-events-auto"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
      >
        Close ✕
      </button>

      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 flex flex-col gap-3">
        {/* Scrubber — tall hit area, thin visual bar */}
        <div
          ref={scrubberRef}
          className="relative py-3 -my-3"
          data-cursor="scrub"
          onMouseDown={(e) => { e.stopPropagation(); handleScrubberMouseDown(e); }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative h-[2px] bg-[#EAE6E0]/20 pointer-events-none">
            <div
              className="absolute inset-y-0 left-0 bg-[#EAE6E0]"
              style={{ width: `${progress * 100}%` }}
            />
            <div
              className="absolute top-1/2 w-2.5 h-2.5 rounded-full bg-[#EAE6E0]"
              style={{
                left: `${progress * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
          </div>
        </div>

        {/* Play/pause + time */}
        <div className="flex items-center justify-between">
          <button
            className="text-[11px] tracking-wider uppercase text-[#EAE6E0] font-medium"
            onClick={(e) => { e.stopPropagation(); handleTogglePlay(); }}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <span className="text-[11px] tracking-wider text-[#EAE6E0]/70 tabular-nums">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── LightboxOverlay ──────────────────────────────────────────────────────────

function LightboxOverlay({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isMobile = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

  const vimeoHash = project.videoHash ? `&h=${project.videoHash}` : "";
  const videoSrc =
    project.videoProvider === "vimeo"
      ? `https://player.vimeo.com/video/${project.videoId}?autoplay=1&controls=0&title=0&byline=0&portrait=0&muted=0${vimeoHash}`
      : `https://www.youtube.com/embed/${project.videoId}?autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0`;

  const desktopVideoVariants = {
    initial: { width: "100vw", height: "100vh" },
    animate: {
      width: "85vw",
      height: "85vh",
      transition: { delay: 0.4, duration: 0.8, ease: "easeInOut" as const },
    },
    exit: {
      width: "100vw",
      height: "100vh",
      transition: { duration: 0.4, ease: "easeIn" as const },
    },
  };

  const mobileVideoVariants = {
    initial: { width: "100vw", height: "100vh" },
    animate: { width: "100vw", height: "100vh", transition: { duration: 0 } },
    exit: { width: "100vw", height: "100vh", transition: { duration: 0 } },
  };

  const videoContainerVariants = isMobile ? mobileVideoVariants : desktopVideoVariants;

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
      variants={overlayVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      onClick={onClose}
    >
      <motion.div
        className="relative overflow-hidden"
        variants={videoContainerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          ref={iframeRef}
          src={videoSrc}
          className="absolute inset-0 w-full h-full"
          style={{ border: 0 }}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={project.title}
        />

        {project.videoProvider === "vimeo" ? (
          <VimeoControls iframeRef={iframeRef} onClose={onClose} />
        ) : (
          <div className="absolute inset-0" onMouseMove={() => {}}>
            <button
              className="absolute top-5 right-6 text-[11px] tracking-wider uppercase text-white font-medium"
              onClick={(e) => { e.stopPropagation(); onClose(); }}
            >
              Close ✕
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── HeroSection ──────────────────────────────────────────────────────────────

function HeroSection({
  project,
  projectIndex,
  heroOpacity,
  onOpenLightbox,
  onScrollToDetails,
}: {
  project: Project;
  projectIndex: number;
  heroOpacity: number;
  onOpenLightbox: () => void;
  onScrollToDetails: () => void;
}) {
  const [unreleasedVisible, setUnreleasedVisible] = useState(false);
  const abbrevRoles = abbreviateRoles(project.roles);
  const num = String(projectIndex + 1).padStart(2, "0");

  function handleHeroClick() {
    if (project.isUnreleased) {
      setUnreleasedVisible(true);
      setTimeout(() => setUnreleasedVisible(false), 1500);
      return;
    }
    onOpenLightbox();
  }

  return (
    <div
      className="relative h-screen w-full overflow-hidden"
      style={{ opacity: heroOpacity, transition: "opacity 200ms ease" }}
    >
      {/* Background */}
      {project.thumbnail ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.thumbnail}
          alt=""
          className="absolute inset-0 w-full h-full"
          style={{
            objectFit: "contain",
            objectPosition: "top center",
            filter: project.isUnreleased ? "url(#mosaic-pixelate)" : undefined,
          }}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, #1E1C1A 0%, #0B0A09 100%)",
          }}
        />
      )}

      {/* Clickable play region — full hero above bottom bar */}
      <div
        className="absolute inset-0"
        style={{ bottom: "80px" }}
        data-cursor={project.isUnreleased ? undefined : "play"}
        onClick={handleHeroClick}
      />

      {/* Unreleased overlay message */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          opacity: unreleasedVisible ? 1 : 0,
          transition: "opacity 400ms ease",
        }}
      >
        <span className="text-[11px] tracking-wider uppercase text-[#888880] bg-[#050505]/80 px-4 py-2">
          Coming {project.year}
        </span>
      </div>

      {/* Bottom bar — title, meta, roles, more info all on one level */}
      <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-8 flex items-end justify-between gap-8 pointer-events-none">
        {/* Left: number + title + client/year */}
        <div className="flex items-baseline gap-4 min-w-0">
          <span className="text-[11px] tracking-wider uppercase text-[#888880] tabular-nums shrink-0">
            {num}
          </span>
          <h1
            className="text-[24px] md:text-[36px] leading-none uppercase truncate"
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 300,
              fontStyle: "italic",
              letterSpacing: "0.05em",
              color: "#EAE6E0",
            }}
          >
            {getDisplayTitle(project)}
          </h1>
          <span className="text-[11px] tracking-wider uppercase text-[#888880] shrink-0 hidden md:inline">
            {project.client} — {project.year}
          </span>
        </div>

        {/* Right: roles + more info */}
        <div className="flex items-center gap-6 shrink-0">
          <span className="text-[11px] tracking-wider uppercase text-[#888880] hidden md:inline">
            {abbrevRoles}
          </span>
          <button
            className="text-[11px] tracking-wider uppercase text-[#888880] hover:text-[#EAE6E0] transition-colors duration-150 pointer-events-auto"
            onClick={(e) => { e.stopPropagation(); onScrollToDetails(); }}
          >
            More Info ↓
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── DetailsSection ───────────────────────────────────────────────────────────

function DetailsSection({ project }: { project: Project }) {
  const abbrevRoles = abbreviateRoles(project.roles);

  return (
    <section className="px-6 md:px-12 pt-32 pb-24">
      <div className="grid grid-cols-12 gap-x-8">
        {project.description && (
          <div className="col-span-12 md:col-span-4 mb-12 md:mb-0">
            <p
              className="text-[17px] leading-[1.75] text-[#EAE6E0]"
              style={{ fontFamily: "var(--font-serif)", fontWeight: 300 }}
            >
              {project.description}
            </p>
          </div>
        )}
        <div
          className={`col-span-12 ${
            project.description
              ? "md:col-span-6 md:col-start-7"
              : "md:col-span-4"
          }`}
        >
          <div className="grid grid-cols-[max-content_1fr] gap-y-3 gap-x-8">
            <span className="text-[12px] uppercase tracking-wider text-[#888880] self-center">
              Roles
            </span>
            <span className="text-[16px] text-[#EAE6E0]">{abbrevRoles}</span>

            <span className="text-[12px] uppercase tracking-wider text-[#888880] self-center">
              Client
            </span>
            <span className="text-[16px] text-[#EAE6E0]">{project.client}</span>

            <span className="text-[12px] uppercase tracking-wider text-[#888880] self-center">
              Year
            </span>
            <span className="text-[16px] text-[#EAE6E0]">{project.year}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── StillsSection ────────────────────────────────────────────────────────────

function StillsSection({ stills }: { stills: string[] }) {
  const [selectedStill, setSelectedStill] = useState<string | null>(null);
  const spans = getStillSpans(stills.length);

  return (
    <section className="px-6 md:px-12 pt-32 pb-24">
      <p className="text-[11px] tracking-wider uppercase text-[#888880] mb-8">
        Stills
      </p>

      <div className="grid grid-cols-12 gap-4">
        {stills.map((src, i) => (
          <div
            key={src}
            className={`${STILL_SPAN[spans[i]] ?? "col-span-12"} overflow-hidden`}
            style={{ cursor: "none" }}
            onClick={() => setSelectedStill(src)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedStill && (
          <motion.div
            className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
            style={{ cursor: "none" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedStill(null)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedStill}
              alt=""
              className="max-w-full max-h-full object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ─── PrevNextNav ──────────────────────────────────────────────────────────────

function PrevNextCard({
  project,
  direction,
}: {
  project: Project;
  direction: "prev" | "next";
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/work/${project.slug}`}
      className={`group block relative overflow-hidden px-6 md:px-12 py-16 ${
        direction === "next" ? "text-right" : ""
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {project.thumbnail && (
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none"
          style={{
            backgroundImage: `url(${project.thumbnail})`,
            opacity: hovered ? 0.15 : 0,
            transition: "opacity 300ms ease",
            filter: project.isUnreleased ? "url(#mosaic-pixelate)" : undefined,
          }}
        />
      )}
      <div className="relative">
        <p className="text-[11px] tracking-wider uppercase mb-4" style={{ color: "#3D6B9E" }}>
          {direction === "prev" ? "Prev" : "Next"}
        </p>
        <p
          className="text-[24px] md:text-[32px] uppercase"
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 300,
            fontStyle: "italic",
            letterSpacing: "0.04em",
            color: hovered ? "#EAE6E0" : "#C8C4BE",
            transition: "color 300ms ease",
          }}
        >
          {getDisplayTitle(project)}
        </p>
        <p className="text-[11px] tracking-wider uppercase text-[#888880] mt-2">
          {project.client} — {project.year}
        </p>
      </div>
    </Link>
  );
}

function PrevNextNav({
  allProjects,
  currentSlug,
}: {
  allProjects: Project[];
  currentSlug: string;
}) {
  const idx = allProjects.findIndex((p) => p.slug === currentSlug);
  const prev = idx > 0 ? allProjects[idx - 1] : null;
  const next = idx < allProjects.length - 1 ? allProjects[idx + 1] : null;

  return (
    <div className="flex border-t border-[#1E1C1A]">
      <div className={`flex-1 ${next ? "border-r border-[#1E1C1A]" : ""}`}>
        {prev ? (
          <PrevNextCard project={prev} direction="prev" />
        ) : (
          <div className="px-6 md:px-12 py-16">
            <p className="text-[11px] tracking-wider uppercase text-[#2E2C2A]">
              Prev
            </p>
          </div>
        )}
      </div>
      <div className="flex-1">
        {next ? (
          <PrevNextCard project={next} direction="next" />
        ) : (
          <div className="px-6 md:px-12 py-16 text-right">
            <p className="text-[11px] tracking-wider uppercase text-[#2E2C2A]">
              Next
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ProjectClient ────────────────────────────────────────────────────────────

export default function ProjectClient({
  project,
  allProjects,
  projectIndex,
  autoplay,
}: {
  project: Project;
  allProjects: Project[];
  projectIndex: number;
  autoplay: boolean;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [heroOpacity, setHeroOpacity] = useState(autoplay && !project.isUnreleased ? 0 : 1);
  const detailsRef = useRef<HTMLElement>(null);

  // Auto-open lightbox on ?autoplay=1
  useEffect(() => {
    if (autoplay && !project.isUnreleased) {
      const t = setTimeout(() => setLightboxOpen(true), 100);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Escape key
  useEffect(() => {
    if (!lightboxOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen]);

  function openLightbox() {
    setHeroOpacity(0);
    setTimeout(() => setLightboxOpen(true), 200);
  }

  function closeLightbox() {
    setLightboxOpen(false);
    // Hero starts fading back in as overlay begins its exit fade (400ms delay into exit)
    setTimeout(() => setHeroOpacity(1), 400);
    if (typeof window !== "undefined" && window.location.search.includes("autoplay")) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }

  return (
    <>
      <HeroSection
        project={project}
        projectIndex={projectIndex}
        heroOpacity={heroOpacity}
        onOpenLightbox={openLightbox}
        onScrollToDetails={() =>
          detailsRef.current?.scrollIntoView({ behavior: "smooth" })
        }
      />

      <AnimatePresence>
        {lightboxOpen && (
          <LightboxOverlay project={project} onClose={closeLightbox} />
        )}
      </AnimatePresence>

      <section ref={detailsRef as React.RefObject<HTMLElement>}>
        <DetailsSection project={project} />
      </section>

      {project.stills && project.stills.length > 0 && (
        <StillsSection stills={project.stills} />
      )}

      <PrevNextNav allProjects={allProjects} currentSlug={project.slug} />
    </>
  );
}
