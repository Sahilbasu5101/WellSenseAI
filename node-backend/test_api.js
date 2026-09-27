const http = require('http');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });
const PORT = process.env.PORT || 5000;

// Helper to make HTTP GET request
function get(urlPath) {
  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${PORT}${urlPath}`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('=' .repeat(70));
  console.log('RUNNING END-TO-END TESTS FOR WELLSENSE NODE.JS BACKEND');
  console.log('=' .repeat(70));

  try {
    // 1. Health check
    console.log('\n[1] Testing GET /api/health...');
    const health = await get('/api/health');
    console.log(`-> Status: ${health.status}, Response:`, health.body);
    if (health.status !== 200 || health.body.status !== 'healthy') {
      throw new Error('Health check failed');
    }

    // 2. Fetch Active Well
    console.log('\n[2] Testing GET /api/wells/active...');
    const activeRes = await get('/api/wells/active');
    console.log(`-> Status: ${activeRes.status}`);
    if (activeRes.status !== 200 || !activeRes.body.well) {
      throw new Error('Failed to fetch active well');
    }
    const activeWell = activeRes.body.well;
    console.log(`-> Active Well ID: ${activeWell.well_id}`);
    console.log(`-> Name: ${activeWell.name}`);
    console.log(`-> Status: ${activeWell.status}`);
    console.log(`-> Coordinates [Lng, Lat]:`, activeWell.location.coordinates);
    console.log(`-> Formations count: ${activeWell.formations.length}`);

    const [activeLng, activeLat] = activeWell.location.coordinates;

    // 3. Fetch Nearby Historical Wells using $geoNear
    console.log(`\n[3] Testing GET /api/wells/nearby around Active Well (Lat: ${activeLat}, Lng: ${activeLng}, Radius: 15,000m)...`);
    const nearbyRes = await get(`/api/wells/nearby?lat=${activeLat}&lng=${activeLng}&radius=15000`);
    console.log(`-> Status: ${nearbyRes.status}`);
    if (nearbyRes.status !== 200) {
      throw new Error(`Nearby query failed with status ${nearbyRes.status}`);
    }

    const { count, wells } = nearbyRes.body;
    console.log(`-> Found ${count} historical wells within 15 km radius.`);
    if (count === 0) {
      throw new Error('Expected nearby wells, but none returned');
    }

    // Verify distance sorting and historical status
    let lastDistance = -1;
    wells.forEach((w, idx) => {
      console.log(`   #${idx + 1} | Well: ${w.well_id} (${w.name}) | Distance: ${w.distance.toFixed(1)}m | Status: ${w.status}`);
      if (w.status !== 'Historical') {
        throw new Error(`Well ${w.well_id} has non-historical status: ${w.status}`);
      }
      if (w.distance < lastDistance) {
        throw new Error(`Wells are not sorted by distance ascending!`);
      }
      lastDistance = w.distance;
    });

    // 4. Test validation error (missing radius)
    console.log('\n[4] Testing GET /api/wells/nearby with missing radius parameter (Validation Test)...');
    const invalidRes = await get(`/api/wells/nearby?lat=${activeLat}&lng=${activeLng}`);
    console.log(`-> Status: ${invalidRes.status} (Expected 400)`);
    console.log(`-> Error Message: ${invalidRes.body.message}`);
    if (invalidRes.status !== 400) {
      throw new Error('Expected 400 Bad Request for missing radius');
    }

    // 5. Test validation error (invalid latitude)
    console.log('\n[5] Testing GET /api/wells/nearby with invalid latitude 999...');
    const invalidLatRes = await get(`/api/wells/nearby?lat=999&lng=${activeLng}&radius=5000`);
    console.log(`-> Status: ${invalidLatRes.status} (Expected 400)`);
    console.log(`-> Error Message: ${invalidLatRes.body.message}`);
    if (invalidLatRes.status !== 400) {
      throw new Error('Expected 400 Bad Request for invalid latitude');
    }

    // 6. Test GET /api/wells (All wells)
    console.log('\n[6] Testing GET /api/wells (Listing all wells)...');
    const allRes = await get('/api/wells');
    console.log(`-> Status: ${allRes.status}, Total Wells: ${allRes.body.count}`);
    if (allRes.status !== 200 || allRes.body.count !== 15) {
      throw new Error(`Expected 15 wells, got ${allRes.body.count}`);
    }

    console.log('\n' + '='.repeat(70));
    console.log('ALL NODE.JS EXPRESS BACKEND TESTS PASSED SUCCESSFULLY!');
    console.log('='.repeat(70));
    process.exit(0);
  } catch (err) {
    console.error('\nTest failed:', err.message);
    process.exit(1);
  }
}

// Start test runner
runTests();
