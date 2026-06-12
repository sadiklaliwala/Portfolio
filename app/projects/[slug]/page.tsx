import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import ProjectDetail from "@/components/ProjectDetail";

interface Props {
  params: Promise<{ slug: string }> | { slug: string };
}

export default async function ProjectPage({ params }: Props) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const project = await client.fetch(
    `*[_type == "project" && slug.current == $slug][0]`,
    { slug },
    { next: { revalidate: 60 } }
  );

  if (!project) {
    notFound();
  }

  return <ProjectDetail project={project} />;
}
