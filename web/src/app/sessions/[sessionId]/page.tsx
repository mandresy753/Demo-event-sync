"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Clock, MapPin, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";
import QuestionList from "@/components/QuestionList";

type Session = {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  capacity: number | null;
  room: { name: string };
  speakers: Array<{ speaker: { id: string; name: string } }>;
  questions: Array<{ id: string; content: string; votes: number; author: string | null; createdAt: string }>;
  event: { title: string };
};

export default function SessionPage() {
  const params = useParams();
  const [session, setSession] = useState<Session | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(stored);
  }, []);

  useEffect(() => {
    if (!params.sessionId) return;
    fetch(`/api/sessions/${params.sessionId}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setSession(data);
        setLoading(false);
      });
  }, [params.sessionId, refresh]);

  const toggleFavorite = (sessionId: string) => {
    const updated = favorites.includes(sessionId)
      ? favorites.filter((id) => id !== sessionId)
      : [...favorites, sessionId];

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const isLive = () => {
    if (!session) return false;
    const now = new Date();
    const start = new Date(session.startTime);
    const end = new Date(session.endTime);
    return now >= start && now <= end;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2ecc71]"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Session introuvable.
      </div>
    );
  }

  const live = isLive();
  const isFav = favorites.includes(session.id);

  return (
    <div className="min-h-screen bg-black py-24">
      <div className="max-w-5xl mx-auto px-6">
        <Link
          href="/events"
          className="mb-10 inline-flex items-center gap-2 text-[#2ecc71] uppercase tracking-[0.3em] text-xs font-black"
        >
          <ArrowLeft className="w-4 h-4" /> Retour
        </Link>

        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-[32px] p-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <span className="text-[#2ecc71] uppercase text-[10px] tracking-[0.3em] font-black">
                SESSION
              </span>
              <h1 className="mt-4 text-4xl font-black text-white tracking-tight">
                {session.title}
              </h1>
            </div>

            <button
              onClick={() => toggleFavorite(session.id)}
              className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition ${
                isFav
                  ? "bg-[#2ecc71] text-black"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {isFav ? "Favori" : "Ajouter"}
            </button>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <div className="bg-white/5 border border-white/10 rounded-[28px] p-6">
              <p className="text-gray-300">{session.description}</p>

              <div className="mt-6 space-y-4 text-xs uppercase tracking-[0.2em] text-gray-400 font-black">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#2ecc71]" />
                  {new Date(session.startTime).toLocaleString("fr-FR")} -{" "}
                  {new Date(session.endTime).toLocaleString("fr-FR")}
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#2ecc71]" />
                  {session.room.name}
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#2ecc71]" />
                  {session.capacity ?? "Illimité"}
                </div>

                {live && (
                  <span className="inline-block bg-[#2ecc71] text-black px-4 py-2 rounded-full text-[10px]">
                    LIVE
                  </span>
                )}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[28px] p-6">
              <h2 className="text-lg font-black text-white mb-4 uppercase tracking-[0.2em]">
                Intervenants
              </h2>

              <div className="space-y-3">
                {session.speakers.map(({ speaker }) => (
                  <Link
                    key={speaker.id}
                    href={`/speakers/${speaker.id}`}
                    className="block bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-[#2ecc71] transition"
                  >
                    <p className="text-white font-bold">{speaker.name}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12">
            <QuestionList
              questions={session.questions}
              sessionId={session.id}
              isLive={live}
              onQuestionAdded={() => setRefresh((prev) => prev + 1)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}