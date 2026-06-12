import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";

interface Props {
  params: Promise<{ slug: string }> | { slug: string };
}

interface PostDetail {
  title: string;
  publishedAt: string;
  summary: string;
  tags?: string[];
  body: any;
}

export const revalidate = 60;

export default async function BlogPostPage({ params }: Props) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const post: PostDetail = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]`,
    { slug }
  );

  if (!post) {
    notFound();
  }

  // Custom components for rendering PortableText
  const portableTextComponents: PortableTextComponents = {
    types: {
      image: ({ value }: any) => {
        if (!value?.asset) return null;
        return (
          <figure style={{ margin: "30px 0", textAlign: "center" }}>
            <img
              src={urlFor(value).width(800).url()}
              alt={value.alt || "Blog image"}
              style={{
                maxWidth: "100%",
                borderRadius: "8px",
                border: "1px solid var(--border)",
              }}
            />
            {value.caption && (
              <figcaption
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.85rem",
                  marginTop: "8px",
                  fontStyle: "italic",
                }}
              >
                {value.caption}
              </figcaption>
            )}
          </figure>
        );
      },
    },
    block: {
      h1: ({ children }: any) => <h1 style={{ fontSize: "2.2rem", fontWeight: 700, margin: "40px 0 20px", color: "var(--text-primary)" }}>{children}</h1>,
      h2: ({ children }: any) => <h2 style={{ fontSize: "1.8rem", fontWeight: 600, margin: "32px 0 16px", color: "var(--text-primary)" }}>{children}</h2>,
      h3: ({ children }: any) => <h3 style={{ fontSize: "1.4rem", fontWeight: 600, margin: "24px 0 12px", color: "var(--text-primary)" }}>{children}</h3>,
      normal: ({ children }: any) => (
        <p style={{ color: "var(--text-secondary)", lineHeight: "1.8", fontSize: "1.05rem", margin: "0 0 20px" }}>
          {children}
        </p>
      ),
      blockquote: ({ children }: any) => (
        <blockquote
          style={{
            borderLeft: "4px solid var(--accent)",
            paddingLeft: "20px",
            margin: "30px 0",
            fontStyle: "italic",
            color: "var(--text-primary)",
            background: "rgba(0, 212, 255, 0.03)",
            padding: "16px 20px",
            borderRadius: "0 8px 8px 0",
          }}
        >
          {children}
        </blockquote>
      ),
    },
    marks: {
      strong: ({ children }: any) => <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>{children}</strong>,
      code: ({ children }: any) => (
        <code
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "0.9em",
            background: "rgba(0, 212, 255, 0.07)",
            padding: "3px 6px",
            borderRadius: "4px",
            color: "var(--accent)",
          }}
        >
          {children}
        </code>
      ),
      link: ({ children, value }: any) => {
        const rel = !value.href.startsWith("/") ? "noreferrer noopener" : undefined;
        const target = !value.href.startsWith("/") ? "_blank" : undefined;
        return (
          <a
            href={value.href}
            rel={rel}
            target={target}
            style={{
              color: "var(--accent)",
              textDecoration: "underline",
              textUnderlineOffset: "4px",
            }}
          >
            {children}
          </a>
        );
      },
    },
  };

  return (
    <main className="min-h-screen py-20 relative z-10" style={{ background: "var(--bg-primary)" }}>
      <div className="container" style={{ maxWidth: "760px" }}>
        <div className="mb-12">
          <Link href="/blog" className="btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            ← Back to Blog List
          </Link>
        </div>

        <article>
          <header className="mb-12" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <time
                dateTime={post.publishedAt}
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.9rem",
                  color: "var(--text-secondary)",
                }}
              >
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              {post.tags && post.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "0.75rem",
                    color: "var(--accent-green)",
                    background: "rgba(0, 255, 136, 0.05)",
                    border: "1px solid rgba(0, 255, 136, 0.15)",
                    padding: "2px 8px",
                    borderRadius: "4px",
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>

            <h1
              style={{
                fontSize: "2.8rem",
                fontWeight: 700,
                lineHeight: "1.25",
                color: "var(--text-primary)",
                marginBottom: "20px",
              }}
            >
              {post.title}
            </h1>

            <p style={{ fontSize: "1.15rem", lineHeight: "1.6", color: "var(--text-secondary)", fontStyle: "italic" }}>
              {post.summary}
            </p>
          </header>

          <div style={{ color: "var(--text-secondary)" }}>
            <PortableText value={post.body} components={portableTextComponents} />
          </div>
        </article>
      </div>
    </main>
  );
}
