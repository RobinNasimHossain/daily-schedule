---
name: testing-renovation-schedule
description: Test the Renovation Daily Schedule React app end-to-end. Use when verifying UI changes, form inputs, data persistence, or materials tracking.
---

# Testing Renovation Daily Schedule App

## Setup

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev` (runs on `http://localhost:5173`)
3. Build check: `npm run build`
4. Lint check: `npm run lint`

## Tech Stack
- React 19 + Vite 8
- No backend — all data stored in browser localStorage under key `renovation-schedule`
- Google Fonts (Inter) loaded via CDN

## App Structure

The app has 5 tabs navigated via buttons at the top:
1. **Project Info** — 6 fields: ID/Name, Company, Address, Lock Code, Date, Project Type
2. **Protection** — Floor protection, plywood, PVC main door fields
3. **Work Schedule** — 9 collapsible sections (Hacking/Removal, Living Room, Kitchen, Maid Room/Balcony, Walkway, Room 1, Room 2, Master Bedroom, Misc). Each has Status dropdown (Pending/In Progress/Completed), Assigned Date, Worker, and room-specific fields.
4. **Materials** — Editable table with pre-loaded items (Protection Pad, Painter Tape, Plywood, PVC). Supports add/remove/edit. Units include pcs, rolls, sheets, bags, boxes, sets, sqft, meters.
5. **View Schedule** — Read-only print-friendly summary of all entered data. Has a "Print Schedule" button.

## Dashboard Stats
The header shows 4 stat cards: Total, Pending, In Progress, Done. These count the 9 work sections by their status. Changing a section's status updates the dashboard immediately.

## Key Test Scenarios

1. **Form Input**: Fill all fields in Project Info, verify values display. Test placeholder text matches expected format.
2. **Status Changes**: Expand a work section, change status dropdown. Verify dashboard stats update (e.g., Pending count decreases, In Progress increases). Verify badge color changes (yellow=Pending, blue=In Progress, green=Completed).
3. **Field Count**: Fill fields in a work section and verify the "X/Y fields" counter updates.
4. **Materials CRUD**: Edit quantities, add new material with name/qty/unit, remove a material. Verify row count changes.
5. **View Schedule**: Verify all entered data appears in the summary view with correct formatting.
6. **localStorage Persistence**: Hard refresh (Ctrl+Shift+R) and verify all data persists across all tabs.
7. **Clear All Data**: Click "Clear All Data" button in footer, confirm dialog, verify all fields reset.

## Common Issues
- The date input uses browser native date picker. On Linux, type the date as MM/DD/YYYY.
- The select dropdowns for status use native HTML `<select>` — click to open, then click the option.
- Work sections are collapsed by default — click the header row to expand.

## Devin Secrets Needed
None — this is a fully client-side app with no authentication or API keys required.
