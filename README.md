# ConsAl — Animal Welfare Platform

ConsAl is a web application that connects people with animal welfare services across Punjab, Pakistan. If you find an injured animal, want to report cruelty, need a veterinarian, or want to donate or adopt — this is the place.

## The Problem

Every day, injured or sick animals are found on streets with no clear way to get help. People don't know which veterinarian to call, where to report cruelty, or how to donate to rescue efforts. Rescue teams work without visibility into what others are doing. There is no central place where the public, veterinarians, and animal welfare organizers can coordinate.

ConsAl solves this by giving everyone — from a citizen who spots a stray dog to an admin managing dozens of rescue cases — a single platform to report, track, and act.

## Who This Is For

* Anyone who sees an injured or sick animal and wants to help.
* Veterinarians who want to be listed and findable by people in need.
* Rescue teams and admins who manage cases, approve vets, and coordinate adoptions.
* People who want to donate or adopt a rescued animal.

## Features

### For Everyone

#### Report an Injured Animal

Fill out a simple form with the animal type, location, description, and a photo. The report gets sent to the admin team, and you can track its status as it moves through the rescue process:

```text
Pending → In Progress → Rescued → Recovering → Released
```

#### Report Animal Cruelty

Submit a confidential cruelty report with location details and severity level:

* Low
* Medium
* High
* Critical

Each report is reviewed and acted on by admins.

#### Find a Veterinarian

Browse a list of approved veterinarians with their clinic name, specialty, city, and contact information. See them all on an interactive map. Results are filtered to show only admin-approved listings.

#### Register a Doctor

Know a veterinarian who isn't listed? Submit their details for admin approval. Once approved, they appear on the map and in search results.

Supported specialties include:

* General Veterinary
* Small Animal Medicine
* Large Animal Medicine
* Veterinary Surgery
* Veterinary Dermatology
* Veterinary Dentistry
* Exotic Pets
* Equine Specialist

#### Donate

Make a contribution to support rescue operations, medical care, food, and shelter. The donation flow simulates a real payment process and saves a record of your contribution.

#### Adopt an Animal

Browse animals that have been rescued and are ready for adoption. Submit an application with your details and reason for adopting. Applications are reviewed and approved by admins.

#### Rescue Updates

See all ongoing and completed rescue operations in one place. Each update shows the animal, location, current status, and admin notes. View them on a timeline or on the map.

#### Awareness & Blog

Read educational articles about animal welfare and environmental topics.

#### Your Profile

View all your submitted reports, donations, adoption applications, and registered doctors in one place.

#### Interactive Map

See approved veterinarians, animal reports, and cruelty cases color-coded by severity on a single map powered by OpenStreetMap (free, no API key required).

#### Dark / Light Theme

Toggle between dark and light appearance. Your preference is remembered the next time you visit.

### For Administrators

#### Full Admin Dashboard

A dedicated panel with sidebar navigation to manage every part of the system:

* **Animal Reports** – View all reports, change their status, and add internal notes visible to the public on rescue updates.
* **Cruelty Reports** – Review cruelty submissions, update investigation status, and add admin notes.
* **Doctors** – Approve or reject veterinarian registrations before they appear on the public listing and map.
* **Donations** – View all donation records.
* **Rescue** – Publish rescue updates that appear on the public rescue feed.
* **Adoptions** – Review and approve/reject adoption applications tied to rescued animals.
* **Awareness & Blog** – Create, edit, and delete awareness posts and blog articles.

Every report and cruelty case tracks changes with automatic timestamps so admins know when the last update happened.

## How It Works

1. You land on the Welcome page. You can click **Get Started** to log in or sign up.
2. Create an account with your name, email, and password. You're automatically logged in.
3. Use any feature. Report an animal, find a vet, donate, or browse rescue updates — all from the navigation bar.
4. When you report an animal or cruelty case, an admin reviews it and updates its status. You can check your profile to see what's changed.
5. When a cruelty case reaches **Recovering** status, the animal appears in the Adopt section. Anyone can apply to adopt it. Admin approval completes the process.
6. Admins log in to a separate panel where they see all reports, manage statuses, approve doctors, and publish content. The public never sees the admin panel.

## Quick Start

### What You Need

* Node.js version 18 or later
* A terminal or command prompt
* No database setup needed (SQLite creates the database file automatically)
* No API keys needed (maps use free OpenStreetMap)

### Step 1: Start the Backend

```bash
cd backend
npm install
node server.js
```

The backend starts on:

```text
http://localhost:3001
```

It creates a file called `database.sqlite` in the project root folder the first time it runs. The admin account is seeded automatically.

### Step 2: Start the Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The app opens on:

```text
http://localhost:5173
```

The frontend automatically sends API requests to the backend on port `3001`.

### Step 3: Log In

| Role         | Email                                       |
| ------------ | ------------------------------------------- |
| Admin        | [admin@pawpal.com](mailto:admin@pawpal.com) |
| Regular User | Sign up on the app                          |

## Project Structure

```text
ConsAl/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── test/
│   └── public/
├── backend/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── db.js
└── database.sqlite
```

## Tech Stack

| Layer    | Technology              | Purpose                                 |
| -------- | ----------------------- | --------------------------------------- |
| Frontend | React 18                | Builds the user interface               |
| Frontend | Vite                    | Development server and production build |
| Frontend | Tailwind CSS            | Styling                                 |
| Frontend | React Router            | Navigation                              |
| Frontend | Leaflet + OpenStreetMap | Interactive maps                        |
| Backend  | Node.js + Express       | API server                              |
| Backend  | SQLite via sql.js       | Database storage                        |
| Backend  | JWT + bcryptjs          | Authentication and password hashing     |

## Build for Production

```bash
cd frontend
npm run build
```

This creates a `dist/` folder with optimized files ready to deploy.

## Notes

* The database file (`database.sqlite`) is created in the project root, not inside the `backend/` folder.
* Deleting the database file resets all data. The schema and admin account are recreated automatically on the next startup.
* Maps use Leaflet with OpenStreetMap tiles and require no API key.
* On Linux with musl (for example, Alpine), you may need to install a native binding:

```bash
npm install @rollup/rollup-linux-x64-musl --no-save
```

## License

This project is intended for educational and animal welfare purposes.
