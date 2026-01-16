<div align="center">

[![TR](https://img.shields.io/badge/lang-TR-red.svg)](README.md)
[![EN](https://img.shields.io/badge/lang-EN-blue.svg)](README_EN.md)

# 🎮 iDotMatrix Web Control

### Bluetooth LED Ekranınızı Web'den Kontrol Edin

**iDotMatrix 32x32 LED ekranınız için modern, kullanıcı dostu web arayüzü.**

</div>

---

## 🌟 Proje Hakkında

iDotMatrix Web Control, popüler iDotMatrix 32x32 piksel LED ekranları kontrol etmek için geliştirilmiş açık kaynaklı bir web uygulamasıdır.

Bluetooth bağlantısı üzerinden çalışan bu uygulama ile:

- **Kendi görsellerinizi** yükleyebilir ve düzenleyebilirsiniz
- **İnternetten GIF** arayabilir ve tek tıkla gönderebilirsiniz
- **Piksel sanatı** çizebilir veya emojileri piksele dönüştürebilirsiniz
- **Kayan yazı** gönderebilir ve saat ayarlarını yönetebilirsiniz

Python backend ve Next.js frontend ile modern bir mimari kullanır. Hem Windows hem de Mac/Linux sistemlerinde çalışır.

---

<div align="center">
  <img src="images/creative_studio.jpg" alt="Creative Studio" width="45%"/>
  &nbsp;&nbsp;
  <img src="images/upload_image.jpg" alt="Upload Image" width="45%"/>
  <br/>
  <sub><i>Yaratıcı Stüdyo ile çizim yapın • Kendi görsellerinizi yükleyin</i></sub>
</div>

---

## ✨ Özellikler

| Özellik                  | Açıklama                                                       |
| ------------------------ | -------------------------------------------------------------- |
| 🔗 **Kolay Bağlantı**    | Bluetooth cihazınızı tek tıkla tarayın ve bağlanın             |
| 🖼️ **Görsel Yükleme**    | Kendi resimlerinizi yükleyin, düzenleyin ve gönderin           |
| 🎬 **GIF Desteği**       | Animasyonlu GIF'leri internetten arayın veya link ile yükleyin |
| 🎨 **Piksel Editörü**    | 32x32 piksel sanatı çizin ve anında cihaza gönderin            |
| 😊 **Emoji Dönüştürücü** | Emojileri piksel sanatına çevirin                              |
| 📝 **Kayan Yazı**        | Özel metinlerinizi ekrana akıtın                               |
| ⏰ **Saat Ayarları**     | Cihaz saatini senkronize edin                                  |
| 🌍 **Çoklu Dil**         | Türkçe ve İngilizce arayüz desteği                             |

---

## 📸 Ekran Görüntüleri

|              🔌 Cihaz Bağlantısı              |               📤 Görsel Yükleme                |
| :-------------------------------------------: | :--------------------------------------------: |
| ![Bağlantı](images/connection_screenshot.png) | ![Yükleme](images/upload_image_screenshot.png) |
|    Bluetooth cihazları tarayın ve bağlanın    |     Görsellerinizi yükleyin ve düzenleyin      |

|               🎬 Galeri & GIF                |              🛠️ Araç Kutusu               |
| :------------------------------------------: | :---------------------------------------: |
| ![Galeri](images/gallery-gif_screenshot.png) | ![Araçlar](images/toolbox_screenshot.png) |
|  İnternette GIF arayın veya link yapıştırın  |        Kayan yazı ve saat ayarları        |

---

## 🚀 Kurulum

### Hızlı Başlat (Önerilen)

**iDotMatrix Manager** aracı ile tek tıkla başlatın:

| Platform      | Komut                                          |
| ------------- | ---------------------------------------------- |
| **Windows**   | `run_windows.bat` dosyasına çift tıklayın      |
| **Mac/Linux** | Terminal'de `./run_mac.sh` komutunu çalıştırın |

Bu araç hem Backend hem Frontend sunucularını otomatik açar ve tarayıcıyı başlatır.

### Manuel Kurulum

<details>
<summary><b>🔧 Geliştirici Kurulumu</b></summary>

#### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Mac/Linux
# veya Windows için: .\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

Ardından tarayıcınızda `http://localhost:3000` adresini açın.

</details>

---

## 🏗️ Teknolojiler

| Katman       | Teknoloji                                       |
| ------------ | ----------------------------------------------- |
| **Frontend** | Next.js 16, React 19, TailwindCSS, Lucide Icons |
| **Backend**  | Python, FastAPI, SimplePyBLE                    |
| **Protokol** | Bluetooth Low Energy (BLE)                      |

---

## 🙏 Teşekkürler

Bu proje, **[8none1/idotmatrix](https://github.com/8none1/idotmatrix)** deposundaki tersine mühendislik çalışmalarından ilham alınarak geliştirilmiştir.

Orijinal protokol notları: [docs/PROTOCOL_NOTES.md](docs/PROTOCOL_NOTES.md)

---

## 📄 Lisans

[MIT](LICENSE) © 2026
