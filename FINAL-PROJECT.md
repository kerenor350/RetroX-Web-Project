# RetroX — Final Project

**קורס:** Web Development  
**מגישות:** Anna Sasporta & Keren Or Lebovitch  
**Repository:** [github.com/kerenor350/WebDev](https://github.com/kerenor350/WebDev)  
**Branch:** `step10`

---

## 1. תיאור הפרויקט

**RetroX** היא פלטפורמת סטרימינג בסגנון Netflix, שפותחה כפרויקט גמר בקורס Web Development.

האפליקציה מאפשרת למשתמשים:
- להירשם ולהתחבר עם Session מאובטח
- לנהל פרופילי צפייה (Personas)
- לצפות בסרטים וסדרות עם המשך צפייה (Continue Watching)
- לבנות רשימה אישית (My List)
- לחפש תכנים, לדרג (Like), לכתוב ביקורות
- לצפות בנתוני IMDB מ-API חיצוני
- לצפות במיקומי צילום על מפה

מנהל המערכת יכול:
- להוסיף ולמחוק סרטים/סדרות מהקטלוג
- לצפות בדוחות Analytics מבוססי MongoDB Aggregation
- לחפש משתמשים במערכת

---

## 2. טכנולוגיות

| שכבה | טכנולוגיה |
|------|-----------|
| Frontend | HTML5, CSS3, JavaScript (Vanilla) |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Authentication | express-session, bcrypt |
| External API | OMDb (נתוני IMDB) |
| Maps | Leaflet + OpenStreetMap |
| Charts | D3.js + Canvas |
| Logging | Custom logger (`utils/logger.js`) |

---

## 3. ארכיטקטורת MVC

```
WebDev/
├── server.js              # נקודת כניסה, session, routes
├── config/db.js           # חיבור MongoDB
├── models/                # סכמות Mongoose
├── controllers/           # לוגיקה עסקית
├── routes/                # API endpoints
├── middleware/            # auth, logging, errors
├── views/                 # דפי HTML
├── public/                # CSS, JS, assets
└── utils/                 # logger, personaAvatars
```

### Models
| קובץ | תיאור |
|------|--------|
| `userModel.js` | משתמשים (username, password, role) |
| `persona.model.js` | פרופילי צפייה (name, image, owner) |
| `movie.model.js` | סרטים/סדרות (title, category, likes, persona, listOwner…) |
| `watchHistory.model.js` | היסטוריית צפייה (persona, movie, currentTime, completed) |
| `postModel.js` | ביקורות ותגובות |

### Controllers
| קובץ | אחריות |
|------|--------|
| `authController.js` | Login, Register, Logout |
| `personaController.js` | CRUD פרופילים |
| `movieController.js` | CRUD סרטים, My List, Like |
| `feedController.js` | פיד אישי לפי פרסונה |
| `watchHistoryController.js` | שמירה ושליפת המשך צפייה |
| `searchController.js` | חיפוש מתקדם + GroupBy Analytics |
| `chartsController.js` | נתוני גרפים (D3) |
| `externalController.js` | IMDB (OMDb) + Geocoding |
| `postController.js` | ביקורות |

### Views (דפים)
| דף | URL | תיאור |
|----|-----|--------|
| `loginPage.html` | `/` | התחברות והרשמה |
| `profiles.html` | `/profiles` | ניהול פרופילים |
| `mainPage.html` | `/main` | פיד ראשי, חיפוש, Analytics |
| `movies.html` | `/movies` | קטלוג מלא + ניהול מנהל |
| `map.html` | `/map` | מפת מיקומי צילום |

---

## 4. Session & הרשאות

### זרימת Session
1. משתמש מתחבר → `POST /login`
2. השרת יוצר Session: `loggedIn`, `username`, `role`
3. Cookie נשלח לדפדפן
4. כל בקשה עוברת Middleware: `checkLogin` / `checkAdmin`
5. Logout → `session.destroy()`

### תפקידים
| תפקיד | הרשאות |
|-------|--------|
| `user` | פיד, My List, צפייה, Like, ביקורות, חיפוש |
| `admin` | כל הרשאות user + CRUD קטלוג + Analytics + חיפוש משתמשים |

### פרטי התחברות לדמו
| משתמש | סיסמה | תפקיד |
|--------|--------|--------|
| `keren` | `retro1234` | user |
| `admin` | `retro1234` | admin |

---

## 5. פיצ'רים עיקריים

### משתמש רגיל
- **Personas** — יצירה, עריכה, מחיקה, בחירת אווטאר
- **פיד אישי** — המלצות, Top 10, קטגוריות, My List
- **Continue Watching** — שמירת מיקום בווידאו והצגה מחדש
- **My List** — הוספה ממודל פרטים / מדף Movies, הסרה מהפיד
- **Like** — לייק לסרט עם עדכון בזמן אמת
- **ביקורות** — כתיבה ומחיקה במודל פרטים
- **חיפוש טקסט** — ב-navbar לפי שם סרט
- **חיפוש מתקדם** — קטגוריה + שנה + דירוג מינימלי
- **IMDB Sidebar** — נתונים מ-OMDb API

### מנהל
- **CRUD קטלוג** — הוספת סרט/סדרה, עריכה, מחיקה (`/movies`)
- **Analytics** — טבלאות GroupBy + 2 גרפי D3
- **חיפוש משתמשים** — username + role + min personas

### מפה
- הצגת מיקומי צילום על Leaflet
- הוספה ועריכה של מיקומים (שמירה ב-MongoDB)

---

## 6. מימוש דרישות המטלה

### CRUD
| ישות | Create | Read | Update | Delete | איפה |
|------|--------|------|--------|--------|------|
| סרטים/סדרות (קטלוג) | ✅ | ✅ | ✅ | ✅ | `/movies` (admin) |
| My List | ✅ | ✅ | — | ✅ | `/main` |
| פרופילים | ✅ | ✅ | ✅ | ✅ | `/profiles` |
| מיקומי צילום | ✅ | ✅ | ✅ | ✅ | `/map` |
| ביקורות | ✅ | ✅ | — | ✅ | מודל פרטים |

### Session
- ✅ Login / Register / Logout
- ✅ הגנה על דפים (`checkLoginPage`)
- ✅ הגנה על API (`checkLogin`, `checkAdmin`)
- ✅ סיסמאות מוצפנות ב-bcrypt

### חיפוש מתקדם (2+ שאילתות, 3+ פרמטרים)

**שאילתה 1 — חיפוש בקטלוג** (`GET /search/movies`)
- פרמטרים: `category`, `year`, `minLikes`
- UI: `/main` → Advanced Search, `/movies` → Search Movies

**שאילתה 2 — חיפוש My List לפי פרופיל** (`GET /search/persona-movies`)
- פרמטרים: `persona`, `category`, `year`, `minLikes`
- API ממומש ב-`searchController.js`

**שאילתה 3 — חיפוש משתמשים (מנהל)** (`GET /analytics/search-users`)
- פרמטרים: `q` (username), `role`, `minPersonas`
- UI: `/main` → Analytics → Search Users

### GroupBy ב-MongoDB (2+ שאילתות)

**1. צפיות לפי קטגוריה** — `getMostWatchedByCategory`
```javascript
WatchHistory.aggregate([
    { $group: { _id: "$movie", viewCount: { $sum: 1 } } },
    { $lookup: { from: "movies", ... } },
    { $group: { _id: "$movieInfo.category", totalViews: { $sum: "$viewCount" } } }
])
```

**2. צפיות לפי פרופיל** — `getViewsByPersona`
```javascript
WatchHistory.aggregate([
    { $group: { _id: "$persona", viewCount: { $sum: 1 }, totalWatchTime: { $sum: "$currentTime" } } }
])
```

**3. לייקים לפי קטגוריה** — `getLikesByCategory`
```javascript
Movie.aggregate([
    { $group: { _id: "$category", totalLikes: { $sum: "$likes" }, avgLikes: { $avg: "$likes" } } }
])
```

### API חיצוני
- **OMDb (IMDB)** — `GET /external/imdb?movieTitle=...`
- **Nominatim (Geocoding)** — המרת כתובת לקואורדינטות במפה

---

## 7. API Endpoints עיקריים

### Auth
| Method | Endpoint | תיאור |
|--------|----------|--------|
| POST | `/login` | התחברות |
| POST | `/register` | הרשמה |
| POST | `/logout` | התנתקות |

### Movies
| Method | Endpoint | תיאור |
|--------|----------|--------|
| GET | `/movies/all` | כל הסרטים |
| GET | `/movies/:persona` | סרטים לפי פרסונה |
| POST | `/movies/catalog` | הוספת סרט לקטלוג (admin) |
| POST | `/movies/my-list` | הוספה ל-My List |
| DELETE | `/movies/my-list/:id` | הסרה מ-My List |
| POST | `/movies/:id/like` | Like |
| DELETE | `/movies/:id` | מחיקת סרט (admin) |

### Feed & Search
| Method | Endpoint | תיאור |
|--------|----------|--------|
| GET | `/feed/:persona` | פיד אישי |
| GET | `/search/movies` | חיפוש מתקדם בקטלוג |
| GET | `/search/persona-movies` | חיפוש My List |
| GET | `/analytics/search-users` | חיפוש משתמשים (admin) |

### Analytics (admin)
| Method | Endpoint | תיאור |
|--------|----------|--------|
| GET | `/analytics/most-watched-by-category` | GroupBy קטגוריה |
| GET | `/analytics/views-by-persona` | GroupBy פרופיל |
| GET | `/analytics/likes-by-category` | GroupBy לייקים |

### Watch History
| Method | Endpoint | תיאור |
|--------|----------|--------|
| GET | `/watch-history/:persona/:movie` | שליפת מיקום צפייה |
| POST | `/watch-history` | שמירת מיקום צפייה |

### External
| Method | Endpoint | תיאור |
|--------|----------|--------|
| GET | `/external/imdb` | נתוני IMDB מ-OMDb |

---

## 8. התקנה והרצה

### דרישות מקדימות
- Node.js (v18+)
- MongoDB (מקומי או Atlas)

### שלבים

```bash
# 1. Clone
git clone https://github.com/kerenor350/WebDev.git
cd WebDev
git checkout step10

# 2. התקנת חבילות
npm install

# 3. הגדרת .env
cp .env.example .env
# ערכי .env:
# PORT=5000
# MONGO_URI=mongodb://127.0.0.1:27017/netflix
# OMDB_API_KEY=<your_key>

# 4. Seed נתוני דמו
npm run seed:demo

# 5. הפעלת השרת
npm start
# או: node server.js

# 6. פתיחה בדפדפן
# http://localhost:5000
```

### סקריפטים
| פקודה | תיאור |
|-------|--------|
| `npm start` | הפעלת השרת |
| `npm run seed:demo` | משתמשים, סרטים, היסטוריית צפייה |
| `npm run seed:movies` | seed סרטים בלבד |
| `npm run seed:admin` | יצירת משתמש admin |
| `npm run verify:demo` | בדיקת תקינות נתוני דמו |

---

## 9. זרימת שימוש

```
Login → בחירת Persona → Main Feed
                              ├── צפייה בסרט (Continue Watching)
                              ├── Like / ביקורת
                              ├── Add to My List
                              ├── Advanced Search
                              ├── IMDB Sidebar
                              └── Analytics (admin)
Movies → חיפוש + ניהול קטלוג (admin)
Profiles → CRUD פרופילים
Map → מיקומי צילום
Logout → חזרה ל-Login
```

---

## 10. קבצים נלווים

| קובץ | תיאור |
|------|--------|
| `FINAL-PROJECT.md` | מסמך פרויקט גמר (קובץ זה) |
| `README.md` | סיכום קצר + התקנה |

---

## 11. סיכום

פרויקט **RetroX** מממש את כל דרישות פרויקט הגמר:

- ✅ ארכיטקטורת **MVC** מלאה
- ✅ **MongoDB** עם Mongoose ו-CRUD
- ✅ **Session** מאובטח עם bcrypt
- ✅ **משתמשים** עם הרשאות (user / admin)
- ✅ **חיפוש מתקדם** עם 3+ פרמטרים
- ✅ **GroupBy** ב-MongoDB Aggregation
- ✅ **API חיצוני** (OMDb / IMDB)
- ✅ **Continue Watching**, **My List**, **Like**
- ✅ **דוחות מנהל** + גרפים
- ✅ ממשק משתמש מלא ב-HTML/CSS/JS

---

*Anna Sasporta & Keren Or Lebovitch — Web Development, 2026*
