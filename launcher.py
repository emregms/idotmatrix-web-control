
import tkinter as tk
from tkinter import ttk, messagebox
import subprocess
import os
import sys
import webbrowser
import threading
import time
import signal

# Configuration
BACKEND_DIR = os.path.join(os.getcwd(), "backend")
FRONTEND_DIR = os.path.join(os.getcwd(), "frontend")
BACKEND_PORT = 8000
FRONTEND_PORT = 3000

class Application(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("iDotMatrix Manager")
        self.geometry("400x350")
        self.resizable(False, False)
        
        self.backend_process = None
        self.frontend_process = None
        
        self.create_widgets()
        self.protocol("WM_DELETE_WINDOW", self.on_close)
        
    def create_widgets(self):
        # Header
        header = ttk.Label(self, text="iDotMatrix Kontrol Paneli", font=("Segoe UI", 16, "bold"))
        header.pack(pady=20)
        
        # Status Frame
        status_frame = ttk.LabelFrame(self, text="Servis Durumu", padding=10)
        status_frame.pack(fill="x", padx=20, pady=5)
        
        self.lbl_backend = ttk.Label(status_frame, text="🔴 Backend: Kapalı", foreground="red")
        self.lbl_backend.pack(anchor="w")
        
        self.lbl_frontend = ttk.Label(status_frame, text="🔴 Frontend: Kapalı", foreground="red")
        self.lbl_frontend.pack(anchor="w")
        
        # Buttons Frame
        btn_frame = ttk.Frame(self)
        btn_frame.pack(pady=20)
        
        self.btn_start = ttk.Button(btn_frame, text="▶ BAŞLAT", command=self.start_services)
        self.btn_start.pack(side="left", padx=5)
        
        self.btn_stop = ttk.Button(btn_frame, text="⏹ DURDUR", command=self.stop_services, state="disabled")
        self.btn_stop.pack(side="left", padx=5)
        
        self.btn_browser = ttk.Button(self, text="🌐 Tarayıcıda Aç", command=self.open_browser, state="disabled")
        self.btn_browser.pack(pady=5)
        
        # Console/Info Area
        self.lbl_info = ttk.Label(self, text="Hazır", foreground="gray")
        self.lbl_info.pack(side="bottom", pady=10)

    def start_services(self):
        self.btn_start.config(state="disabled")
        self.btn_stop.config(state="normal")
        self.lbl_info.config(text="Servisler başlatılıyor...")
        
        # Start Backend
        def run_backend():
            # Determine python executable
            if sys.platform == "win32":
                python_exec = os.path.join(BACKEND_DIR, "venv", "Scripts", "python.exe")
            else:
                python_exec = os.path.join(BACKEND_DIR, "venv", "bin", "python")
            
            if not os.path.exists(python_exec):
                 # Fallback to system python if venv not found
                 python_exec = "python" # or python3
            
            cmd = [python_exec, "-m", "uvicorn", "app.main:app", "--reload", "--host", "0.0.0.0", "--port", str(BACKEND_PORT)]
            self.backend_process = subprocess.Popen(cmd, cwd=BACKEND_DIR, shell=False) # shell=False to track PID easier
            
        # Start Frontend
        def run_frontend():
            # npm needs shell=True on windows usually to find executable
            shell_mode = True if sys.platform == "win32" else False
            cmd = ["npm", "run", "dev"]
            self.frontend_process = subprocess.Popen(cmd, cwd=FRONTEND_DIR, shell=shell_mode)

        try:
            run_backend()
            self.lbl_backend.config(text="🟢 Backend: Çalışıyor", foreground="green")
            
            run_frontend()
            self.lbl_frontend.config(text="🟢 Frontend: Çalışıyor", foreground="green")
            
            self.lbl_info.config(text="Servisler aktif. Tarayıcı açılabilir.")
            self.btn_browser.config(state="normal")
            
            # Auto open browser after a delay
            self.after(3000, self.open_browser)
            
        except Exception as e:
            messagebox.showerror("Hata", str(e))
            self.stop_services()

    def stop_services(self):
        self.lbl_info.config(text="Servisler durduruluyor...")
        
        if self.backend_process:
            if sys.platform == "win32":
                subprocess.call(['taskkill', '/F', '/T', '/PID', str(self.backend_process.pid)])
            else:
                os.kill(self.backend_process.pid, signal.SIGTERM)
            self.backend_process = None
            self.lbl_backend.config(text="🔴 Backend: Kapalı", foreground="red")

        if self.frontend_process:
            if sys.platform == "win32":
                # Node spawns children, tricky to kill without taskkill /T
                subprocess.call(['taskkill', '/F', '/T', '/PID', str(self.frontend_process.pid)])
            else:
                os.kill(self.frontend_process.pid, signal.SIGTERM)
            self.frontend_process = None
            self.lbl_frontend.config(text="🔴 Frontend: Kapalı", foreground="red")
            
        self.btn_start.config(state="normal")
        self.btn_stop.config(state="disabled")
        self.btn_browser.config(state="disabled")
        self.lbl_info.config(text="Servisler durduruldu.")

    def open_browser(self):
        webbrowser.open(f"http://localhost:{FRONTEND_PORT}")

    def on_close(self):
        if self.backend_process or self.frontend_process:
            if messagebox.askokcancel("Çıkış", "Servisler hala çalışıyor. Kapatılsın mı?"):
                self.stop_services()
                self.destroy()
        else:
            self.destroy()

if __name__ == "__main__":
    app = Application()
    app.mainloop()
