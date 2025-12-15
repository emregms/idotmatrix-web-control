"use client";

import { useState, useRef, useEffect } from "react";
import { api } from "@/lib/api";
import { Upload, Image as ImageIcon, Send, Eraser, Pencil, Trash2, RefreshCcw } from "lucide-react";
import { clsx } from "clsx";

export default function ImageController({ isConnected }: { isConnected: boolean }) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [grid, setGrid] = useState<string[][]>([]); // 32x32 grid
    const [tool, setTool] = useState<"pencil" | "eraser">("eraser"); // Default to eraser for cleanup
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState<string | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null); // For final export
    const processCanvasRef = useRef<HTMLCanvasElement>(null); // For image processing

    // Helper to convert hex to rgba for canvas
    const hexToRgb = (hex: string) => {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    const processImageToGrid = (file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const ctx = processCanvasRef.current?.getContext("2d");
                if (!ctx) return;

                // Clear and resize
                ctx.clearRect(0, 0, 32, 32);

                // Draw image resized to 32x32
                // Ensure better quality scaling if needed, but pixelated is fine for this
                ctx.drawImage(img, 0, 0, 32, 32);

                // Read pixels
                const imageData = ctx.getImageData(0, 0, 32, 32);
                const data = imageData.data;
                const newGrid: string[][] = [];

                for (let y = 0; y < 32; y++) {
                    const row: string[] = [];
                    for (let x = 0; x < 32; x++) {
                        const i = (y * 32 + x) * 4;
                        const r = data[i];
                        const g = data[i + 1];
                        const b = data[i + 2];
                        const a = data[i + 3];

                        if (a < 128) {
                            row.push("#000000"); // Treat transparent as black/background
                        } else {
                            // Convert rgb to hex
                            const toHex = (c: number) => {
                                const hex = c.toString(16);
                                return hex.length === 1 ? "0" + hex : hex;
                            };
                            row.push(`#${toHex(r)}${toHex(g)}${toHex(b)}`);
                        }
                    }
                    newGrid.push(row);
                }
                setGrid(newGrid);
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setStatus(null);
            processImageToGrid(file);
        }
    };

    const handlePixelClick = (rowIndex: number, colIndex: number) => {
        const newGrid = [...grid];
        newGrid[rowIndex] = [...newGrid[rowIndex]];

        if (tool === "eraser") {
            newGrid[rowIndex][colIndex] = "#000000"; // Erase to black
        } else {
            // Basic pencil - maybe default white or just keeping eraser focused for now
            // User asked for "silmek" (erase) mostly. Let's make pencil White for restoration
            newGrid[rowIndex][colIndex] = "#FFFFFF";
        }
        setGrid(newGrid);
    };

    const handlePointerDown = (r: number, c: number) => {
        setIsDrawing(true);
        handlePixelClick(r, c);
    };

    const handlePointerEnter = (r: number, c: number) => {
        if (isDrawing) handlePixelClick(r, c);
    };

    const handleUpload = async () => {
        if (!grid.length) return;
        setUploading(true);
        setStatus("Gönderiliyor...");

        try {
            // Convert grid back to image
            const ctx = canvasRef.current?.getContext("2d");
            if (!ctx) return;

            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, 32, 32);

            grid.forEach((row, y) => {
                row.forEach((color, x) => {
                    ctx.fillStyle = color;
                    ctx.fillRect(x, y, 1, 1);
                });
            });

            const blob = await new Promise<Blob | null>(resolve => canvasRef.current?.toBlob(resolve, 'image/png'));
            if (!blob) throw new Error("Canvas error");

            const file = new File([blob], "edited_upload.png", { type: "image/png" });
            await api.upload(file);
            setStatus("Başarıyla gönderildi!");
        } catch (err) {
            console.error(err);
            setStatus("Gönderim hatası.");
        } finally {
            setUploading(false);
        }
    };

    const reset = () => {
        setSelectedFile(null);
        setGrid([]);
        setStatus(null);
    };

    return (
        <div className={`flex flex-col gap-6 ${!isConnected ? "opacity-50 pointer-events-none" : ""}`}>
            {/* Helper Canvases - Always render them so refs are available */}
            <canvas ref={processCanvasRef} width={32} height={32} className="hidden" />
            <canvas ref={canvasRef} width={32} height={32} className="hidden" />

            {/* Input Area */}
            {!selectedFile ? (
                <div
                    className="border-2 border-dashed border-slate-700 bg-slate-800/50 rounded-xl p-12 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-slate-800 transition-colors w-full"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                    <div className="bg-slate-800 p-4 rounded-full">
                        <Upload className="w-8 h-8 text-blue-400" />
                    </div>
                    <div className="text-center">
                        <p className="text-white font-bold text-lg">Görsel Yüklemek İçin Tıklayın</p>
                        <p className="text-slate-400 text-sm mt-1">PNG, JPG, GIF (Otomatik 32x32'ye küçültülür)</p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                    {/* Toolbar */}
                    <div className="flex items-center gap-4 mb-4 bg-slate-800 p-2 rounded-lg">
                        <span className="text-xs font-bold text-slate-400 px-2">Düzenleme:</span>
                        <button
                            onClick={() => setTool("eraser")}
                            className={clsx(
                                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                                tool === "eraser" ? "bg-red-500/20 text-red-300 border border-red-500/50" : "text-slate-400 hover:bg-slate-700"
                            )}
                        >
                            <Eraser className="w-4 h-4" />
                            Silgi
                        </button>
                        <button
                            onClick={() => setTool("pencil")}
                            className={clsx(
                                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                                tool === "pencil" ? "bg-blue-500/20 text-blue-300 border border-blue-500/50" : "text-slate-400 hover:bg-slate-700"
                            )}
                        >
                            <Pencil className="w-4 h-4" />
                            Beyaz Kalem
                        </button>
                        <div className="w-px h-6 bg-slate-700 mx-2" />
                        <button
                            onClick={reset}
                            className="text-slate-400 hover:text-white p-1"
                            title="İptal / Yeni Resim"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Interactive Editor Grid */}
                    <div
                        className="relative bg-slate-900 border border-slate-700 shadow-2xl p-4 rounded-xl"
                        onPointerLeave={() => setIsDrawing(false)}
                        onPointerUp={() => setIsDrawing(false)}
                    >
                        {/* Only render grid if we have data */}
                        {grid.length > 0 && (
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(32, 1fr)",
                                    gap: "1px",
                                }}
                                className="bg-slate-800 border border-slate-800 cursor-crosshair touch-none select-none w-full max-w-[500px] aspect-square mx-auto"
                            >
                                {grid.map((row, r) => (
                                    row.map((color, c) => (
                                        <div
                                            key={`${r}-${c}`}
                                            className="w-full h-full"
                                            style={{ backgroundColor: color }}
                                            onPointerDown={(e) => {
                                                e.preventDefault();
                                                handlePointerDown(r, c);
                                            }}
                                            onPointerEnter={(e) => handlePointerEnter(r, c)}
                                        />
                                    ))
                                ))}
                            </div>
                        )}
                    </div>

                    <p className="text-slate-500 text-xs mt-3 mb-6">
                        İstenmeyen pikselleri silmek için üzerine tıklayın veya sürükleyin.
                    </p>

                    {/* Action Buttons */}
                    <div className="w-full max-w-sm flex flex-col gap-3">
                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className={clsx(
                                "w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg",
                                uploading ? "bg-purple-900 cursor-wait" : "bg-purple-600 hover:bg-purple-500 hover:scale-[1.02] shadow-purple-900/20"
                            )}
                        >
                            <Send className="w-5 h-5" />
                            {uploading ? "Cihaza Gönderiliyor..." : "Ekrana Gönder"}
                        </button>

                        {status && (
                            <div className={clsx(
                                "p-3 rounded-lg text-center text-sm font-medium animate-in fade-in slide-in-from-top-2",
                                status.includes("hata") ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"
                            )}>
                                {status}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
