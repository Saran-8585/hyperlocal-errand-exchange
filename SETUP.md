# Hyperlocal Errand Exchange — Setup Guide

Detailed instructions for installing, configuring, and running the Hyperlocal Errand Exchange application.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Option 1: Manual Setup (Development)](#2-option-1-manual-setup-development)
3. [Option 2: Docker Setup (Production)](#3-option-2-docker-setup-production)
4. [Environment Variables](#4-environment-variables)
5. [Database Seeding](#5-database-seeding)
6. [Test Credentials](#6-test-credentials)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Prerequisites

| Requirement | Version | Verification Command |
|-------------|---------|---------------------|
| Node.js | 20.x or higher | `node --version` |
| npm | 9.x or higher | `npm --version` |
| MongoDB | 7.x | `mongod --version` or `docker --version` |
| Git | Latest | `git --version` |
| Docker (optional) | Latest | `docker --version` |
| Docker Compose (optional) | Latest | `docker compose version` |

---

## 2. Option 1: Manual Setup (Development)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd hyperlocal-errand-exchange
```

### Step 2: Backend — Install Dependencies

```bash
cd backend
npm install
```

This installs the following packages:
- express, cors — Web framework
- mongoose — MongoDB ODM
- bcryptjs — Password hashing
- jsonwebtoken — JWT authentication
- dotenv — Environment configuration
- express-async-errors — Async error handling

### Step 3: Configure Environment Variables

Create or edit `backend/.env`:

```env
PORT=5001
JWT_SECRET=hyperlocal_errand_jwt_secret_key_2024
MONGODB_URI=mongodb://localhost:27017/hyperlocal_errand
```

**Note:** The `.env` file comes pre-configured. If your MongoDB is running on a different host or port, update `MONGODB_URI` accordingly.

### Step 4: Start MongoDB

**Option A: Local MongoDB Installation**

```bash
mongod --dbpath /data/db
```

**Option B: Docker Container**

```bash
docker run -d -p 27017:27017 --name hyperlocal-mongo mongo:7
```

### Step 5: Seed the Database

```bash
npm run seed
```

Expected output:
```
Connected to MongoDB for seeding
  - 10 users
  - 20 errands
  - 8 reviews

Database seeded successfully!
Test credentials:
  akash@local.com / password123
  bhavana@local.com / password123
```

### Step 6: Start the Backend Server

```bash
npm run dev
```

The server starts on http://localhost:5001 (or the next available port if 5001 is in use).

### Step 7: Frontend — Install Dependencies

Open a **new terminal** and run:

```bash
cd frontend
npm install
```

This installs:
- react, react-dom — UI library
- react-router-dom — Client-side routing
- axios — HTTP client
- react-leaflet, leaflet — Map integration
- lucide-react — Icons
- tailwindcss, postcss, autoprefixer — Styling

### Step 8: Start the Frontend Dev Server

```bash
npm run dev
```

The app opens at http://localhost:5173

The Vite dev server proxies `/api` requests to `http://localhost:5001` automatically (configured in `vite.config.js`).

### Step 9: Verify

1. Open http://localhost:5173 in your browser
2. You should see the Browse page with seeded errands
3. Click "Create account" and register a new user
4. Browse errands, try filters, and toggle map view

---

## 3. Option 2: Docker Setup (Production)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd hyperlocal-errand-exchange
```

### Step 2: Build and Start All Services

```bash
docker compose up -d
```

This command:
1. Pulls the `mongo:7` image from Docker Hub
2. Builds the backend image from `backend/Dockerfile`
3. Builds the frontend image from `frontend/Dockerfile`
4. Creates a Docker network for inter-service communication
5. Starts all three containers in detached mode

### Step 3: Verify Containers Are Running

```bash
docker compose ps
```

Expected output:
```
NAME                    IMAGE                  STATUS
hyperlocal-mongodb      mongo:7                Up (healthy)
hyperlocal-backend      hyperlocal-backend      Up
hyperlocal-frontend     hyperlocal-frontend     Up
```

### Step 4: Seed the Database

```bash
docker exec -it hyperlocal-backend npm run seed
```

### Step 5: Access the Application

Open http://localhost in your browser.

The Nginx reverse proxy serves the frontend React app and forwards `/api` requests to the backend.

### Step 6: View Logs (Optional)

```bash
docker compose logs -f
```

### Step 7: Stop All Services

```bash
docker compose down
```

To also remove the MongoDB data volume:
```bash
docker compose down -v
```

### Docker Architecture

```
                    +------------------+
                    |  Frontend        |
Browser ───────────>|  Nginx :80       |
                    |  serves /dist    |
                    +--------+---------+
                             |
                     /api/* requests
                             |
                    +--------v---------+
                    |  Backend         |
                    |  Node.js :5001   |
                    +--------+---------+
                             |
                    MongoDB connection
                             |
                    +--------v---------+
                    |  MongoDB :27017  |
                    |  (mongo:7)       |
                    +------------------+
```

---

## 4. Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5001` | Backend server port |
| `JWT_SECRET` | `hyperlocal_errand_jwt_secret_key_2024` | Secret key for signing JWT tokens (change in production) |
| `MONGODB_URI` | `mongodb://localhost:27017/hyperlocal_errand` | MongoDB connection string |

### .env File Location

The `.env` file must be at `backend/.env` (not the project root). This is already configured in the repository.

---

## 5. Database Seeding

### What the Seed Script Creates

| Entity | Count | Details |
|--------|-------|---------|
| Users | 10 | One in each Coimbatore neighbourhood |
| Errands | 20 | Various categories, statuses, and locations |
| Reviews | 8 | Ratings on Completed and Claimed errands |

### Running the Seed Script

```bash
# From the backend directory
npm run seed
```

The seed script:
1. Connects to MongoDB using `MONGODB_URI`
2. Clears all existing data (users, errands, reviews)
3. Inserts fresh sample data
4. Displays success message with test credentials

### Re-seeding

Re-run the script anytime to reset the database:
```bash
npm run seed
```

**Warning:** This deletes all existing data before inserting sample data.

---

## 6. Test Credentials

| Email | Password | Name | Neighbourhood |
|-------|----------|------|---------------|
| akash@local.com | password123 | Akash Kumar | Kuniyamuthur |
| bhavana@local.com | password123 | Bhavana R | Sugunapuram |
| charu@local.com | password123 | Charu Devi | Vadavalli |
| dinesh@local.com | password123 | Dinesh S | Kovaipudur |
| esha@local.com | password123 | Esha Mahesh | Saibaba Colony |
| gowtham@local.com | password123 | Gowtham K | Gandhipuram |
| harini@local.com | password123 | Harini V | R.S. Puram |
| irfan@local.com | password123 | Irfan M | Peelamedu |
| janani@local.com | password123 | Janani S | Singanallur |
| karthik@local.com | password123 | Karthik R | Ganapathy |

---

## 7. Troubleshooting

### Issue: MongoDB Connection Refused

**Error:** `MongoDB connection error: connect ECONNREFUSED 127.0.0.1:27017`

**Solutions:**
1. Ensure MongoDB is running: `docker ps` or `systemctl status mongod`
2. Start MongoDB: `docker start hyperlocal-mongo` or `mongod --dbpath /data/db`
3. Check if another port is being used — update `.env` if needed

### Issue: Port Already in Use

**Error:** `Port 5001 is in use, trying 5002...`

**Solutions:**
1. Kill the existing process: `lsof -i :5001` then `kill -9 <PID>`
2. Change the port in `backend/.env`
3. The app auto-increments the port if the specified one is in use

### Issue: Frontend Cannot Reach Backend

**Symptoms:** API calls fail, maps show no markers, login/register don't work

**Solutions:**
1. Ensure backend is running on port 5001
2. Check that the Vite proxy is configured in `frontend/vite.config.js`
3. If using Docker, check `docker compose logs backend`
4. Ensure CORS is not blocking — the backend uses `cors()` middleware

### Issue: Seed Script Fails

**Error:** Various validation errors or connection errors

**Solutions:**
1. Ensure MongoDB is running and accessible
2. Check `MONGODB_URI` in `.env`
3. Run `npm install` again to ensure dependencies are installed
4. Check console output for specific error details

### Issue: Docker Build Fails

**Error:** Various during `docker compose up -d`

**Solutions:**
1. Ensure Docker Desktop or Docker Engine is running
2. `docker compose down` then `docker compose up -d --build` to force rebuild
3. Check disk space: `df -h`
4. Ensure ports 80, 5001, and 27017 are not in use

### Issue: Map Tiles Not Loading

**Symptoms:** Map shows grey background instead of OpenStreetMap tiles

**Solutions:**
1. Check internet connectivity — tiles are loaded from OpenStreetMap servers
2. Some networks block tile.openstreetmap.org — try a different network
3. The map will function offline but without visible tiles (markers still work)

---

## File Structure (Relevant Paths)

```
hyperlocal-errand-exchange/
├── docker-compose.yml            # Docker multi-container orchestration
├── SETUP.md                      # This file
├── README.md                     # Project documentation
├── backend/
│   ├── .env                      # Environment variables
│   ├── Dockerfile                # Backend Docker image
│   ├── .dockerignore             # Docker build exclusions
│   ├── package.json              # Dependencies and scripts
│   ├── index.js                  # Express server entry point
│   ├── db/
│   │   ├── database.js           # MongoDB connection
│   │   └── seed.js               # Database seeder
│   ├── models/
│   │   ├── User.js               # Mongoose user schema
│   │   ├── Errand.js             # Mongoose errand schema
│   │   └── Review.js             # Mongoose review schema
│   ├── controllers/              # Business logic (5 files)
│   ├── routes/                   # Route definitions (5 files)
│   └── middleware/
│       └── auth.js               # JWT authentication guard
└── frontend/
    ├── Dockerfile                # Frontend Docker image (multi-stage)
    ├── nginx.conf                # Nginx production config
    ├── .dockerignore             # Docker build exclusions
    ├── package.json              # Dependencies and scripts
    ├── vite.config.js            # Vite dev server + proxy config
    └── src/
        ├── main.jsx              # React entry point
        ├── App.jsx               # Root component with routes
        ├── context/
        │   └── AuthContext.jsx   # Authentication state
        ├── components/           # Reusable components (7 files)
        ├── pages/                # Page components (7 files)
        └── utils/
            └── axios.js          # Axios instance with JWT interceptor
```
