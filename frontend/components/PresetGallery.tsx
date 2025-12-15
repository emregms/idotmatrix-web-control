"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Grid, Cloud, Link as LinkIcon, Search, Loader2 } from "lucide-react";
import { clsx } from "clsx";

// Using Giphy Public Beta Key (legacy, subject to rate limits but usually works for demos)
const GIPHY_API_KEY = "dc6zaTOxFJmzC";
const GIPHY_SEARCH_URL = "https://api.giphy.com/v1/gifs/search";
const GIPHY_TRENDING_URL = "https://api.giphy.com/v1/gifs/trending";

interface GiphyImage {
    id: string;
    title: string;
    images: {
        fixed_height_small: { url: string }; // Use small variant for preview
        original: { url: string }; // Use original for upload
    };
}

export default function PresetGallery({ isConnected }: { isConnected: boolean }) {
    const [activeTab, setActiveTab] = useState<"search" | "url">("search");
    const [searchQuery, setSearchQuery] = useState("");
    const [gifs, setGifs] = useState<GiphyImage[]>([]);
    const [loadingGifs, setLoadingGifs] = useState(false);
    const [customUrl, setCustomUrl] = useState("");
    const [uploading, setUploading] = useState<string | null>(null); // ID or 'url'
    const [status, setStatus] = useState<string | null>(null);

    // Initial load - Trending pixel art
    useEffect(() => {
        searchGiphy("pixel art");
    }, []);

    const searchGiphy = async (query: string) => {
        setLoadingGifs(true);
        try {
            const url = query
                ? `${GIPHY_SEARCH_URL}?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=12&rating=g`
                : `${GIPHY_TRENDING_URL}?api_key=${GIPHY_API_KEY}&limit=12&rating=g`;

            const res = await fetch(url);
            const data = await res.json();
            setGifs(data.data || []);
        } catch (e) {
            console.error("Giphy fetch error:", e);
        } finally {
            setLoadingGifs(false);
        }
    };

    const handleFetchAndSend = async (url: string, id: string = "url") => {
        if (!url) return;
        setUploading(id);
        setStatus("İndiriliyor ve Gönderiliyor...");
        try {
            const res = await api.fetchUrl(url);
            if (res.status === "uploaded_from_url") {
                setStatus("Başarıyla gönderildi! 🎉");
            } else {
                setStatus("Hata oluştu.");
            }
        } catch (err) {
            console.error(err);
            setStatus("Hata: Görsel işlenemedi.");
        } finally {
            setUploading(null);
        }
    };

    return (
        <div className={`mt-8 space-y-6 ${!isConnected ? "opacity-50 pointer-events-none" : ""}`}>
            <div className="flex items-center gap-2 mb-4">
                <Cloud className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-semibold">Giphy Galeri</h2>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-slate-800 rounded-lg w-fit mb-4">
                <button
                    onClick={() => setActiveTab("search")}
                    className={clsx(
                        "px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
                        activeTab === "search" ? "bg-slate-700 text-white shadow-sm" : "text-slate-400 hover:text-white"
                    )}
                >
                    <Search className="w-4 h-4" />
                    GIF Ara
                </button>
                <button
                    onClick={() => setActiveTab("url")}
                    className={clsx(
                        "px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
                        activeTab === "url" ? "bg-slate-700 text-white shadow-sm" : "text-slate-400 hover:text-white"
                    )}
                >
                    <LinkIcon className="w-4 h-4" />
                    Link İle Yükle
                </button>
            </div>

            <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6 min-h-[300px]">
                {/* Status Message */}
                {status && (
                    <div className={clsx(
                        "mb-4 p-3 rounded-lg text-center text-sm font-medium animate-pulse",
                        status.includes("Hata") ? "bg-red-900/30 text-red-300 border border-red-800" : "bg-green-900/30 text-green-300 border border-green-800"
                    )}>
                        {status}
                    </div>
                )}

                {activeTab === "search" && (
                    <div className="space-y-4">
                        <form
                            onSubmit={(e) => { e.preventDefault(); searchGiphy(searchQuery); }}
                            className="flex gap-2"
                        >
                            <input
                                type="text"
                                placeholder="Örn: mario, pacman, fire..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                            />
                            <button type="submit" className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors">
                                Ara
                            </button>
                        </form>

                        {loadingGifs ? (
                            <div className="flex justify-center py-10">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {gifs.map((gif) => (
                                    <div
                                        key={gif.id}
                                        className="group relative bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-blue-500 cursor-pointer aspect-square"
                                        onClick={() => handleFetchAndSend(gif.images.original.url, gif.id)}
                                    >
                                        <img
                                            src={gif.images.fixed_height_small.url}
                                            alt={gif.title}
                                            className="w-full h-full object-cover"
                                        />
                                        {uploading === gif.id && (
                                            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                                                <Loader2 className="w-6 h-6 text-white animate-spin" />
                                            </div>
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1 text-[10px] text-white truncate opacity-0 group-hover:opacity-100 transition-opacity">
                                            {gif.title || "GIF"}
                                        </div>
                                    </div>
                                ))}
                                {gifs.length === 0 && (
                                    <p className="col-span-full text-center text-slate-500 py-4">Sonuç bulunamadı.</p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "url" && (
                    <div className="flex flex-col gap-4 max-w-md mx-auto py-8">
                        <div className="text-center space-y-2 mb-4">
                            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                                <LinkIcon className="w-6 h-6 text-blue-400" />
                            </div>
                            <h3 className="text-lg font-medium">Bağlantıdan Yükle</h3>
                            <p className="text-sm text-slate-400">
                                İnternetteki herhangi bir görselin veya GIF'in bağlantısını yapıştırın.
                            </p>
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                placeholder="https://..."
                                value={customUrl}
                                onChange={(e) => {
                                    setCustomUrl(e.target.value);
                                    setStatus(null);
                                }}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:border-blue-500 transition-colors"
                            />
                            <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                        </div>

                        <button
                            onClick={() => handleFetchAndSend(customUrl, "url")}
                            disabled={!customUrl || uploading === "url"}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-500 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all"
                        >
                            {uploading === "url" ? <Loader2 className="w-5 h-5 animate-spin" /> : <LinkIcon className="w-5 h-5" />}
                            {uploading === "url" ? "İşleniyor..." : "Yükle ve Göster"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
