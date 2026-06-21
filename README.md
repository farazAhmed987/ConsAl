# ConsAl — Animal Welfare Platform

ConsAl connects people with animal welfare initiatives across Punjab. You can report injured or sick animals, register veterinarians, donate to rescue operations, view cruelty reports on a map, and stay updated on rescue efforts.

## Features

- **Report a Sick Animal** — Submit details about an animal in need; track the status of your report.
- **Register a Doctor** — Add a veterinarian for admin approval; approved doctors appear on the map.
- **Report Animal Cruelty** — File confidential reports with severity levels (low → critical).
- **Donate** — Make dummy donations to support medical care, food, shelter, and emergency rescues.
- **Rescue Updates** — View ongoing and completed rescue operations.
- **Shelters & Doctors Map** — Google Maps view showing approved veterinarians and cruelty report locations.
- **Awareness & Blog** — Read educational posts and environment articles.
- **Admin Dashboard** — Full CRUD management for reports, doctors, donations, rescue updates, awareness posts, and blog content.
- **User Accounts** — Sign up, log in, view your profile with your reports and donations.
- **Dark / Light Theme** — Toggle between dark and light appearance; preference is saved.

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express, SQLite (via sql.js)
- **Auth:** JWT (JSON Web Tokens), bcryptjs
- **Maps:** Google Maps API (@react-google-maps/api)
- **Font:** Inter (Google Fonts)

---

## How to Run

### Prerequisites

- **Node.js** v18 or later
- A **Google Maps API key** (for the map to work)
- A terminal / command prompt

### 1. Download or clone the project

```bash
git clone <repo-url>
cd ConsAl
2. Set up the backend
cd backend
npm install
Start the backend server:
npm run dev
The API runs at http://localhost:3001.
3. Set up the frontend
Open a second terminal in the project root:
cd frontend
npm install
Create a .env file in the frontend folder with your Google Maps key:
VITE_GOOGLE_MAPS_API_KEY=your_key_here
Start the frontend dev server:
npm run dev
The app opens at http://localhost:5173.
The frontend automatically proxies /api requests to the backend on port 3001 — no extra configuration needed.
4. Production build (optional)
cd frontend
npm run build
This creates a dist/ folder. You can serve it with npm run preview or copy the contents into the backend's public/ folder and let Express serve it.
Demo Login
Role	Email
Admin	admin@pawpal.com (mailto:admin@pawpal.com)
User	(sign up yourself)
Project Structure
ConsAl/
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── api/       # Axios client
│   │   ├── components/# Reusable UI, layout, forms, map
│   │   ├── context/   # Auth & Theme providers
│   │   ├── hooks/     # Custom hooks (useAuth, useTheme)
│   │   ├── pages/     # All page components (user + admin)
│   │   └── utils/     # Formatters, helpers
│   └── public/assets/ # Static images
├── backend/           # Express + SQLite API
│   ├── routes/        # Route handlers (9 modules)
│   ├── server.js      # Entry point
│   └── db.js          # SQLite wrapper (sql.js)
└── README.md
