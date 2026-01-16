"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import { Search, Image as ImageIcon, Loader2, Link as LinkIcon, DownloadCloud } from "lucide-react";
import { clsx } from "clsx";

export default function PresetGallery({ isConnected }: { isConnected: boolean }) {
    const { t } = useI18n();
    const [activeTab, setActiveTab] = useState<"search" | "url">("search");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [urlInput, setUrlInput] = useState("");
    const [sendingUrl, setSendingUrl] = useState(false);

    const handleSendUrl = async (url: string) => {
        if (!isConnected) return;
        setSendingUrl(true);
        try {
            await api.fetchUrl(url);
        } catch (e) {
            console.error(e);
            alert(t("sendFailed"));
        } finally {
            setSendingUrl(false);
        }
    };

    const performSearch = async () => {
        if (!searchQuery.trim()) return;
        setLoading(true);
        setSearchResults([]);

        try {
            const res = await fetch(`http://localhost:8000/search?q=${encodeURIComponent(searchQuery)}`);
            const data = await res.json();
            setSearchResults(data);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`space-y-6 ${!isConnected ? "opacity-50 pointer-events-none" : ""}`}>
            <div className="flex items-center gap-2 p-1 bg-slate-800 rounded-xl mb-6">
                <button
                    onClick={() => setActiveTab("search")}
                    className={clsx(
                        "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                        activeTab === "search" ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
                    )}
                >
                    {t("searchOnline")}
                </button>
                <button
                    onClick={() => setActiveTab("url")}
                    className={clsx(
                        "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                        activeTab === "url" ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
                    )}
                >
                    {t("uploadLink")}
                </button>
            </div>

            {activeTab === "search" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder={t("searchPlaceholder")}
                                className="w-full bg-slate-800 border-slate-700 text-white pl-10 h-12 rounded-xl focus:ring-2 focus:ring-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && performSearch()}
                            />
                        </div>
                        <button
                            onClick={performSearch}
                            className="bg-blue-600 hover:bg-blue-500 px-6 rounded-xl font-bold text-white transition-colors"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : t("search")}
                        </button>
                    </div>

                    {searchResults.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {searchResults.map((img, idx) => (
                                <div
                                    key={idx}
                                    className="group relative bg-slate-800 rounded-xl overflow-hidden aspect-square border border-slate-700 hover:border-purple-500 transition-colors cursor-pointer"
                                    onClick={() => handleSendUrl(img.url)}
                                >
                                    <img
                                        src={img.thumbnail || img.url}
                                        alt={img.title}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-2 text-center">
                                        <DownloadCloud className="w-6 h-6 mb-1" />
                                        <span className="text-xs">{t("sendToDevice")}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        !loading && (
                            <div className="text-center text-slate-500 py-12">
                                <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>{t("noResults")}</p>
                                <p className="text-xs mt-2">{t("betterResults")}</p>
                            </div>
                        )
                    )}
                </div>
            )}

            {activeTab === "url" && (
                <div className="max-w-xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="https://..."
                                className="w-full bg-slate-800 border-slate-700 text-white pl-10 h-12 rounded-xl focus:ring-2 focus:ring-green-500"
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                            />
                        </div>
                    </div>
                    <button
                        onClick={() => handleSendUrl(urlInput)}
                        disabled={!urlInput || sendingUrl}
                        className="w-full mt-4 bg-green-600 hover:bg-green-500 disabled:bg-slate-700 h-12 rounded-xl font-bold text-white transition-colors"
                    >
                        {sendingUrl ? t("downloadingAndSending") : t("sendLinkToScreen")}
                    </button>
                    <p className="text-slate-500 text-xs text-center mt-4">
                        {t("staticImagesSupported")}
                    </p>
                </div>
            )}
        </div>
    );
}

