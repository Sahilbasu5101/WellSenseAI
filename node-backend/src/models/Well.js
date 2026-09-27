const mongoose = require('mongoose');

// Sub-schema for geological formations encountered in the wellbore
const formationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Formation name is required'],
      trim: true,
    },
    depth_start: {
      type: Number,
      required: [true, 'Formation starting depth is required'],
      min: 0,
    },
    depth_end: {
      type: Number,
      required: [true, 'Formation ending depth is required'],
      min: 0,
    },
  },
  { _id: false }
);

// GeoJSON Point Schema
const pointSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude] per GeoJSON standard
      required: [true, 'Coordinates [longitude, latitude] are required'],
      validate: {
        validator: function (coords) {
          return (
            Array.isArray(coords) &&
            coords.length === 2 &&
            coords[0] >= -180 &&
            coords[0] <= 180 && // Longitude: -180 to 180
            coords[1] >= -90 &&
            coords[1] <= 90 // Latitude: -90 to 90
          );
        },
        message: 'Coordinates must be valid [longitude (-180 to 180), latitude (-90 to 90)]',
      },
    },
  },
  { _id: false }
);

// Well Schema
const wellSchema = new mongoose.Schema(
  {
    well_id: {
      type: String,
      required: [true, 'Well ID is required'],
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Well name is required'],
      trim: true,
    },
    status: {
      type: String,
      required: [true, 'Operational status is required'],
      enum: ['Active', 'Historical'],
      default: 'Historical',
      index: true,
    },
    location: {
      type: pointSchema,
      required: [true, 'GeoJSON location is required'],
    },
    total_depth: {
      type: Number,
      required: [true, 'Total depth is required'],
      min: 0,
    },
    formations: {
      type: [formationSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// 2dsphere index on location field for MongoDB geospatial queries ($geoNear, $nearSphere, etc.)
wellSchema.index({ location: '2dsphere' });

const Well = mongoose.model('Well', wellSchema);

module.exports = Well;
