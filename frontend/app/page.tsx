"use client";

import { useState } from "react";
import DeviceScanner from "@/components/DeviceScanner";
import ImageController from "@/components/ImageController";
import { TextScroller, ClockManager } from "@/components/ExtraModules";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Palette,
  Settings,
  Menu,
  X,
  Bluetooth,
  Upload,
  Wrench // Tools icon
} from "lucide-react";
import { clsx } from "clsx";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  // Default tab is 'connect'
  const [activeTab, setActiveTab] = useState<"connect" | "upload" | "gallery" | "studio" | "tools">("connect");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleConnectSuccess = () => {
    setIsConnected(true);
    // Auto redirect to upload tab
    setActiveTab("upload");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "connect":
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-xl">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                <Bluetooth className="w-8 h-8 text-blue-400" />
                Cihaz Bağlantısı
              </h2>
              <p className="text-slate-400 mb-8">
                Başlamak için iDotMatrix cihazınızı tarayın ve bağlanın. Bağlantı kurulduğunda otomatik olarak kontrol paneline yönlendirileceksiniz.
              </p>
              <DeviceScanner onConnect={handleConnectSuccess} isConnected={isConnected} />
            </div>
          </div>
        );
      case "upload":
        return (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Upload className="w-5 h-5 text-purple-400" />
              Görsel Yükleme & Düzenleme
            </h2>
            {!isConnected && (
              <div className="absolute inset-0 z-10 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center p-6 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl max-w-md">
                  <Bluetooth className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">Cihaz Bağlı Değil</h3>
                  <p className="text-slate-400 mb-4">Görsel yüklemek için önce cihaz bağlantısını sağlamalısınız.</p>
                  <button
                    onClick={() => setActiveTab("connect")}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
                  >
                    Bağlantı Ekranına Git
                  </button>
                </div>
              </div>
            )}
            <ImageController isConnected={isConnected} />
          </div>
        );
      case "gallery":
        return (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl min-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
            {!isConnected && (
              <div className="absolute inset-0 z-10 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                <p className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 shadow-lg">
                  Cihaz bağlı değil
                </p>
              </div>
            )}
            <PresetGallery isConnected={isConnected} />
          </div>
        );
      case "studio":
        return (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl min-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
            {!isConnected && (
              <div className="absolute inset-0 z-10 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                <p className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 shadow-lg">
                  Cihaz bağlı değil
                </p>
              </div>
            )}
            <CreativeStudio isConnected={isConnected} />
          </div>
        );
      case "tools":
        return (
          <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {!isConnected && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl text-yellow-200 text-center mb-6">
                ⚠️ Cihaz bağlı değilken bu araçlar çalışmaz.
              </div>
            )}
            <TextScroller isConnected={isConnected} />
            <ClockManager isConnected={isConnected} />
          </div>
        );
      default:
        return null;
    }
  };

  const NavItem = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setMobileMenuOpen(false);
      }}
      className={clsx(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
        activeTab === id
          ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
          : "text-slate-400 hover:bg-slate-800 hover:text-white"
      )}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-purple-500/30 flex flex-col md:flex-row">

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <h1 className="text-xl font-black bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          iDotMatrix
        </h1>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-400 hover:text-white">
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={clsx(
        "fixed md:sticky md:top-0 h-[calc(100vh-65px)] md:h-screen w-full md:w-72 bg-slate-950/95 md:bg-slate-900 border-r border-slate-800 p-6 flex flex-col gap-8 z-40 transition-transform duration-300 ease-in-out md:translate-x-0 overflow-y-auto",
        mobileMenuOpen ? "translate-x-0 top-[65px]" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="hidden md:block">
          <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            iDotMatrix
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-mono">Control Center v1.1</p>
        </div>

        <nav className="flex-1 space-y-2">
          <div className="pb-4 mb-4 border-b border-slate-800">
            <NavItem id="connect" icon={Bluetooth} label="Bağlantı" />
          </div>
          <NavItem id="upload" icon={Upload} label="Resim Yükle" />
          <NavItem id="gallery" icon={ImageIcon} label="Galeri & GIF" />
          <NavItem id="studio" icon={Palette} label="Yaratıcı Stüdyo" />
          <div className="pt-4 mt-4 border-t border-slate-800">
            <NavItem id="tools" icon={Wrench} label="Araçlar" />
          </div>
        </nav>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Durum</span>
            <div className={clsx("w-2 h-2 rounded-full animate-pulse", isConnected ? "bg-green-500" : "bg-red-500")} />
          </div>
          <p className={clsx("text-sm font-medium", isConnected ? "text-green-400" : "text-slate-400")}>
            {isConnected ? "Cihaz Bağlı" : "Bağlantı Yok"}
          </p>
        </div>

        <footer className="text-start text-slate-600 text-[10px]">
          Geliştirici: <a href="https://hegg.tr" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">hegg.tr</a>
        </footer>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 md:pt-12 max-w-7xl mx-auto w-full">
        <header className="mb-8 hidden md:block">
          <h2 className="text-3xl font-bold text-white">
            {activeTab === "connect" && "Bağlantı Merkezi"}
            {activeTab === "upload" && "Resim Yükleme"}
            {activeTab === "gallery" && "İçerik Galerisi"}
            {activeTab === "studio" && "Yaratıcı Stüdyo"}
            {activeTab === "tools" && "Araç Kutusu"}
          </h2>
          <p className="text-slate-400 mt-1">
            {activeTab === "connect" && "Cihazınızı bulun ve eşleştirin."}
            {activeTab === "upload" && "Kendi görsellerinizi yükleyin, düzenleyin ve gönderin."}
            {activeTab === "gallery" && "Popüler GIF'leri keşfet veya link ile yükle."}
            {activeTab === "studio" && "Kendi piksel sanatını veya emojini oluştur."}
            {activeTab === "tools" && "Kayan yazı ve saat ayarı gibi ekstra özellikler."}
          </p>
        </header>

        {renderContent()}
      </div>

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </main>
  );
}
