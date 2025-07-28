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

## 📁 Project Structure

```
WebApplication1/
├── Controllers/
├── Services/
├── Repositories/
├── Interfaces/
├── Models/
├── Geometry/
├── gis-frontend/         # React-based frontend
├── Resources/            # Static response messages
├── Program.cs
└── appsettings.json
```

---

## 📽️ Project Demo Video

[🔗 Add video link here]

---

## 🧪 Sample WKT Inputs

- Point: `POINT(32.8597 39.9334)`
- Line: `LINESTRING(29.0 41.0, 32.0 39.0)`
- Polygon: `POLYGON((30 40, 35 45, 40 40, 30 40))`

---

## 📄 License

This project was developed for educational purposes and is **not intended for commercial use**.
