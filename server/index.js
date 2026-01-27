const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');

const { initializeAdmin } = require('./utils/initAdmin');
const shareReceiptRoutes = require('./routes/shareReceipt');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for development, configure properly for production
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'your-production-domain.com' 
    : '*',
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use(express.static('public'));

// API Routes

app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/share-receipt', shareReceiptRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('✅ Connected to MongoDB');
  
  // Initialize default admin user
  await initializeAdmin();
  
  // Start server
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    console.log(`\n📝 To login:`);
    console.log(`   1. Open http://localhost:${PORT} in your browser`);
    console.log(`   2. Use credentials: admin / admin123`);
    console.log(`   3. ⚠️  Change password after first login!\n`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  console.log('\n⚠️  MongoDB is not running. Please start MongoDB first:');
  console.log('   Option 1 (macOS): brew services start mongodb-community');
  console.log('   Option 2 (Manual): mongod --dbpath /path/to/data');
  console.log('   Option 3 (Cloud): Use MongoDB Atlas - update MONGODB_URI in .env\n');
  process.exit(1);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

module.exports = app;
