"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type Phase = "idle" | "filling" | "completing" | "fading";

export default function LoadingBar() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("filling");
  const t1 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t2 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t3 = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clear() {
    [t1, t2, t3].forEach((r) => { if (r.current) clearTimeout(r.current); });
  }

  useEffect(() => {
    clear();
    // Reset to 0 instantly, then kick off the fill
    setPhase("idle");
    t1.current = setTimeout(() => setPhase("filling"), 30);   // 0 → 80% over 1.1s
    t2.current = setTimeout(() => setPhase("completing"), 1100); // snap to 100%
    t3.current = setTimeout(() => setPhase("fading"), 1350);  // fade out

    return clear;
  }, [pathname]);

  const width =
    phase === "idle"       ? "0%"   :
    phase === "filling"    ? "80%"  :
    phase === "completing" ? "100%" :
                             "100%";

  const transition =
    phase === "filling"    ? "width 1.1s cubic-bezier(0.08, 0.6, 0.3, 1)" :
    phase === "completing" ? "width 220ms ease-in"                          :
                             "none";

  const opacity = phase === "fading" ? 0 : 1;

  if (phase === "idle" && width === "0%") return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] h-[2px] pointer-events-none">
      <div
        style={{
          height: "100%",
          width,
          transition,
          opacity,
          backgroundColor: "#EAE6E0",
          transitionProperty: phase === "fading" ? "opacity" : "width",
          ...(phase === "fading" && { transition: "opacity 280ms ease" }),
        }}
      />
    </div>
  );
}
