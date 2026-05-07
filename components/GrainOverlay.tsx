"use client";

import { useEffect, useRef } from "react";

export default function GrainOverlay() {
  const turbRef = useRef<SVGFETurbulenceElement>(null);

  useEffect(() => {
    let freq = 0.65;
    const id = setInterval(() => {
      freq = freq >= 0.68 ? 0.62 : +(freq + 0.001).toFixed(3);
      turbRef.current?.setAttribute("baseFrequency", String(freq));
    }, 200);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 40, opacity: 0.035 }}
    >
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <filter id="grain">
          <feTurbulence
            ref={turbRef}
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves={3}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  );
}
