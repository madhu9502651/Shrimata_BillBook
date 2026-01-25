// Script to print user1 document from the database for verification
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./server/models/User');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shrimata_billbook';

async function printUser1() {
  await mongoose.connect(MONGODB_URI);
  const user = await User.findOne({ username: 'user1' });
  console.log('user1 document from DB:', user);
  process.exit(0);
}

printUser1().catch(err => {
  console.error(err);
  process.exit(1);
});
