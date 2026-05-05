"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Calendar, Clock, MapPin, Users, User, Star, MessageCircle } from "lucide-react";
import QuestionList from "@/components/QuestionList";

interface Session {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  capacity: number | null;
  room: { name: string };
  speakers: Array<{ speaker: { id: string; name: string; photoUrl: string | null } }>;
  questions: Array<{ id: string; content: string; votes: number; author: string | null; createdAt: string }>;
}

export default function EventDetail() {
  const params = useParams();
  const id = params?.eventId as string;

  const [event, setEvent] = useState<any>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(stored);
  }, []);

  useEffect(() => {
    if (!id) return;
    fetchEvent();
    fetchSessions();
  }, [id]);

  const fetchEvent = async () => {
    const res = await fetch(`/api/events/${id}`);
    if (!res.ok) return;
    const data = await res.json();
    setEvent(data);
  };

  const fetchSessions = async () => {
    const res = await fetch(`/api/events/${id}/sessions`);
    if (!res.ok) return;
    const data = await res.json();
    setSessions(data);
    setLoading(false);
  };

  const toggleFavorite = (sessionId: string) => {
    let newFavorites;
    if (favorites.includes(sessionId)) {
      newFavorites = favorites.filter(f => f !== sessionId);
    } else {
      newFavorites = [...favorites, sessionId];
    }
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  const isLive = (session: Session) => {
    const now = new Date();
    const start = new Date(session.startTime);
    const end = new Date(session.endTime);
    return now >= start && now <= end;
  };

  if (loading || !id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2ecc71]"></div>
      </div>
    );
  }

  if (!event) return <div className="text-center text-gray-400">Événement non trouvé</div>;

  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* HEADER */}
      <div className="bg-gradient-to-r from-black via-black/80 to-black border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h1 className="text-5xl font-black mb-6 tracking-tight">
            {event.title}
          </h1>

          <div className="flex flex-wrap gap-6 text-gray-400 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#2ecc71]" />
              <span>
                {new Date(event.startDate).toLocaleDateString('fr-FR')} -{" "}
                {new Date(event.endDate).toLocaleDateString('fr-FR')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#2ecc71]" />
              <span>{event.location}</span>
            </div>
          </div>

          <p className="mt-6 text-gray-400 max-w-3xl">
            {event.description}
          </p>
        </div>
      </div>

      {/* SESSIONS */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-black mb-10 tracking-tight">
          Programme des sessions
        </h2>

        <div className="space-y-6">
          {sessions.map((session) => {
            const live = isLive(session);
            const isFav = favorites.includes(session.id);

            return (
              <div
                key={session.id}
                className={`bg-[#111] border border-white/10 rounded-3xl p-6 transition ${
                  live ? "ring-2 ring-[#2ecc71]" : ""
                }`}
              >
                <div className="flex justify-between">
                  <div className="flex-1">

                    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-400">
                      {live && (
                        <span className="bg-[#2ecc71] text-black px-3 py-1 rounded-full text-xs font-black">
                          LIVE
                        </span>
                      )}

                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-[#2ecc71]" />
                        {new Date(session.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} -
                        {new Date(session.endTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>

                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-[#2ecc71]" />
                        {session.room.name}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold mb-2">
                      {session.title}
                    </h3>

                    <p className="text-gray-400 mb-6">
                      {session.description}
                    </p>

                    <div className="flex flex-wrap gap-6 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#2ecc71]" />
                        Capacité: {session.capacity || "Illimitée"}
                      </div>

                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[#2ecc71]" />
                        {session.speakers.map(s => s.speaker.name).join(", ")}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFavorite(session.id)}
                    className={`ml-4 p-2 rounded-xl transition ${
                      isFav
                        ? "text-[#2ecc71] bg-[#2ecc71]/10"
                        : "text-gray-500 hover:bg-white/5"
                    }`}
                  >
                    <Star className={`w-6 h-6 ${isFav ? "fill-current" : ""}`} />
                  </button>
                </div>

                {live && (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="flex items-center gap-2 mb-4">
                      <MessageCircle className="w-5 h-5 text-[#2ecc71]" />
                      <h4 className="font-bold">
                        Questions & Réponses
                      </h4>
                    </div>

                    <QuestionList
                      questions={session.questions}
                      sessionId={session.id}
                      isLive={live}
                      onQuestionAdded={() => {
                        fetchSessions();
                        setRefresh(r => r + 1);
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}