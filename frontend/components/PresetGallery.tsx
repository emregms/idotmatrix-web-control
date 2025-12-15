"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Grid, Cloud, Link as LinkIcon, Image as ImageIcon, Search, Loader2 } from "lucide-react";
import { clsx } from "clsx";

const PRESETS = [
    { name: "Mario Run", url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3V4c2Z5ZmF4dW14Z3V4Z3V4Z3V4Z3V4Z3V4Z3V4Zy9sM3YzYzR3/giphy.gif" },
    { name: "Pacman", url: "https://media.giphy.com/media/d9QiBcfem5Mh8o/giphy.gif" },
    { name: "Nyan Cat", url: "https://media.giphy.com/media/sIIhZliB2McAo/giphy.gif" },
    { name: "Invader", url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDZ4eHR5eHR5eHR5eHR5eHR5eHR5eHR5eHR5eHR5Zy9QZ2phUFM/giphy.gif" }, // Placeholder replacement
    { name: "Ghost", url: "https://media.giphy.com/media/10xc8M0pZk1p96/giphy.gif" },
    { name: "Fire", url: "https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif" },
    { name: "Heart", url: "https://media.giphy.com/media/l41lFj8afMrk7gGXu/giphy.gif" },
    { name: "Slime", url: "https://media.giphy.com/media/3o7TKMt1VVNkHVyPaE/giphy.gif" },
];

export default function PresetGallery({ isConnected }: { isConnected: boolean }) {
    const [activeTab, setActiveTab] = useState<"presets" | "url">("presets");
    const [customUrl, setCustomUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string | null>(null);

    const handleFetchAndSend = async (url: string) => {
        if (!url) return;
        setLoading(true);
        setStatus("İndiriliyor ve Gönderiliyor...");
        try {
            const res = await api.fetchUrl(url);
            if (res.status === "uploaded_from_url") {
                setStatus("Başarıyla gönderildi!");
            } else {
                setStatus("Hata oluştu.");
            }
        } catch (err) {
            console.error(err);
            setStatus("Hata: Görsel işlenemedi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`mt-8 space-y-6 ${!isConnected ? "opacity-50 pointer-events-none" : ""}`}>
            <div className="flex items-center gap-2 mb-4">
                <Grid className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-semibold">İçerik Galerisi</h2>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-slate-800 rounded-lg w-fit">
                <button
                    onClick={() => setActiveTab("presets")}
                    className={clsx(
                        "px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
                        activeTab === "presets" ? "bg-slate-700 text-white shadow-sm" : "text-slate-400 hover:text-white"
                    )}
                >
                    <Cloud className="w-4 h-4" />
                    Hazır Galeri
                </button>
                <button
                    onClick={() => setActiveTab("url")}
                    className={clsx(
                        "px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
                        activeTab === "url" ? "bg-slate-700 text-white shadow-sm" : "text-slate-400 hover:text-white"
                    )}
                >
                    <LinkIcon className="w-4 h-4" />
                    Web Linki (URL)
                </button>
            </div>

            {/* Content */}
            <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6 min-h-[300px]">
                {activeTab === "presets" && (
                    <div className="grid grid-cols-4 gap-4">
                        {PRESETS.map((preset) => (
                            <div
                                key={preset.name}
                                className="group relative bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-purple-500 cursor-pointer transition-all hover:scale-105 active:scale-95"
                                onClick={() => handleFetchAndSend(preset.url)}
                            >
                                <div className="aspect-square relative">
                                    <img
                                        src={preset.url}
                                        alt={preset.name}
                                        className="w-full h-full object-cover image-pixelated"
                                        style={{ imageRendering: "pixelated" }}
                                    />
                                    {loading && status && !customUrl && ( // Simple check to show loading on active item could be better but ok for now
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-2 text-center text-xs font-medium text-slate-400 group-hover:text-white bg-slate-900/90 absolute bottom-0 w-full translate-y-full group-hover:translate-y-0 transition-transform">
                                    {preset.name}
                                </div>
                            </div>
                        ))}
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
                                placeholder="https://media.giphy.com/..."
                                value={customUrl}
                                onChange={(e) => {
                                    setCustomUrl(e.target.value);
                                    setStatus(null);
                                }}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:border-purple-500 transition-colors"
                            />
                            <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                        </div>

                        <button
                            onClick={() => handleFetchAndSend(customUrl)}
                            disabled={!customUrl || loading}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-500 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                            {loading ? "İşleniyor..." : "Yükle ve Göster"}
                        </button>
                    </div>
                )}

                {status && (
                    <div className={clsx(
                        "mt-4 p-3 rounded-lg text-center text-sm font-medium",
                        status.includes("Hata") ? "bg-red-900/30 text-red-300 border border-red-800" : "bg-green-900/30 text-green-300 border border-green-800"
                    )}>
                        {status}
                    </div>
                )}
            </div>
        </div>
    );
}
