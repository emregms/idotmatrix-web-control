"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Locale = "tr" | "en";

const translations = {
  tr: {
    // Navigation
    connection: "Bağlantı",
    uploadImage: "Resim Yükle",
    galleryGif: "Galeri & GIF",
    creativeStudio: "Yaratıcı Stüdyo",
    tools: "Araçlar",
    
    // Headers
    connectionCenter: "Bağlantı Merkezi",
    imageUpload: "Resim Yükleme",
    contentGallery: "İçerik Galerisi",
    creativeStudioTitle: "Yaratıcı Stüdyo",
    toolbox: "Araç Kutusu",
    
    // Subtitles
    findAndPairDevice: "Cihazınızı bulun ve eşleştirin.",
    uploadEditSend: "Kendi görsellerinizi yükleyin, düzenleyin ve gönderin.",
    discoverGifs: "Popüler GIF'leri keşfet veya link ile yükle.",
    createPixelArt: "Kendi piksel sanatını veya emojini oluştur.",
    extraFeatures: "Kayan yazı ve saat ayarı gibi ekstra özellikler.",
    
    // Device Connection
    deviceConnection: "Cihaz Bağlantısı",
    deviceConnectionDesc: "Başlamak için iDotMatrix cihazınızı tarayın ve bağlanın. Bağlantı kurulduğunda otomatik olarak kontrol paneline yönlendirileceksiniz.",
    
    // Upload section
    imageUploadEdit: "Görsel Yükleme & Düzenleme",
    deviceNotConnected: "Cihaz Bağlı Değil",
    mustConnectFirst: "Görsel yüklemek için önce cihaz bağlantısını sağlamalısınız.",
    goToConnection: "Bağlantı Ekranına Git",
    
    // Status
    status: "Durum",
    deviceConnected: "Cihaz Bağlı",
    noConnection: "Bağlantı Yok",
    
    // Tools warning
    toolsWarning: "⚠️ Cihaz bağlı değilken bu araçlar çalışmaz.",
    
    // Gallery
    deviceNotConnectedShort: "Cihaz bağlı değil",
    
    // Footer
    developer: "Geliştirici",
    
    // ImageController
    clickToUpload: "Görsel Yüklemek İçin Tıklayın",
    autoResize: "PNG, JPG, GIF (Otomatik 32x32'ye küçültülür)",
    editing: "Düzenleme:",
    eraser: "Silgi",
    whitePencil: "Beyaz Kalem",
    cancelNewImage: "İptal / Yeni Resim",
    processing: "İşleniyor...",
    clickToDrag: "İstenmeyen pikselleri silmek için üzerine tıklayın veya sürükleyin.",
    sendingToDevice: "Cihaza gönderiliyor...",
    sentSuccess: "✅ Başarıyla gönderildi!",
    sendError: "❌ Gönderim hatası!",
    sendToScreen: "Ekrana Gönder",
    sendingToDeviceBtn: "Cihaza Gönderiliyor...",
    
    // DeviceScanner
    connectedToDevice: "Cihaza Bağlı",
    disconnect: "Bağlantıyı Kes",
    scanFailed: "Tarama başarısız. Backend çalışıyor mu?",
    connectionFailed: "Bağlantı başarısız oldu.",
    connectionError: "Bağlantı hatası.",
    scanning: "Taranıyor...",
    scan: "Tara",
    unknownDevice: "Bilinmeyen Cihaz",
    connecting: "Bağlanıyor...",
    connect: "Bağlan",
    noDevicesFound: "Cihaz bulunamadı. Lütfen \"Tara\" butonuna basın.",
    
    // PresetGallery
    searchOnline: "İnternette Ara",
    uploadLink: "Link Yükle",
    searchPlaceholder: "Örn: Mario, Space, Coin...",
    search: "Ara",
    sendToDevice: "Cihaza Gönder",
    noResults: "Sonuç yok veya arama yapılmadı.",
    betterResults: "Daha iyi sonuçlar için İngilizce terimler deneyin (örn: \"8bit fire\").",
    downloadingAndSending: "İndiriliyor ve Gönderiliyor...",
    sendLinkToScreen: "Linkteki Görseli Ekrana Yansıt",
    staticImagesSupported: "Statik resimler veya GIF linkleri desteklenir.",
    sendFailed: "Gönderim başarısız",
    
    // PixelEditor
    pencil: "Kalem",
    clear: "Temizle",
    colorPalette: "Renk Paleti",
    sending: "Gönderiliyor...",
    reflectToScreen: "Ekrana Yansıt",
    
    // CreativeStudio
    draw: "Çizim",
    emoji: "Emoji",
    
    // ExtraModules - TextScroller
    scrollingText: "Kayan Yazı",
    enterText: "Metin Girin",
    textPlaceholder: "Merhaba Dünya!",
    selectColor: "Renk Seçin",
    sendText: "Yazıyı Gönder",
    textSendFailed: "Metin gönderilemedi.",
    
    // ExtraModules - ClockManager
    clockAndTime: "Saat ve Zaman",
    fixBrokenClock: "Bozulmuş Saati Düzelt",
    syncWithComputer: "Cihazın saati yanlışsa, bilgisayar saatiyle eşitleyin.",
    syncNow: "Şimdi Eşitle",
    returnToClockMode: "Saat Moduna Dön",
    returnToClockModeDesc: "Ekranda saatin görünmesi için varsayılan moda döner.",
    activate: "Aktif Et",
    syncFailed: "Saat eşitlenemedi.",
    modeFailed: "Mod değiştirilemedi.",
  },
  en: {
    // Navigation
    connection: "Connection",
    uploadImage: "Upload Image",
    galleryGif: "Gallery & GIF",
    creativeStudio: "Creative Studio",
    tools: "Tools",
    
    // Headers
    connectionCenter: "Connection Center",
    imageUpload: "Image Upload",
    contentGallery: "Content Gallery",
    creativeStudioTitle: "Creative Studio",
    toolbox: "Toolbox",
    
    // Subtitles
    findAndPairDevice: "Find and pair your device.",
    uploadEditSend: "Upload, edit and send your own images.",
    discoverGifs: "Discover popular GIFs or upload via link.",
    createPixelArt: "Create your own pixel art or emoji.",
    extraFeatures: "Extra features like scrolling text and clock settings.",
    
    // Device Connection
    deviceConnection: "Device Connection",
    deviceConnectionDesc: "Scan and connect to your iDotMatrix device to get started. You will be automatically redirected to the control panel once connected.",
    
    // Upload section
    imageUploadEdit: "Image Upload & Edit",
    deviceNotConnected: "Device Not Connected",
    mustConnectFirst: "You must connect to a device first to upload images.",
    goToConnection: "Go to Connection",
    
    // Status
    status: "Status",
    deviceConnected: "Device Connected",
    noConnection: "No Connection",
    
    // Tools warning
    toolsWarning: "⚠️ These tools don't work when device is not connected.",
    
    // Gallery
    deviceNotConnectedShort: "Device not connected",
    
    // Footer
    developer: "Developer",
    
    // ImageController
    clickToUpload: "Click to Upload Image",
    autoResize: "PNG, JPG, GIF (Auto-resized to 32x32)",
    editing: "Editing:",
    eraser: "Eraser",
    whitePencil: "White Pencil",
    cancelNewImage: "Cancel / New Image",
    processing: "Processing...",
    clickToDrag: "Click or drag to erase unwanted pixels.",
    sendingToDevice: "Sending to device...",
    sentSuccess: "✅ Successfully sent!",
    sendError: "❌ Send error!",
    sendToScreen: "Send to Screen",
    sendingToDeviceBtn: "Sending to Device...",
    
    // DeviceScanner
    connectedToDevice: "Connected to Device",
    disconnect: "Disconnect",
    scanFailed: "Scan failed. Is the backend running?",
    connectionFailed: "Connection failed.",
    connectionError: "Connection error.",
    scanning: "Scanning...",
    scan: "Scan",
    unknownDevice: "Unknown Device",
    connecting: "Connecting...",
    connect: "Connect",
    noDevicesFound: "No devices found. Please click \"Scan\".",
    
    // PresetGallery
    searchOnline: "Search Online",
    uploadLink: "Upload Link",
    searchPlaceholder: "E.g: Mario, Space, Coin...",
    search: "Search",
    sendToDevice: "Send to Device",
    noResults: "No results or no search performed.",
    betterResults: "Try English terms for better results (e.g: \"8bit fire\").",
    downloadingAndSending: "Downloading and Sending...",
    sendLinkToScreen: "Send Link Image to Screen",
    staticImagesSupported: "Static images or GIF links are supported.",
    sendFailed: "Send failed",
    
    // PixelEditor
    pencil: "Pencil",
    clear: "Clear",
    colorPalette: "Color Palette",
    sending: "Sending...",
    reflectToScreen: "Send to Screen",
    
    // CreativeStudio
    draw: "Draw",
    emoji: "Emoji",
    
    // ExtraModules - TextScroller
    scrollingText: "Scrolling Text",
    enterText: "Enter Text",
    textPlaceholder: "Hello World!",
    selectColor: "Select Color",
    sendText: "Send Text",
    textSendFailed: "Failed to send text.",
    
    // ExtraModules - ClockManager
    clockAndTime: "Clock & Time",
    fixBrokenClock: "Fix Broken Clock",
    syncWithComputer: "If device time is wrong, sync with computer time.",
    syncNow: "Sync Now",
    returnToClockMode: "Return to Clock Mode",
    returnToClockModeDesc: "Returns to default mode for clock display.",
    activate: "Activate",
    syncFailed: "Clock sync failed.",
    modeFailed: "Mode change failed.",
  },
};

type TranslationKeys = keyof typeof translations.tr;

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKeys) => string;
  isHydrated: boolean;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("tr");
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Load from localStorage after hydration
  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale;
    if (saved && (saved === "tr" || saved === "en")) {
      setLocale(saved);
    }
    setIsHydrated(true);
  }, []);
  
  // Save locale to localStorage
  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem("locale", newLocale);
  };
  
  const t = (key: TranslationKeys): string => {
    return translations[locale][key] || key;
  };
  
  return (
    <I18nContext.Provider value={{ locale, setLocale: handleSetLocale, t, isHydrated }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

