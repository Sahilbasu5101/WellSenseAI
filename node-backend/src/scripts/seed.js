const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const Well = require('../models/Well');

const resolveWellsDataFile = () => {
  const candidatePaths = [
    process.env.WELLS_DATA_PATH,
    path.resolve(__dirname, '../../../wells_data.json'),
    path.resolve(__dirname, '../../wells_data.json'),
    path.resolve(process.cwd(), 'wells_data.json'),
    path.resolve(process.cwd(), '../wells_data.json'),
  ].filter(Boolean);

  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  return null;
};

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/wellsense_db';
    console.log(`[Seed] Connecting to MongoDB: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    const dataPath = resolveWellsDataFile();
    if (!dataPath) {
      throw new Error('wells_data.json file not found! Please run generate_mock_data.py first.');
    }

    console.log(`[Seed] Reading wells dataset from: ${dataPath}`);
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const wellsData = JSON.parse(rawData);

    console.log(`[Seed] Found ${wellsData.length} wells in dataset.`);

    // Clear existing data
    const deleted = await Well.deleteMany({});
    console.log(`[Seed] Purged ${deleted.deletedCount} existing well records.`);

    // Drop any prior indexes and create clean 2dsphere index
    try {
      await Well.collection.dropIndexes();
    } catch (e) {
      // ignore if collection newly created
    }
    await Well.createIndexes();
    console.log('[Seed] Ensured 2dsphere geospatial index on location field.');

    // Insert new records
    const insertedWells = await Well.insertMany(wellsData);
    console.log(`[Seed] Successfully inserted ${insertedWells.length} wells into MongoDB.`);

    const activeCount = await Well.countDocuments({ status: 'Active' });
    const historicalCount = await Well.countDocuments({ status: 'Historical' });

    console.log(`[Seed] Summary:`);
    console.log(`   - Active Wells: ${activeCount}`);
    console.log(`   - Historical Wells: ${historicalCount}`);
    console.log('[Seed] Database seeding completed successfully!');
  } catch (error) {
    console.error(`[Seed] Seeding failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('[Seed] Disconnected from MongoDB.');
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
