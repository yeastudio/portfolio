import Link from "next/link";
import { projects } from "@/data/projects";

// Explicit column spans per project position — adjust here to change rhythm.
// Each row must sum to 12.
// Row 1: 7+5, Row 2: 4+4+4, Row 3: 5+7, Row 4: 8+4, Row 5: 6+6
const GRID_RHYTHM = [7, 5, 4, 4, 4, 5, 7, 8, 4, 6, 6];

// Full class strings so Tailwind includes them at build time.
const SPAN_CLASSES: Record<number, string> = {
  4: "col-span-12 md:col-span-4",
  5: "col-span-12 md:col-span-5",
  6: "col-span-12 md:col-span-6",
  7: "col-span-12 md:col-span-7",
  8: "col-span-12 md:col-span-8",
};

export default function Home() {
  return (
    <div className="pt-32 pb-32">
      <div className="px-3 grid grid-cols-12 gap-4">
        {projects.map((project, index) => {
          const span = GRID_RHYTHM[index] ?? 4;
          return (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              className={`block ${SPAN_CLASSES[span]}`}
            >
              <div className="w-full aspect-video bg-[#1A1A1A]" />
              <div className="pl-1 mt-3 flex items-baseline gap-6 text-[12px]">
                <span className="text-[#888888] tabular-nums shrink-0">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-[#EDEDED]">{project.title}</span>
                <span className="text-[#888888]">{project.client}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
