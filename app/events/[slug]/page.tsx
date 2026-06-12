import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import EventDetail from "@/components/EventDetail";

interface Props {
  params: Promise<{ slug: string }> | { slug: string };
}

export default async function EventPage({ params }: Props) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const event = await client.fetch(
    `*[_type == "event" && slug.current == $slug][0]`,
    { slug },
    { next: { revalidate: 60 } }
  );

  if (!event) {
    notFound();
  }

  return <EventDetail event={event} />;
}
