import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import VimeoEmbed from "@/components/VimeoEmbed";
import YoutubeEmbed from "@/components/YoutubeEmbed";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return {
    title: project ? `${project.title} — Andrew Ye` : "Andrew Ye",
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) notFound();

  return (
    <div className="px-6 pt-32 pb-24 max-w-[1200px] mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-light tracking-tight mb-3">{project.title}</h1>
        <p className="text-[#888888] mb-3">
          {project.client} · {project.year}
        </p>
        <p className="text-[11px] tracking-[0.1em] uppercase text-[#888888]">
          {project.roles.join(" / ")}
        </p>
      </div>

      {project.isUnreleased ? (
        <div className="w-full aspect-video bg-[#1C1C1C] flex items-center justify-center mb-12">
          <p className="text-[#888888] text-xs tracking-[0.1em] uppercase">
            Unreleased — Coming {project.year}
          </p>
        </div>
      ) : project.videoProvider === "vimeo" ? (
        <div className="mb-12">
          <VimeoEmbed videoId={project.videoId} />
        </div>
      ) : project.videoProvider === "youtube" ? (
        <div className="mb-12">
          <YoutubeEmbed videoId={project.videoId} />
        </div>
      ) : null}

      {project.description && (
        <p className="text-[#EDEDED] font-light leading-relaxed max-w-2xl">
          {project.description}
        </p>
      )}
    </div>
  );
}
