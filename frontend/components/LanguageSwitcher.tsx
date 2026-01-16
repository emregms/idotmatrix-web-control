"use client";

import { useI18n } from "@/lib/i18n";
import { Globe } from "lucide-react";
import { clsx } from "clsx";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1 border border-slate-700">
      <Globe className="w-4 h-4 text-slate-400 ml-2" />
      <button
        onClick={() => setLocale("tr")}
        className={clsx(
          "px-2 py-1 text-xs font-medium rounded transition-all",
          locale === "tr"
            ? "bg-blue-600 text-white"
            : "text-slate-400 hover:text-white hover:bg-slate-700"
        )}
      >
        TR
      </button>
      <button
        onClick={() => setLocale("en")}
        className={clsx(
          "px-2 py-1 text-xs font-medium rounded transition-all",
          locale === "en"
            ? "bg-blue-600 text-white"
            : "text-slate-400 hover:text-white hover:bg-slate-700"
        )}
      >
        EN
      </button>
    </div>
  );
}
