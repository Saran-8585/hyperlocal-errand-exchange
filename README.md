# HYPERLOCAL ERRAND EXCHANGE

### A Community-Driven Peer-to-Peer Errand Platform

---

**Submitted in partial fulfillment of the requirements for the degree of**

**Bachelor of Technology**

---

**Academic Year 2025–2026**

---

## ABSTRACT

Hyperlocal Errand Exchange is a community-driven web application that connects people within a neighbourhood who need small tasks completed with nearby individuals willing to perform them for a monetary reward or favour. The platform focuses specifically on the Coimbatore region, with Sri Krishna Arts and Science College (SKASC) at its geographic centre. Users can post errands such as grocery runs, parcel deliveries, pet care, home help, and tech assistance. Other users can browse available errands on an interactive map, claim tasks, complete them, and earn ratings through a peer review system. The application features real-time deadline tracking, JWT-based authentication, a responsive dashboard, and interactive map integration using Leaflet.js. Built with a modern JavaScript stack — React on the frontend and Node.js/Express with MongoDB on the backend — the system is fully containerised using Docker for consistent deployment across environments.

---

## TABLE OF CONTENTS

| Section | Title |
|---------|-------|
| 1 | Introduction |
| 2 | Technology Stack |
| 3 | System Architecture |
| 4 | Module Description |
| 5 | Database Design |
| 6 | API Reference |
| 7 | Installation & Setup |
| 8 | Usage Guide |
| 9 | Testing |
| 10 | Future Enhancements |
| 11 | Conclusion |
| 12 | References |

---

## 1. INTRODUCTION

### 1.1 Project Overview

Hyperlocal Errand Exchange is a full-stack web application designed to facilitate community-based task outsourcing within a local geographic area. The platform enables users to publish small errands they need completed and allows other users in the same locality to accept and complete those errands. The system creates a micro-tasking economy at the neighbourhood level, fostering community interaction and mutual assistance.

### 1.2 Problem Statement

In urban environments, residents often face time constraints that prevent them from completing small but essential daily tasks — picking up groceries, dropping off parcels, walking pets, or assembling furniture. Existing solutions either rely on professional service providers (which are expensive) or informal social networks (which lack structure and accountability). There is a need for a dedicated platform that:

- Connects requesters with nearby helpers
- Provides structured task listing with deadlines and rewards
- Offers accountability through ratings and reviews
- Visualises tasks geographically for convenience
- Keeps all interactions within a hyperlocal context

### 1.3 Objectives

1. Develop a responsive web application for posting and claiming errands
2. Implement user authentication and profile management
3. Provide an interactive map interface for geographic task discovery
4. Create a dashboard for tracking posted and claimed errands
5. Implement a rating and review system for quality assurance
6. Containerise the application for portability and easy deployment
7. Use MongoDB for scalable, document-oriented data storage

### 1.4 Scope & Limitations

**In Scope:**
- User registration, login, and profile management
- Errand CRUD operations (post, browse, claim, complete, cancel)
- Interactive map integration with Leaflet.js
- Filtering by category, urgency, area, reward, and search keywords
- Dashboard with statistics (posted, claimed, completed, earnings)
- Peer review system with 1–5 star ratings
- Docker containerisation for consistent deployment
- Location data centred around Coimbatore, Tamil Nadu

**Out of Scope (Planned for future):**
- Real-time payment gateway integration
- In-app chat between users
- Push notifications
- SMS/email verification
- Mobile application (native)

---

## 2. TECHNOLOGY STACK

### 2.1 Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React.js | 18.3.1 | UI component library |
| Vite | 5.4 | Build tool and dev server |
| React Router | 6.25 | Client-side routing |
| Tailwind CSS | 3.4 | Utility-first styling |
| Leaflet.js | 1.9 | Interactive maps |
| React-Leaflet | 4.2 | React bindings for Leaflet |
| Axios | 1.7 | HTTP client |
| Lucide React | 0.400 | Icon library |

