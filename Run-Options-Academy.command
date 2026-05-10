#!/bin/bash

# Navigate to the project directory
cd "$(dirname "$0")"

echo "--------------------------------------------------"
echo "   🚀 Starting Options Academy - Paper Trading"
echo "--------------------------------------------------"

# Check if node_modules exists in root, server, and client
if [ ! -d "node_modules" ] || [ ! -d "webapp/server/node_modules" ] || [ ! -d "webapp/client/node_modules" ]; then
    echo "📦 Installing dependencies (this may take a minute)..."
    npm run install-all
fi

# Ensure database is synced
echo "🗄️ Checking database schema..."
npm run db-setup

echo "✨ Launching Application..."
echo "--------------------------------------------------"
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:3002"
echo "--------------------------------------------------"

# Run the app
npm run start-app
