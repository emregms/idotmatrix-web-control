
const API_URL = "http://localhost:8000";

export const api = {
  scan: async () => {
    const res = await fetch(`${API_URL}/scan`);
    return res.json();
  },
  connect: async (address: string) => {
    const res = await fetch(`${API_URL}/connect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address }),
    });
    return res.json();
  },
  disconnect: async () => {
    const res = await fetch(`${API_URL}/disconnect`, { method: "POST" });
    return res.json();
  },
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_URL}/upload`, {
      method: "POST",
      body: formData,
    });
    return res.json();
  },
  fetchUrl: async (url: string) => {
    const res = await fetch(`${API_URL}/fetch-url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    return res.json();
  },
  getStatus: async () => {
    const res = await fetch(`${API_URL}/status`);
    return res.json();
  },
  sendText: async (data: { text: string; color: string }) => {
    const res = await fetch(`${API_URL}/text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  syncTime: async () => {
    const res = await fetch(`${API_URL}/sync-time`, { method: "POST" });
    return res.json();
  },
  setClockMode: async () => {
    const res = await fetch(`${API_URL}/clock-mode`, { method: "POST" });
    return res.json();
  },
};
