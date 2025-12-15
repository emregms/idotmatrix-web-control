"use client";

import { useState, useRef, useEffect } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button"; // Assuming standard UI components or I'll use raw HTML/Tailwind if not
import { Eraser, Pencil, Trash2, Upload, Palette, RefreshCw } from "lucide-react";
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

    const handlePixelClick = (rowIndex: number, colIndex: number, isDrag: boolean = false) => {
        // Optimization: Don't update if color is same
        const currentColor = tool === "eraser" ? "#000000" : selectedColor;
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
            handlePixelClick(r, c, true);
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

            // Get blob
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
        <div className="flex flex-col gap-6 items-center">
            {/* Tools */}
            <div className="flex flex-wrap justify-center gap-3 p-3 bg-slate-800 rounded-xl w-full max-w-sm">
                <button
                    onClick={() => setTool("pencil")}
                    className={clsx("p-2 rounded-lg transition-colors", tool === "pencil" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-700")}
                    title="Kalem"
                >
                    <Pencil className="w-5 h-5" />
                </button>
                <button
                    onClick={() => setTool("eraser")}
                    className={clsx("p-2 rounded-lg transition-colors", tool === "eraser" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-700")}
                    title="Silgi"
                >
                    <Eraser className="w-5 h-5" />
                </button>
                <div className="w-px h-8 bg-slate-700 mx-1" />
                <button
                    onClick={clearGrid}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors"
                    title="Temizle"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>

            {/* Editor & Colors Container */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Grid Canvas */}
                <div
                    className="flex flex-col items-center bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-2xl"
                    onPointerLeave={() => setIsDrawing(false)}
                    onPointerUp={() => setIsDrawing(false)}
                >
                    <div
                        className="grid grid-cols-[repeat(32,minmax(0,1fr))] gap-px bg-slate-800 border border-slate-800 cursor-crosshair touch-none select-none"
                        style={{ width: "320px", height: "320px" }} // Scaled up 10x
                    >
                        {grid.map((row, r) => (
                            row.map((color, c) => (
                                <div
                                    key={`${r}-${c}`}
                                    className="w-full h-full"
                                    style={{ backgroundColor: color }}
                                    onPointerDown={(e) => {
                                        e.preventDefault(); // Prevent scroll on touch
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

                {/* Color Palette */}
                <div className="grid grid-cols-4 gap-2 bg-slate-800 p-3 rounded-xl max-w-[200px]">
                    {COLORS.map((color) => (
                        <button
                            key={color}
                            className={clsx(
                                "w-8 h-8 rounded-full border-2 transition-transform hover:scale-110",
                                selectedColor === color ? "border-white scale-110 shadow-lg" : "border-transparent"
                            )}
                            style={{ backgroundColor: color }}
                            onClick={() => {
                                setSelectedColor(color);
                                setTool("pencil");
                            }}
                        />
                    ))}
                    <div className="col-span-4 mt-2 pt-2 border-t border-slate-700">
                        <input
                            type="color"
                            value={selectedColor}
                            onChange={(e) => {
                                setSelectedColor(e.target.value);
                                setTool("pencil");
                            }}
                            className="w-full h-8 cursor-pointer rounded bg-transparent"
                        />
                    </div>
                </div>
            </div>

            <button
                onClick={handleSendToDevice}
                disabled={!isConnected || loading}
                className={clsx(
                    "w-full max-w-sm py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all mt-4",
                    !isConnected ? "bg-slate-800 text-slate-500 cursor-not-allowed" :
                        loading ? "bg-blue-800 text-blue-200 cursor-wait" :
                            "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white shadow-lg hover:shadow-green-500/25"
                )}
            >
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                {loading ? "Gönderiliyor..." : "Ekrana Gönder"}
            </button>

        </div>
    );
}
