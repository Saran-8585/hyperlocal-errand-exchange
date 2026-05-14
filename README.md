# Hyperlocal Errand Exchange

A community platform where users post small errands they need done and nearby locals claim them for a small fee or favour.

## Tech Stack

- **Frontend:** React.js (Vite), React Router v6, Tailwind CSS
- **Backend:** Node.js + Express.js (REST API)
- **Database:** SQLite via `better-sqlite3`
- **Auth:** JWT (JSON Web Tokens)
- **Maps:** Leaflet.js + React Leaflet
- **Icons:** Lucide React

## Setup

### 1. Install backend dependencies
```bash
cd backend
npm install
```

### 2. Seed the database
```bash
npm run seed
```

### 3. Start the backend server
```bash
npm run dev
```

### 4. Install frontend dependencies (new terminal)
```bash
cd frontend
npm install
```

### 5. Start the frontend dev server
```bash
npm run dev
```

The app will be available at **http://localhost:5173**

## Test Credentials

- alice@local.com / password123
- bob@local.com / password123

## Features

- Browse errands with filters and map view
- Post errands with draggable map pin
- Claim, complete, and cancel errands
- Dashboard with stats and management tables
- Profile pages with reviews and ratings
- Real-time deadline countdowns
- Toast notifications for all actions
