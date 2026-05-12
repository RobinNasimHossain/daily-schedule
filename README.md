# Renovation Daily Schedule - MERN Application

A production-level MERN (MongoDB, Express, React, Node.js) application for managing renovation project daily work schedules. Track project details, protection work, room-by-room renovation tasks, materials, and view/print complete schedules.

## Features

- **Project Info**: ID, Company, Address, Lock Code, Date, Project Type
- **Protection**: Floor protection pads, plywood, PVC main door + frame
- **Work Schedule**: 9 configurable room sections (Hacking/Removal, Living, Kitchen, Maid Room/Balcony, Walkway, Room 1, Room 2, Master Bedroom, Misc)
- **Materials Tracker**: Add/remove materials with quantity and unit tracking
- **Schedule View**: Print-ready view of complete schedule
- **CRUD Operations**: Create, Read, Update, Delete schedules via REST API
- **Search & Filter**: Search schedules by name, company, or address
- **Duplicate**: Clone existing schedules
- **Toast Notifications**: Real-time feedback on operations
- **Responsive Design**: Works on desktop and mobile

## Tech Stack

- **Frontend**: React 19, Vite, JSX
- **Backend**: Express.js 5, Node.js
- **Database**: MongoDB with Mongoose ODM
- **Styling**: Custom CSS with responsive design

## Prerequisites

- Node.js 20+
- MongoDB (local or Atlas cloud)

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/RobinNasimHossain/daily-schedule.git
   cd daily-schedule
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your MongoDB URI:
   ```
   MONGODB_URI=mongodb://localhost:27017/renovation-schedule
   PORT=5000
   NODE_ENV=development
   ```

5. Start development (runs both server and client):
   ```bash
   npm run dev
   ```

   The React frontend runs on `http://localhost:5173` and the Express API on `http://localhost:5000`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both server and client concurrently |
| `npm run client` | Start Vite dev server only |
| `npm run server` | Start Express server only |
| `npm run build` | Build React for production |
| `npm start` | Start production server (serves built frontend) |
| `npm run lint` | Run ESLint |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/schedules` | List all schedules (supports search, pagination) |
| `GET` | `/api/schedules/:id` | Get single schedule |
| `POST` | `/api/schedules` | Create new schedule |
| `PUT` | `/api/schedules/:id` | Update schedule |
| `DELETE` | `/api/schedules/:id` | Delete schedule |
| `PATCH` | `/api/schedules/:id/work/:roomKey` | Update specific room work data |
| `POST` | `/api/schedules/:id/duplicate` | Duplicate a schedule |
| `GET` | `/api/health` | Health check |

## Production Deployment

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Set environment variables:
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_uri
   PORT=5000
   ```

3. Start the server:
   ```bash
   npm start
   ```

## Project Structure

```
daily-schedule/
├── server/
│   ├── index.js              # Express server entry
│   ├── config/db.js           # MongoDB connection
│   ├── models/Schedule.js     # Mongoose schema
│   ├── routes/schedules.js    # REST API routes
│   └── middleware/errorHandler.js
├── src/
│   ├── api/scheduleApi.js     # Frontend API client
│   ├── components/
│   │   ├── ProjectInfo.jsx    # Project info form
│   │   ├── ProtectionForm.jsx # Protection details form
│   │   ├── WorkSection.jsx    # Room work section
│   │   ├── MaterialsList.jsx  # Materials tracker
│   │   ├── ScheduleView.jsx   # Print-ready view
│   │   ├── ScheduleList.jsx   # Saved schedules list
│   │   └── Toast.jsx          # Notification component
│   ├── App.jsx                # Main application
│   ├── App.css                # Application styles
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles
├── package.json
├── vite.config.js
├── .env.example
└── index.html
```
