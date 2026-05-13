# Renovation Daily Work Schedule

A full-stack MERN application for managing renovation project daily work schedules. Built with React, Node.js/Express (Vercel Serverless Functions), and MongoDB.

## Features

- **Project Management** — Create, edit, and delete renovation projects
- **Project Info** — Track ID, company, address, lock code, date, and project type
- **Site Protection** — Floor protection, plywood, PVC door tracking
- **Work Schedule** — Room-by-room task tracking with status (Pending / In Progress / Completed)
  - Hacking/Removal, Living Room, Kitchen, Maid Room/Balcony, Walkway
  - Room 1, Room 2, Master Bedroom, Misc
- **Materials List** — Track materials with quantities and units
- **Print View** — Print-optimized schedule report
- **Offline Support** — Falls back to localStorage when server is unavailable
- **Mobile Responsive** — Works on phones, tablets, and desktops

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 19, Vite 8, CSS              |
| Backend   | Vercel Serverless Functions (Node)  |
| Database  | MongoDB Atlas + Mongoose            |
| Hosting   | Vercel                              |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Setup

```bash
# Clone the repo
git clone https://github.com/RobinNasimHossain/daily-schedule.git
cd daily-schedule

# Install dependencies
npm install

# Copy env file and add your MongoDB URI
cp .env.example .env
# Edit .env and add your MONGODB_URI

# Start development server
npm run dev
```

### Environment Variables

| Variable       | Description                          | Required |
|----------------|--------------------------------------|----------|
| `MONGODB_URI`  | MongoDB connection string            | Yes      |
| `VITE_API_URL` | API base URL (defaults to `/api`)    | No       |

## API Endpoints

| Method | Endpoint              | Description           |
|--------|-----------------------|-----------------------|
| GET    | `/api/schedules`      | List all schedules    |
| POST   | `/api/schedules`      | Create a schedule     |
| GET    | `/api/schedules/:id`  | Get a schedule        |
| PUT    | `/api/schedules/:id`  | Update a schedule     |
| DELETE | `/api/schedules/:id`  | Delete a schedule     |
| GET    | `/api/health`         | Health check          |

## Deployment (Vercel)

1. Push your code to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add `MONGODB_URI` as an environment variable in Vercel project settings
4. Deploy — Vercel auto-detects Vite + serverless functions

## Project Structure

```
daily-schedule/
├── api/                    # Vercel serverless backend
│   ├── lib/
│   │   ├── mongodb.js      # MongoDB connection utility
│   │   └── models/
│   │       └── Schedule.js # Mongoose schema
│   ├── schedules/
│   │   ├── index.js        # GET all / POST
│   │   └── [id].js         # GET / PUT / DELETE by ID
│   └── health.js           # Health check endpoint
├── src/                    # React frontend
│   ├── api.js              # API service layer
│   ├── App.jsx             # Main app with routing
│   ├── App.css             # Styles
│   ├── components/
│   │   ├── ProjectInfo.jsx
│   │   ├── ProtectionForm.jsx
│   │   ├── WorkSection.jsx
│   │   ├── MaterialsList.jsx
│   │   ├── ScheduleView.jsx
│   │   └── ScheduleList.jsx
│   ├── index.css
│   └── main.jsx
├── vercel.json             # Vercel deployment config
├── .env.example            # Environment template
└── package.json
```
