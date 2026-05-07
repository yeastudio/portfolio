"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

interface GlitchState {
  fontFamily: string;
  fontWeight: number;
  fontStyle: string;
  letterSpacing: string;
}

const STATES: GlitchState[] = [
  // 0 — settled final: General Sans 500
  { fontFamily: "var(--font-sans)", fontWeight: 500, fontStyle: "normal", letterSpacing: "0.1em" },
  // 1 — Newsreader italic 300
  { fontFamily: "var(--font-serif)", fontWeight: 300, fontStyle: "italic", letterSpacing: "0.1em" },
  // 2 — General Sans 300 stretched
  { fontFamily: "var(--font-sans)", fontWeight: 300, fontStyle: "normal", letterSpacing: "0.3em" },
  // 3 — Newsreader 400 upright
  { fontFamily: "var(--font-serif)", fontWeight: 400, fontStyle: "normal", letterSpacing: "0.1em" },
  // 4 — General Sans 500 (same as 0, snaps to final)
  { fontFamily: "var(--font-sans)", fontWeight: 500, fontStyle: "normal", letterSpacing: "0.1em" },
];

// Mount: 0 → 1 → 2 → 3 → 4 → 0  (starts from settled, glitches, returns)
// Hover: 1 → 2 → 3 → 4 → 0       (already settled, glitches, returns)
const MOUNT_SEQ = [0, 1, 2, 3, 4, 0];
const HOVER_SEQ = [1, 2, 3, 4, 0];
const STEP_MS = 68;

export default function LogoMark() {
  const [stateIdx, setStateIdx] = useState(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const runSequence = useCallback((seq: number[]) => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    seq.forEach((idx, i) => {
      const t = setTimeout(() => setStateIdx(idx), i * STEP_MS);
      timersRef.current.push(t);
    });
  }, []);

  useEffect(() => {
    // Small delay so the page settles before mount glitch
    const t = setTimeout(() => runSequence(MOUNT_SEQ), 400);
    return () => {
      clearTimeout(t);
      timersRef.current.forEach(clearTimeout);
    };
  }, [runSequence]);

  const style = STATES[stateIdx];

  return (
    <Link href="/" className="select-none shrink-0">
      <div className="flex flex-col items-start" style={{ lineHeight: 1 }}>
        <span
          onMouseEnter={() => runSequence(HOVER_SEQ)}
          style={{
            fontFamily: style.fontFamily,
            fontWeight: style.fontWeight,
            fontStyle: style.fontStyle,
            letterSpacing: style.letterSpacing,
            textTransform: "uppercase",
            fontSize: "18px",
            color: "#EAE6E0",
            display: "block",
            lineHeight: 1,
          }}
        >
          YEA
        </span>
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 300,
            fontStyle: "italic",
            letterSpacing: "0.08em",
            fontSize: "10px",
            color: "#888880",
            display: "block",
            marginTop: "4px",
            lineHeight: 1,
          }}
        >
          Andrew Ye
        </span>
      </div>
    </Link>
  );
}
