"use client";

import { useState, useRef } from "react";
import GlitchText, { GlitchSpan } from "@/components/GlitchText";

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
      <span className="block px-1 text-[11px] font-medium tracking-wider uppercase text-[#3D6B9E]">
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
      <GlitchText
        text="Andrew Ye is a Director, Editor, and Colorist based in New York City. Self-taught and drawn to the arts from an early age, Andrew broke from a family of doctors to build a life around image and story. His background covers a lot of ground — STEM, dance and movement, 3D and VFX — and that mix quietly shapes everything he makes. What drives him is simple: work that pulls you in without you noticing, where the craft gets out of the way and you're just in it."
        className="text-[17px] leading-[1.85] text-[#EAE6E0] font-light"
      />
      <div className="mt-10 flex items-center gap-2">
        <span className="text-[11px] uppercase tracking-wider text-[#888880]">
          For Inquiries —
        </span>
        <ToggleButton onClick={onToggle}>Contact</ToggleButton>
      </div>
    </div>
  );
}

function EmailCopy() {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleClick() {
    navigator.clipboard.writeText("andrew@yea.studio");
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      onClick={handleClick}
      className="relative overflow-hidden inline-block text-left"
    >
      {/* Base: email address */}
      <span className="block text-[15px] text-[#EAE6E0]">
        <GlitchSpan>andrew@yea.studio</GlitchSpan>
      </span>

      {/* Sweep fill */}
      <span
        className="absolute inset-0 bg-[#EAE6E0] pointer-events-none"
        style={{
          transform: copied ? "translateX(0%)" : "translateX(-101%)",
          transition: "transform 350ms ease-out",
        }}
      />

      {/* "Copied" text clipped to swept region */}
      <span
        className="absolute inset-0 flex items-center text-[15px] text-[#0B0A09] pointer-events-none whitespace-nowrap"
        style={{
          clipPath: copied ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
          transition: "clip-path 350ms ease-out",
        }}
      >
        Copied to clipboard
      </span>
    </button>
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
        <EmailCopy />

        <span className="text-[11px] uppercase tracking-wider text-[#888880] self-center">
          Instagram
        </span>
        <a
          href="https://instagram.com/_andrewye"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[15px] text-[#EAE6E0]"
        >
          <GlitchSpan>@_andrewye</GlitchSpan>
        </a>

        <span className="text-[11px] uppercase tracking-wider text-[#888880] self-center">
          LinkedIn
        </span>
        <a
          href="https://linkedin.com/in/yeastudio"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[15px] text-[#EAE6E0]"
        >
          <GlitchSpan>linkedin.com/in/yeastudio</GlitchSpan>
        </a>

        <span className="text-[11px] uppercase tracking-wider text-[#888880] self-center">
          Location
        </span>
        <span className="text-[15px] text-[#EAE6E0]">
          <GlitchSpan>New York, NY</GlitchSpan>
        </span>
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
      {/* Portrait — tablet/desktop: top-right */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/propic.jpg"
        alt="Andrew Ye"
        className="absolute hidden md:block h-[70vh] w-auto object-contain pointer-events-none select-none"
        style={{ left: "50vw", maxWidth: "46vw", top: "8vh" }}
      />

      {/* Text content — bottom-left */}
      <div
        className="absolute left-0 pl-6 md:pl-12 pr-6"
        style={{ bottom: "12vh", maxWidth: "640px" }}
      >
        {/* Portrait — mobile: sits directly above the text */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/propic.jpg"
          alt="Andrew Ye"
          className="block md:hidden w-auto object-contain pointer-events-none select-none mb-6"
          style={{ height: "28vh", maxWidth: "80vw" }}
        />
        <div className="relative overflow-hidden">
          {/* Wipe overlay — starts off-screen left, covers right, exits right */}
          <div
            className="absolute inset-0 bg-[#050505] z-10 pointer-events-none"
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
