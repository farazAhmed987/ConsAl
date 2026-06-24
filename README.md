# ConsAl 🐾


Full-stack animal welfare management platform connecting citizens, veterinarians, 
and rescue administrators across Punjab.

## Features

- **Report & Track** — Submit animal rescue or cruelty reports; follow status from 
  pending → rescued → released/adopted in real time
- **Live Map** — Interactive Leaflet map with color-coded markers (blue = animal 
  reports, green = approved doctors, severity-colored = cruelty). No API key needed.
- **Adoption Pipeline** — Recovered animals listed for adoption; users apply, 
  admin approves, status updates automatically
- **Doctor Registry** — Citizens nominate vets; admin approves; approved doctors 
  appear on the map
- **Admin Dashboard** — Full CRUD for reports, doctors, donations, awareness posts, 
  blog content, and adoption applications
- **Donations** — Simulated payment flow with admin tracking
- **Responsive + Theme** — Dark/light toggle persisted in localStorage; mobile-first
- **JWT Auth** — Role-based routing (user / admin)

## Tech Stack

Frontend | Backend | Database | Maps | Auth
--- | --- | --- | --- | ---
React 18 + Vite | Node.js + Express | SQL.js (SQLite) | Leaflet + OSM | JWT + bcrypt
Tailwind CSS | | | |
React Router | | | |

## Quick Start

```bash
# 1. Backend
cd backend
npm install
node server.js          # → http://localhost:3001

# 2. Frontend (separate terminal)
cd frontend
npm install
npm run dev             # → http://localhost:5173
The frontend proxies /api to the backend automatically.
Demo Credentials
Role	Email	Password
Admin	admin@pawpal.com (mailto:admin@pawpal.com)	admin123
User	(register yourself)	 
Project Structure
ConsAl/
├── frontend/
│   ├── src/
│   │   ├── pages/           # 12 user pages + 9 admin pages
│   │   ├── components/      # Layouts, forms, map, UI primitives
│   │   ├── context/         # AuthContext, ThemeContext
│   │   ├── hooks/           # useAuth, useTheme, useForm
│   │   ├── api/             # Axios client with JWT interceptor
│   │   └── utils/           # Formatters, helpers
│   └── public/assets/       # Static images
├── backend/
│   ├── routes/              # 9 API route modules
│   ├── middleware/          # JWT verify, admin guard, optional auth
│   ├── server.js            # Entry point
│   └── db.js                # SQLite wrapper + schema + seed
├── database.sqlite          # Auto-generated on first run
└── README.md
Scripts
Command	Description
npm run dev (frontend)	Start Vite dev server
npm run build (frontend)	Production build → dist/
npm test (frontend)	Run Vitest suite
node server.js (backend)	Start Express API
