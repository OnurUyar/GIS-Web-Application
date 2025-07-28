# GIS Web Application 🗺️

This project is a user-friendly, web-based **Geographic Information System (GIS)** application. It allows users to interact with a map by adding, editing, deleting, and querying geographic objects such as points, lines, and polygons.

---

## 🚀 Features

- 📍 Add, update, and delete **Points**
- 📏 Draw **Lines** with automatic length calculation (in kilometers)
- 📐 Draw **Polygons** with automatic area calculation (in km²)
- 🗂️ Connected to PostgreSQL + PostGIS for spatial data storage
- 📡 Interactive map-based object selection and editing
- 🔍 Search geographic objects by name
- 🧠 Full CRUD operations via RESTful API
- 💻 Built with a modern and clean React.js front-end

---

## 🧱 Technologies Used

**Back-End:**
- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL + PostGIS
- NetTopologySuite (for geometry operations)

**Front-End:**
- React.js
- Leaflet (open-source JavaScript library for maps)
- Axios (HTTP requests)


---

## 🔧 Getting Started

### 1. Back-End
```bash
cd WebApplication1
dotnet restore
dotnet ef database update
dotnet run
```

### 2. Front-End
```bash
cd gis-frontend
npm install
npm start
```

> The frontend will run at `http://localhost:3000`, and the backend will typically be available at `https://localhost:<port>` depending on your launch settings.

---

### 📁 Project Structure

```
WebApplication1/
├── bin/                  # Build output files (generated automatically)
├── Controllers/          # API endpoints for Points, Lines, Polygons
├── Data/                 # Database context and configuration
├── Geometry/             # WKT parsing and geometric calculations (area, length, etc.)
├── gis-frontend/         # React-based frontend map application (Leaflet.js)
├── Interfaces/           # Service and repository interfaces for abstraction
├── Migrations/           # Entity Framework Core migration files
├── Models/               # Entity models representing domain objects (Point, Line, Polygon)
├── Properties/           # .NET configuration files (launchSettings.json, etc.)
├── Repositories/         # Data access logic (EF Core-based repositories)
├── Resources/            # Static response messages, e.g., validation or error texts
├── Services/             # Business logic and CRUD operations for each GIS entity
├── Program.cs            # Entry point of the ASP.NET Core application
└── appsettings.json      # Application configuration file (DB connection, logging, etc.)
```

---

## 📽️ Project Demo Video

[ https://www.youtube.com/watch?v=cDCCxh-Io7w ]

---

### 🗺️ Front-End Screenshot
<img width="668" height="939" alt="appV3" src="https://github.com/user-attachments/assets/fa896bd0-8b62-47bb-afe0-601b1950eb9f" />

---

## 📄 License

This project was developed for educational purposes and is **not intended for commercial use**.
