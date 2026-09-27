const express = require('express');
const router = express.Router();
const {
  getNearbyWells,
  getActiveWell,
  getAllWells,
  getWellById,
} = require('../controllers/wellController');

// Geospatial query route: GET /api/wells/nearby?lat=...&lng=...&radius=...
router.get('/nearby', getNearbyWells);

// Active well route: GET /api/wells/active
router.get('/active', getActiveWell);

// List all wells route: GET /api/wells
router.get('/', getAllWells);

// Single well route: GET /api/wells/:id
router.get('/:id', getWellById);

module.exports = router;
