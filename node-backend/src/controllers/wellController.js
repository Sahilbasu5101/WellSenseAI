const mongoose = require('mongoose');
const Well = require('../models/Well');

// ---------------------------------------------------------------------------
// Static fallback data — used when MongoDB is not available
// ---------------------------------------------------------------------------
const STATIC_WELLS = [
  {
    _id: 'static-001',
    well_id: 'W-001',
    name: 'DLJN-HST-001',
    status: 'Active',
    location: { type: 'Point', coordinates: [95.3197, 27.3653] },
    total_depth: 3850,
    formations: [
      { name: 'Alluvium', depth_start: 0, depth_end: 450 },
      { name: 'Tipam Sandstone', depth_start: 450, depth_end: 1800 },
      { name: 'Barail Shale', depth_start: 1800, depth_end: 2700 },
      { name: 'Lakadong Sandstone', depth_start: 2700, depth_end: 3850 },
    ],
  },
  {
    _id: 'static-002',
    well_id: 'W-002',
    name: 'DLJN-HST-002',
    status: 'Historical',
    location: { type: 'Point', coordinates: [95.3450, 27.3800] },
    total_depth: 3200,
    formations: [
      { name: 'Alluvium', depth_start: 0, depth_end: 380 },
      { name: 'Tipam Sandstone', depth_start: 380, depth_end: 1650 },
      { name: 'Barail Shale', depth_start: 1650, depth_end: 2500 },
      { name: 'Lakadong Sandstone', depth_start: 2500, depth_end: 3200 },
    ],
  },
  {
    _id: 'static-003',
    well_id: 'W-003',
    name: 'DLJN-HST-003',
    status: 'Historical',
    location: { type: 'Point', coordinates: [95.2950, 27.3500] },
    total_depth: 4100,
    formations: [
      { name: 'Alluvium', depth_start: 0, depth_end: 500 },
      { name: 'Tipam Sandstone', depth_start: 500, depth_end: 1900 },
      { name: 'Barail Shale', depth_start: 1900, depth_end: 2950 },
      { name: 'Lakadong Sandstone', depth_start: 2950, depth_end: 4100 },
    ],
  },
  {
    _id: 'static-004',
    well_id: 'W-004',
    name: 'DLJN-HST-004',
    status: 'Historical',
    location: { type: 'Point', coordinates: [95.3700, 27.3900] },
    total_depth: 2980,
    formations: [
      { name: 'Alluvium', depth_start: 0, depth_end: 320 },
      { name: 'Tipam Sandstone', depth_start: 320, depth_end: 1550 },
      { name: 'Barail Shale', depth_start: 1550, depth_end: 2300 },
      { name: 'Lakadong Sandstone', depth_start: 2300, depth_end: 2980 },
    ],
  },
  {
    _id: 'static-005',
    well_id: 'W-005',
    name: 'DLJN-HST-005',
    status: 'Historical',
    location: { type: 'Point', coordinates: [95.3100, 27.3750] },
    total_depth: 3650,
    formations: [
      { name: 'Alluvium', depth_start: 0, depth_end: 410 },
      { name: 'Tipam Sandstone', depth_start: 410, depth_end: 1750 },
      { name: 'Barail Shale', depth_start: 1750, depth_end: 2700 },
      { name: 'Lakadong Sandstone', depth_start: 2700, depth_end: 3650 },
    ],
  },
];

/** Returns true only when Mongoose is fully connected to MongoDB */
const isDbConnected = () => mongoose.connection.readyState === 1;

// ---------------------------------------------------------------------------
// Haversine distance helper (meters) for static nearby filter
// ---------------------------------------------------------------------------
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in metres
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ---------------------------------------------------------------------------
// Controllers
// ---------------------------------------------------------------------------

/**
 * @desc    Find all historical wells within a specified radius (in meters) of a location
 * @route   GET /api/wells/nearby
 * @access  Public
 */
