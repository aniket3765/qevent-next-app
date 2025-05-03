'use client';

import ArtistCard from '@/components/ArtistCard';
import { useEffect, useState } from 'react';

export default function ArtistPage() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await fetch('https://qevent-backend.labs.crio.do/artists');
        if (!res.ok) throw new Error('HTTP error! status:' + res.status);
        const data = await res.json();
        setArtists(data);
      } catch (error) {
        setError(error?.message || 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  return (
    <main className="min-h-screen p-6 md:p-12">
      <h1 className="text-4xl font-bold mb-8">Artist Page</h1>

      {loading && <p className="text-lg">Loading artists...</p>}

      {error && <p className="text-red-500 text-lg">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-6">
          {artists.map((artist) => (
            
            <ArtistCard artistData={artist}/>
          ))}
        </div>
      )}
    </main>
  );
}
