"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, MapPin, Star } from "lucide-react";

type Session = {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  capacity: number | null;
  room: { name: string };
  speakers: Array<{ speaker: { id: string; name: string; photoUrl: string | null } }>;
};

type SessionCard = Session & { event: { title: string } };

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sessions, setSessions] = useState<SessionCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(stored);
  }, []);

  useEffect(() => {
    if (!favorites.length) {
      setSessions([]);
      setLoading(false);
      return;
    }

    fetch("/api/sessions", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setSessions(data.filter((s: SessionCard) => favorites.includes(s.id)));
        setLoading(false);
      });
  }, [favorites]);

  const removeFavorite = (sessionId: string) => {
    const updated = favorites.filter((id) => id !== sessionId);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };

  return (
    <div className="min-h-screen bg-black py-24">
      <div className="max-w-6xl mx-auto px-6">

        <div className="mb-14">
          <span className="inline-block bg-[#2ecc71]/10 text-[#2ecc71] text-[10px] font-black px-4 py-1.5 rounded-full border border-[#2ecc71]/20 uppercase tracking-[0.2em] mb-6">
            EventSync
          </span>

          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter">
            Mes sessions favorites
          </h1>

          <p className="mt-4 text-gray-400 max-w-2xl">
            Retrouvez vos sessions sauvegardées et gérez votre planning en un clic.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-12 h-12 border-2 border-[#2ecc71] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : sessions.length === 0 ? (
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-20 text-center text-gray-400">
            Aucun favori pour le moment
          </div>
        ) : (
          <div className="grid gap-8">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="bg-white/5 backdrop-blur border border-white/10 rounded-[32px] p-8 hover:bg-white/10 transition"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">

                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">
                      {session.title}
                    </h2>
                    <p className="text-gray-400 mt-2">
                      {session.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">

                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#2ecc71]" />
                      {new Date(session.startTime).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>

                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#2ecc71]" />
                      {session.room.name}
                    </span>

                    <span className="flex items-center gap-2 text-[#2ecc71]">
                      <Star className="w-4 h-4 fill-current" />
                      FAVORI
                    </span>

                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">

                  <Link
                    href={`/sessions/${session.id}`}
                    className="text-[#2ecc71] font-black text-[10px] uppercase tracking-[0.3em] hover:tracking-[0.35em] transition"
                  >
                    voir la session
                  </Link>

                  <button
                    onClick={() => removeFavorite(session.id)}
                    className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold transition"
                  >
                    Retirer
                  </button>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}