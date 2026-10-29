# RetroX — Final Project

**Web Development Course**  
**Authors:** Anna Sasporta & Keren Or Lebovitch

RetroX is a Netflix-style streaming web application built with a full **MVC architecture**, **MongoDB**, **express-session**, and a rich client-side UI.

📄 **Full documentation (Hebrew):** [FINAL-PROJECT.md](./FINAL-PROJECT.md)

---

## Features

- User login / register / logout with **bcrypt** + **session**
- **Personas** — CRUD watch profiles per user
- Personal **feed** — recommendations, Top 10, categories, My List
- **Continue Watching** — resume playback from saved position
- **Like**, reviews, and detail modal
- **Advanced search** — category + year + min rating
- **Admin analytics** — MongoDB `$group` reports + D3 charts + user search
- **External API** — OMDb (IMDB data)
- **Filming locations map** — Leaflet + MongoDB

---

## Tech Stack

HTML5 · CSS3 · JavaScript · Node.js · Express 5 · MongoDB · Mongoose · express-session · bcrypt · D3.js · Leaflet · OMDb API

---

## Quick Start

```bash
git clone https://github.com/kerenor350/RetroX-Web-Project.git
cd WebDev
git checkout step10
npm install
cd WebDev
git checkout step10
npm install
```

Create `.env` (see `.env.example`):

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/netflix
OMDB_API_KEY=your_omdb_api_key
```

```bash
npm run seed:demo
npm start
```

Open **http://localhost:5000**

### Demo Login

| User | Password | Role |
|------|----------|------|
| `keren` | `retro1234` | user |
| `admin` | `retro1234` | admin |

---

## Project Structure

```
models/        → Mongoose schemas (User, Persona, Movie, WatchHistory, Post)
controllers/   → Business logic
routes/        → API endpoints
middleware/    → Auth, logging, error handling
views/         → HTML pages
public/        → CSS, JS, images, video
server.js      → Entry point
```

---

## Pages

| URL | Description |
|-----|-------------|
| `/` | Login & Register |
| `/profiles` | Manage personas |
| `/main` | Feed, search, My List, analytics |
| `/movies` | Full catalog + admin CRUD |
| `/map` | Filming locations map |

---

## License

ISC
