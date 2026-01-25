// Script to create user1 with password 'user123' in MongoDB using your existing User model
// Usage: node create-user1.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('./server/models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shrimata_billbook';

async function createUser() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  const existing = await User.findOne({ username: 'user1' });
  if (existing) {
    console.log('user1 already exists');
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash('user123', 10);
  const user = new User({ username: 'user1', password: passwordHash, role: 'user' });
  await user.save();
  console.log('user1 created successfully');
  process.exit(0);
}

createUser().catch(err => {
  console.error(err);
  process.exit(1);
});
