import Link from "next/link";
import { projects } from "@/data/projects";
import ThumbnailHover from "@/components/ThumbnailHover";

const GRID_COLS = 3; // matches lg:grid-cols-3

function chunkRows<T>(arr: T[], cols: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < arr.length; i += cols) rows.push(arr.slice(i, i + cols));
  return rows;
}

export default function Home() {
  // Credits are index-only; exclude them from the landing page grid
  const rows = chunkRows(projects.filter((p) => !p.isCredit), GRID_COLS);

  return (
    <div className="pt-[120px] pb-16">
      <p className="pl-6 md:pl-8 pb-6 text-[11px] tracking-[0.2em] uppercase text-[#888880]">
        Selected Work
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
        {rows.flatMap((row, rowIdx) => {
          // Find the widest (most landscape) aspect in this row.
          // All video thumbnails default to 16/9; custom ratios can be set via project.thumbnailAspect.
          const aspects = row.map((p) => p.thumbnailAspect ?? 16 / 9);
          const maxAspect = Math.max(...aspects);
          // Constrain the whole row if it contains a 16:9-or-wider thumbnail
          const rowConstraint = maxAspect >= 16 / 9 - 0.05 ? maxAspect : undefined;

          return row.map((project, colIdx) => (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              className="block"
            >
              <ThumbnailHover
                project={project}
                index={rowIdx * GRID_COLS + colIdx}
                constrainAspect={rowConstraint}
              />
            </Link>
          ));
        })}
      </div>
    </div>
  );
}
