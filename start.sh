#!/bin/bash

# Neva AI — Start both frontend and backend servers

echo "🚀 Starting Neva AI..."
echo ""

# Check if backend port is available
if ! nc -z localhost 5000 2>/dev/null; then
    echo "Starting backend API (port 5000)..."
    python3 backend.py &
    BACKEND_PID=$!
    sleep 2
else
    echo "⚠️  Port 5000 already in use"
fi

# Check if frontend port is available
if ! nc -z localhost 5173 2>/dev/null; then
    echo "Starting frontend dev server (port 5173)..."
    npm run dev &
    FRONTEND_PID=$!
else
    echo "⚠️  Port 5173 already in use"
fi

echo ""
echo "✅ Servers started!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5000"
echo "   Health:   http://localhost:5000/health"
echo ""
echo "Press Ctrl+C to stop all servers"

# Keep script running
wait
