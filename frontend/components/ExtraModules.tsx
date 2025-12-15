"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Type, Clock, Send, RefreshCw, Palette } from "lucide-react";

export function TextScroller({ isConnected }: { isConnected: boolean }) {
    const [text, setText] = useState("");
    const [color, setColor] = useState("#FFFFFF");
    const [sending, setSending] = useState(false);

    const handleSend = async () => {
        if (!text.trim()) return;
        setSending(true);
        try {
            await api.sendText({ text, color });
        } catch (e) {
            console.error(e);
            alert("Metin gönderilemedi.");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className={`bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl ${!isConnected ? "opacity-50 pointer-events-none" : ""}`}>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Type className="w-6 h-6 text-yellow-400" />
                Kayan Yazı
            </h2>

            <div className="space-y-4">
                <div>
                    <label className="text-xs text-slate-400 font-bold uppercase mb-1 block">Metin Girin</label>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Merhaba Dünya!"
                        maxLength={50}
                        className="w-full bg-slate-800 border-slate-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-yellow-500 font-mono text-lg"
                    />
                </div>

                <div>
                    <label className="text-xs text-slate-400 font-bold uppercase mb-1 block">Renk Seçin</label>
                    <div className="flex gap-2 items-center bg-slate-800 p-2 rounded-lg border border-slate-700">
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
                        />
                        <span className="text-slate-300 font-mono uppercase">{color}</span>
                    </div>
                </div>

                <button
                    onClick={handleSend}
                    disabled={sending || !text.trim()}
                    className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 rounded-lg font-bold text-white transition-colors flex items-center justify-center gap-2"
                >
                    <Send className="w-5 h-5" />
                    {sending ? "Gönderiliyor..." : "Yazıyı Gönder"}
                </button>
            </div>
        </div>
    );
}

export function ClockManager({ isConnected }: { isConnected: boolean }) {
    const [syncing, setSyncing] = useState(false);

    const handleSync = async () => {
        setSyncing(true);
        try {
            await api.syncTime();
        } catch (e) {
            console.error(e);
            alert("Saat eşitlenemedi.");
        } finally {
            setSyncing(false);
        }
    };

    const handleClockMode = async () => {
        try {
            await api.setClockMode();
        } catch (e) {
            console.error(e);
            alert("Mod değiştirilemedi.");
        }
    };

    return (
        <div className={`bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl ${!isConnected ? "opacity-50 pointer-events-none" : ""}`}>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-pink-400" />
                Saat ve Zaman
            </h2>

            <div className="space-y-4">
                <div className="flex items-center justify-between bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <div>
                        <h3 className="text-white font-medium">Bozulmuş Saati Düzelt</h3>
                        <p className="text-slate-400 text-xs mt-1">Cihazın saati yanlışsa, bilgisayar saatiyle eşitleyin.</p>
                    </div>
                    <button
                        onClick={handleSync}
                        disabled={syncing}
                        className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-lg transition-colors border border-slate-600"
                        title="Şimdi Eşitle"
                    >
                        <RefreshCw className={`w-5 h-5 ${syncing ? "animate-spin" : ""}`} />
                    </button>
                </div>

                <div className="flex items-center justify-between bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <div>
                        <h3 className="text-white font-medium">Saat Moduna Dön</h3>
                        <p className="text-slate-400 text-xs mt-1">Ekranda saatin görünmesi için varsayılan moda döner.</p>
                    </div>
                    <button
                        onClick={handleClockMode}
                        className="bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm"
                    >
                        Aktif Et
                    </button>
                </div>
            </div>
        </div>
    );
}
