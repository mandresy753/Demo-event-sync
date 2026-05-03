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
  const { id } = useParams();
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
    fetchEvent();
    fetchSessions();
  }, [id]);

  const fetchEvent = async () => {
    const res = await fetch(`/api/events/${id}`);
    const data = await res.json();
    setEvent(data);
  };

  const fetchSessions = async () => {
    const res = await fetch(`/api/events/${id}/sessions`);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!event) return <div>Événement non trouvé</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
          <div className="flex flex-wrap gap-6 text-blue-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{new Date(event.startDate).toLocaleDateString('fr-FR')} - {new Date(event.endDate).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{event.location}</span>
            </div>
          </div>
          <p className="mt-6 text-blue-50 max-w-3xl">{event.description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Programme des sessions</h2>
        
        <div className="space-y-6">
          {sessions.map((session) => {
            const live = isLive(session);
            const isFav = favorites.includes(session.id);
            
            return (
              <div key={session.id} className={`bg-white rounded-2xl shadow-lg overflow-hidden ${live ? 'ring-2 ring-red-500' : ''}`}>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        {live && (
                          <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full animate-pulse">
                            LIVE
                          </span>
                        )}
                        <span className="text-gray-500 text-sm flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(session.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - {new Date(session.endTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-gray-500 text-sm flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {session.room.name}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{session.title}</h3>
                      <p className="text-gray-600 mb-4">{session.description}</p>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">Capacité: {session.capacity || 'Illimitée'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <User className="w-4 h-4" />
                          <span className="text-sm">
                            Intervenants: {session.speakers.map(s => s.speaker.name).join(", ")}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => toggleFavorite(session.id)}
                      className={`p-2 rounded-lg transition ${isFav ? 'text-yellow-500 bg-yellow-50' : 'text-gray-400 hover:bg-gray-100'}`}
                    >
                      <Star className={`w-6 h-6 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  
                  {live && (
                    <div className="mt-6 pt-6 border-t">
                      <div className="flex items-center gap-2 mb-4">
                        <MessageCircle className="w-5 h-5 text-blue-600" />
                        <h4 className="font-semibold text-gray-900">Questions & Réponses</h4>
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}