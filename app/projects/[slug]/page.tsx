import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import ProjectDetail from "@/components/ProjectDetail";
import type { Metadata } from "next";
import { urlFor } from "@/sanity/lib/image";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sadiklaliwala.me";
const developerName = process.env.NEXT_PUBLIC_DEVELOPER_NAME || "Sadik Laliwala";

interface Props {
  params: Promise<{ slug: string }> | { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const project = await client.fetch(
    `*[_type == "project" && slug.current == $slug][0]{
      title,
      description,
      image
    }`,
    { slug },
    { next: { revalidate: 60 } }
  );

  if (!project) {
    return {
      title: `Project Not Found | ${developerName}`,
      description: "This project could not be found."
    };
  }

  let imageUrl = "";
  if (project.image) {
    try {
      imageUrl = urlFor(project.image).width(1200).height(630).url();
    } catch (e) {}
  }

  return {
    title: `${project.title} | Projects - ${developerName}`,
    description: project.description || `Read details about ${project.title} project`,
    alternates: {
      canonical: `${siteUrl}/projects/${slug}`,
    },
    openGraph: {
      title: `${project.title} | Projects`,
      description: project.description || `Read details about ${project.title} project`,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Projects`,
      description: project.description || `Read details about ${project.title} project`,
      images: imageUrl ? [imageUrl] : [],
    }
  };
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": project.description,
    "creator": {
      "@type": "Person",
      "name": developerName
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ProjectDetail project={project} />
    </>
  );
}
