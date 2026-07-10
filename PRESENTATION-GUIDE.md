# RetroX — מדריך הצגה למרצה

**פרויקט:** RetroX (Netflix-style)  
**מגישות:** Anna Sasporta & Keren Or Lebovitch  
**טכנולוגיות:** HTML5 · CSS3 · JavaScript · Node.js · Express · MongoDB · Session

---

## לפני ההצגה — צ'קליסט

- [ ] MongoDB רץ (`mongodb://127.0.0.1:27017`)
- [ ] `.env` מוגדר (`MONGO_URI`, `OMDB_API_KEY`)
- [ ] הרצת seed: `npm run seed:demo`
- [ ] השרת רץ: `node server.js` → `http://localhost:5000`
- [ ] רענון קשיח בדפדפן: `Ctrl + Shift + R`
- [ ] 2 טאבים מוכנים: משתמש רגיל + מנהל
- [ ] DevTools סגור (אלא אם מראים Session)

### פרטי התחברות

| משתמש   | סיסמה      | תפקיד        |
|---------|------------|--------------|
| `keren` | `retro1234` | משתמש רגיל  |
| `admin` | `retro1234` | מנהל         |

---

## שקפים מומלצים (6–8 שקפים)

### שקף 1 — כותרת
- **RetroX** — פלטפורמת סטרימינג אישית
- שמות + קורס Web Development
- לוגו / צילום מסך ראשי

### שקף 2 — טכנולוגיות
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express 5
- Database: MongoDB + Mongoose
- Auth: express-session + bcrypt
- External API: OMDb (IMDB)
- Charts: D3.js · Map: Leaflet

### שקף 3 — מבנה MVC
```
models/       → סכמות MongoDB
controllers/  → לוגיקה עסקית
routes/       → API endpoints
views/        → דפי HTML
public/       → CSS, JS, assets
middleware/   → auth, logging
server.js     → נקודת כניסה
```

### שקף 4 — Session & משתמשים
- Login → session נוצר (`loggedIn`, `username`, `role`)
- Cookie בדפדפן → כל בקשה מאומתת
- `user` vs `admin` — הרשאות שונות
- Logout → `session.destroy()`

### שקף 5 — פיצ'רים עיקריים
- פרופילים (CRUD) + My List
- פיד אישי + Continue Watching + Like
- חיפוש (קטגוריה + טקסט)
- IMDB API · מפה · דוחות מנהל

### שקף 6 — דמו חי (צילום מסך)
- `/main` — פיד + IMDB sidebar
- `/movies` — admin create/delete
- `/profiles` — personas
- Analytics — טבלאות + D3

### שקף 7 — סיכום
- כל דרישות המטלה ממומשות
- MVC מלא, MongoDB, Session, API חיצוני
- שאלות?

---

## תסריט דמו חי (10 דקות)

### חלק א׳ — MVC + Session (2 דק')
**דיבור:**
> "הפרויקט בנוי ב-MVC. הלקוח פונה ל-Route, עובר Middleware של auth, ואז Controller שעובד מול MongoDB."

**פעולות:**
1. פתחי את מבנה התיקיות ב-VS Code / Explorer
2. הראי `server.js` → `routes` → `controllers` → `models`
3. גלשי ל-`http://localhost:5000` — דף Login
4. התחברי `keren` / `retro1234`
5. הסבירי: "נוצר session בשרת, cookie נשלח לדפדפן"
6. `/profiles` — בחרי פרסונה (למשל Keren)

---

### חלק ב׳ — משתמש רגיל (3 דק')
**דיבור:**
> "כל פרסונה מקבלת פיד אישי, רשימה משלה, והיסטוריית צפייה."

| # | פעולה | דרישה שמודגמת |
|---|--------|----------------|
| 1 | `/main` — הצגת הפיד | תצוגת תוכן |
| 2 | לחצי על סרט → **Watch Now** → צפי חלקי → סגרי | Continue Watching |
| 3 | חזרי ל-`/main` → **Continue Watching** | סימון צפייה |
| 4 | פתחי סרט → **Like** ❤️ | Like |
| 5 | שדה חיפוש ב-navbar — הקלידי שם סרט | חיפוש טקסט |
| 6 | **Advanced Search** — קטגוריה + שנה + rating | חיפוש קטגוריה |
| 7 | Sidebar שמאלי — **IMDb** → Load | API חיצוני |
| 8 | גללי ל-**My List** → Remove | ניהול My List |

