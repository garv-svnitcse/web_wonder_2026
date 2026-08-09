# 🦖 JurassiVerse — Prehistoric Mesozoic Experience & Research Hub

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-3D%20Viewer-000000?logo=three.js&logoColor=white)](https://threejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)

Welcome to **JurassiVerse**, a state-of-the-art, immersive prehistoric web application and research portal. Experience life millions of years ago through interactive 3D dinosaur visualization, chronological Mesozoic timelines, adaptive trivia quizzes with Gemini AI doubt clearing, and a peer-reviewed research dossier submission engine with admin email verification.

---

## 🌟 Key Features

### 🦕 1. Interactive Dinosaur Database & 3D Viewer
- **3D Model Inspection**: Render interactive 3D dinosaur models (`.glb`) with Three.js orbit controls, dynamic lighting, and custom canvas interactions.
- **Prehistoric Filter Engine**: Filter species by era (*Triassic, Jurassic, Cretaceous*), feeding diet (*Carnivore, Herbivore, Omnivore*), and threat level.
- **Physical Stats & Metrics**: Dynamic calculation and formatting of length (meters), weight (Tons / kg), speed (km/h), and discovery details.

### 📜 2. Mesozoic Era Timeline
- **Chronological Era Navigation**: Traverse through ancient geological periods with animated milestone cards and video backgrounds.
- **Direct Video Streaming**: Stream media assets with dynamic fallback handling (`/videos/trex.mp4`, `/videos/timeline.mp4`, `/videos/research.mp4`, `/videos/testimonial.mp4`).

### 🔬 3. Research Dossier Hub & Admin Verification
- **Research Paper Submission**: Researchers can submit scientific findings, abstracts, evidence documents, and profile details with Cloudinary file storage.
- **Automated Email Notifications**: Integrated with **Brevo** and **Resend** API fallback to send email notifications upon submission.
- **Themed Admin Action Cards**: One-click approval (`GET /research/approve/{title}`) and rejection (`GET /research/reject/{title}`) direct from email links. Admin actions render a glassmorphic `#08110B` dark-themed response page.
- **Direct Email Feedback**: Approval and rejection status emails are automatically routed directly to the researcher's inbox.

### 🧠 4. Adaptive Quiz Engine & JurassiVerse AI
- **Dynamic Difficulty**: Adaptive progression across *Easy*, *Medium*, and *Hard* levels using Random Forest Machine Learning prediction.
- **Randomized Questions & Options**: Every quiz attempt randomizes question sequence and options order to ensure freshness.
- **JurassiVerse AI Paleontologist**: Embedded **Gemini Flash AI** assistant to answer student and explorer doubts about quiz questions, choices, and paleontology concepts.
- **Explorer Leaderboard**: Real-time high-score ranking and performance analytics (*accuracy %, total attempts, average score*).

### 🎬 5. Cinema & Video Hub
- **Documentary Theatre**: Immersive video carousel featuring documentary trailers, sound effects, and full-screen cinema modals.

### 💬 6. Community Forum & Discussion Hub
- **Explorer Posts & Discussions**: Community threads where paleontology enthusiasts upvote, comment, and share research insights.

### 🔐 7. Auth Portal & 1-Hour Activity Session
- **Clerk SSO & Email Auth**: Seamless login and signup powered by `@clerk/clerk-react` and `clerk-backend-api` with 2FA/OTP support.
- **Sliding 1-Hour Activity Window**: Sessions extend by 1 hour on active user interaction (`mousemove`, `keydown`, `click`, `scroll`). Automatically logs out after 60 minutes of total inactivity.

### ⚡ 8. High-Performance Architecture
- **Bulk Batch Pre-Fetching**: Optimized database queries in MongoDB to eliminate N+1 latency, reducing research page API response times from **~4 seconds down to < 50ms**.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19, Vite 8, React Router DOM v7 |
| **Styling & UI Aesthetics** | Vanilla CSS, Framer Motion, GSAP, Lenis Kinetic Scroll, Lucide Icons, React Icons |
| **3D Rendering** | Three.js |
| **Authentication** | Clerk (`@clerk/clerk-react` + `clerk-backend-api`) |
| **Backend Framework** | Python 3.14+, FastAPI, Uvicorn |
| **Database** | MongoDB Atlas / Local MongoDB (PyMongo) |
| **AI Integration** | Google Gemini GenAI SDK (`gemini-flash-latest`) |
| **File Storage** | Cloudinary API |
| **Email Services** | Brevo API (Primary) & Resend API (Fallback) |

---

## 📁 Repository Structure

```bash
web_wonder_2026/
├── backend/
│   ├── core/
│   │   └── config.py            # Environment variables and CORS configuration
│   ├── db/
│   │   └── database.py          # PyMongo database connection
│   ├── dependencies/
│   │   └── auth.py              # Clerk authentication dependencies & user sync
│   ├── routes/
│   │   ├── admin.py             # Admin metrics endpoints
│   │   ├── auth.py              # User authentication & profile endpoints
│   │   ├── community_redit.py   # Community forum posts & comments
│   │   ├── contact.py           # Explorer feedback & contact email routing
│   │   ├── dinosaur.py          # Dinosaur catalogue & 3D model proxies
│   │   ├── quiz.py              # Adaptive quiz, ML scoring, & Gemini AI chat
│   │   ├── research.py          # Research papers, preview batching, approval HTML
│   │   └── timeline.py          # Mesozoic era preview & timeline data
│   ├── schemas/                 # Pydantic schemas for request validation
│   ├── services/
│   │   ├── cloudinary_service.py # Cloudinary file uploader
│   │   ├── email_service.py      # Brevo & Resend email dispatchers
│   │   └── quiz_ml.py            # Random Forest difficulty predictor
│   ├── main.py                  # FastAPI app entry point & middleware
│   └── requirements.txt         # Backend Python dependencies
│
└── frontends/
    └── my-app/
        ├── public/
        │   ├── models/          # 3D GLB dinosaur models
        │   └── videos/          # Local video background assets
        ├── src/
        │   ├── components/      # GlassAuthModal, Navbar, Footer, Hero, Expedition, etc.
        │   ├── config/          # API URL configuration
        │   ├── pages/           # Home, Dinosaur, Timeline, Cinema, Research, Quiz, Admin, Contact, About, Terms, Privacy
        │   ├── styles/          # Vanilla CSS design sheets
        │   ├── App.jsx          # React Router route registry
        │   └── main.jsx         # React root & Clerk provider setup
        ├── package.json         # Frontend npm dependencies
        └── vite.config.js       # Vite configuration
```

---

## ⚙️ Environment Configuration

### 1. Backend Configuration (`backend/.env`)
Create a `.env` file in the `backend/` directory:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=web_wonder
SECRET_KEY=your_super_secret_jwt_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Dispatchers
RESEND_API_KEY=re_your_resend_api_key
BREVO_API_KEY=xkeysib-your_brevo_api_key
RECEIVER_EMAIL=admin@jurassiverse.com

# AI & Clerk Authentication
GEMINI_API_KEY=AIzaSy_your_gemini_api_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
CLERK_JWT_KEY=your_clerk_jwt_key

# CORS Origins
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,https://web-wonder-2026.vercel.app
```

### 2. Frontend Configuration (`frontends/my-app/.env`)
Create a `.env` file in `frontends/my-app/`:

```env
VITE_API_URL=http://localhost:5001
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
```

---

## 🚀 Installation & Local Development

### Prerequisites
- **Node.js**: v20+
- **Python**: v3.10+
- **MongoDB**: Local MongoDB instance or MongoDB Atlas cluster

### Step 1: Start the Backend Server
```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI development server
python main.py
```
*The FastAPI backend will be live at `http://localhost:5001` (API Docs at `http://localhost:5001/docs`).*

### Step 2: Start the Frontend Application
```bash
cd frontends/my-app

# Install npm packages
npm install

# Run Vite dev server
npm run dev
```
*The web app will open at `http://localhost:5173`.*

---

## 📡 API Endpoint Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/dinosaurs/preview` | Preview top dinosaur cards |
| `GET` | `/dinosaurs` | Filter dinosaurs by search, era, diet, or threat |
| `GET` | `/dinosaurs/{slug}` | Get single dinosaur details & 3D model path |
| `GET` | `/timeline/preview` | Get summary timeline cards |
| `GET` | `/research/preview` | Bulk-batched research preview with filters |
| `POST` | `/research/upload` | Submit research paper & evidence files |
| `GET` | `/research/approve/{title}` | Approve research paper & return themed status card |
| `GET` | `/research/reject/{title}` | Reject research paper & return themed status card |
| `POST` | `/quiz/start` | Start randomized quiz attempt |
| `POST` | `/quiz/submit` | Submit quiz answers for ML level prediction |
| `POST` | `/quiz/ai_chat` | Ask doubts to Gemini AI Paleontologist |
| `POST` | `/contact/` | Submit explorer feedback form & send notification email |

---

## 📄 License
Distributed under the **MIT License**. See `LICENSE` for more information.