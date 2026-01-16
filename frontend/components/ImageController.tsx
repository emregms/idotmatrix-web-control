"use client";

import { useState, useRef } from "react";
import { api } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import { Upload, Send, Eraser, Pencil, Trash2 } from "lucide-react";
import { clsx } from "clsx";

export default function ImageController({ isConnected }: { isConnected: boolean }) {
    const { t } = useI18n();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [grid, setGrid] = useState<string[][]>([]); // 32x32 grid
    const [tool, setTool] = useState<"pencil" | "eraser">("eraser"); // Default to eraser for cleanup
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState<string | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null); // For final export
    const processCanvasRef = useRef<HTMLCanvasElement>(null); // For image processing

    const processImageToGrid = (file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const ctx = processCanvasRef.current?.getContext("2d");
                if (!ctx) return;

                ctx.clearRect(0, 0, 32, 32);
                ctx.drawImage(img, 0, 0, 32, 32);

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
                            row.push("#000000");
                        } else {
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
            newGrid[rowIndex][colIndex] = "#000000";
        } else {
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
        setStatus(t("sendingToDevice"));

        try {
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
            const result = await api.upload(file);

            if (result.status === "uploaded") {
                setStatus(t("sentSuccess"));
                setTimeout(() => setStatus(null), 3000);
            } else {
                throw new Error("Upload failed");
            }
        } catch (err) {
            console.error(err);
            setStatus(t("sendError"));
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
            <canvas
                ref={processCanvasRef}
                width={32}
                height={32}
                className="absolute opacity-0 pointer-events-none -z-50"
                style={{ top: -9999, left: -9999 }}
            />
            <canvas
                ref={canvasRef}
                width={32}
                height={32}
                className="absolute opacity-0 pointer-events-none -z-50"
                style={{ top: -9999, left: -9999 }}
            />

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
                        <p className="text-white font-bold text-lg">{t("clickToUpload")}</p>
                        <p className="text-slate-400 text-sm mt-1">{t("autoResize")}</p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                    <div className="flex items-center gap-4 mb-4 bg-slate-800 p-2 rounded-lg">
                        <span className="text-xs font-bold text-slate-400 px-2">{t("editing")}</span>
                        <button
                            onClick={() => setTool("eraser")}
                            className={clsx(
                                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                                tool === "eraser" ? "bg-red-500/20 text-red-300 border border-red-500/50" : "text-slate-400 hover:bg-slate-700"
                            )}
                        >
                            <Eraser className="w-4 h-4" />
                            {t("eraser")}
                        </button>
                        <button
                            onClick={() => setTool("pencil")}
                            className={clsx(
                                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                                tool === "pencil" ? "bg-blue-500/20 text-blue-300 border border-blue-500/50" : "text-slate-400 hover:bg-slate-700"
                            )}
                        >
                            <Pencil className="w-4 h-4" />
                            {t("whitePencil")}
                        </button>
                        <div className="w-px h-6 bg-slate-700 mx-2" />
                        <button
                            onClick={reset}
                            className="text-slate-400 hover:text-white p-1"
                            title={t("cancelNewImage")}
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div
                        className="relative bg-slate-900 border border-slate-700 shadow-2xl p-4 rounded-xl"
                        onPointerLeave={() => setIsDrawing(false)}
                        onPointerUp={() => setIsDrawing(false)}
                    >
                        {grid.length > 0 && (
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(32, 1fr)",
                                    gap: "0px",
                                    width: "320px",
                                    height: "320px"
                                }}
                                className="bg-slate-950 border border-slate-800 cursor-crosshair touch-none select-none mx-auto"
                            >
                                {grid.map((row, r) => (
                                    row.map((color, c) => (
                                        <div
                                            key={`${r}-${c}`}
                                            style={{ backgroundColor: color }}
                                            onPointerDown={(e) => {
                                                e.preventDefault();
                                                handlePointerDown(r, c);
                                            }}
                                            onPointerEnter={() => handlePointerEnter(r, c)}
                                        />
                                    ))
                                ))}
                            </div>
                        )}

                        {grid.length === 0 && (
                            <div className="w-[320px] h-[320px] flex items-center justify-center text-slate-500">
                                <div className="animate-spin w-8 h-8 border-2 border-current border-t-transparent rounded-full mb-2"></div>
                                <span className="ml-2">{t("processing")}</span>
                            </div>
                        )}
                    </div>

                    <p className="text-slate-500 text-xs mt-3 mb-6">
                        {t("clickToDrag")}
                    </p>

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
                            {uploading ? t("sendingToDeviceBtn") : t("sendToScreen")}
                        </button>

                        {status && (
                            <div className={clsx(
                                "p-3 rounded-lg text-center text-sm font-bold animate-in fade-in slide-in-from-top-2 border",
                                status.includes("❌")
                                    ? "bg-red-500/10 text-red-400 border-red-500/20"
                                    : "bg-green-500/10 text-green-400 border-green-500/20"
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

