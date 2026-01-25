# 🧾 Shrimata BillBook - Secure Business Management System

A full-stack business management application with secure authentication, role-based access control, and database persistence.

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Admin and User roles with different permissions
- **Encrypted Passwords**: bcrypt password hashing
- **MongoDB Database**: All data stored securely in database
- **Rate Limiting**: Protection against brute-force attacks
- **Helmet Security**: HTTP security headers

## 👥 User Roles

### Admin Role
- Full access to all features
- Can view, create, edit, and delete all records
- Access to Dashboard, Orders, Attendance, Production, Expenses, Products, Rolls, Master Workers
- Can manage users

### User Role  
- **Limited Access**: Only Production tab visible
- **Today's Data Only**: Can only view and add today's production records
- **No Delete/Edit**: Cannot edit or delete existing records
- **Restricted Tabs**: Other tabs are locked with access denied message

## 📋 Prerequisites

1. **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
2. **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## 🚀 Installation & Setup

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Environment Variables

The `.env` file is already created with default values. **IMPORTANT**: Change these in production!

```env
# MongoDB Connection - Update this with your MongoDB URI
MONGODB_URI=mongodb://localhost:27017/shrimata_billbook

# JWT Secret - CHANGE THIS to a random string in production!
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345

# Admin Credentials - Change these after first login!
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=admin123
```

### Step 3: Start MongoDB

**Option A: Local MongoDB**
```bash
# macOS with Homebrew
brew services start mongodb-community

# Or start manually
mongod --dbpath /path/to/your/data/directory
```

**Option B: MongoDB Atlas (Cloud)**
1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string and update `MONGODB_URI` in `.env`

### Step 4: Start the Server

```bash
# Development mode (auto-restart on changes)
npm run dev

# Or production mode
npm start
```

Server will start at: **http://localhost:3000**

## 🔑 Default Login Credentials

**Admin Account:**
- Username: `admin`
- Password: `admin123`

⚠️ **IMPORTANT**: Change the admin password immediately after first login!

## 📖 Usage Guide

### First Time Setup

1. Open browser and go to `http://localhost:3000`
2. Login with admin credentials
3. The system will automatically:
   - Create default admin user
   - Initialize empty database
   - Show login page

### Creating Users

Currently, users must be created directly in MongoDB. To add a new user:

```javascript
// Connect to MongoDB and run:
db.users.insertOne({
  username: "worker1",
  password: "$2a$10$...", // Use bcrypt to hash password
  role: "user",
  fullName: "Worker Name",
  isActive: true,
  createdAt: new Date()
})
```

Or use MongoDB Compass/Studio to add users with hashed passwords.

### Admin Features

- **Dashboard**: Overview of business metrics
- **Orders**: Manage customer orders and payments
- **Attendance**: Track worker attendance
- **Production**: Record daily production data
- **Expenses**: Track investments and household expenses
- **Products**: Manage product catalog
- **Rolls**: Inventory management with smart cutting optimization
- **Master Workers**: Manage worker profiles

### User Features

- **Production Tab Only**: Can add today's production records
- **View Only**: Cannot see historical data
- **No Modifications**: Cannot edit or delete existing records
- **Locked Tabs**: Other sections show "Access Denied" message

## 🏗️ Project Structure

```
Shrimata_BillBook/
├── server/
│   ├── index.js              # Main server file
│   ├── models/
│   │   ├── User.js           # User authentication model
│   │   └── Data.js           # Unified data model
│   ├── routes/
│   │   ├── auth.js           # Authentication endpoints
│   │   └── data.js           # Data CRUD endpoints
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   └── utils/
│       └── initAdmin.js      # Initialize default admin
├── public/
│   ├── index.html            # Login page
│   ├── app.html              # Main application
│   └── js/
│       └── api-client.js     # Secure API client
├── .env                      # Environment variables
├── .gitignore                # Git ignore rules
├── package.json              # Dependencies
└── README.md                 # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout

### Data Operations
- `GET /api/data` - Get all data (filtered by role)
- `GET /api/data/:id` - Get single record
- `POST /api/data` - Create new record
- `PUT /api/data/:id` - Update record
- `DELETE /api/data/:id` - Delete record (admin only)

## 🛡️ Security Best Practices

1. **Change Default Credentials**: Immediately change admin password after setup
2. **Use Strong JWT Secret**: Generate a random secret key for production
3. **HTTPS in Production**: Always use HTTPS in production
4. **Environment Variables**: Never commit `.env` file to git
5. **MongoDB Access**: Secure MongoDB with authentication and firewall rules
6. **Rate Limiting**: Already enabled to prevent brute-force attacks
7. **Regular Updates**: Keep dependencies up to date

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Make sure MongoDB is running. Start it with `brew services start mongodb-community` or `mongod`.

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution**: Either stop the process using port 3000 or change `PORT` in `.env` file.

### Token Expired
**Solution**: Logout and login again. Tokens expire after 24 hours by default.

### Cannot Access Other Tabs (User Role)
**Solution**: This is intentional. Regular users can only access Production tab. Login as admin for full access.

## 📦 Production Deployment

### Environment Setup
1. Set `NODE_ENV=production` in `.env`
2. Use strong, random `JWT_SECRET`
3. Use MongoDB Atlas or secure MongoDB instance
4. Enable HTTPS
5. Configure CORS for your domain

### Process Manager (PM2)
```bash
npm install -g pm2
pm2 start server/index.js --name shrimata-billbook
pm2 save
pm2 startup
```

## 📞 Support

For issues or questions:
1. Check troubleshooting section
2. Review server logs
3. Check MongoDB connection
4. Verify environment variables

## 🔄 Data Migration

If you have existing data in localStorage from the old system:

1. Export data from browser console:
```javascript
const data = JSON.parse(localStorage.getItem('shrimata_data_v1'));
console.log(JSON.stringify(data, null, 2));
```

2. Use MongoDB import or create migration script to import to database

## ⚙️ Advanced Configuration

### Session Timeout
Change `SESSION_TIMEOUT` in `.env` (default: 24h)

### Password Strength
Adjust `BCRYPT_ROUNDS` in `.env` (default: 10, higher = more secure but slower)

### Rate Limiting
Edit `server/index.js` to adjust rate limits (default: 100 requests per 15 minutes)

---

**Version**: 2.0.0  
**Last Updated**: January 2026  
**License**: Proprietary - All Rights Reserved
