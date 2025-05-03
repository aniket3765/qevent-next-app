'use client';

import EventCard from "@/components/EventCard";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from 'next/navigation';

function EventsContent() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchParams = useSearchParams();
  const artistQuery = searchParams.get('artist');
  const tagQuery = searchParams.get('tag');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("https://qevent-backend.labs.crio.do/events");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const filteredEvents = data.filter((event) => {
          const artistMatch = artistQuery
            ? event.artist?.toLowerCase() === artistQuery.toLowerCase()
            : true;
          const tagMatch = tagQuery
            ? event.tags?.includes(tagQuery)
            : true;
          return artistMatch && tagMatch;
        });

        setEvents(filteredEvents);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [artistQuery, tagQuery]);

  if (loading) {
    return <p>Loading events...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <>
      <h1 className="text-4xl font-bold mb-8">
        {artistQuery
          ? `Events by ${artistQuery}`
          : tagQuery
          ? `Events with tag "${tagQuery}"`
          : "Events"}
      </h1>

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard key={event.id} eventData={event} />
          ))}
        </div>
      )}
    </>
  );
}

export default function EventsPage() {
  return (
    <main className="min-h-screen p-24">
      <Suspense fallback={<p>Loading filters...</p>}>
        <EventsContent />
      </Suspense>
    </main>
  );
}