**Rationale:** React was chosen for its component-based architecture, extensive ecosystem, and performance. Vite provides fast hot-module replacement during development and optimised production builds. Tailwind CSS enables rapid, responsive UI development without writing custom CSS. Leaflet is lightweight, open-source, and well-suited for map visualisation without requiring API keys.

### 2.2 Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20 LTS | JavaScript runtime |
| Express.js | 4.21 | Web framework and REST API |
| Mongoose | 9.x | MongoDB ODM |
| JSON Web Token | 9.0 | Authentication tokens |
| bcryptjs | 2.4 | Password hashing |
| cors | 2.8 | Cross-origin resource sharing |
| dotenv | 16.4 | Environment configuration |

**Rationale:** Node.js with Express provides a lightweight, non-blocking I/O server ideal for REST APIs. Mongoose offers a clean abstraction over MongoDB with schema validation, population (JOIN-like references), and middleware support. JWT enables stateless authentication suitable for API consumption by frontend clients.

### 2.3 Database

| Technology | Version | Purpose |
|------------|---------|---------|
| MongoDB | 7 | Document-oriented NoSQL database |

**Rationale:** MongoDB's flexible document model maps naturally to the application's data structures (users, errands, reviews). Embedded subdocuments and references via ObjectId allow efficient queries. The schema-less design enables rapid iteration during development. MongoDB's aggregation pipeline simplifies analytics queries such as average ratings and earnings totals.

### 2.4 Deployment

| Technology | Purpose |
|------------|---------|
| Docker | Containerisation platform |
| Docker Compose | Multi-container orchestration |
| Nginx | Production reverse proxy for frontend |

---

## 3. SYSTEM ARCHITECTURE

### 3.1 High-Level Architecture

```
+-------------------------------------------------------------------+
|                           CLIENT                                   |
|  (Browser)                                                        |
|  +---------------------+  +-------------------+                   |
|  | React SPA (Vite)    |  | Leaflet Map       |                   |
|  | - Component Tree    |  | - OpenStreetMap   |                   |
|  | - React Router v6   |  | - Markers/Popups  |                   |
|  | - Auth Context       |  | - Draggable Pins  |                   |
|  +----------+----------+  +-------------------+                   |
|             |                                                     |
|         Axios HTTP                                                |
|    (with JWT Bearer Token)                                        |
+------------|------------------------------------------------------+
             |
    Nginx Proxy (in production)
  (forwards /api/* to backend)
             |
+------------|------------------------------------------------------+
|           BACKEND (Node.js + Express)                              |
|  +-------------------+  +------------------+                      |
|  | Routes            |  | Middleware        |                      |
|  | - /api/auth       |  | - JWT Auth Guard  |                      |
|  | - /api/errands    |  | - CORS            |                      |
|  | - /api/dashboard  |  | - Error Handler   |                      |
|  | - /api/profile    |  |                   |                      |
|  | - /api/reviews    |  |                   |                      |
|  +---------+---------+  +------------------+                      |
|            |                                                        |
|  +---------+---------+                                              |
|  | Controllers       |                                              |
|  | - AuthController  |  Mongoose ODM                                |
|  | - ErrandController+-+    |                                       |
|  | - DashboardCtrl   | |    |                                       |
|  | - ProfileController| |    |                                       |
|  | - ReviewController | |    |                                       |
|  +-------------------+ |    |                                       |
|            |            |    |                                       |
|  +---------v------------v----v---+                                  |
|  | Models                        |                                  |
|  | - User (Mongoose Schema)      |                                  |
|  | - Errand (Mongoose Schema)    |                                  |
|  | - Review (Mongoose Schema)    |                                  |
|  +----------------+--------------+                                  |
|                   |                                                 |
+-------------------|------------------------------------------------+
                    |
            MongoDB (Dockerised)
            - hyperlocal_errand DB
            - users collection
            - errands collection
            - reviews collection
```

