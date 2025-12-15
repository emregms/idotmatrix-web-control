"use client";

import { useState, useRef } from "react";
import { api } from "@/lib/api";
import { Upload, Image as ImageIcon, Send } from "lucide-react";

export default function ImageController({ isConnected }: { isConnected: boolean }) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setStatus(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        setUploading(true);
        setStatus("Gönderiliyor...");
        try {
            await api.upload(selectedFile);
            setStatus("Başarıyla gönderildi!");
        } catch (err) {
            console.error(err);
            setStatus("Gönderim hatası.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={`space-y-6 ${!isConnected ? "opacity-50 pointer-events-none" : ""}`}>
            <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-semibold">Görsel / GIF Gönder</h2>
            </div>

            <div
                className="border-2 border-dashed border-slate-700 bg-slate-800/50 rounded-xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-slate-800 transition-colors"
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />

                {previewUrl ? (
                    <div className="relative group">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-32 h-32 object-contain image-pixelated bg-black rounded-lg shadow-lg border border-slate-600"
                            style={{ imageRendering: "pixelated" }}
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg text-xs text-white">
                            Değiştir
                        </div>
                    </div>
                ) : (
                    <>
                        <Upload className="w-10 h-10 text-slate-500" />
                        <div className="text-center">
                            <p className="text-slate-300 font-medium">Görsel seçmek için tıklayın</p>
                            <p className="text-slate-500 text-sm">PNG, JPG, GIF (32x32 önerilir)</p>
                        </div>
                    </>
                )}
            </div>

            {selectedFile && (
                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                    >
                        <Send className="w-4 h-4" />
                        {uploading ? "Cihaza İşleniyor..." : "Ekrana Gönder"}
                    </button>
                    {status && (
                        <p className={`text-center text-sm ${status.includes("hata") ? "text-red-400" : "text-green-400"}`}>
                            {status}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
