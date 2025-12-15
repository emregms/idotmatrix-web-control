"use client";

import { useState, useRef, useEffect } from "react";
import { api } from "@/lib/api";
import { Eraser, Pencil, Trash2, Upload, RefreshCw } from "lucide-react";
import { clsx } from "clsx";

// Simple color palette
const COLORS = [
    "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#00FFFF", "#FF00FF", // Brights
    "#FFFFFF", "#000000", "#808080", "#C0C0C0", // Grays
    "#FFA500", "#800080", "#008000", "#800000", "#000080", "#808000", // Darks
];

export default function PixelEditor({ isConnected }: { isConnected: boolean }) {
    const [grid, setGrid] = useState<string[][]>(Array(32).fill(Array(32).fill("#000000")));
    const [selectedColor, setSelectedColor] = useState("#FF0000");
    const [tool, setTool] = useState<"pencil" | "eraser">("pencil");
    const [isDrawing, setIsDrawing] = useState(false);
    const [loading, setLoading] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Initialize independent row arrays
    useEffect(() => {
        const newGrid = Array.from({ length: 32 }, () => Array(32).fill("#000000"));
        setGrid(newGrid);
    }, []);

    const handlePixelClick = (rowIndex: number, colIndex: number) => {
        const currentColor = tool === "eraser" ? "#000000" : selectedColor;
        // Optimization check
        if (grid[rowIndex][colIndex] === currentColor) return;

        const newGrid = [...grid];
        newGrid[rowIndex] = [...newGrid[rowIndex]]; // Copy row
        newGrid[rowIndex][colIndex] = currentColor;
        setGrid(newGrid);
    };

    const handlePointerDown = (r: number, c: number) => {
        setIsDrawing(true);
        handlePixelClick(r, c);
    };

    const handlePointerEnter = (r: number, c: number) => {
        if (isDrawing) {
            handlePixelClick(r, c);
        }
    };

    const clearGrid = () => {
        setGrid(Array.from({ length: 32 }, () => Array(32).fill("#000000")));
    };

    const handleSendToDevice = async () => {
        if (!canvasRef.current) return;
        setLoading(true);

        try {
            const ctx = canvasRef.current.getContext("2d");
            if (!ctx) return;

            // Draw grid to canvas
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, 32, 32);

            grid.forEach((row, r) => {
                row.forEach((color, c) => {
                    ctx.fillStyle = color;
                    ctx.fillRect(c, r, 1, 1);
                });
            });

            const blob = await new Promise<Blob | null>(resolve => canvasRef.current?.toBlob(resolve, 'image/png'));
            if (!blob) throw new Error("Canvas to Blob failed");

            const file = new File([blob], "drawing.png", { type: "image/png" });
            await api.upload(file);

        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 items-center w-full">
            {/* Tools Header */}
            <div className="flex flex-wrap items-center justify-between w-full max-w-[800px] bg-slate-800 p-4 rounded-xl shadow-lg">
                <div className="flex gap-2">
                    <button
                        onClick={() => setTool("pencil")}
                        className={clsx(
                            "flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all",
                            tool === "pencil" ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50" : "text-slate-400 hover:bg-slate-700"
                        )}
                    >
                        <Pencil className="w-5 h-5" /> Kalem
                    </button>
                    <button
                        onClick={() => setTool("eraser")}
                        className={clsx(
                            "flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all",
                            tool === "eraser" ? "bg-red-600 text-white shadow-lg shadow-red-900/50" : "text-slate-400 hover:bg-slate-700"
                        )}
                    >
                        <Eraser className="w-5 h-5" /> Silgi
                    </button>
                </div>

                <button
                    onClick={clearGrid}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    title="Temizle"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>

            <div className="flex flex-col xl:flex-row gap-8 items-start justify-center w-full">
                {/* Main Grid Canvas - FIXED SIZE for better UX */}
                <div
                    className="bg-slate-900 p-1 border border-slate-800 rounded-xl shadow-2xl overflow-hidden"
                    onPointerLeave={() => setIsDrawing(false)}
                    onPointerUp={() => setIsDrawing(false)}
                >
                    <div
                        className="grid grid-cols-[repeat(32,minmax(0,1fr))] bg-slate-800 border-2 border-slate-800 cursor-crosshair touch-none select-none"
                        style={{ width: "640px", height: "640px", gap: "1px" }}
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
                    {/* Hidden canvas for export */}
                    <canvas ref={canvasRef} width={32} height={32} className="hidden" />
                </div>

                {/* Sidebar: Colors & Actions */}
                <div className="flex flex-col gap-6 w-full max-w-[250px]">

                    {/* Color Palette */}
                    <div className="bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700">
                        <h3 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">Renk Paleti</h3>
                        <div className="grid grid-cols-4 gap-2">
                            {COLORS.map((color) => (
                                <button
                                    key={color}
                                    className={clsx(
                                        "w-10 h-10 rounded-lg shadow-sm border-2 transition-transform hover:scale-110 active:scale-95",
                                        selectedColor === color ? "border-white ring-2 ring-white/20 z-10 scale-110" : "border-slate-600/50"
                                    )}
                                    style={{ backgroundColor: color }}
                                    onClick={() => {
                                        setSelectedColor(color);
                                        setTool("pencil");
                                    }}
                                />
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-700">
                            <input
                                type="color"
                                value={selectedColor}
                                onChange={(e) => {
                                    setSelectedColor(e.target.value);
                                    setTool("pencil");
                                }}
                                className="w-full h-10 cursor-pointer rounded-lg bg-slate-700 border border-slate-600 p-1"
                            />
                        </div>
                    </div>

                    {/* Send Button */}
                    <button
                        onClick={handleSendToDevice}
                        disabled={!isConnected || loading}
                        className={clsx(
                            "w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl text-lg",
                            !isConnected ? "bg-slate-800 text-slate-500 cursor-not-allowed" :
                                loading ? "bg-blue-800 text-blue-200 cursor-wait" :
                                    "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white hover:scale-[1.02] hover:shadow-green-500/25"
                        )}
                    >
                        {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
                        {loading ? "Gönderiliyor..." : "Ekrana Yansıt"}
                    </button>
                    {!isConnected && (
                        <p className="text-xs text-red-400 text-center">Cihaz bağlı değil</p>
                    )}
                </div>
            </div>
        </div>
    );
}
