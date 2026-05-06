import Link from "next/link";
import { projects } from "@/data/projects";

export default function Home() {
  return (
    <div className="px-6 pt-24 pb-16">
      <div className="grid grid-cols-12 gap-6">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/work/${project.slug}`}
            className={`group ${
              project.featured ? "col-span-12 md:col-span-8" : "col-span-12 md:col-span-4"
            }`}
          >
            <div className="relative w-full aspect-video bg-[#1C1C1C] overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
                <span className="text-[#EDEDED] text-sm font-light">{project.title}</span>
                {project.isUnreleased && (
                  <span className="text-[#888888] text-xs tracking-[0.06em]">
                    Unreleased — {project.year}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
