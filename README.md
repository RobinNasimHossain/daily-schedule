# Renovation Daily Schedule - MERN Stack

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing renovation project daily work schedules. Built for construction teams to track work progress across rooms, manage materials, and generate print-ready reports.

## Features

- **Project Info** - Track client details, company, address, lock code, and project type
- **Protection Tracking** - Floor protection, plywood, PVC door protection
- **Work Schedule** - Room-by-room task management with status tracking (Pending / In Progress / Completed)
  - Hacking/Removal, Living Room, Kitchen, Maid Room/Balcony, Walkway, Room 1, Room 2, Master Bedroom, Misc
- **Materials List** - Track protection pads, painter tape, plywood, PVC and custom materials
- **Schedule List** - Browse, search, duplicate, and delete saved schedules
- **Print View** - Print-optimized layout for physical reports
- **MongoDB Persistence** - All data stored in MongoDB Atlas

## Tech Stack

- **Frontend**: React 19, Vite, CSS
- **Backend**: Express 5, Node.js
- **Database**: MongoDB with Mongoose ODM

## Setup

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and set your MongoDB URI:

```bash
cp .env.example .env
```

Edit `.env`:

```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/renovation-schedule
PORT=5000
```

### Development

```bash
npm run dev
```

This runs both the Express server (port 5000) and Vite dev server (port 5173) concurrently.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
daily-schedule/
├── server/
│   ├── config/db.js          # MongoDB connection
│   ├── models/Schedule.js    # Mongoose schema
│   ├── routes/schedules.js   # REST API routes
│   ├── middleware/errorHandler.js
│   └── index.js              # Express server
├── src/
│   ├── api/scheduleApi.js    # Frontend API service
│   ├── components/
│   │   ├── ProjectInfo.jsx
│   │   ├── ProtectionForm.jsx
│   │   ├── WorkSection.jsx
│   │   ├── MaterialsList.jsx
│   │   ├── ScheduleList.jsx
│   │   ├── ScheduleView.jsx
│   │   └── Toast.jsx
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── .env.example
├── package.json
└── vite.config.js
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/schedules` | List all schedules |
| GET | `/api/schedules/:id` | Get single schedule |
| POST | `/api/schedules` | Create schedule |
| PUT | `/api/schedules/:id` | Update schedule |
| DELETE | `/api/schedules/:id` | Delete schedule |
| PATCH | `/api/schedules/:id/work/:roomKey` | Update room work data |
| POST | `/api/schedules/:id/duplicate` | Duplicate schedule |
| GET | `/api/health` | Health check |
