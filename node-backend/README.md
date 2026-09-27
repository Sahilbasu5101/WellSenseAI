# WellSense AI - Node.js & Express REST API Backend

Node.js + Express.js backend connected to **MongoDB** using **Mongoose**, featuring **GeoJSON** point modeling and **MongoDB `$geoNear` aggregation** for geospatial drilling analytics.

---

## 🛠️ Tech Stack & Features

- **Node.js (v22+) & Express.js**: REST API with route modularization and centralized error handling.
- **MongoDB & Mongoose**: Object Data Modeling (ODM) with schema validation.
- **GeoJSON & 2dsphere Indexing**: `type: 'Point'` with `coordinates: [lng, lat]` and a `'2dsphere'` index.
- **`$geoNear` Aggregation Pipeline**: High-performance spatial query to find nearest historical wells within a meter radius, sorted ascending by distance.
- **CORS Middleware**: Ready for React frontend consumption.
- **Automated Seeding**: Populates MongoDB from `wells_data.json`.

---

## 📁 Directory Structure

```
node-backend/
│
├── src/
│   ├── config/
│   │   └── db.js                 # Mongoose connection logic
│   ├── models/
│   │   └── Well.js               # Well Mongoose model with GeoJSON & 2dsphere index
│   ├── controllers/
│   │   └── wellController.js     # Handlers for /nearby, /active, and CRUD
│   ├── routes/
│   │   └── wellRoutes.js         # Express router mounts
│   ├── scripts/
│   │   └── seed.js               # Database seeder using wells_data.json
│   └── server.js                 # Express application & server listener
│
├── .env                          # Configuration (PORT, MONGODB_URI)
├── package.json                  # Dependencies & scripts
├── test_api.js                   # Automated end-to-end test suite
└── README.md
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd node-backend
npm install
```

### 2. Seed the Database
Populates MongoDB with the 15 wells (1 Active, 14 Historical) from `wells_data.json` and creates the `2dsphere` index:
```bash
npm run seed
```

### 3. Start the Server
```bash
# Production mode
npm start

# Development mode (auto-reload on changes)
npm run dev
```
Server runs on: **`http://localhost:5000`**

---

## 📡 API Endpoints

### 1. `GET /api/wells/active`
Fetches current active well details.

#### Example Request:
```bash
curl -X GET "http://localhost:5000/api/wells/active"
```

#### Example Response (`200 OK`):
```json
{
  "success": true,
  "well": {
    "_id": "673...",
    "well_id": "W-001",
    "name": "DLJN-ACT-001",
    "status": "Active",
    "location": {
      "type": "Point",
      "coordinates": [95.41571, 27.366965]
    },
    "total_depth": 3840,
    "formations": [
      { "name": "Alluvium", "depth_start": 0, "depth_end": 420 },
      { "name": "Girujan Clay", "depth_start": 420, "depth_end": 1280 }
    ]
  }
}
```

---

### 2. `GET /api/wells/nearby`
Finds all **Historical** wells within a specified radius (in meters) of a target location using MongoDB's `$geoNear` aggregation pipeline. Results are automatically sorted by proximity (nearest first) and include the calculated `distance` in meters.

#### Query Parameters:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `lat` | Number | Yes | Center Latitude (-90 to 90) |
| `lng` | Number | Yes | Center Longitude (-180 to 180) |
| `radius`| Number | Yes | Search radius in **meters** (e.g., `15000` for 15 km) |

#### Example Request:
```bash
curl -X GET "http://localhost:5000/api/wells/nearby?lat=27.366965&lng=95.41571&radius=15000"
```

#### Example Response (`200 OK`):
```json
{
  "success": true,
  "count": 10,
  "query": {
    "center": {
      "latitude": 27.366965,
      "longitude": 95.41571
    },
    "radiusMeters": 15000,
    "radiusKm": 15
  },
  "wells": [
    {
      "well_id": "W-003",
      "name": "DLJN-HST-003",
      "status": "Historical",
      "location": {
        "type": "Point",
        "coordinates": [95.38541, 27.39124]
      },
      "total_depth": 3410,
      "distance": 4265.8
    },
    {
      "well_id": "W-013",
      "name": "DLJN-HST-013",
      "status": "Historical",
      "location": {
        "type": "Point",
        "coordinates": [95.46129, 27.41285]
      },
      "total_depth": 4120,
      "distance": 7162.0
    }
  ]
}
```

---

### 3. `GET /api/wells`
Returns all 15 wells. Optional filter: `?status=Active` or `?status=Historical`.

---

## 🧪 Automated Testing

Run the included test script to verify all endpoints, `$geoNear` distance calculation, and validation errors:
```bash
npm test
```
