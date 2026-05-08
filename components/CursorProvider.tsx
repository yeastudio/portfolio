"use client";

import { useState, useEffect, useRef } from "react";

type CursorType = "default" | "pointer" | "play" | "scrub";

const DOT_SIZE = 16;
const TRI_SIZE = 16;
const COLOR_DOT = "#EAE6E0";
const COLOR_TRI = "#3D6B9E";

function getCursorType(el: Element): CursorType {
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


  // RAF loop — lerps PLAY label toward cursor
  useEffect(() => {
    function tick() {
      labelPosRef.current.x = lerp(labelPosRef.current.x, targetRef.current.x, 0.1);
      labelPosRef.current.y = lerp(labelPosRef.current.y, targetRef.current.y, 0.1);
      if (labelRef.current && cursorTypeRef.current === "play") {
        labelRef.current.style.transform = `translate(${labelPosRef.current.x + TRI_SIZE + 2}px, ${labelPosRef.current.y - 4}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

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
        if (newType === "play") labelPosRef.current = { x, y };
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

  const isDefault = cursorType === "default";
  const isPlay = cursorType === "play";
  const pressScale = pressed ? "scale(0.8)" : "scale(1)";

  return (
    <>
      {children}
      <div aria-hidden>
        <div
          ref={wrapperRef}
          className="fixed top-0 left-0 z-[9999] pointer-events-none"
          style={{ transform: "translate(-100px, -100px)", willChange: "transform" }}
        >
          {/* Default: solid dot — warm white */}
          <div
            style={{
              position: "absolute",
              width: DOT_SIZE,
              height: DOT_SIZE,
              top: -(DOT_SIZE / 2),
              left: -(DOT_SIZE / 2),
              borderRadius: "50%",
              backgroundColor: COLOR_DOT,
              opacity: visible && isDefault ? 1 : 0,
              transform: pressScale,
              transformOrigin: "center",
              transition: "opacity 150ms, transform 100ms ease",
            }}
          />

          {/* Hover: filled off-centre triangle — steel blue */}
          <div
            style={{
              position: "absolute",
              width: TRI_SIZE,
              height: TRI_SIZE,
              top: 0,
              left: 0,
              backgroundColor: COLOR_TRI,
              clipPath: "polygon(0% 0%, 100% 32%, 28% 100%)",
              opacity: visible && !isDefault ? 1 : 0,
              transform: pressScale,
              transformOrigin: "0% 0%",
              transition: "opacity 150ms, transform 100ms ease",
            }}
          />
        </div>

        {/* PLAY label */}
        <div
          ref={labelRef}
          className="fixed top-0 left-0 z-[9999] pointer-events-none"
          style={{
            transform: "translate(-100px, -100px)",
            opacity: visible && isPlay ? 1 : 0,
            transition: "opacity 150ms",
            willChange: "transform",
          }}
        >
          <span
            className="text-[11px] tracking-wider uppercase font-medium"
            style={{ color: COLOR_TRI }}
          >
            PLAY
          </span>
        </div>

      </div>
    </>
  );
}
