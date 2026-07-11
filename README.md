# Jurassic Journey - Integration & Setup Guide

Welcome to the **`integration-dev`** branch of **Jurassic Journey**. This guide will walk you through setting up the workspace, installing dependencies, launching the development servers, and verifying the backend-to-frontend integration.

---

## 🛠 Prerequisites
* **Python 3.9+** and `pip`
* **Node.js 18+** and `npm`
* A running **MongoDB** instance (local or Atlas cluster) containing the `dinosaur_collection` document setup.

---

## 🔑 1. Environment & Database Configuration
Create a `.env` file inside the `backend/` directory:
```bash
touch backend/.env
```
Add your connection credentials:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/
DATABASE_NAME=JurrasiVerse
```

---

## 🐍 2. Backend Server Setup
The backend is powered by FastAPI and communicates directly with MongoDB.

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```
2. **Install Python dependencies**:
   ```bash
   python3 -m pip install -r requirements.txt
   ```
3. **Launch the FastAPI application**:
   ```bash
   python3 -m uvicorn main:app --reload --port 8000
   ```
   * *The server will start at **[http://localhost:8000](http://localhost:8000)**.*
   * *Swagger documentation is available at **[http://localhost:8000/docs](http://localhost:8000/docs)**.*

---

## ⚡ 3. Frontend App Setup
The frontend is a React application built with Vite and Tailwind CSS.

1. **Navigate to the frontend directory**:
   ```bash
   cd frontends/my-app
   ```
2. **Install Node modules**:
   ```bash
   npm install
   ```
3. **Start the Vite development server**:
   ```bash
   npm run dev -- --port 3000
   ```
   * *The React application will be available at **[http://localhost:3000](http://localhost:3000)**.*

---

## 🦖 4. Verifying the Integration
Once both servers are running, follow these steps to confirm the database integration works correctly:

### Test the Endpoint
Run a request against the preview endpoint to confirm the backend flat-maps nested MongoDB fields correctly:
```bash
curl http://localhost:8000/timeline/preview
```
**Expected Response (JSON)**:
```json
[
  {
    "name": "TYRANNOSAURUS REX",
    "era": "Late Cretaceous",
    "image": "https://example.com/images/trex.jpg",
    "length": "12.3 m",
    "weight": "8.4 Tons",
    "speed": "27 km/h",
    "diet": "Carnivore",
    "slug": "tyrannosaurus-rex"
  }
]
```

### Check the Homepage UI
1. Open **[http://localhost:3000/](http://localhost:3000/)** in your browser.
2. Scroll to the **"Meet The Giants" (Featured)** section.
3. Confirm that the cards render the specimens loaded from your MongoDB collection (e.g., *Tyrannosaurus Rex*, *Triceratops*, *Velociraptor*) and display dynamic physical statistics (Length, Weight, Speed, Diet) mapped from `physical_stats`.