const getNearbyWells = async (req, res, next) => {
  try {
    const { lat, lng, radius } = req.query;

    if (lat === undefined || lng === undefined || radius === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required query parameters: "lat", "lng", and "radius" (in meters) are all required.',
        example: '/api/wells/nearby?lat=27.3653&lng=95.3197&radius=10000',
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusMeters = parseFloat(radius);

    if (isNaN(latitude) || latitude < -90 || latitude > 90) {
      return res.status(400).json({
        success: false,
        message: 'Invalid "lat" parameter. Latitude must be a number between -90 and 90.',
      });
    }

    if (isNaN(longitude) || longitude < -180 || longitude > 180) {
      return res.status(400).json({
        success: false,
        message: 'Invalid "lng" parameter. Longitude must be a number between -180 and 180.',
      });
    }

    if (isNaN(radiusMeters) || radiusMeters <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid "radius" parameter. Radius must be a positive number in meters.',
      });
    }

    let nearbyWells;

    if (isDbConnected()) {
      nearbyWells = await Well.aggregate([
        {
          $geoNear: {
            near: { type: 'Point', coordinates: [longitude, latitude] },
            key: 'location',
            distanceField: 'distance',
            maxDistance: radiusMeters,
            query: { status: 'Historical' },
            spherical: true,
          },
        },
        { $sort: { distance: 1 } },
      ]);
    } else {
      nearbyWells = STATIC_WELLS.filter((w) => w.status === 'Historical')
        .map((w) => ({
          ...w,
          distance: haversineDistance(latitude, longitude, w.location.coordinates[1], w.location.coordinates[0]),
        }))
        .filter((w) => w.distance <= radiusMeters)
        .sort((a, b) => a.distance - b.distance);
    }

    return res.status(200).json({
      success: true,
      count: nearbyWells.length,
      query: {
        center: { latitude, longitude },
        radiusMeters,
        radiusKm: Number((radiusMeters / 1000).toFixed(2)),
      },
      wells: nearbyWells,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Fetch the current active well details
 * @route   GET /api/wells/active
 * @access  Public
 */
const getActiveWell = async (req, res, next) => {
  try {
    let activeWell;

    if (isDbConnected()) {
      activeWell = await Well.findOne({ status: 'Active' });
    } else {
      activeWell = STATIC_WELLS.find((w) => w.status === 'Active') || null;
    }

    if (!activeWell) {
      return res.status(404).json({
        success: false,
        message: 'No currently active well found in the database.',
      });
    }

    return res.status(200).json({ success: true, well: activeWell });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all wells (Active and Historical)
 * @route   GET /api/wells
 * @access  Public
 */
const getAllWells = async (req, res, next) => {
  try {
    let wells;

    if (isDbConnected()) {
      const { status } = req.query;
      const filter = status ? { status } : {};
      wells = await Well.find(filter).sort({ well_id: 1 });
    } else {
      const { status } = req.query;
      wells = status ? STATIC_WELLS.filter((w) => w.status === status) : [...STATIC_WELLS];
      wells.sort((a, b) => a.well_id.localeCompare(b.well_id));
    }

    return res.status(200).json({ success: true, count: wells.length, wells });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single well by well_id or MongoDB _id
 * @route   GET /api/wells/:id
 * @access  Public
 */
const getWellById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let well;

    if (isDbConnected()) {
      well = await Well.findOne({ well_id: id });
      if (!well && id.match(/^[0-9a-fA-F]{24}$/)) {
        well = await Well.findById(id);
      }
    } else {
      well = STATIC_WELLS.find((w) => w.well_id === id || w._id === id) || null;
    }

    if (!well) {
      return res.status(404).json({ success: false, message: `Well with ID '${id}' not found.` });
    }

    return res.status(200).json({ success: true, well });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNearbyWells,
  getActiveWell,
  getAllWells,
  getWellById,
};
