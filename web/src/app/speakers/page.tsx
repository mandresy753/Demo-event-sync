"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Speaker = {
  id: string;
  name: string;
  bio: string | null;
  photoUrl: string | null;
};

export default function SpeakersPage() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/speakers", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setSpeakers(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2ecc71]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <span className="text-[#2ecc71] text-[10px] uppercase tracking-[0.3em] font-black mb-2 block">Intervenants</span>
          <h1 className="text-5xl font-black text-black">Nos speakers</h1>
          <p className="mt-4 text-gray-500 max-w-3xl">Accédez à la page publique des intervenants et découvrez leurs sessions associées.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {speakers.map((speaker) => (
            <Link key={speaker.id} href={`/speakers/${speaker.id}`} className="group block rounded-3xl border border-gray-200 p-8 shadow-sm transition hover:border-[#2ecc71] hover:bg-[#f8fffb]">
              <div className="flex items-center gap-5">
                <div className="h-20 w-20 rounded-3xl overflow-hidden bg-gray-100 flex items-center justify-center text-2xl text-gray-500">
                  {speaker.photoUrl ? <img src={speaker.photoUrl} alt={speaker.name} className="h-full w-full object-cover" /> : speaker.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{speaker.name}</h2>
                  <p className="text-gray-500 mt-2 line-clamp-2">{speaker.bio || "Aucune biographie disponible."}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
