---
name: testing-mern-renovation-app
description: Test the MERN renovation daily schedule app end-to-end. Use when verifying auth, project CRUD, auto-save, or data persistence.
---

# Testing the MERN Renovation Daily Schedule App

## Prerequisites

1. **MongoDB** must be running on port 27017. Start via Docker:
   ```bash
   docker start mongo-test || docker run -d --name mongo-test -p 27017:27017 mongo:7
   ```
2. **Express server** on port 5000:
   ```bash
   cd server && node server.js &
   ```
3. **React dev server** on port 5173:
   ```bash
   npm run dev &
   ```
4. Verify all services:
   ```bash
   curl -s http://localhost:5000/api/health  # {"status":"healthy"}
   curl -s http://localhost:5173 | head -3   # HTML response
   ```

## Devin Secrets Needed

No secrets required — the app uses local MongoDB with no auth and generates its own JWT tokens.

## Test Flow

1. **Register**: Navigate to `http://localhost:5173`, click "Sign Up", fill username/email/fullName/password (min 6 chars), click "Create Account"
2. **Create Project**: Click "+ New Project", type name, press Enter or click Create
3. **Fill Data**: Switch between tabs (Project Info, Protection, Work Schedule, Materials) and enter data
4. **Verify Auto-Save**: Wait 1-2 seconds after changes — auto-save fires with 1s debounce
5. **Test Persistence**: Go to Projects tab, re-click the project — data should reload from server
6. **Test Logout/Login**: Click Logout, sign back in, verify data intact
7. **Negative Test**: Try wrong password — should show error and not log in

## Key Assertions

- Dashboard stats (Total/Pending/In Progress/Done) update immediately when section status changes
- Project Info fields persist after navigating away and back
- Work Schedule section statuses persist across page reloads
- All tabs except "Projects" are disabled when no project is selected
- Registration creates account and redirects to empty projects view

## Known Issues

- The error message for invalid login credentials may show "Session expired. Please login again." instead of "Invalid credentials" — the auth rejection works correctly but the error text might be misleading
- The `ctrl+shift+r` and `F5` keyboard shortcuts may not work through the computer use tool — use address bar navigation to test page reloads
- After a system restart, all three services (MongoDB, Express, React) need to be manually restarted

## Architecture Notes

- Frontend API service at `src/services/api.js` — all HTTP calls go through here with JWT token management
- Auth context at `src/context/AuthContext.jsx` — manages user state, login/register/logout
- Auto-save logic in `src/App.jsx` — 1s debounce via `useEffect` + `setTimeout`
- Backend routes: `/api/auth/*` for auth, `/api/projects/*` for CRUD (all protected by JWT middleware)
- MongoDB database name: `renovation-schedule`
