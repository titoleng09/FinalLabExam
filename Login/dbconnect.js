// STEP-1 : IMPORT MONGOOSE PACKAGE
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Database Connection URL (from .env / Kubernetes env)
const uri = process.env.MONGO_URI;

const clientOptions = {
  dbName: process.env.DB_NAME || 'studentdb',
  serverApi: { version: '1', strict: true, deprecationErrors: true }
};

async function run() {
  // STEP-2 : ESTABLISH CONNECTION WITH MONGODB DATABASE THROUGH MONGOOSE
  await mongoose.connect(uri, clientOptions);
  await mongoose.connection.db.admin().command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
}
run().catch(console.dir);

// STEP-3 : EXPORT MODULE mongoose because we need it in other JS file
module.exports = mongoose;
