
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});


// MongoDB connection
const { MongoClient, ObjectId } = require('mongodb');
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'shrimata_billbook';
let db, dataCollection;

MongoClient.connect(MONGO_URL, { useUnifiedTopology: true })
  .then(client => {
    db = client.db(DB_NAME);
    dataCollection = db.collection('data');
    console.log('✅ Connected to MongoDB:', MONGO_URL, 'DB:', DB_NAME);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Always resolve the public directory absolutely
const publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(publicDir));




// Data routes (public, now using MongoDB)
app.get('/api/data', async (req, res) => {
  try {
    const data = await dataCollection.find({}).toArray();
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.get('/api/data/:id', async (req, res) => {
  try {
    const record = await dataCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!record) return res.status(404).json({ error: 'Record not found' });
    res.json({ data: record });
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID format' });
  }
});

app.post('/api/data', async (req, res) => {
  try {
    const now = new Date();
    const record = {
      ...req.body,
      createdAt: now,
      updatedAt: now
    };
    const result = await dataCollection.insertOne(record);
    res.status(201).json({ data: { ...record, _id: result.insertedId } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add record' });
  }
});

app.put('/api/data/:id', async (req, res) => {
  try {
    const update = {
      ...req.body,
      updatedAt: new Date()
    };
    const result = await dataCollection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: update },
      { returnDocument: 'after' }
    );
    if (!result.value) return res.status(404).json({ error: 'Record not found' });
    res.json({ data: result.value });
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID format' });
  }
});

app.delete('/api/data/:id', async (req, res) => {
  try {
    const result = await dataCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Record not found' });
    res.json({ message: 'Record deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID format' });
  }
});

// Start server after MongoDB is connected
function startServer() {
  app.listen(PORT, () => {
    console.log('🧾 Shrimata BillBook - Development Mode');
    console.log('=====================================');
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log('💾 Using MongoDB for persistent storage');
    console.log('');
    console.log('⚠️  This is DEVELOPMENT mode - not for production!');
    console.log('   For production, secure your environment and database.');
    console.log('');
  });
}

// Wait for MongoDB connection before starting server
const waitForDb = setInterval(() => {
  if (dataCollection) {
    clearInterval(waitForDb);
    startServer();
  }
}, 100);
