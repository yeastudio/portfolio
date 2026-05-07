"use client";

import { useState } from "react";
import Link from "next/link";

interface Props {
  href: string;
  children: React.ReactNode;
}

export default function NavLink({ href, children }: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      className="relative overflow-hidden inline-block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Base text */}
      <span className="block px-2 py-0.5 text-[16px] font-bold tracking-wider uppercase text-[#EAE6E0]">
        {children}
      </span>

      {/* Warm white sweep L→R */}
      <span
        className="absolute inset-0 bg-[#EAE6E0] pointer-events-none"
        style={{
          transform: hovered ? "translateX(0%)" : "translateX(-101%)",
          transition: "transform 300ms ease-out",
        }}
      />

      {/* Dark text clipped to swept region */}
      <span
        className="absolute inset-0 flex items-center px-2 text-[16px] font-bold tracking-wider uppercase text-[#0B0A09] pointer-events-none"
        style={{
          clipPath: hovered ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
          transition: "clip-path 300ms ease-out",
        }}
      >
        {children}
      </span>
    </Link>
  );
}
