'use client';

import EventCard from "@/components/EventCard";
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';

export default function EventsPage() {
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

        // Filter events by artist name from query
        // const filteredEvents = artistQuery
        //   ? data.filter((e) =>(e.artist && e.artist.toLowerCase() === artistQuery.toLowerCase()))
        //   : data;
        const filteredEvents = artistQuery
  ? data.filter((e) =>(e.artist && e.artist.toLowerCase() === artistQuery.toLowerCase()))
  : data;


        setEvents(filteredEvents);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [artistQuery]);

  if (loading) {
    return (
      <main className="min-h-screen p-24">
        <h1 className="text-4xl font-bold mb-8">Events</h1>
        <p>Loading events...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen p-24">
        <h1 className="text-4xl font-bold mb-8">Events</h1>
        <p className="text-red-500">Error: {error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-24">
     <h1 className="text-4xl font-bold mb-8">
  {artistQuery ? `Events by ${artistQuery}` : tagQuery ? `Events with tag "${tagQuery}"` : 'Events'}
</h1>

      
      {events.length === 0 ? (
        <p>No events found for this artist.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard key={event?.id} eventData={event} />
          ))}
        </div>
      )}
    </main>
  );
}