### 3.2 Component Hierarchy (Frontend)

```
App
├── AuthProvider (Context)
├── ToastProvider (Context)
├── Routes
│   ├── / → Browse
│   │   ├── SearchBar
│   │   ├── FilterPanel
│   │   ├── ErrandCard[] (Grid)
│   │   └── BrowseMap (Toggle)
│   ├── /login → Login
│   ├── /register → Register
│   ├── /post → PostErrand
│   │   └── DraggableMap
│   ├── /errand/:id → ErrandDetail
│   │   ├── SingleErrandMap
│   │   └── ConfirmDialog
│   ├── /dashboard → Dashboard
│   │   ├── StatsGrid
│   │   ├── PostedTable
│   │   └── ClaimedTable
│   └── /profile/:id → Profile
│       ├── StarRatingDisplay
│       └── StarRatingInput
├── Navbar (Persistent)
└── Toast (Floating)
```

### 3.3 Data Flow

1. User authenticates via `/api/auth/login` — receives JWT token
2. Token stored in `localStorage`, attached as `Bearer` header by Axios interceptor
3. Protected routes check `req.user` (decoded from JWT by middleware)
4. All errand queries return `status: 'Open'` errands by default
5. Claim/Complete/Cancel operations use atomic `findOneAndUpdate` with condition checks
6. Dashboard stats use MongoDB aggregation pipeline for SUM
7. Rating averages computed via `$avg` aggregation on reviews

---

## 4. MODULE DESCRIPTION

### 4.1 Authentication Module

The authentication module handles user registration, login, and session management.

- **Registration:** Accepts name, email, password, and neighbourhood. Validates uniqueness of email. Hashes password with bcryptjs (10 salt rounds). Generates avatar initial from first character of name. Returns JWT token and user object.
- **Login:** Accepts email and password. Verifies credentials. Returns JWT token (7-day expiry) and user object.
- **Profile Retrieval:** Returns authenticated user's details via `/api/auth/me` using the JWT token for identification.

### 4.2 Errand Management Module

Core module for the lifecycle of errand listings.

- **Browse:** Lists all `Open` errands with optional filters (category, urgency, neighbourhood, text search, reward range). Populates poster details via Mongoose `populate()`. Enriches results with runner rating average.
- **Detail:** Returns full errand information including poster and claimer details, runner rating, and coordinate data for map display.
- **Create:** Inserts a new errand document. Validates required fields. Sets defaults for optional fields.
- **Claim:** Atomically updates errand status from `Open` to `Claimed`. Prevents self-claiming. Handles race conditions with atomic `findOneAndUpdate`.
- **Complete:** Updates status from `Claimed` to `Completed`. Only the claiming user can perform this action.
- **Cancel:** Updates status from `Open` to `Cancelled`. Only the posting user can perform this action.

### 4.3 Dashboard Module

Provides aggregated views for authenticated users.

- **Posted Errands:** Lists all errands posted by the user with claimer details.
- **Claimed Errands:** Lists all errands claimed by the user with poster details.
- **Statistics:** Returns counts of posted, claimed, and completed errands plus total earnings from completed errands (calculated via MongoDB aggregation).

### 4.4 Profile & Reviews Module

Manages user profiles and the peer review system.

- **View Profile:** Returns user details along with aggregated counts (posted, completed) and average rating from reviews.
- **Update Profile:** Allows users to update their name, neighbourhood, and phone number.
- **Create Review:** Validates that the errand is completed, the reviewer is the poster, and no duplicate review exists. Rating constrained to 1–5.
- **View Reviews:** Returns all reviews for a given user, populated with reviewer names and avatars.

### 4.5 Interactive Map Module

Integrates Leaflet.js for geographic visualisation.

