# iDotMatrix Web Kontrol

Bu proje, iDotMatrix 32x32 LED ekranı için geliştirilmiş modern bir web arayüzüdür. Bluetooth üzerinden cihazla iletişim kurarak görsel, GIF ve animasyon yüklemenizi sağlar.

![App Screenshot](frontend/public/screenshot-placeholder.png)

## Özellikler
- **Web Arayüzü**: Next.js ile geliştirilmiş şık ve kullanıcı dostu arayüz.
- **GIF Desteği**: Animasyonlu GIF dosyalarını otomatik optimize ederek oynatır.
- **Hazır Galeri**: Popüler pikselleri tek tıkla yükleyin.
- **URL Yükleme**: İnternetten herhangi bir görsel linki ile yükleme yapın.
- **Python Backend**: Güçlü ve genişletilebilir FastAPI altyapısı.

## Kurulum

### Backend
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Teşekkür ve Atıf (Credits)

Bu proje, **[8none1/idotmatrix](https://github.com/8none1/idotmatrix)** deposundaki tersine mühendislik (reverse engineering) çalışmalarından ve protokol analizlerinden ilham alınarak geliştirilmiştir. Orijinal Bluetooth iletişim mantığı ve protokol analizleri için **8none1**'e teşekkür ederiz.

Orijinal protokol notları için: [docs/PROTOCOL_NOTES.md](docs/PROTOCOL_NOTES.md)

## Lisans
[MIT](LICENSE)
