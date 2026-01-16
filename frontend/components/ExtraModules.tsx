"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import { Type, Clock, Send, RefreshCw } from "lucide-react";

export function TextScroller({ isConnected }: { isConnected: boolean }) {
    const { t } = useI18n();
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
            alert(t("textSendFailed"));
        } finally {
            setSending(false);
        }
    };

    return (
        <div className={`bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl ${!isConnected ? "opacity-50 pointer-events-none" : ""}`}>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Type className="w-6 h-6 text-yellow-400" />
                {t("scrollingText")}
            </h2>

            <div className="space-y-4">
                <div>
                    <label className="text-xs text-slate-400 font-bold uppercase mb-1 block">{t("enterText")}</label>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={t("textPlaceholder")}
                        maxLength={50}
                        className="w-full bg-slate-800 border-slate-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-yellow-500 font-mono text-lg"
                    />
                </div>

                <div>
                    <label className="text-xs text-slate-400 font-bold uppercase mb-1 block">{t("selectColor")}</label>
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
                    {sending ? t("sending") : t("sendText")}
                </button>
            </div>
        </div>
    );
}

export function ClockManager({ isConnected }: { isConnected: boolean }) {
    const { t } = useI18n();
    const [syncing, setSyncing] = useState(false);

    const handleSync = async () => {
        setSyncing(true);
        try {
            await api.syncTime();
        } catch (e) {
            console.error(e);
            alert(t("syncFailed"));
        } finally {
            setSyncing(false);
        }
    };

    const handleClockMode = async () => {
        try {
            await api.setClockMode();
        } catch (e) {
            console.error(e);
            alert(t("modeFailed"));
        }
    };

    return (
        <div className={`bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl ${!isConnected ? "opacity-50 pointer-events-none" : ""}`}>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-pink-400" />
                {t("clockAndTime")}
            </h2>

            <div className="space-y-4">
                <div className="flex items-center justify-between bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <div>
                        <h3 className="text-white font-medium">{t("fixBrokenClock")}</h3>
                        <p className="text-slate-400 text-xs mt-1">{t("syncWithComputer")}</p>
                    </div>
                    <button
                        onClick={handleSync}
                        disabled={syncing}
                        className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-lg transition-colors border border-slate-600"
                        title={t("syncNow")}
                    >
                        <RefreshCw className={`w-5 h-5 ${syncing ? "animate-spin" : ""}`} />
                    </button>
                </div>

                <div className="flex items-center justify-between bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <div>
                        <h3 className="text-white font-medium">{t("returnToClockMode")}</h3>
                        <p className="text-slate-400 text-xs mt-1">{t("returnToClockModeDesc")}</p>
                    </div>
                    <button
                        onClick={handleClockMode}
                        className="bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm"
                    >
                        {t("activate")}
                    </button>
                </div>
            </div>
        </div>
    );
}

