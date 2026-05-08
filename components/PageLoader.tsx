"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type Phase = "holding" | "fading" | "done";

export default function PageLoader() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("done");
  const [lineWidth, setLineWidth] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const isFirstMount = useRef(true);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function clear() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  function run(fillDuration: number) {
    clear();
    setPhase("holding");
    setLineWidth(0);
    setOpacity(1);
    // Loader is now covering the page — safe to reveal content underneath
    document.documentElement.classList.remove("js-loading");

    // Start fill
    const t0 = setTimeout(() => setLineWidth(100), 60);
    // Fade out once fill completes (+ small pause)
    const t1 = setTimeout(() => {
      setPhase("fading");
      setOpacity(0);
    }, fillDuration + 200);
    // Remove from DOM after fade
    const t2 = setTimeout(() => setPhase("done"), fillDuration + 750);

    timers.current = [t0, t1, t2];
  }

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      const visited = sessionStorage.getItem("yea-visited");
      if (!visited) {
        sessionStorage.setItem("yea-visited", "true");
        run(2200); // First visit: ~2.2s fill
      } else {
        run(1200); // Returning: ~1.2s fill
      }
      return;
    }
    // Every subsequent navigation
    run(1200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (phase === "done") return null;

  return (
    // z-40 keeps us below the header (z-50) so nav stays visible
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-[var(--background)]"
      style={{
        opacity,
        transition: phase === "fading" ? "opacity 500ms ease" : "none",
        pointerEvents: phase === "fading" ? "none" : "auto",
      }}
    >
      <div className="flex flex-col items-center gap-5">
        <p className="text-[10px] tracking-[0.35em] uppercase text-[#888880]">
          Yea Studio
        </p>
        <div className="relative w-[100px] h-px bg-[#1E1C1A] overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-[#EAE6E0]"
            style={{
              width: `${lineWidth}%`,
              transition:
                lineWidth === 100
                  ? "width var(--fill-dur, 1.2s) cubic-bezier(0.08, 0.55, 0.35, 1)"
                  : "none",
            }}
          />
        </div>
      </div>
    </div>
  );
}
