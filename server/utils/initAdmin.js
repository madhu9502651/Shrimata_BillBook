const User = require('../models/User');

async function initializeAdmin() {
  try {
    const adminCount = await User.countDocuments({ role: 'admin' });
    
    if (adminCount === 0) {
      const admin = new User({
        username: process.env.DEFAULT_ADMIN_USERNAME || 'admin',
        password: process.env.DEFAULT_ADMIN_PASSWORD || 'admin123',
        role: 'admin',
        fullName: 'System Administrator',
        isActive: true
      });

      await admin.save();
      console.log('✅ Default admin user created');
      console.log(`   Username: ${admin.username}`);
      console.log(`   Password: ${process.env.DEFAULT_ADMIN_PASSWORD || 'admin123'}`);
      console.log('   ⚠️  CHANGE THIS PASSWORD IMMEDIATELY!');
    }
  } catch (error) {
    console.error('❌ Failed to initialize admin:', error);
  }
}

module.exports = { initializeAdmin };
