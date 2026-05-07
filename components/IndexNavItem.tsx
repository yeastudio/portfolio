"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import NavLink from "@/components/NavLink";

const FILTERS = [
  { label: "ALL", value: "all" },
  { label: "COMMERCIAL", value: "commercial" },
  { label: "MUSIC VIDEO", value: "music-video" },
  { label: "DANCE", value: "dance" },
  { label: "PERSONAL", value: "personal" },
  { label: "NARRATIVE", value: "narrative" },
];

function FilterDropdown({ onClose }: { onClose: () => void }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeFilter = searchParams.get("filter") ?? "all";
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    router.push(value === "all" ? "/index" : `/index?filter=${value}`, { scroll: false });
    onClose();
  };

  return (
    <div className="absolute top-full left-0 bg-[#0A0A0A] z-50 py-2 min-w-[200px]">
      {FILTERS.map(({ label, value }) => {
        const isActive = activeFilter === value;
        const isHovered = hoveredValue === value;
        const showArrow = isActive || isHovered;
        const textColor = isActive || isHovered ? "text-[#EDEDED]" : "text-[#888888]";
        const weight = isActive ? "font-medium" : "font-normal";

        return (
          <button
            key={value}
            onClick={() => handleSelect(value)}
            onMouseEnter={() => setHoveredValue(value)}
            onMouseLeave={() => setHoveredValue(null)}
            className="w-full text-left px-4 py-2 flex items-center gap-3"
          >
            <span
              className={`text-[12px] text-[#888888] leading-none inline-block ${showArrow ? "visible" : "invisible"}`}
              style={{ transform: "scaleX(-1)" }}
            >
              ↵
            </span>
            <span className={`text-[12px] tracking-wider uppercase ${textColor} ${weight}`}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// Styled button with same L→R sweep invert as NavLink
function FilterButton({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden inline-block"
    >
      <span className="block px-2 py-0.5 text-[16px] font-bold tracking-wider uppercase text-[#EDEDED]">
        Filter
      </span>
      <span
        className="absolute inset-0 bg-white pointer-events-none"
        style={{
          transform: hovered ? "translateX(0%)" : "translateX(-101%)",
          transition: "transform 300ms ease-out",
        }}
      />
      <span
        className="absolute inset-0 flex items-center px-2 text-[16px] font-bold tracking-wider uppercase text-[#0A0A0A] pointer-events-none"
        style={{
          clipPath: hovered ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
          transition: "clip-path 300ms ease-out",
        }}
      >
        Filter
      </span>
    </button>
  );
}

export default function IndexNavItem() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleOutsideClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  useEffect(() => {
    if (pathname !== "/index") setOpen(false);
  }, [pathname]);

  if (pathname !== "/index") {
    return <NavLink href="/index">Index</NavLink>;
  }

  return (
    <div className="relative" ref={ref} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <FilterButton onClick={() => setOpen(true)} />
      {open && (
        <Suspense fallback={null}>
          <FilterDropdown onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </div>
  );
}
