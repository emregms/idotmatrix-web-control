# iDotMatrix Control Center 🎨

<div align="center">

[![TR](https://img.shields.io/badge/lang-TR-red.svg)](README.md)
[![EN](https://img.shields.io/badge/lang-EN-blue.svg)](README_EN.md)

![iDotMatrix](https://raw.githubusercontent.com/8none1/idotmatrix/master/images/device.jpg)

**An advanced web-based control panel for generic 32x32 RGB LED Matrix devices.**  
(Compatible with iDotMatrix, iDealLED, and similar Bluetooth Low Energy devices)

</div>

## 🌟 Features

- **Dashboard Interface:** Modern, responsive, and user-friendly web interface.
- **Easy Connection:** Automatic device scanning and stable Bluetooth connection.
- **Pixel Editor:** Integrated 32x32 editor to draw, edit, and upload your own designs.
- **Auto-Image Processing:** Automatically converts any uploaded image (PNG, JPG) to a 32x32 pixel art format.
- **GIF Support:** Upload animated GIFs or search/download from the built-in gallery.
- **Scrolling Text:** Send custom scrolling text messages with color and speed options.
- **Time Sync:** One-click synchronization to fix device time.
- **Tools:** Specialized tools for device management.

## 🚀 Quick Start (Windows)

We have prepared a launcher to make everything easy for you.

1.  Run the **`Launcher - iDotMatrix.lnk`** shortcut (or `launcher.py` directly).
2.  Click the **"Start System"** button.
    *   This will automatically start the Backend server and Frontend interface.
    *   It will open the control panel in your browser (`http://localhost:3000`).
3.  **Connect:** Find your device in the "Connection" tab and click "Connect".
4.  **Enjoy:** Upload images, write text, or create pixel art!

## 🛠️ Manual Installation (For Developers)

If you want to run the project manually:

### Backend (Python)
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

## 📱 Supported Devices
The application has been tested with standard **iDotMatrix** 32x32 Bluetooth LED panels. It likely works with other devices using the same protocol (iDealLED, etc.).

## 🤝 Credits
- **Original Protocol Reverse Engineering:** [8none1/idotmatrix](https://github.com/8none1/idotmatrix)
- **UI & Web Development:** [emregms](https://github.com/emregms) | [hegg.tr](https://hegg.tr)

## 📄 License
MIT License
