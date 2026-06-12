import { client } from "@/sanity/lib/client";
import Link from "next/link";

interface Post {
  title: string;
  slug: { current: string };
  publishedAt: string;
  summary: string;
  tags?: string[];
}

export const revalidate = 60; // Revalidate every minute

export default async function BlogListPage() {
  const posts: Post[] = await client.fetch(
    `*[_type == "post"] | order(publishedAt desc){
      title,
      slug,
      publishedAt,
      summary,
      tags
    }`
  );

  return (
    <main className="min-h-screen py-20 relative z-10" style={{ background: "var(--bg-primary)" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        <div className="mb-12" style={{ display: "flex", justifyContent: "flex-start", textAlign: "left" }}>
          <Link href="/" className="btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: "8px", textDecoration: "none", marginLeft: "0", marginRight: "auto" }}>
            ← Back to Home
          </Link>
        </div>

        <header className="mb-16">
          <p className="section-label" style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--accent)" }}>// dev blog & til</p>
          <h1 className="section-title" style={{ fontSize: "2.8rem", marginTop: "8px", fontWeight: 700 }}>Writing & Learnings</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "12px", fontSize: "1.1rem", lineHeight: "1.6" }}>
            A space where I share technical deep dives, tutorials, and short Today-I-Learned notes about software engineering.
          </p>
        </header>

        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          {posts.length === 0 ? (
            <p style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>No posts published yet.</p>
          ) : (
            posts.map((post) => (
              <article
                key={post.slug.current}
                style={{
                  borderBottom: "1px solid var(--border)",
                  paddingBottom: "32px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                  <time
                    dateTime={post.publishedAt}
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "0.85rem",
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

                <Link
                  href={`/blog/${post.slug.current}`}
                  style={{
                    textDecoration: "none",
                    color: "var(--text-primary)",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "1.8rem",
                      fontWeight: 600,
                      marginBottom: "12px",
                      cursor: "pointer",
                      transition: "color 0.2s ease",
                    }}
                  >
                    {post.title}
                  </h2>
                </Link>

                <p style={{ color: "var(--text-secondary)", lineHeight: "1.7", fontSize: "1rem" }}>
                  {post.summary}
                </p>

                <div style={{ marginTop: "16px" }}>
                  <Link
                    href={`/blog/${post.slug.current}`}
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "0.9rem",
                      color: "var(--accent)",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    Read article →
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
