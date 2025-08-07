
# 🗨️ Chat App Backend API

Backend untuk aplikasi chat real-time menggunakan **Node.js**, **Express**, **MongoDB**, dan **Socket.IO**. API ini mendukung fitur login/register, autentikasi JWT, pembuatan ruang obrolan (chat), pengiriman pesan, dan komunikasi real-time menggunakan WebSocket.

---

## 🚀 Tech Stack

- **Bahasa**: JavaScript (ESM)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose ODM
- **Realtime**: Socket.IO
- **Autentikasi**: JWT (JSON Web Token)
- **Environment Management**: dotenv
- **Logger**: morgan
- **CORS**: cors middleware

---

## 📁 Struktur Direktori

```
chat-backend/
│
├── controllers/       # Handler untuk API (chat, user, message)
├── middlewares/       # Auth JWT, error handler
├── models/            # Skema Mongoose (User, Chat, Message)
├── routes/            # Definisi API endpoint
├── sockets/           # Konfigurasi dan event Socket.IO
├── utils/             # Utility helper (token, response handler)
├── .env               # Konfigurasi environment (tidak dipush)
├── app.js             # Setup Express + Socket.IO
├── server.js          # Entry point
└── package.json
```

---

## ⚙️ Instalasi

### 1. Clone repo ini
```bash
git clone https://github.com/username/chat-backend.git
cd chat-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Konfigurasi environment

Buat file `.env` di root, contoh isinya:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=your_jwt_secret
```

> Gantilah `MONGODB_URI` dan `JWT_SECRET` sesuai kebutuhan kamu.

---

## ▶️ Menjalankan Server

### Mode development
```bash
npm run dev
```

> Server berjalan di `http://localhost:5000`

---

## 📡 Endpoint Utama

| METHOD | URL | Keterangan |
|--------|-----|------------|
| POST   | /api/auth/register | Register user |
| POST   | /api/auth/login    | Login user (dapatkan token) |
| GET    | /api/chats         | Ambil semua chat milik user |
| POST   | /api/chats         | Buat chat baru |
| POST   | /api/messages/:chatId | Kirim pesan |
| GET    | /api/messages/:chatId | Ambil pesan dari chat tertentu |
| PUT    | /api/messages/:messageId | Edit pesan |
| DELETE | /api/messages/:messageId | Hapus pesan |

> Semua route (kecuali login/register) butuh **Bearer Token** di header.

---

## 🔌 Realtime dengan Socket.IO

- Connect ke server dengan token:
```js
const socket = io("http://localhost:5000", {
  auth: {
    token: "JWT_TOKEN"
  }
});
```

- Bergabung ke ruang chat:
```js
socket.emit('joinChat', chatId);
```

- Kirim pesan:
```js
socket.emit('sendMessage', {
  chatId,
  content: 'Halo!'
});
```

- Terima pesan:
```js
socket.on('messageReceived', (message) => {
  console.log('New Message:', message);
});
```

---

## 📦 Scripts

| Perintah | Fungsi |
|----------|--------|
| `npm run dev` | Jalankan server dengan nodemon |
| `npm start`   | Jalankan server production |

---

## 🧪 Tools Disarankan

- **Postman** untuk uji REST API
- **MongoDB Compass** untuk cek database
- **Socket.IO Client / Frontend App** untuk uji realtime

---

## 🔒 Catatan Keamanan

- Jangan push file `.env` ke repo publik
- Gunakan `JWT_SECRET` yang kuat
- Validasi dan sanitize setiap input user

---

## 📜 Lisensi

MIT License – bebas digunakan, dikembangkan, dan dimodifikasi

---

## 🙋‍♂️ Kontribusi

Pull Request terbuka! Silakan fork repo ini dan kirim perubahan kamu ✨
