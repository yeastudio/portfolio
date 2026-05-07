"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Commercial", value: "commercial" },
  { label: "Music Video", value: "music-video" },
  { label: "Dance", value: "dance" },
  { label: "Personal", value: "personal" },
  { label: "Narrative", value: "narrative" },
];

function FilterBarInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const active = searchParams.get("filter") ?? "all";

  return (
    <div className="px-6 md:px-12 pt-16 pb-8 flex flex-wrap items-center gap-y-2">
      {FILTERS.map(({ label, value }, i) => (
        <span key={value} className="flex items-center">
          {i > 0 && (
            <span className="text-[11px] text-[#888880] px-2 select-none" aria-hidden>
              ·
            </span>
          )}
          <button
            onClick={() =>
              router.push(
                value === "all" ? "/index" : `/index?filter=${value}`,
                { scroll: false }
              )
            }
            className="text-[11px] tracking-wider uppercase transition-colors duration-150"
            style={{
              color: active === value ? "#EAE6E0" : "#888880",
              fontWeight: active === value ? 500 : 400,
            }}
          >
            {label}
          </button>
        </span>
      ))}
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
