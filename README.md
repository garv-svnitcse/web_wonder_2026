# 🦖 Jurassic Journey

Welcome to **Jurassic Journey**, a premium, interactive, and immersive prehistoric expedition web application. This project features a state-of-the-art 3D dinosaur viewer, a searchable prehistoric research database, interactive quizzes with leaderboards, and an elegant, glassmorphic UI styled with smooth scroll effects and premium micro-animations.

---

## 🌟 Key Features

### 💻 Frontend (Vite + React)
- **Interactive 3D Viewer**: Immersive 3D model visualization using Three.js and custom canvas controls to explore dinosaurs from every angle.
- **Search & Filter Research Database**: Explore prehistoric giants with a robust search engine, filtering by era (Triassic, Jurassic, Cretaceous), diet (Herbivore, Carnivore), and danger level.
- **Dinosaur Trivia Quiz**: Test your Mesozoic knowledge! Features dynamic difficulty levels (Easy, Medium, Hard), real-time answer checking, score tracking, and a global leaderboard.
- **Interactive Timeline**: Travel back in time and browse chronological events from different prehistoric eras.
- **Premium Custom UI & Scroll Behavior**:
  - **Auto-Hiding Navbar**: Slides smoothly out of the screen (to the right) on scroll to maximize readability, and re-appears when you scroll to the top.
  - **Floating Menu Trigger**: A sleek, glassmorphic floating menu button appears when the navbar is hidden, allowing users to restore it with a single click in the middle of a page.
  - **Responsive Layout**: Fluid UI scaling down perfectly for mobile, tablet, and widescreen viewports without layout shift or overlapping.
  - **High-Contrast Badges**: Redesigned glassmorphic badges with opaque backdrops and gold/accent borders for maximum text readability over bright background images.

### ⚙️ Backend (FastAPI + MongoDB)
- **RESTful API**: Fast and modular endpoints managed using FastAPI.
- **Authentication**: JWT token-based secure user authentication (login/register) and password hashing with Argon2.
- **Database Seeding & Fallbacks**: Connected to MongoDB to fetch real-time dinosaur profiles, quiz metrics, and timelines, with robust offline mock fallbacks to prevent crashes.
- **Contact Forms & Mailers**: Custom routes to receive contact requests with integration options for Resend email notifications.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React (v19), Vite, TailwindCSS, Framer Motion, GSAP, Lenis Smooth Scroll, Three.js, React Icons, React Router DOM |
| **Backend** | Python (v3.14+), FastAPI, Uvicorn, MongoDB (PyMongo), Pydantic, Passlib (Argon2), Python-Jose, Dotenv |
| **Database** | MongoDB (Local / Atlas) |

---

## 📁 Repository Structure

```bash
web_wonder_2026/
├── backend/
│   ├── core/           # Configuration, security, and token helper settings
│   ├── db/             # MongoDB database connection instance
│   ├── routes/         # API Routers (auth, timeline, research, quiz, dinosaur, contact)
│   ├── schemas/        # Pydantic data schemas for request validation
│   ├── main.py         # App entrypoint (initializes FastAPI and CORS middleware)
│   ├── .env.example    # Template for environment configurations
│   ├── .env            # Local secrets and database URI config (Git ignored)
│   └── requirements.txt# Backend Python dependencies
└── frontends/
    └── my-app/
        ├── public/     # Static assets and media files
        ├── src/
        │   ├── assets/     # High-res dinosaur images
        │   ├── components/ # Reusable UI components (Navbar, Expedition, Featured, Hero)
        │   ├── pages/      # Route pages (Home, Dinosaur Details, ResearchDatabase, Quiz, 3D Viewer)
        │   ├── styles/     # Page-specific CSS sheets
        │   ├── index.css   # Main CSS design system
        │   └── main.jsx    # React rendering root
        ├── package.json    # Frontend npm packages
        └── vite.config.js  # Vite server configurations
```

---

## 🚀 Installation & Local Setup

Make sure you have **Node.js (v20+)**, **npm**, **Python (3.10+)**, and **MongoDB** installed on your system.

### 1. Database Setup
Ensure MongoDB is running locally on your machine on port `27017`.
- **macOS (using Homebrew)**:
  ```bash
  brew services start mongodb-community
  ```
- **Checking Connection**:
  ```bash
  nc -zv localhost 27017
  ```

### 2. Backend Installation & Execution
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```
4. Create your `.env` configuration file:
   Create a file named `.env` in the `backend/` root directory and add the following:
   ```env
   MONGO_URI=mongodb://localhost:27017
   DATABASE_NAME=web_wonder
   SECRET_KEY=your_generated_jwt_secret_key_here
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=60
   ```
5. Run the FastAPI development server:
   ```bash
   uvicorn main:app --host 127.0.0.1 --port 5000
   ```
   The backend documentation will be accessible at [http://127.0.0.1:5000/docs](http://127.0.0.1:5000/docs).

### 3. Frontend Installation & Execution
1. Navigate to the frontend directory:
   ```bash
   cd frontends/my-app
   ```
2. Install npm packages (use `--legacy-peer-deps` due to React 19 package warnings):
   ```bash
   npm install --legacy-peer-deps
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to **[http://localhost:3000](http://localhost:3000)**.

---

## 🎨 UI Best Practices & Custom Tweaks

- **Visual Consistency**: Cards are dynamically aligned using fixed-height boundaries for titles, scientific names, and description boxes, preventing visual staggering in the grids.
- **Contrast Overlays**: Important tags like dinosaur periods and feeding diets use blurred opaque containers behind text to maintain AAA-level accessibility over dynamic image backgrounds.
- **Scroll Physics**: Smooth kinetic scroll is integrated using Lenis scroll to provide a luxurious scrolling experience.