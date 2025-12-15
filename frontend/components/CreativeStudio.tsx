"use client";

import { useState } from "react";
import PixelEditor from "./PixelEditor";
import EmojiToPixel from "./EmojiPicker";
import { PenTool, Smile } from "lucide-react";
import { clsx } from "clsx";

export default function CreativeStudio({ isConnected }: { isConnected: boolean }) {
    const [mode, setMode] = useState<"draw" | "emoji">("draw");

    return (
        <div className={`mt-10 ${!isConnected ? "opacity-50 pointer-events-none filter grayscale" : ""}`}>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                    Yaratıcı Stüdyo
                </h2>

                {/* Toggle */}
                <div className="bg-slate-800 p-1 rounded-lg flex gap-1">
                    <button
                        onClick={() => setMode("draw")}
                        className={clsx(
                            "px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all",
                            mode === "draw" ? "bg-slate-700 text-pink-400 shadow-sm" : "text-slate-400 hover:text-white"
                        )}
                    >
                        <PenTool className="w-4 h-4" />
                        Çizim
                    </button>
                    <button
                        onClick={() => setMode("emoji")}
                        className={clsx(
                            "px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all",
                            mode === "emoji" ? "bg-slate-700 text-purple-400 shadow-sm" : "text-slate-400 hover:text-white"
                        )}
                    >
                        <Smile className="w-4 h-4" />
                        Emoji
                    </button>
                </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 min-h-[500px]">
                {mode === "draw" ? (
                    <PixelEditor isConnected={isConnected} />
                ) : (
                    <EmojiToPixel isConnected={isConnected} />
                )}
            </div>
        </div>
    );
}