- **Browse Map:** Displays all open errands as coloured markers (red for high urgency, orange for medium, green for low). Auto-fits map bounds to show all markers.
- **Single Errand Map:** Shows a static map with the errand's pin location.
- **Draggable Map:** Used in the post-errand form — allows users to drag a pin to set precise coordinates.
- **Default View:** Centred on Sri Krishna Arts and Science College, Coimbatore (10.9379°N, 76.9592°E).

---

## 5. DATABASE DESIGN

### 5.1 Entity Relationship

```
+----------+        +----------+        +----------+
|   User   |<-------|  Errand  |------->|  Review  |
+----------+  1:N   +----------+  1:N   +----------+
     |                 |    |
     | posted_by (FK)  |    | claimed_by (FK)
     +-----------------+    +-----------------+
                                                     
  Errand.errand_id ──────── Review.errand_id (FK)
  User._id ──────────────── Review.reviewer_id (FK)
  User._id ──────────────── Review.reviewee_id (FK)
```

### 5.2 User Schema

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | ObjectId | Auto-generated | Unique identifier |
| `name` | String | Required | User's full name |
| `email` | String | Required, Unique, Lowercase | Login credential |
| `password` | String | Required | bcrypt-hashed |
| `neighbourhood` | String | Required | Coimbatore area |
| `phone` | String | Default: '' | Contact number |
| `avatar_initial` | String | Default: '' | First letter of name |
| `created_at` | Date | Auto (timestamps) | Registration date |
| `updated_at` | Date | Auto (timestamps) | Profile update date |

### 5.3 Errand Schema

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | ObjectId | Auto-generated | Unique identifier |
| `title` | String | Required | Short task title |
| `description` | String | Required | Detailed description |
| `category` | String | Required | Grocery Run, Parcel Drop, Pet Care, Home Help, Tech Help, Other |
| `reward` | Number | Default: 0 | Monetary reward |
| `reward_type` | String | Default: '₹' | Currency indicator |
| `urgency` | String | Default: 'Medium' | Low, Medium, High |
| `location_name` | String | Required | Neighbourhood name |
| `latitude` | Number | Required | Map coordinate |
| `longitude` | Number | Required | Map coordinate |
| `deadline` | Date | Required | Task expiry time |
| `status` | String | Default: 'Open' | Open, Claimed, Completed, Cancelled |
| `posted_by` | ObjectId | Ref: User | Errand creator |
| `claimed_by` | ObjectId | Ref: User, Nullable | Task runner |
| `created_at` | Date | Auto (timestamps) | Posted date |
| `updated_at` | Date | Auto (timestamps) | Last status change |

**Indexes:** `{ status: 1, posted_by: 1 }`, `{ claimed_by: 1 }`

### 5.4 Review Schema

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | ObjectId | Auto-generated | Unique identifier |
| `errand_id` | ObjectId | Ref: Errand, Required | Related errand |
| `reviewer_id` | ObjectId | Ref: User, Required | Person leaving review |
| `reviewee_id` | ObjectId | Ref: User, Required | Person being reviewed |
| `rating` | Number | Required, 1–5, Integer | Star rating |
| `comment` | String | Default: '' | Text feedback |
| `created_at` | Date | Auto (timestamps) | Review date |

**Indexes:** `{ reviewee_id: 1, created_at: -1 }`, `{ errand_id: 1, reviewer_id: 1 }` (unique)

### 5.5 Design Decisions

- **ObjectId References:** Users and errands are referenced rather than embedded to maintain data consistency and avoid duplication.
- **Timestamps:** Mongoose `timestamps: true` manages `created_at` and `updated_at` automatically.
- **Lean Queries:** Read operations use `.lean()` for better performance (returns plain JavaScript objects instead of Mongoose documents).
- **Compound Index:** Unique index on `(errand_id, reviewer_id)` prevents duplicate reviews.

---

## 6. API REFERENCE

### 6.1 Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Create a new user account |

