#!/bin/bash

echo "🧾 Shrimata BillBook - Starting Server..."
echo ""

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running!"
    echo ""
    echo "Please start MongoDB first using one of these options:"
    echo ""
    echo "  Option 1 (Recommended for macOS):"
    echo "    brew services start mongodb-community"
    echo ""
    echo "  Option 2 (Manual start):"
    echo "    mongod --dbpath ~/data/db"
    echo ""
    echo "  Option 3 (Cloud - MongoDB Atlas):"
    echo "    1. Sign up at https://www.mongodb.com/cloud/atlas"
    echo "    2. Create a cluster and get connection string"
    echo "    3. Update MONGODB_URI in .env file"
    echo ""
    echo "After starting MongoDB, run: npm start"
    echo ""
    exit 1
fi

echo "✅ MongoDB is running"
echo "🚀 Starting server..."
echo ""

node server/index.js
