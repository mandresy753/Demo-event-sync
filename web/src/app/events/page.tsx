"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, ArrowRight, Search } from "lucide-react";

type Event = {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  imageUrl?: string;
  _count?: { sessions: number };
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tous");

  useEffect(() => {
    fetch("/api/events", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      });
  }, []);

  const now = new Date();

  const filteredEvents = events.filter((event) => {
    const match = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    if (!match) return false;
    if (activeCategory === "À venir") return new Date(event.startDate) > now;
    if (activeCategory === "Passés") return new Date(event.endDate) < now;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2ecc71]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-24">
      <div className="max-w-7xl mx-auto px-6">

        <div className="mb-14">
          <span className="text-[#2ecc71] font-black text-[10px] uppercase tracking-[0.3em] mb-2 block">
            EVENTSYNC
          </span>

          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white">
            Tous les événements
          </h1>

          <p className="mt-4 text-gray-400 max-w-3xl">
            Découvrez les événements et leurs programmes en temps réel.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">

          <div className="relative w-full md:w-2/3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un événement..."
              className="w-full bg-white/5 border border-white/10 rounded-3xl py-4 pl-12 pr-6 text-white placeholder-white/30 focus:outline-none focus:border-[#2ecc71]"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {["Tous", "À venir", "Passés"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveCategory(tab)}
                className={`px-5 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition ${
                  activeCategory === tab
                    ? "bg-[#2ecc71] text-black"
                    : "bg-white/5 text-gray-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white/5 border border-white/10 rounded-[28px] overflow-hidden hover:scale-[1.02] transition"
            >

              <div className="relative h-64">
                <img
                  src={
                    event.imageUrl ||
                    "https://images.unsplash.com/photo-1515169067865-5387ec356754?q=80&w=1200"
                  }
                  className="w-full h-full object-cover"
                  alt={event.title}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

                <div className="absolute bottom-6 left-6">
                  <h2 className="text-2xl font-black text-white">
                    {event.title}
                  </h2>
                </div>
              </div>

              <div className="p-8">

                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gray-400 mb-4">
                  <MapPin className="w-4 h-4 text-[#2ecc71]" />
                  {event.location}
                </div>

                <p className="text-gray-300 mb-6 line-clamp-3">
                  {event.description}
                </p>

                <div className="flex items-center justify-between">

                  <span className="text-[10px] font-black uppercase text-gray-400">
                    {event._count?.sessions ?? 0} sessions
                  </span>

                  <Link
                    href={`/events/${event.id}`}
                    className="text-[#2ecc71] font-black uppercase text-[10px] flex items-center gap-2"
                  >
                    Programme <ArrowRight className="w-4 h-4" />
                  </Link>

                </div>

              </div>
            </div>
          ))}

          {filteredEvents.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-12">
              Aucun événement trouvé
            </div>
          )}

        </div>

      </div>
    </div>
  );
}