**Request Body:**
```json
{
  "name": "Akash Kumar",
  "email": "akash@local.com",
  "password": "yourpassword",
  "neighbourhood": "Kuniyamuthur"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "669c8f1a...",
    "name": "Akash Kumar",
    "email": "akash@local.com",
    "neighbourhood": "Kuniyamuthur",
    "avatar_initial": "A",
    "phone": ""
  }
}
```

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | No | Authenticate and receive token |

**Request Body:**
```json
{ "email": "akash@local.com", "password": "yourpassword" }
```

**Response (200):** Same structure as register.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/auth/me` | Yes | Get authenticated user's profile |

---

### 6.2 Errands

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/errands` | No | List open errands with filters |
| GET | `/api/errands/:id` | No | Get single errand details |
| POST | `/api/errands` | Yes | Create a new errand |
| PUT | `/api/errands/:id/claim` | Yes | Claim an errand |
| PUT | `/api/errands/:id/complete` | Yes | Mark errand completed |
| PUT | `/api/errands/:id/cancel` | Yes | Cancel an errand |

**Query Parameters for GET /api/errands:**
| Parameter | Type | Example |
|-----------|------|---------|
| `category` | string | `Grocery Run` |
| `urgency` | string | `High` |
| `neighbourhood` | string | `Kuniyamuthur` |
| `search` | string | `groceries` |
| `minReward` | number | `50` |
| `maxReward` | number | `200` |

**POST /api/errands Request Body:**
```json
{
  "title": "Pick up groceries from Reliance Fresh",
  "description": "Need my weekly grocery order from Kuniyamuthur.",
  "category": "Grocery Run",
  "reward": 100,
  "urgency": "Medium",
  "location_name": "Kuniyamuthur",
  "latitude": 10.876,
  "longitude": 76.955,
  "deadline": "2026-07-20T18:00"
}
```

---

### 6.3 Dashboard

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/dashboard/posted` | Yes | User's posted errands |
| GET | `/api/dashboard/claimed` | Yes | User's claimed errands |
| GET | `/api/dashboard/stats` | Yes | Aggregated statistics |

**GET /api/dashboard/stats Response:**
```json
{
  "posted": 3,
  "claimed": 2,
  "completed": 1,
  "earnings": 150
}
```

---

### 6.4 Profile

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/profile/:id` | No | View a user's profile |
| PUT | `/api/profile` | Yes | Update own profile |

**PUT /api/profile Request Body:**
```json
{ "name": "Akash M", "neighbourhood": "Vadavalli", "phone": "9876543210" }
```

---

### 6.5 Reviews

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/reviews` | Yes | Submit a review |
| GET | `/api/reviews/:userId` | No | Get reviews for a user |

**POST /api/reviews Request Body:**
```json
{
  "errand_id": "669c8f1a...",
  "reviewee_id": "669c8f1b...",
  "rating": 5,
  "comment": "Excellent service!"
}
```

---

### 6.6 Utilities

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/neighbourhoods` | No | List Coimbatore areas |

**Response:**
```json
[
  "Kuniyamuthur", "Sugunapuram", "Vadavalli", "Kovaipudur",
  "R.S. Puram", "Gandhipuram", "Saibaba Colony", "Peelamedu",
  "Singanallur", "Ganapathy"
]
```

---

## 7. INSTALLATION & SETUP

### 7.1 Prerequisites

- **Node.js** 20.x or higher
- **npm** 9.x or higher
- **MongoDB** 7.x (local installation or Docker container)
- **Docker** and **Docker Compose** (optional, for containerised setup)
- **Git** (for cloning the repository)

### 7.2 Manual Setup (Development)

**Step 1: Clone the repository**
```bash
git clone <repository-url>
cd hyperlocal-errand-exchange
```

**Step 2: Backend setup**
```bash
cd backend
npm install
```

**Step 3: Configure environment variables**
Edit `backend/.env`:
```env
PORT=5001
JWT_SECRET=hyperlocal_errand_jwt_secret_key_2024
MONGODB_URI=mongodb://localhost:27017/hyperlocal_errand
```

