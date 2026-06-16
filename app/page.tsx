import Hero from "@/components/Hero";
import About from "@/components/About";
import { client } from "@/sanity/lib/client";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import GitHubActivity from "@/components/GitHubActivity";
import Events from "@/components/Events";
import Experience from "@/components/Experience";
import PerformanceDashboard from "@/components/PerformanceDashboard";
import Contact from "@/components/Contact";

export default async function Home() {
  const [hero, about, skills, projects, experience, contact, events] =
    await Promise.all([
      client.fetch(`*[_type == "hero"][0]`, {}, { next: { revalidate: 60 } }),
      client.fetch(`*[_type == "about"][0]`, {}, { next: { revalidate: 60 } }),
      client.fetch(`*[_type == "skill"]`, {}, { next: { revalidate: 60 } }),
      client.fetch(`*[_type == "project"]`, {}, { next: { revalidate: 60 } }),
      client.fetch(
        `*[_type == "experience"]`,
        {},
        { next: { revalidate: 60 } },
      ),
      client.fetch(`*[_type == "contact"]`, {}, { next: { revalidate: 60 } }),
      client.fetch(
        `*[_type == "event"] | order(date desc)`,
        {},
        { next: { revalidate: 60 } },
      ),
    ]);

  return (
    <main>
      <Hero data={hero} />
      <About data={about} />
      <Experience data={experience} />
      <Skills data={skills} />
      <Projects data={projects} />
      <GitHubActivity />
      <Events data={events} />
      <PerformanceDashboard />
      <Contact data={contact} />
    </main>
  );
}
