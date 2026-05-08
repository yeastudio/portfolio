"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type Phase = "holding" | "sweeping" | "done";

export default function PageLoader() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("done"); // start hidden until we confirm first visit
  const [lineWidth, setLineWidth] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isFirstMount = useRef(true);

  function clear() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  function runFullLoader() {
    clear();
    setPhase("holding");
    setLineWidth(0);
    const t0 = setTimeout(() => setLineWidth(100), 60);
    const t1 = setTimeout(() => setPhase("sweeping"), 2400);
    const t2 = setTimeout(() => setPhase("done"), 3700);
    timers.current = [t0, t1, t2];
  }

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      // Only show the full loader on the first visit of the session
      const visited = sessionStorage.getItem("yea-visited");
      if (!visited) {
        sessionStorage.setItem("yea-visited", "true");
        runFullLoader();
      }
      return;
    }
    // Subsequent navigations — PageTransition handles the fade, loader stays hidden
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (phase === "done") return null;

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-[#0B0A09]"
      style={{
        transform: phase === "sweeping" ? "translateY(-100%)" : "translateY(0%)",
        transition:
          phase === "sweeping"
            ? "transform 1.25s cubic-bezier(0.76, 0, 0.24, 1)"
            : "none",
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
                  ? "width 2.2s cubic-bezier(0.08, 0.55, 0.35, 1)"
                  : "none",
            }}
          />
        </div>
      </div>
    </div>
  );
}
