import { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sadiklaliwala.me";

  let projectUrls: MetadataRoute.Sitemap = [];
  let blogUrls: MetadataRoute.Sitemap = [];

  try {
    // Fetch dynamic project slugs
    const projects = await client.fetch<Array<{ slug?: { current: string }; _updatedAt?: string }>>(
      `*[_type == "project"] { slug, _updatedAt }`,
      {},
      { next: { revalidate: 3600 } } // Cache sitemap queries for an hour
    );

    projectUrls = projects
      .filter((p) => p.slug?.current)
      .map((p) => ({
        url: `${baseUrl}/projects/${p.slug!.current}`,
        lastModified: p._updatedAt ? new Date(p._updatedAt) : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      }));
  } catch (e) {
    console.error("Sitemap: Failed to load projects", e);
  }

  try {
    // Fetch dynamic blog post slugs
    const posts = await client.fetch<Array<{ slug?: { current: string }; publishedAt?: string }>>(
      `*[_type == "post"] { slug, publishedAt }`,
      {},
      { next: { revalidate: 3600 } }
    );

    blogUrls = posts
      .filter((p) => p.slug?.current)
      .map((p) => ({
        url: `${baseUrl}/blog/${p.slug!.current}`,
        lastModified: p.publishedAt ? new Date(p.publishedAt) : new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      }));
  } catch (e) {
    console.error("Sitemap: Failed to load blog posts", e);
  }

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/playground`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  return [...staticUrls, ...projectUrls, ...blogUrls];
}
