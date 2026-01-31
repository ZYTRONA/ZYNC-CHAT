#!/bin/bash

# ZYNC-CHAT Development Startup Script
# This script starts both backend and frontend in development mode

echo "======================================"
echo "   ZYNC-CHAT Development Startup"
echo "======================================"
echo ""

# Check if MongoDB is running
echo "Checking MongoDB status..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running!"
    echo "Starting MongoDB..."
    sudo systemctl start mongod
    sleep 2
fi

if pgrep -x "mongod" > /dev/null; then
    echo "✅ MongoDB is running"
else
    echo "❌ Failed to start MongoDB. Please start it manually."
    exit 1
fi

echo ""
echo "======================================"
echo "   Starting Backend Server"
echo "======================================"
cd Server

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

# Start backend in background
echo "Starting backend on http://localhost:5000"
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

echo ""
echo "======================================"
echo "   Starting Frontend Client"
echo "======================================"
cd ../Client

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Start frontend
echo "Starting frontend on http://localhost:3000"
npm start &
FRONTEND_PID=$!

echo ""
echo "======================================"
echo "   ZYNC-CHAT is starting..."
echo "======================================"
echo ""
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Backend PID:  $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Press Ctrl+C to stop all services"
echo "======================================"

# Wait for user interrupt
wait
