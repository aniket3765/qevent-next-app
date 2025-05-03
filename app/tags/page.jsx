'use client';

import { useRouter } from 'next/navigation';

export default function TagsPage() {
  const router = useRouter();

  const tags = ['Technology', 'Innovation', 'Conference']; // Replace with dynamic tags if available

  const handleTagClick = (tag) => {
    router.push(`/events?tag=${encodeURIComponent(tag)}`);
  };

  return (
    <main className="min-h-screen p-24">
      <h1 className="text-4xl font-bold mb-8">Tags Page</h1>
      <div className="flex gap-4 flex-wrap">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {tag}
          </button>
        ))}
      </div>
    </main>
  );
}
