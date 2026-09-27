const Well = require('../models/Well');

/**
 * @desc    Find all historical wells within a specified radius (in meters) of a location using $geoNear
 * @route   GET /api/wells/nearby
 * @access  Public
 */
const getNearbyWells = async (req, res, next) => {
  try {
    const { lat, lng, radius } = req.query;

    // Validate presence of required query parameters
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

    // Validate numeric formats and coordinate boundaries
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

    // Execute MongoDB $geoNear aggregation pipeline
    // Note: $geoNear must be the first stage in the aggregation pipeline
    const nearbyWells = await Well.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [longitude, latitude], // GeoJSON standard: [lng, lat]
          },
          key: 'location',
          distanceField: 'distance', // Calculates and appends distance in meters
          maxDistance: radiusMeters,
          query: { status: 'Historical' }, // Filter only historical wells
          spherical: true,
        },
      },
      {
        $sort: { distance: 1 }, // Nearest wells first
      },
    ]);

    return res.status(200).json({
      success: true,
      count: nearbyWells.length,
      query: {
        center: {
          latitude,
          longitude,
        },
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
    const activeWell = await Well.findOne({ status: 'Active' });

    if (!activeWell) {
      return res.status(404).json({
        success: false,
        message: 'No currently active well found in the database.',
      });
    }

    return res.status(200).json({
      success: true,
      well: activeWell,
    });
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
    const { status } = req.query;
    const filter = status ? { status } : {};
    const wells = await Well.find(filter).sort({ well_id: 1 });

    return res.status(200).json({
      success: true,
      count: wells.length,
      wells,
    });
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
    let well = await Well.findOne({ well_id: id });
    if (!well && id.match(/^[0-9a-fA-F]{24}$/)) {
      well = await Well.findById(id);
    }

    if (!well) {
      return res.status(404).json({
        success: false,
        message: `Well with ID '${id}' not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      well,
    });
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
