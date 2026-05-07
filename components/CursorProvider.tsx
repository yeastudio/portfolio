"use client";

import { useState, useEffect, useRef } from "react";

type CursorType = "default" | "pointer" | "play" | "scrub";

function getCursorType(el: Element): CursorType {
  // Body-level override set during scrub drag so triangle persists while mouse roams
  if (document.body.dataset.cursor === "scrub") return "scrub";
  const dataCursor = el.closest("[data-cursor]")?.getAttribute("data-cursor");
  if (dataCursor === "play") return "play";
  if (dataCursor === "scrub") return "scrub";
  if (el.closest("a, button, [role='button'], input, label, select")) return "pointer";
  return "default";
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function CursorProvider({ children }: { children: React.ReactNode }) {
  const [cursorType, setCursorType] = useState<CursorType>("default");
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  const targetRef = useRef({ x: -100, y: -100 });
  const labelPosRef = useRef({ x: -100, y: -100 });
  const prevTypeRef = useRef<CursorType>("default");
  const cursorTypeRef = useRef<CursorType>("default");
  const rafRef = useRef<number | null>(null);

  // RAF loop — lerps PLAY label toward cursor, no React re-renders
  useEffect(() => {
    function tick() {
      labelPosRef.current.x = lerp(labelPosRef.current.x, targetRef.current.x, 0.1);
      labelPosRef.current.y = lerp(labelPosRef.current.y, targetRef.current.y, 0.1);

      if (labelRef.current && cursorTypeRef.current === "play") {
        labelRef.current.style.transform = `translate(${labelPosRef.current.x + 14}px, ${labelPosRef.current.y - 6}px)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Mouse event listeners
  useEffect(() => {
    function onMove(e: MouseEvent) {
      const { clientX: x, clientY: y } = e;
      targetRef.current = { x, y };

      if (wrapperRef.current) {
        wrapperRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }

      setVisible(true);

      const el = e.target as Element;
      const newType = getCursorType(el);
      if (newType !== prevTypeRef.current) {
        if (newType === "play") {
          labelPosRef.current = { x, y };
        }
        prevTypeRef.current = newType;
        cursorTypeRef.current = newType;
        setCursorType(newType);
      }
    }

    function onLeave() { setVisible(false); }
    function onDown() { setPressed(true); }
    function onUp() { setPressed(false); }

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
    };
  }, []);

  const isPointer = cursorType === "pointer";
  const isScrub = cursorType === "scrub";
  const pressScale = pressed ? "scale(0.75)" : "scale(1)";

  return (
    <>
      {children}
      <div aria-hidden>
        {/* Position wrapper — translate follows cursor instantly via DOM */}
        <div
          ref={wrapperRef}
          className="fixed top-0 left-0 z-[9999] pointer-events-none"
          style={{ transform: "translate(-100px, -100px)", willChange: "transform" }}
        >
          {/* SVG cursor — circle (default/play) morphs to triangle outline (pointer) */}
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            style={{
              position: "absolute",
              top: -6,
              left: -6,
              overflow: "visible",
              opacity: visible && !isScrub ? 0.9 : 0,
              transform: pressScale,
              transformOrigin: "center",
              transition: "opacity 150ms, transform 100ms ease",
            }}
          >
            {/* Circle — default and play states */}
            <circle
              cx="6" cy="6" r="5"
              fill="none"
              stroke="#EAE6E0"
              strokeWidth="1"
              style={{
                opacity: isPointer ? 0 : 1,
                transition: "opacity 150ms",
              }}
            />
            {/* Triangle outline — pointer/hover state */}
            <path
              d="M 6 1 L 11 11 L 1 11 Z"
              fill="none"
              stroke="#EAE6E0"
              strokeWidth="1"
              strokeLinejoin="round"
              style={{
                opacity: isPointer ? 1 : 0,
                transition: "opacity 150ms",
              }}
            />
          </svg>

          {/* Filled triangle — scrub state, tip at cursor (top-left) */}
          <div
            style={{
              position: "absolute",
              width: 22,
              height: 22,
              top: 0,
              left: 0,
              opacity: visible && isScrub ? 0.9 : 0,
              backgroundColor: "#EAE6E0",
              clipPath: "polygon(0% 0%, 100% 32%, 28% 100%)",
              transform: pressScale,
              transition: "opacity 120ms, transform 100ms ease",
            }}
          />
        </div>

        {/* PLAY label — position driven by RAF lerp via DOM */}
        <div
          ref={labelRef}
          className="fixed top-0 left-0 z-[9999] pointer-events-none"
          style={{
            transform: "translate(-100px, -100px)",
            opacity: visible && cursorType === "play" ? 1 : 0,
            transition: "opacity 150ms",
            willChange: "transform",
          }}
        >
          <span
            className="text-[11px] tracking-wider uppercase font-medium"
            style={{ color: "#EAE6E0" }}
          >
            PLAY
          </span>
        </div>
      </div>
    </>
  );
}
