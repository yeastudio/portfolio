"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const CATEGORIES = [
  { label: "All", value: "all" },
  { label: "Commercial", value: "commercial" },
  { label: "Music Video", value: "music-video" },
  { label: "Dance", value: "dance" },
  { label: "Personal", value: "personal" },
  { label: "Narrative", value: "narrative" },
];

const ROLES = ["Director", "DP", "Editor", "Colorist", "Sound", "VFX"];

function RoleDropdown() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRole = searchParams.get("role");

  // Close when clicking outside
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  function navigate(role: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (role) params.set("role", role.toLowerCase());
    else params.delete("role");
    const qs = params.toString();
    router.push(qs ? `/index?${qs}` : "/index", { scroll: false });
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative ml-auto shrink-0">
      {/* Trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-[11px] tracking-wider uppercase transition-colors duration-150"
        style={{ color: activeRole ? "#EAE6E0" : "#888880", fontWeight: activeRole ? 500 : 400 }}
      >
        {activeRole ? activeRole.toUpperCase() : "ROLE"}
        {activeRole ? (
          // Clear ×
          <span
            className="text-[13px] leading-none text-[#888880] hover:text-[#EAE6E0] transition-colors"
            onClick={(e) => { e.stopPropagation(); navigate(null); }}
            role="button"
            aria-label="Clear role filter"
          >
            ×
          </span>
        ) : (
          <span
            className="text-[8px] leading-none"
            style={{ transform: open ? "scaleY(-1)" : "none", display: "inline-block", transition: "transform 200ms" }}
          >
            ▾
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      <div
        className="absolute right-0 z-50 overflow-hidden"
        style={{
          top: "calc(100% + 12px)",
          minWidth: "110px",
          pointerEvents: open ? "auto" : "none",
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0)" : "translateY(-6px)",
          transition: "opacity 180ms ease, transform 180ms ease",
        }}
      >
        <div className="border border-[#1E1C1A] bg-[#0B0A09] py-1.5">
          {ROLES.map((role) => {
            const isActive = activeRole === role.toLowerCase();
            return (
              <button
                key={role}
                onClick={() => navigate(isActive ? null : role)}
                className="flex items-center justify-between w-full px-4 py-2 text-[11px] tracking-wider uppercase transition-colors duration-100"
                style={{ color: isActive ? "#3D6B9E" : "#888880", fontWeight: isActive ? 500 : 400 }}
              >
                {role}
                {isActive && <span className="text-[13px] leading-none text-[#888880]">×</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FilterBarInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const active = searchParams.get("filter") ?? "all";

  function navigateCategory(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") params.delete("filter");
    else params.set("filter", value);
    const qs = params.toString();
    router.push(qs ? `/index?${qs}` : "/index", { scroll: false });
  }

  return (
    <div className="px-6 md:px-12 pt-16 pb-8 flex flex-wrap items-center gap-y-2">
      {/* Category chips */}
      {CATEGORIES.map(({ label, value }, i) => (
        <span key={value} className="flex items-center">
          {i > 0 && (
            <span className="text-[11px] text-[#888880] px-2 select-none" aria-hidden>·</span>
          )}
          <button
            onClick={() => navigateCategory(value)}
            className="text-[11px] tracking-wider uppercase transition-colors duration-150"
            style={{ color: active === value ? "#3D6B9E" : "#888880", fontWeight: active === value ? 500 : 400 }}
          >
            {label}
          </button>
        </span>
      ))}

      {/* Role filter — right-aligned */}
      <RoleDropdown />
    </div>
  );
}

export default function FilterBar() {
  return (
    <Suspense fallback={null}>
      <FilterBarInner />
    </Suspense>
  );
}