---

### חלק ג׳ — CRUD פרופילים (1.5 דק')
**דיבור:**
> "כל משתמש מנהל פרופילי צפייה — Create, Read, Update, Delete."

| # | פעולה |
|---|--------|
| 1 | `/profiles` |
| 2 | **Add Persona** — שם + אווטאר |
| 3 | **Save** — שינוי שם |
| 4 | **Remove** — מחיקה (אופציונלי) |

---

### חלק ד׳ — מנהל (3 דק')
**דיבור:**
> "מנהל יכול להוסיף סרטים וסדרות לקטלוג ולצפות בדוחות."

1. **Logout** → התחברי `admin` / `retro1234`
2. `/movies` — טופס **Add Movie/Series** → Create
3. מחקי סרט (Delete) — CRUD מנהל
4. `/main` — גללי ל-**Analytics**:
   - Most Watched by Category
   - Views by Persona
   - Likes by Category
   - 2 גרפי D3
5. (אופציונלי) `/map` — מיקומי צילומים

---

### חלק ה׳ — Logout + סגירה (30 שנ')
1. **Logout** — session נהרס
2. נסי `/main` ישירות → מפנה ל-Login ✓

**משפט סיום:**
> "RetroX מממשת MVC מלא עם MongoDB, Session, CRUD לסרטים ופרופילים, חיפוש, IMDB API, Like, דוחות מנהל והמשך צפייה."

---

## מיפוי דרישות מטלה → היכן להראות

| דרישה | איפה בדמו | קובץ עיקרי |
|--------|-----------|------------|
| CRUD סרטים/סדרות (מנהל) | `/movies` — Create + Delete | `movieController.js` |
| ניהול My List | `/main` — My List + Remove | `movieController.js` |
| CRUD פרופילים | `/profiles` | `personaController.js` |
| Session | Login / Logout / גישה לדפים | `authController.js`, `server.js` |
| משתמשים + סיסמאות | Login + admin vs user | `userModel.js`, bcrypt |
| MVC | מבנה תיקיות | כל הפרויקט |
| חיפוש קטגוריה | `/main` — Advanced Search | `searchController.js` |
| חיפוש טקסט | Navbar search | `mainPage.js`, `movies.js` |
| API חיצוני IMDB | Sidebar IMDb | `externalController.js` |
| Like | מודל סרט — ❤️ | `movieController.js` |
| דוחות צפייה + Like | `/main` Analytics (admin) | `searchController.js`, `charts.js` |
| Continue Watching | `/main` + נגן וידאו | `watchHistoryController.js` |

---

## אם המרצה שואל שאלות טכניות

**איך Session עובד?**  
`express-session` ב-`server.js`. אחרי login נשמר `loggedIn`, `username`, `role` ב-`req.session`. Middleware `checkLogin` / `checkAdmin` בודק לפני כל API.

**איך סיסמאות מאובטחות?**  
`bcrypt.hash` בהרשמה, `bcrypt.compare` ב-login. הסיסמה לא נשמרת בטקסט גלוי.

**איך My List שייך למשתמש?**  
שדה `listOwner` = `req.session.username`, `persona` = הפרסונה הנבחרת.

**מאיפה דוחות הצפייה?**  
אוסף `WatchHistory` — aggregation לפי קטגוריה ופרסונה.

**מאיפה IMDB?**  
`GET /external/imdb?movieTitle=...` → OMDb API עם `OMDB_API_KEY`.

---

## תקלות נפוצות — פתרון מהיר

| בעיה | פתרון |
|------|--------|
| Cannot connect MongoDB | הפעילי MongoDB service |
| IMDB לא עובד | בדקי `OMDB_API_KEY` ב-`.env` + restart server |
| דף ריק / ישן | `Ctrl + Shift + R` |
| Route not found | הפעילי מחדש `node server.js` |
| אין נתונים | `npm run seed:demo` |

---

*הדפס מסמך זה או שמרי בטלפון ליום ההצגה.*
