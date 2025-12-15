"use client";

import { useState, useEffect } from "react";
import DeviceScanner from "@/components/DeviceScanner";
import ImageController from "@/components/ImageController";
import PresetGallery from "@/components/PresetGallery";
import CreativeStudio from "@/components/CreativeStudio";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-purple-500/30">
      <div className="container mx-auto max-w-2xl p-6 space-y-8">
        <header className="text-center py-6">
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
            iDotMatrix Kontrol
          </h1>
          <p className="text-slate-400">
            32x32 LED Ekran Yönetimi
          </p>
        </header>

        <section className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl">
          <DeviceScanner onConnect={() => setIsConnected(true)} isConnected={isConnected} />
        </section>

        <section className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden">
          {!isConnected && (
            <div className="absolute inset-0 z-10 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
              <p className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 shadow-lg">
                Önce cihaza bağlanın
              </p>
            </div>
          )}
          <ImageController isConnected={isConnected} />
          <div className="my-8 border-t border-slate-800" />
          <PresetGallery isConnected={isConnected} />

          <div className="my-8 border-t border-slate-800" />
          <CreativeStudio isConnected={isConnected} />
        </section>

        <footer className="text-center text-slate-600 text-xs py-8">
          Geliştirici: <a href="https://hegg.tr" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">hegg.tr</a> • Backend: Python • Frontend: Next.js
        </footer>
      </div>
    </main>
  );
}
