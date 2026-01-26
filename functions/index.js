const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();


// Hardcoded environment variables for Firebase Functions (free tier)
const ENV = {
  NODE_ENV: 'development',
  PORT: 3000,
  MONGODB_URI: 'mongodb://localhost:27017/shrimata_billbook',
  JWT_SECRET: 'your-super-secret-jwt-key-change-this-in-production-12345',
  DEFAULT_ADMIN_USERNAME: 'admin',
  DEFAULT_ADMIN_PASSWORD: 'admin123',
  SESSION_TIMEOUT: '24h',
  BCRYPT_ROUNDS: '10',
};

// Patch process.env for all downstream code
Object.assign(process.env, ENV);

const authRoutes = require('../server/routes/auth');
const dataRoutes = require('../server/routes/data');
const { initializeAdmin } = require('../server/utils/initAdmin');

const app = express();

// CORS for all origins (adjust for production)
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// MongoDB connection (only once)
let isConnected = false;
async function connectDB() {
  if (!isConnected) {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await initializeAdmin();
    isConnected = true;
  }
}

// Firebase Function export
exports.api = functions.https.onRequest(async (req, res) => {
  await connectDB();
  return app(req, res);
});
