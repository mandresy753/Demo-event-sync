"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Speaker = {
  id: string;
  name: string;
  bio: string | null;
  photoUrl: string | null;
  socialLinks?: Record<string, string> | null;
  sessions: Array<{
    session: {
      id: string;
      title: string;
      event: { title: string };
      room: { name: string };
    };
  }>;
};

export default function SpeakerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [speaker, setSpeaker] = useState<Speaker | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.speakerId) return;

    fetch(`/api/speakers/${params.speakerId}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setSpeaker(data);
        setLoading(false);
      });
  }, [params.speakerId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2ecc71]"></div>
      </div>
    );
  }

  if (!speaker) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Intervenant non trouvé.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-24">
      <div className="max-w-6xl mx-auto px-6">

        <button
          onClick={() => router.back()}
          className="mb-10 inline-flex items-center gap-2 text-[#2ecc71] font-black uppercase text-[10px] tracking-[0.3em] hover:opacity-80 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>

        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-[32px] p-10">

          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10">

            <div className="h-44 w-44 rounded-3xl overflow-hidden bg-white/10 flex items-center justify-center text-5xl font-black text-[#2ecc71] border border-white/10">
              {speaker.photoUrl ? (
                <img
                  src={speaker.photoUrl}
                  alt={speaker.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                speaker.name.charAt(0)
              )}
            </div>

            <div>
              <h1 className="text-5xl font-black tracking-tighter text-white">
                {speaker.name}
              </h1>

              <p className="mt-5 text-gray-400 max-w-3xl leading-relaxed">
                {speaker.bio || "Aucune biographie fournie."}
              </p>
            </div>

          </div>

          <div className="mt-14">

            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#2ecc71] mb-6">
              Sessions associées
            </h2>

            <div className="grid gap-6">

              {speaker.sessions.map(({ session }) => (
                <Link
                  key={session.id}
                  href={`/sessions/${session.id}`}
                  className="group bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-[#2ecc71] transition"
                >
                  <h3 className="text-xl font-black text-white group-hover:text-[#2ecc71] transition">
                    {session.title}
                  </h3>

                  <p className="text-gray-400 mt-2 text-sm">
                    {session.event.title} • {session.room.name}
                  </p>
                </Link>
              ))}

              {speaker.sessions.length === 0 && (
                <div className="text-gray-500 text-center py-10 border border-white/10 rounded-3xl">
                  Aucune session associée
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}