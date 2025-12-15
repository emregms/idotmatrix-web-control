"use client";

import { useState, useRef } from "react";
import Picker, { EmojiClickData } from "emoji-picker-react";
import { api } from "@/lib/api";
import { Upload, RefreshCw, Smile } from "lucide-react";
import { clsx } from "clsx";

export default function EmojiToPixel({ isConnected }: { isConnected: boolean }) {
    const [loading, setLoading] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleEmojiClick = async (emojiData: EmojiClickData) => {
        setSelectedEmoji(emojiData.emoji);

        // Draw immediately to preview
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            if (ctx) {
                ctx.clearRect(0, 0, 32, 32);
                ctx.fillStyle = "#000000"; // Black background
                ctx.fillRect(0, 0, 32, 32);

                ctx.font = "26px Arial custom-emoji"; // Adjust size to fit 32x32
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(emojiData.emoji, 16, 18); // Centered
            }
        }
    };

    const handleSend = async () => {
        if (!canvasRef.current || !selectedEmoji) return;
        setLoading(true);

        try {
            const blob = await new Promise<Blob | null>(resolve => canvasRef.current?.toBlob(resolve, 'image/png'));
            if (!blob) throw new Error("Canvas error");

            const file = new File([blob], "emoji.png", { type: "image/png" });
            await api.upload(file);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="flex gap-8 items-start flex-wrap justify-center">
                {/* Picker Wrapper */}
                <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
                    <Picker
                        theme={"dark" as any}
                        onEmojiClick={handleEmojiClick}
                        searchDisabled={false}
                        skinTonesDisabled
                        width={320}
                        height={400}
                        previewConfig={{ showPreview: false }}
                    />
                </div>

                {/* Preview & Action */}
                <div className="flex flex-col items-center gap-4">
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-xl">
                        <p className="text-slate-400 text-xs mb-2 text-center uppercase tracking-wider font-bold">Önizleme (32x32)</p>
                        <div className="w-[128px] h-[128px] bg-black border border-slate-700 relative">
                            <canvas
                                ref={canvasRef}
                                width={32}
                                height={32}
                                className="w-full h-full image-pixelated"
                                style={{ imageRendering: "pixelated" }}
                            />
                            {!selectedEmoji && (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-600">
                                    <Smile className="w-8 h-8 opacity-50" />
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handleSend}
                        disabled={!isConnected || !selectedEmoji || loading}
                        className={clsx(
                            "w-full py-3 px-6 rounded-lg font-bold flex items-center justify-center gap-2 transition-all",
                            !isConnected || !selectedEmoji ? "bg-slate-800 text-slate-500 cursor-not-allowed" :
                                loading ? "bg-purple-800 text-purple-200 cursor-wait" :
                                    "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/20"
                        )}
                    >
                        {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                        {loading ? "Gönderiliyor..." : "Ekrana Gönder"}
                    </button>
                </div>
            </div>
        </div>
    );
}
