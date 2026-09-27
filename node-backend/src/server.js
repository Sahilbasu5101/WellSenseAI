const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const wellRoutes = require('./routes/wellRoutes');

// Load environment configuration
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/wells', wellRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'WellSense Node.js Analytics API',
    timestamp: new Date().toISOString(),
  });
});

// Root welcome endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to WellSense AI Oil Drilling Analytics API',
    endpoints: {
      activeWell: '/api/wells/active',
      nearbyWells: '/api/wells/nearby?lat=27.3653&lng=95.3197&radius=15000',
      allWells: '/api/wells',
      health: '/api/health',
    },
  });
});

// 404 Catch-All Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
  });
});

// Central Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[API Error]:', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start Express Server
const server = app.listen(PORT, () => {
  console.log(`[Server] WellSense Node API running on http://localhost:${PORT}`);
  console.log(`[Server] Endpoints:`);
  console.log(`   - GET http://localhost:${PORT}/api/wells/active`);
  console.log(`   - GET http://localhost:${PORT}/api/wells/nearby?lat=27.3653&lng=95.3197&radius=15000`);
});

module.exports = { app, server };
