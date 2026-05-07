import Link from "next/link";
import { projects } from "@/data/projects";
import ThumbnailHover from "@/components/ThumbnailHover";

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
    // pt-[112px] = header (88px) + row-gap (24px) so space above first thumbnail
    // matches the gap between rows exactly.
    <div className="pt-[104px] pb-16">
      <div className="px-4 md:px-6 grid grid-cols-12 gap-x-4 gap-y-4">
        {projects.map((project, index) => {
          const span = GRID_RHYTHM[index] ?? 4;
          return (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              className={`block self-start ${SPAN_CLASSES[span]}`}
            >
              <ThumbnailHover project={project} index={index} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
