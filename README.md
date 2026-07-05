# 🚀 TransferHub

**TransferHub** is a fast, secure, browser-based peer-to-peer file sharing platform that enables seamless file transfers between mobile and desktop devices. It uses **WebRTC** for direct device-to-device data channels and **Socket.IO** for real-time signaling and device pairing.

![TransferHub Demo](./client/public/favicon.svg) <!-- Replace with demo GIF later -->

---

## ✨ Features

- **⚡ Fast Peer-to-Peer:** Data travels directly between devices, ensuring maximum speed.
- **📱 Cross-Platform:** Works on Windows, macOS, Linux, Android, iOS across modern browsers.
- **📷 QR & 6-Digit Pairing:** Easy and secure device pairing.
- **📂 File & Folder Sharing:** Drag & drop multiple files or entire folders instantly.
- **📋 Clipboard Sync:** Send text/clipboard contents between devices seamlessly.
- **📊 Real-time Metrics:** View transfer progress, ETA, and speed.
- **⏸️ Transfer Controls:** Pause, resume, cancel, or retry active transfers.
- **🔒 Secure & Private:** Files are never stored on the server. Data channels are encrypted via WebRTC standard DTLS/SRTP.
- **🛡️ Production Ready:** Includes rate-limiting, error boundaries, reconnection logic, offline detection, and ICE restarts.

---

## 🛠️ Architecture & Tech Stack

### Frontend (Client)
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4 + Lucide Icons
- **State/Routing:** Context API, React Router v7
- **Features:** Lazy loading, Code splitting, Global Error Boundaries
- **Testing:** Vitest, React Testing Library

### Backend (Server)
- **Runtime:** Node.js + Express.js
- **Signaling:** Socket.IO v4
- **Security:** Helmet, Express-Rate-Limit, CORS
- **Testing:** Jest, Supertest

### Real-Time Communication
- **Protocol:** WebRTC (DataChannels)
- **NAT Traversal:** Public Google STUN servers (configurable TURN support)

---

## 📁 Project Structure

```
TransferHub/
│
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── components/     # UI Components (TransferCard, Sidebar, etc.)
│   │   ├── contexts/       # WebRTC, Socket, Toast, and Theme Contexts
│   │   ├── layouts/        # Dashboard Layout
│   │   ├── pages/          # Transfer, Clipboard, History, Settings, 404
│   │   └── index.css       # Global styles (Tailwind)
│   └── vite.config.js      # Vite build & test configuration
│
├── server/                 # Backend Node.js Application
│   ├── config/             # CORS and environment configurations
│   ├── middleware/         # Error handling and Rate Limiters
│   ├── routes/             # API routes (health checks)
│   ├── socket/             # Socket.IO signaling, validation, and pairing registry
│   └── index.js            # Server entry point & graceful shutdown
│
└── .github/                # GitHub Actions and Issue/PR templates
```

---

## ⚙️ Installation & Local Development

### 1. Clone the repository
```bash
git clone https://github.com/Amansharmacs1/TransferHub.git
cd TransferHub
```

### 2. Setup Backend
```bash
cd server
npm install
npm run dev
```
The server will run on `http://localhost:5000`.

### 3. Setup Frontend
```bash
cd ../client
npm install
npm run dev
```
The client will run on `http://localhost:5173`.

---

## 🌍 Environment Variables

You can configure the backend and frontend using `.env` files.

### Server (`server/.env`)
```env
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.com
```

### Client (`client/.env`)
```env
VITE_SERVER_URL=https://your-backend-domain.com
VITE_TURN_URL=turn:your-turn-server.com:3478
VITE_TURN_USERNAME=your-username
VITE_TURN_CREDENTIAL=your-credential
```
*Note: TURN servers are optional but highly recommended for connections behind strict corporate firewalls or symmetric NATs.*

---

## 🚀 Deployment Guide

### Frontend Deployment (Vercel / Netlify)
1. Push the repository to GitHub.
2. Import the project into Vercel.
3. Set the Root Directory to `client`.
4. Add the `VITE_SERVER_URL` environment variable.
5. Deploy.

### Backend Deployment (Railway / Render)
1. Import the repository into Railway or Render.
2. Set the Root Directory to `server`.
3. Set Start Command to `npm start`.
4. Add Environment Variables (`CLIENT_URL`, `NODE_ENV=production`).
5. Deploy.

---

## 🧪 Testing

Run automated tests for both environments:

**Backend Tests (Jest):**
```bash
cd server
npm test
```

**Frontend Tests (Vitest):**
```bash
cd client
npm test
```

---

## 🤝 Contributing

Contributions, bug reports, and feature requests are always welcome! 
Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