**Step 4: Start MongoDB**

Ensure MongoDB is running locally on port 27017, or using Docker:
```bash
docker run -d -p 27017:27017 --name mongo mongo:7
```

**Step 5: Seed the database**
```bash
npm run seed
```

**Step 6: Start the backend server**
```bash
npm run dev
```
The API server runs at http://localhost:5001

**Step 7: Frontend setup (new terminal)**
```bash
cd frontend
npm install
```

**Step 8: Start the frontend dev server**
```bash
npm run dev
```
The application opens at http://localhost:5173

### 7.3 Docker Setup (Production)

**Prerequisites:** Docker and Docker Compose installed.

**Step 1: Clone the repository**
```bash
git clone <repository-url>
cd hyperlocal-errand-exchange
```

**Step 2: Build and start all services**
```bash
docker compose up -d
```

This starts three containers:
- `hyperlocal-mongodb` — MongoDB 7 on port 27017
- `hyperlocal-backend` — Node.js API on port 5001
- `hyperlocal-frontend` — Nginx serving React app on port 80

**Step 3: Seed the database**
```bash
docker exec -it hyperlocal-backend npm run seed
```

**Step 4: Access the application**
Open http://localhost in your browser.

**Step 5: Stop all services**
```bash
docker compose down
```

---

## 8. USAGE GUIDE

### 8.1 Registration & Login

1. Navigate to the application URL
2. Click **Create account** on the welcome screen
3. Fill in your name, email, password, and select your neighbourhood from the dropdown (Coimbatore areas centred around SKASC)
4. Submit the form — you are automatically logged in and redirected to the browse page
5. On subsequent visits, use the **Sign in** link to log in with your credentials

### 8.2 Browsing Errands

The browse page displays all open errands as a card grid:

- **Filter by category:** Grocery Run, Parcel Drop, Pet Care, Home Help, Tech Help, Other
- **Filter by urgency:** Low, Medium, High
- **Filter by area:** All Coimbatore neighbourhoods
- **Filter by reward:** Set minimum and maximum reward amounts
- **Search:** Type keywords to search titles and descriptions
- **Map view:** Toggle between grid and map views using the Map/Grid button
- Each card shows title, description, category badge, urgency indicator, reward, location, poster name, and countdown timer

### 8.3 Posting an Errand

1. Click **Post Errand** in the navigation bar
2. Fill in the title, description, and select a category
3. Set urgency level (default: Medium)
4. Enter a reward amount (0 for favour-based tasks)
5. Select a deadline date and time
6. Choose the neighbourhood and adjust the map pin by dragging it
7. Submit — the errand appears on the browse page immediately

### 8.4 Claiming an Errand

1. Open an errand's detail page by clicking on its card
2. Review the description, reward, deadline, and poster information
3. Click **Claim this Errand** to accept the task
4. The status updates to **Claimed** and the errand appears in your dashboard

### 8.5 Completing an Errand

1. Navigate to **Dashboard → My Claimed Errands**
2. Click **Complete** next to the completed task
3. The status updates to **Completed** and the reward is counted in your earnings

### 8.6 Leaving a Review

1. Navigate to the runner's profile page
2. Click **Leave a Review**
3. Select the completed errand from the dropdown
4. Rate 1–5 stars and add an optional comment
5. Submit — the rating is reflected on the runner's profile

---

## 9. TESTING

### 9.1 Test Accounts

The seed script creates 11 user accounts for testing (10 regular + 1 admin):

| Email | Password | Neighbourhood | Role |
|-------|----------|---------------|------|
| admin@local.com | admin123 | Kuniyamuthur | admin |
| akash@local.com | password123 | Kuniyamuthur | user |
| bhavana@local.com | password123 | Sugunapuram | user |
| charu@local.com | password123 | Vadavalli | user |
| dinesh@local.com | password123 | Kovaipudur | user |
| esha@local.com | password123 | Saibaba Colony | user |
| gowtham@local.com | password123 | Gandhipuram | user |
| harini@local.com | password123 | R.S. Puram | user |
| irfan@local.com | password123 | Peelamedu | user |
| janani@local.com | password123 | Singanallur | user |
| karthik@local.com | password123 | Ganapathy | user |

