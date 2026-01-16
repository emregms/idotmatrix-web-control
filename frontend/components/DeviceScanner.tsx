"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import { Bluetooth, RefreshCw, Smartphone } from "lucide-react";
import { clsx } from "clsx";

interface Device {
    name: string;
    address: string;
    rssi: number;
}

interface DeviceScannerProps {
    onConnect: () => void;
    isConnected: boolean;
}

export default function DeviceScanner({ onConnect, isConnected }: DeviceScannerProps) {
    const { t } = useI18n();
    const [devices, setDevices] = useState<Device[]>([]);
    const [scanning, setScanning] = useState(false);
    const [connecting, setConnecting] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const scan = async () => {
        setScanning(true);
        setError(null);
        try {
            const res = await api.scan();
            setDevices(res.devices);
        } catch (err) {
            setError(t("scanFailed"));
            console.error(err);
        } finally {
            setScanning(false);
        }
    };

    const connect = async (address: string) => {
        setConnecting(address);
        setError(null);
        try {
            const res = await api.connect(address);
            if (res.success) {
                onConnect();
                setDevices([]);
            } else {
                setError(t("connectionFailed"));
            }
        } catch (err) {
            setError(t("connectionError"));
            console.error(err);
        } finally {
            setConnecting(null);
        }
    };

    if (isConnected) {
        return (
            <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-green-400 font-medium">{t("connectedToDevice")}</span>
                </div>
                <button
                    onClick={async () => {
                        await api.disconnect();
                        window.location.reload();
                    }}
                    className="text-sm text-red-400 hover:text-red-300 underline"
                >
                    {t("disconnect")}
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Bluetooth className="w-6 h-6 text-blue-400" />
                    {t("deviceConnection")}
                </h2>
                <button
                    onClick={scan}
                    disabled={scanning}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-md transition-colors"
                >
                    <RefreshCw className={clsx("w-4 h-4", scanning && "animate-spin")} />
                    {scanning ? t("scanning") : t("scan")}
                </button>
            </div>

            {error && (
                <div className="p-3 bg-red-900/50 text-red-200 text-sm rounded-md border border-red-800">
                    {error}
                </div>
            )}

            <div className="grid gap-2">
                {devices.map((device) => (
                    <div
                        key={device.address}
                        className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700 hover:border-blue-500/50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Smartphone className="w-5 h-5 text-slate-400" />
                            <div>
                                <div className="font-medium">{device.name || t("unknownDevice")}</div>
                                <div className="text-xs text-slate-500">{device.address} • RSSI: {device.rssi}</div>
                            </div>
                        </div>
                        <button
                            onClick={() => connect(device.address)}
                            disabled={!!connecting}
                            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded text-sm font-medium transition-colors"
                        >
                            {connecting === device.address ? t("connecting") : t("connect")}
                        </button>
                    </div>
                ))}
                {devices.length === 0 && !scanning && !error && (
                    <div className="text-center text-slate-500 py-8">
                        {t("noDevicesFound")}
                    </div>
                )}
            </div>
        </div>
    );
}

