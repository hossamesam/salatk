"use client";
import React, { useEffect, useState } from "react";

interface Surah {
    number: number;
    name: string;
    englishName: string;
    ayahs: number;
}

interface Ayah {
    number: number;
    text: string;
    audio: string;
}

export default function Quranpage() {
    const [surahs, setSurahs] = useState<Surah[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
    const [ayahs, setAyahs] = useState<Ayah[]>([]);
    const [ayahsLoading, setAyahsLoading] = useState(false);
    const [activeAyah, setActiveAyah] = useState<number | null>(null);

    useEffect(() => {
        fetch("https://api.alquran.cloud/v1/surah")
            .then((res) => res.json())
            .then((data) => {
                setSurahs(
                    data.data.map((s: { number: number; name: string; englishName: string; numberOfAyahs: number }) => ({
                        number: s.number,
                        name: s.name,
                        englishName: s.englishName,
                        ayahs: s.numberOfAyahs,
                    }))
                );
                setLoading(false);
            });
    }, []);

    const handleSurahClick = (surah: Surah) => {
        setSelectedSurah(surah);
        setAyahs([]);
        setAyahsLoading(true);
        fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/ar.alafasy`)
            .then((res) => res.json())
            .then((data) => {
                // جلب روابط الصوت لكل آية
                setAyahs(
                    data.data.ayahs.map((a: any) => ({
                        number: a.numberInSurah,
                        text: a.text,
                        audio: a.audio, // بعض APIs توفر رابط الصوت مباشرة
                    }))
                );
                setAyahsLoading(false);
            });
    };

    const playAudio = (ayah: Ayah) => {
        setActiveAyah(ayah.number);
        const audio = new Audio(ayah.audio || `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`);
        audio.play();
        audio.onended = () => setActiveAyah(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 py-8" dir="rtl">
            <div className="max-w-3xl mx-auto bg-white/80 rounded-xl shadow-lg p-6">
                {!selectedSurah ? (
                    <>
                        <h1 className="text-3xl font-extrabold text-center mb-8 text-emerald-800 tracking-widest drop-shadow">
                            القرآن الكريم
                        </h1>
                        {loading ? (
                            <div className="text-center text-gray-500">جاري التحميل...</div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {surahs.map((surah) => (
                                    <button
                                        key={surah.number}
                                        className="bg-emerald-100 hover:bg-emerald-200 transition rounded-lg shadow p-4 flex flex-col items-center border border-emerald-200"
                                        onClick={() => handleSurahClick(surah)}
                                    >
                                        <span className="text-emerald-800 font-bold text-xl mb-1">
                                            {surah.name}
                                        </span>
                                        <span className="text-gray-500 text-xs mb-1">
                                            {surah.englishName}
                                        </span>
                                        <span className="text-gray-600 text-xs">
                                            عدد الآيات: {surah.ayahs}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div>
                        <button
                            className="mb-6 px-4 py-2 rounded bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition"
                            onClick={() => {
                                setSelectedSurah(null);
                                setAyahs([]);
                            }}
                        >
                            ← الرجوع إلى قائمة السور
                        </button>
                        <div className="text-center mb-8">
                            <div className="text-4xl font-extrabold text-emerald-800 tracking-widest drop-shadow mb-2">
                                {selectedSurah.name}
                            </div>
                            <div className="text-lg text-gray-500 mb-2">
                                {selectedSurah.englishName}
                            </div>
                            <div className="text-md text-gray-700">
                                عدد الآيات: {selectedSurah.ayahs}
                            </div>
                        </div>
                        <div className="bg-emerald-50 rounded-lg p-6 shadow-inner border border-emerald-100">
                            {ayahsLoading ? (
                                <div className="text-center text-gray-500">
                                    جاري تحميل الآيات...
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-4 justify-center text-2xl leading-loose font-[Amiri]">
                                    {ayahs.map((ayah) => (
                                        <span
                                            key={ayah.number}
                                            className={`relative mb-2 px-2 py-1 rounded-lg transition cursor-pointer ${activeAyah === ayah.number
                                                ? "bg-emerald-200 ring-2 ring-emerald-600"
                                                : "hover:bg-emerald-100"
                                                }`}
                                            onClick={() => playAudio(ayah)}
                                            title="اضغط للاستماع للآية"
                                        >
                                            {ayah.text}
                                            <span className="inline-block align-middle mx-2 text-emerald-700 font-bold text-lg">
                                                <span className="rounded-full border-2 border-emerald-400 px-2 py-0.5 bg-white shadow text-emerald-700">
                                                    {ayah.number}
                                                </span>
                                            </span>
                                            {activeAyah === ayah.number && (
                                                <span className="absolute left-2 top-1 text-emerald-700 animate-pulse">🔊</span>
                                            )}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
