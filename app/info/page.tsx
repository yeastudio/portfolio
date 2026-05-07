"use client";

import { useState } from "react";

type View = "about" | "contact";
type Phase = "idle" | "covering" | "uncovering";

function ToggleButton({ onClick, children }: { onClick: () => void; children: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden inline-block"
    >
      <span className="block px-1 text-[11px] font-medium tracking-wider uppercase text-[#EAE6E0]">
        {children}
      </span>
      <span
        className="absolute inset-0 bg-[#EAE6E0] pointer-events-none"
        style={{
          transform: hovered ? "translateX(0%)" : "translateX(-101%)",
          transition: "transform 250ms ease-out",
        }}
      />
      <span
        className="absolute inset-0 flex items-center px-1 text-[11px] font-medium tracking-wider uppercase text-[#0B0A09] pointer-events-none"
        style={{
          clipPath: hovered ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
          transition: "clip-path 250ms ease-out",
        }}
      >
        {children}
      </span>
    </button>
  );
}

function AboutContent({ onToggle }: { onToggle: () => void }) {
  return (
    <div>
      <p className="text-[11px] tracking-wider uppercase text-[#888880] mb-6">
        01 — About
      </p>
      <p className="text-[16px] leading-[1.7] text-[#EAE6E0] font-light">
        Andrew Ye is a Director, Editor, and Colorist based in New York City.
        Self-taught and drawn to the arts from an early age, Andrew broke from
        a family of doctors to build a life around image and story. His
        background covers a lot of ground — STEM, dance and movement, 3D and
        VFX — and that mix quietly shapes everything he makes. What drives him
        is simple: work that pulls you in without you noticing, where the craft
        gets out of the way and you&apos;re just in it.
      </p>
      <div className="mt-10 flex items-center gap-2">
        <span className="text-[11px] uppercase tracking-wider text-[#888880]">
          For Inquiries —
        </span>
        <ToggleButton onClick={onToggle}>Contact</ToggleButton>
      </div>
    </div>
  );
}

function ContactContent({ onToggle }: { onToggle: () => void }) {
  return (
    <div>
      <p className="text-[11px] tracking-wider uppercase text-[#888880] mb-6">
        02 — Contact
      </p>
      <div className="grid grid-cols-[max-content_1fr] gap-y-3 gap-x-8">
        <span className="text-[11px] uppercase tracking-wider text-[#888880] self-center">
          Email
        </span>
        <a
          href="mailto:andrew@yea.studio"
          className="text-[14px] text-[#EAE6E0] hover:text-[#EAE6E0] transition-colors duration-150"
        >
          andrew@yea.studio
        </a>

        <span className="text-[11px] uppercase tracking-wider text-[#888880] self-center">
          Instagram
        </span>
        <a
          href="https://instagram.com/_andrewye"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[14px] text-[#EAE6E0] hover:text-[#EAE6E0] transition-colors duration-150"
        >
          @_andrewye
        </a>

        <span className="text-[11px] uppercase tracking-wider text-[#888880] self-center">
          LinkedIn
        </span>
        <a
          href="https://linkedin.com/in/yeastudio"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[14px] text-[#EAE6E0] hover:text-[#EAE6E0] transition-colors duration-150"
        >
          linkedin.com/in/yeastudio
        </a>

        <span className="text-[11px] uppercase tracking-wider text-[#888880] self-center">
          Location
        </span>
        <span className="text-[14px] text-[#EAE6E0]">New York, NY</span>
      </div>
      <div className="mt-10 flex items-center gap-2">
        <span className="text-[11px] uppercase tracking-wider text-[#888880]">
          Return To —
        </span>
        <ToggleButton onClick={onToggle}>About</ToggleButton>
      </div>
    </div>
  );
}

export default function InfoPage() {
  const [view, setView] = useState<View>("about");
  const [phase, setPhase] = useState<Phase>("idle");

  function handleToggle() {
    if (phase !== "idle") return;
    setPhase("covering");
    setTimeout(() => {
      setView((v) => (v === "about" ? "contact" : "about"));
      setPhase("uncovering");
      setTimeout(() => setPhase("idle"), 300);
    }, 300);
  }

  const overlayStyle: React.CSSProperties = {
    transform:
      phase === "covering"
        ? "translateX(0%)"
        : phase === "uncovering"
        ? "translateX(100%)"
        : "translateX(-100%)",
    transition:
      phase === "idle"
        ? "none"
        : phase === "covering"
        ? "transform 300ms ease-out"
        : "transform 300ms ease-in",
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div
        className="absolute left-0 pl-6 md:pl-12 pr-6"
        style={{ bottom: "12vh", maxWidth: "640px" }}
      >
        <div className="relative overflow-hidden">
          {/* Wipe overlay — starts off-screen left, covers right, exits right */}
          <div
            className="absolute inset-0 bg-[#0B0A09] z-10 pointer-events-none"
            style={overlayStyle}
          />
          {view === "about" ? (
            <AboutContent onToggle={handleToggle} />
          ) : (
            <ContactContent onToggle={handleToggle} />
          )}
        </div>
      </div>
    </div>
  );
}
