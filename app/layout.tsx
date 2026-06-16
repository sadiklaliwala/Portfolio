import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ParticleBackground from "@/components/ParticleBackground";
import CommandPalette from "@/components/CommandPalette";
import SpotifyWidget from "@/components/SpotifyWidget";
import ThemeToggle from "@/components/ThemeToggle";
import { AchievementProvider } from "@/context/AchievementContext";
import TrophyWidget from "@/components/TrophyWidget";
import { LanguageProvider } from "@/context/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sadiklaliwala.me";
const developerName = process.env.NEXT_PUBLIC_DEVELOPER_NAME || "Sadik Laliwala";

export const metadata: Metadata = {
  title: `${developerName} | Portfolio`,
  description: "Software Engineer Portfolio and Showcase",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: `${developerName} | Portfolio`,
    description: "Software Engineer Portfolio and Showcase",
    url: siteUrl,
    siteName: `${developerName} Portfolio`,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${developerName} | Portfolio`,
    description: "Software Engineer Portfolio and Showcase",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": developerName,
    "url": siteUrl,
    "jobTitle": "Full Stack Software Engineer",
    "knowsAbout": [
      "Software Engineering",
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "Full Stack Development",
      "Sanity CMS"
    ],
    "sameAs": [
      `https://github.com/${process.env.NEXT_PUBLIC_GITHUB_USERNAME || "sadiklaliwala"}`,
      `https://linkedin.com/in/${process.env.NEXT_PUBLIC_LINKEDIN_USERNAME || "sadiklaliwala"}`
    ]
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('portfolio-theme') || 'midnight';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })()
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <AchievementProvider>
            <ParticleBackground />
            <CommandPalette />
            <SpotifyWidget />
            <ThemeToggle />
            <TrophyWidget />
            <LanguageToggle />
            {children}
          </AchievementProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
