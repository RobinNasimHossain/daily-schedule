# Renovation Daily Schedule

A full-stack MERN application for managing renovation project daily work schedules.

## Tech Stack

- **Frontend**: React 19 + Vite
- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: JWT (JSON Web Tokens) + bcrypt

## Features

- User authentication (register/login)
- Create and manage multiple renovation projects
- 9 work sections per project (Hacking/Removal, Living, Kitchen, Maid Room, Walkway, Room 1, Room 2, Master Bedroom, Misc)
- Protection details tracking
- Materials inventory with CRUD operations
- Real-time dashboard stats (Total/Pending/In Progress/Completed)
- Auto-save to server with debounce
- Print-ready schedule view
- Responsive design

## Project Structure

```
daily-schedule/
├── src/                    # React frontend
│   ├── components/         # UI components
│   │   ├── auth/           # Login/Register pages
│   │   ├── ProjectInfo.jsx
│   │   ├── ProjectSelector.jsx
│   │   ├── ProtectionForm.jsx
│   │   ├── WorkSection.jsx
│   │   ├── MaterialsList.jsx
│   │   └── ScheduleView.jsx
│   ├── context/            # React context (Auth)
│   ├── services/           # API service layer
│   ├── App.jsx
│   └── main.jsx
├── server/                 # Express.js backend
│   ├── config/             # Database config
│   ├── models/             # Mongoose models (User, Project)
│   ├── routes/             # API routes (auth, projects)
│   ├── middleware/          # Auth middleware
│   └── server.js           # Entry point
├── docker-compose.yml      # Docker orchestration
├── Dockerfile              # Frontend container
└── nginx.conf              # Nginx reverse proxy
```

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd server
cp .env.example .env    # Edit with your MongoDB URI and JWT secret
npm install
npm start               # Runs on port 5000
```

### Frontend Setup

```bash
npm install
npm run dev             # Runs on port 5173
```

### Environment Variables

#### Backend (`server/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/renovation-schedule` |
| `JWT_SECRET` | JWT signing secret | (required) |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `CORS_ORIGINS` | Allowed origins (comma-separated) | `http://localhost:5173,http://localhost:3000` |

#### Frontend (`.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000` |

### Docker

```bash
docker-compose up --build
```

This starts MongoDB, the Express backend, and the React frontend (served via Nginx).

## API Endpoints

### Auth
- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Sign in
- `GET /api/auth/me` — Get current user (protected)

### Projects
- `GET /api/projects` — List user's projects (protected)
- `POST /api/projects` — Create project (protected)
- `GET /api/projects/:id` — Get project (protected)
- `PUT /api/projects/:id` — Update project (protected)
- `DELETE /api/projects/:id` — Delete project (protected)

### Health
- `GET /api/health` — Server health check
