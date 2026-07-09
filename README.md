# RetroX – Web Development Assignment 4

## Project Description

RetroX is a Netflix-style streaming web application developed as part of the Web Development course.

This project demonstrates the transition from a simple server-side application to a structured MVC architecture while integrating MongoDB as the database.

The application allows users to log in, choose a persona, browse movies, add new movies, and delete existing movies asynchronously without refreshing the page.

---

## Technologies

* HTML5
* CSS3
* JavaScript
* Node.js
* Express.js
* MongoDB
* Mongoose
* Express Session

---

## MVC Architecture

The project follows the MVC (Model–View–Controller) design pattern.

### Models

Contains the database models using Mongoose.

* movie.model.js
* persona.model.js
* userModel.js

### Controllers

Contains the application logic.

* authController.js
* movieController.js
* personaController.js

### Routes

Defines the API endpoints.

* authRoutes.js
* movieRoutes.js
* personaRoutes.js

### Views

Contains the HTML pages.

* loginPage.html
* profiles.html
* mainPage.html

### Public

Contains all static files.

* CSS
* JavaScript
* Images

---

## Features

* User Login
* Session Management
* Persona Selection
* Display Movies
* Add Movie
* Delete Movie using Fetch API
* MongoDB Integration
* Dynamic Content Loading

---

## Installation

1. Clone the repository

```bash
git clone <repository-url>
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`)

```text
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/netflix
```

For **MongoDB Atlas**, replace `MONGO_URI` with your Atlas connection string.

4. Seed the database

```bash
npm run seed:admin
npm run seed:movies
```

5. Start the server

```bash
npm start
```

6. Open the browser

```
http://localhost:5000
```

---

## Database

MongoDB is used to store movie data.

The application performs CRUD operations through Mongoose.

---

## Author

Keren Or
