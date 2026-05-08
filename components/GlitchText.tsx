"use client";

import { useCallback, useRef } from "react";

interface GlitchStyle {
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
  textTransform: string;
  backgroundColor: string;
  color: string;
  letterSpacing: string;
}

const RESET: GlitchStyle = {
  fontFamily: "",
  fontWeight: "",
  fontStyle: "",
  textTransform: "",
  backgroundColor: "",
  color: "",
  letterSpacing: "",
};

const STATES: GlitchStyle[] = [
  { ...RESET, fontFamily: "var(--font-serif)", fontWeight: "300", fontStyle: "italic" },
  { ...RESET, fontFamily: "var(--font-serif)", fontWeight: "400" },
  { ...RESET, fontFamily: "var(--font-sans)", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.08em" },
  { ...RESET, fontFamily: "var(--font-sans)", fontWeight: "300", textTransform: "lowercase" },
  { ...RESET, fontFamily: "var(--font-sans)", fontWeight: "400", backgroundColor: "#EAE6E0", color: "#0B0A09" },
  { ...RESET, fontFamily: "var(--font-serif)", fontWeight: "400", fontStyle: "italic" },
  { ...RESET, fontFamily: "var(--font-sans)", fontWeight: "300", letterSpacing: "0.2em" },
];

function applyStyle(el: HTMLSpanElement, s: GlitchStyle) {
  Object.assign(el.style, s);
}

interface WordSpanProps {
  word: string;
  index: number;
  refs: React.MutableRefObject<(HTMLSpanElement | null)[]>;
}

function WordSpan({ word, index, refs }: WordSpanProps) {
  const handleEnter = useCallback(() => {
    const el = refs.current[index];
    if (!el) return;

    // Lock into a new random state — stays until hovered again
    const state = STATES[Math.floor(Math.random() * STATES.length)];
    applyStyle(el, state);

    // ~60% chance to infect a neighbor into its own random state
    if (Math.random() > 0.4) {
      const neighbor = refs.current[index + (Math.random() > 0.5 ? 1 : -1)];
      if (neighbor) {
        applyStyle(neighbor, STATES[Math.floor(Math.random() * STATES.length)]);
      }
    }
  }, [index, refs]);

  return (
    <span
      ref={(el) => { refs.current[index] = el; }}
      onMouseEnter={handleEnter}
      style={{ display: "inline" }}
    >
      {word}{" "}
    </span>
  );
}

interface Props {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function GlitchText({ text, className, style }: Props) {
  const refs = useRef<(HTMLSpanElement | null)[]>([]);
  const words = text.split(" ");

  return (
    <p className={className} style={style}>
      {words.map((word, i) => (
        <WordSpan key={i} word={word} index={i} refs={refs} />
      ))}
    </p>
  );
}

// Inline single-element version — locks state on hover until hovered again
export function GlitchSpan({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const handleEnter = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    applyStyle(el, STATES[Math.floor(Math.random() * STATES.length)]);
  }, []);

  return (
    <span ref={ref} onMouseEnter={handleEnter} className={className}>
      {children}
    </span>
  );
}
