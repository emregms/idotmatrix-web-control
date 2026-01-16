<div align="center">
  
# 🎮 iDotMatrix Web Control

### Control Your Bluetooth LED Display from the Web

[![TR](https://img.shields.io/badge/🇹🇷_Türkçe-Tıkla-red?style=for-the-badge)](README.md)
[![EN](https://img.shields.io/badge/🇬🇧_English-Selected-blue?style=for-the-badge)](README_EN.md)

**Modern, user-friendly web interface for your iDotMatrix 32x32 LED display.**

</div>

---

## 🌟 About The Project

iDotMatrix Web Control is an open-source web application designed to control popular iDotMatrix 32x32 pixel LED displays.

Working over Bluetooth connection, this application allows you to:

- **Upload and edit** your own images
- **Search GIFs** online and send them with one click
- **Draw pixel art** or convert emojis to pixels
- **Send scrolling text** and manage clock settings

It uses a modern architecture with Python backend and Next.js frontend. Works on both Windows and Mac/Linux systems.

---

<div align="center">
  <img src="images/creative_studio.jpg" alt="Creative Studio" width="45%"/>
  &nbsp;&nbsp;
  <img src="images/upload_image.jpg" alt="Upload Image" width="45%"/>
  <br/>
  <sub><i>Draw with Creative Studio • Upload your own images</i></sub>
</div>

---

## ✨ Features

| Feature                | Description                                              |
| ---------------------- | -------------------------------------------------------- |
| 🔗 **Easy Connection** | Scan and connect to your Bluetooth device with one click |
| 🖼️ **Image Upload**    | Upload, edit, and send your own images                   |
| 🎬 **GIF Support**     | Search for animated GIFs online or upload via link       |
| 🎨 **Pixel Editor**    | Draw 32x32 pixel art and send it instantly               |
| 😊 **Emoji Converter** | Convert emojis to pixel art                              |
| 📝 **Scrolling Text**  | Stream custom text across the display                    |
| ⏰ **Clock Settings**  | Synchronize device time                                  |
| 🌍 **Multi-language**  | Turkish and English interface support                    |

---

## 📸 Screenshots

<details open>
<summary><b>🔌 Device Connection</b></summary>
<br/>
<img src="images/connection_screenshot.png" alt="Device Connection" width="100%"/>
<p><i>Bluetooth devices are automatically scanned. Select your device from the list and connect with one click.</i></p>
</details>

<details>
<summary><b>📤 Image Upload</b></summary>
<br/>
<img src="images/upload_image_screenshot.png" alt="Image Upload" width="100%"/>
<p><i>Upload PNG, JPG, or GIF files. Automatically converted to 32x32 pixels. Use the eraser tool to clean unwanted pixels.</i></p>
</details>

<details>
<summary><b>🎬 Gallery & GIF Search</b></summary>
<br/>
<img src="images/gallery-gif_screenshot.png" alt="Gallery and GIF" width="100%"/>
<p><i>Search for GIFs online or paste any image link to upload directly to your device.</i></p>
</details>

<details>
<summary><b>🛠️ Toolbox</b></summary>
<br/>
<img src="images/toolbox_screenshot.png" alt="Toolbox" width="100%"/>
<p><i>Send scrolling text, sync device time, or return to clock mode.</i></p>
</details>

---

## 🚀 Installation

### Quick Start (Recommended)

Start with one click using **iDotMatrix Manager**:

| Platform      | Command                        |
| ------------- | ------------------------------ |
| **Windows**   | Double-click `run_windows.bat` |
| **Mac/Linux** | Run `./run_mac.sh` in Terminal |

This tool automatically starts both Backend and Frontend servers and opens the browser.

### Manual Installation

<details>
<summary><b>🔧 Developer Setup</b></summary>

#### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Mac/Linux
# or for Windows: .\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser.

</details>

---

## 🏗️ Technologies

| Layer        | Technology                                      |
| ------------ | ----------------------------------------------- |
| **Frontend** | Next.js 16, React 19, TailwindCSS, Lucide Icons |
| **Backend**  | Python, FastAPI, SimplePyBLE                    |
| **Protocol** | Bluetooth Low Energy (BLE)                      |

---

## 🙏 Credits

This project was inspired by the reverse engineering work in **[8none1/idotmatrix](https://github.com/8none1/idotmatrix)**.

Original protocol notes: [docs/PROTOCOL_NOTES.md](docs/PROTOCOL_NOTES.md)

---

## 📄 License

[MIT](LICENSE) © 2026
