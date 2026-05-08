export const dynamicParams = false;

import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import ProjectClient from "@/components/ProjectClient";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
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

export default async function ProjectPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;

  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const projectIndex = projects.findIndex((p) => p.slug === slug);
  const autoplay = sp?.autoplay === "1";

  return (
    <ProjectClient
      project={project}
      allProjects={projects}
      projectIndex={projectIndex}
      autoplay={autoplay}
    />
  );
}
