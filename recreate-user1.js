// Script to recreate user1 with password 'user123' using bcryptjs (to match backend)
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./server/models/User');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shrimata_billbook';

async function recreateUser() {
  await mongoose.connect(MONGODB_URI);
  await User.deleteOne({ username: 'user1' });
  const passwordHash = await bcrypt.hash('user123', 10);
  console.log('Generated hash for user1:', passwordHash);
  const user = new User({ username: 'user1', password: passwordHash, role: 'user' });
  await user.save();
  console.log('user1 recreated with bcryptjs');
  process.exit(0);
}

recreateUser().catch(err => {
  console.error(err);
  process.exit(1);
});
