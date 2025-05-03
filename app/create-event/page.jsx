'use client';

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateEventPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    location: "",
    date: "",
    time: "",
    tags: "",
    artist: "",
    price: "",
    description: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/events");
    }
  }, [status, router]);

  if (status === "loading") return <p className="p-6">Loading...</p>;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEventCreate = async (e) => {
    e.preventDefault();

    const newEvent = {
      id: Math.random().toString(36).slice(2, 34),
      name: form.name,
      location: form.location,
      date: form.date,
      time: form.time,
      tags: form.tags.split(",").map(tag => tag.trim()),
      image: `https://picsum.photos/300/200?random=${Math.floor(Math.random() * 99) + 1}`,
      artist: form.artist,
      price: Number(form.price),
      description: form.description,
    };

    try {
      const res = await fetch("https://qevent-backend.labs.crio.do/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      });

      if (res.status === 201) {
        router.push("/events");
      } else {
        alert("Event creation failed");
      }
    } catch (err) {
      console.error(err);
      alert("Event creation failed");
    }
  };

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Create Event</h1>
      <p className="mb-6">Welcome, {session?.user?.name}. Fill the form below to create an event.</p>

      <form onSubmit={handleEventCreate} className="space-y-5 bg-white p-6 rounded-lg shadow-md">
        {["name", "location", "date", "time", "tags", "artist", "price"].map((field) => (
          <div key={field}>
            <label className="block mb-1 font-medium capitalize">{field}</label>
            <input
              type={field === "price" ? "number" : "text"}
              name={field}
              value={form[field]}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
            />
          </div>
        ))}

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-400 to-teal-600 text-white py-2 rounded-md hover:opacity-90 font-semibold"
        >
          Submit Event
        </button>
      </form>
    </main>
  );
}