### 9.2 Sample Test Scenarios

| Scenario | Steps | Expected Result |
|----------|-------|-----------------|
| Register new user | Fill registration form with new email | Account created, redirected to browse |
| Browse with filters | Select "Pet Care" category, "High" urgency | Only matching errands shown |
| Post an errand | Fill form, drag marker, submit | New card appears in browse |
| Claim an errand | Log in as test user, click claim on open errand | Status changes to Claimed |
| Complete an errand | Log in as claimer, click complete | Status changes to Completed |
| Leave a review | Log in as poster of completed errand, submit review | Rating appears on runner's profile |
| View dashboard | Log in, visit Dashboard | Stats and tables reflect user's activity |

---

## 10. FUTURE ENHANCEMENTS

1. **Payment Gateway Integration** — Integrate Razorpay or Stripe for secure in-app payments and reward disbursement.

2. **Real-time Chat** — Implement Socket.io for in-app messaging between errand posters and claimers.

3. **Push Notifications** — Integrate Web Push API or Firebase Cloud Messaging for deadline reminders and status updates.

4. **OTP Verification** — Add phone number OTP verification for enhanced trust and security.

5. **User Verification** — Implement Aadhaar or government ID verification for identity assurance.

6. **Advanced Maps** — Add route distance calculation and estimated travel time between poster and claimer.

7. **Mobile Application** — Develop React Native or Flutter mobile apps for wider accessibility.

8. **Admin Panel** — Create an admin dashboard for user management, content moderation, and analytics.

9. **Recurring Errands** — Allow users to create recurring errands (daily, weekly) for regular tasks.

10. **Emergency Services** — Add a separate category for urgent community assistance requests.

---

## 11. CONCLUSION

The Hyperlocal Errand Exchange successfully demonstrates a community-driven approach to task outsourcing within a defined geographic area. The application provides a complete workflow from posting to completion, with accountability ensured through user authentication, peer reviews, and status tracking.

The migration from SQLite to MongoDB improved the application's scalability and simplified data relationships through embedded documents and references. The containerisation using Docker ensures consistent deployment across development, testing, and production environments.

The platform has been configured for the Coimbatore region with Sri Krishna Arts and Science College as the geographic focal point, making it immediately usable for the local community. The modular architecture allows easy adaptation to other geographic areas by updating neighbourhood data and map defaults.

Key technical achievements include:
- Full-stack JavaScript implementation with React and Node.js
- Secure JWT-based authentication with bcrypt password hashing
- Interactive map integration with Leaflet.js
- Responsive UI with Tailwind CSS
- NoSQL data modelling with Mongoose ODM
- Containerised deployment with Docker and Docker Compose

---

## 12. REFERENCES

1. React.js Documentation. https://react.dev
2. Vite Build Tool. https://vitejs.dev
3. Tailwind CSS Documentation. https://tailwindcss.com/docs
4. Express.js Guide. https://expressjs.com
5. Mongoose ODM Documentation. https://mongoosejs.com
6. MongoDB Documentation. https://www.mongodb.com/docs
7. Leaflet.js. https://leafletjs.com
8. React Leaflet. https://react-leaflet.js.org
9. JSON Web Tokens. https://jwt.io
10. Docker Documentation. https://docs.docker.com
11. Docker Compose. https://docs.docker.com/compose
12. OpenStreetMap Tile Usage Policy. https://operations.osmfoundation.org/policies/tiles

---

*Project developed by Shree*

*Department of Computer Science*

*Sri Krishna Arts and Science College (Autonomous), Coimbatore*

*Academic Year 2025–2026*
