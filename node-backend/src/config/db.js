const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.warn('[MongoDB] MONGODB_URI not set — running in static data mode (no DB).');
      return;
    }
    const conn = await mongoose.connect(mongoUri);
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    console.warn('[MongoDB] Continuing without database — static data mode active.');
    // Do NOT exit; let the server run with hardcoded fallback data
  }
};

module.exports = connectDB;
