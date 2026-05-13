---
name: testing-renovation-app
description: Test the renovation daily schedule app end-to-end. Use when verifying UI changes, offline persistence, or CRUD flows.
---

# Testing the Renovation Daily Schedule App

## Prerequisites
- Node.js installed
- Run `npm install` in the repo root

## Starting the Dev Server
```bash
cd /home/ubuntu/repos/daily-schedule
npm run dev
```
Vite dev server starts at `http://localhost:5173/` with HMR.

## Testing Modes

### Offline Mode (no MongoDB)
If no `MONGODB_URI` is set, the app runs in **offline fallback mode** using localStorage. This is the default for local testing and exercises all the same frontend code paths.

- An orange banner "Could not connect to server. Working offline with local storage." appears at the top
- Footer shows "Offline mode — data saved locally"
- All CRUD operations use the `renovation-schedule` localStorage key

### Online Mode (with MongoDB)
Set `MONGODB_URI` in `.env` to a MongoDB Atlas connection string. The app will use the serverless API at `/api/schedules`.

## Key Test Flows

### 1. Create → List → Reload → Edit → Delete
This is the primary golden path:
1. Clear localStorage: `localStorage.clear()` in browser console, then reload
2. Verify list shows "0 PROJECTS" and "No projects yet"
3. Click "+ New Project"
4. Fill Project Info fields (ID/Name, Company, Address, Lock Code, Date, Project Type)
5. Switch to Protection tab, fill fields
6. Switch to Work Schedule tab, expand a room section, fill a field
7. Click "Save Project" in footer
8. Click "← Back" to return to list
9. **Critical check**: List should show "1 PROJECTS" with project card (title, company, address, status counts)
10. Press F5 to reload — project should persist
11. Click the project card — edit view should show all pre-filled data
12. Navigate back, click × to delete, confirm — list should show 0 PROJECTS

### 2. Work Schedule Sections
All 9 sections should be present and expandable:
- Hacking / Removal
- Living Room
- Kitchen
- Maid Room / Balcony
- Walkway
- Room 1
- Room 2
- Master Bedroom
- Misc

Each section has Status (Pending/In Progress/Completed), Assigned Date, Worker/Team, and section-specific fields.

## Common Pitfalls

### localStorage Format
The `renovation-schedule` localStorage key stores data as `{list: [...]}` where each entry has `_id`, `project`, `protection`, `workData`, `materials`, and `createdAt`. If the format is wrong (e.g., a flat object instead of `{list: [...]}`), the list view might show 0 projects even though data exists. Clear localStorage and re-save if this happens.

### Delete Confirmation
Deleting a project triggers a `window.confirm()` dialog. In automated testing, this may cause timeouts — handle it by accepting the dialog explicitly.

### ESLint
The project uses flat ESLint config. Backend files under `api/` use Node.js globals (separate config section). Run `npx eslint .` to check.

### Build
```bash
npm run build
```
Output goes to `dist/`. Vercel deployment uses this + the `api/` directory.

## Lint & Build Checks
```bash
npx eslint .
npm run build
```
Both must pass before pushing.

## Devin Secrets Needed
- `MONGODB_URI` — MongoDB Atlas connection string (only needed for online mode testing; offline mode works without it)
