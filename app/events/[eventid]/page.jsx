'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EventPage() {
  const { eventid } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`https://qevent-backend.labs.crio.do/events/${eventid}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (eventid) fetchEvent();
  }, [eventid]);

  if (loading) {
    return <div className="p-24 text-lg">Loading event details...</div>;
  }

  if (error) {
    return <div className="p-24 text-red-500">Error: {error}</div>;
  }

  if (!event) return null;

  return (
    <main className="min-h-screen p-6 md:p-24 bg-white text-gray-800">
      <div className="max-w-4xl mx-auto border rounded-xl shadow-lg overflow-hidden">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-64 object-cover"
        />
        <div className="p-6 space-y-4">
          <h1 className="text-3xl font-bold">{event.name}</h1>
          <p className="text-gray-600">{event.location} — {event.date} at {event.time}</p>
          <p className="text-lg font-semibold text-teal-600">Artist: {event.artist}</p>
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
          <p className="text-gray-700 leading-relaxed">{event.description}</p>
          <p className="text-xl font-bold text-orange-500">Price: ₹{event.price}</p>
        </div>
      </div>
    </main>
  );
}
