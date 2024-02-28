#!/bin/bash

# Start the Docker containers for the database
echo "Setting up Docker containers for the database..."
cd backend || exit 1

# Start the Docker containers using docker-compose
echo "Starting Docker containers..."
docker compose up -d

# Wait for the containers to start
sleep 10

# Check docker status
docker compose ps
sleep 5

# Check if containers started successfully
if ! docker compose ps &>/dev/null; then
    echo "Docker containers failed to start."
    exit 1
fi

echo "Docker containers are running."

# Start the Spring Boot backend
echo "Starting Spring Boot backend..."
mvn spring-boot:run &

# Save the PID of the backend process
backend_pid=$!

# Wait for backend to start
sleep 10

# Start the React frontend
cd ..
echo "Starting React frontend..."
cd frontend || exit 1

# Check if node_modules directory exists
if [ ! -d "node_modules" ]; then
    # Install dependencies for frontend
    echo "Installing dependencies for frontend..."
    npm install || { echo "Failed to install frontend dependencies."; kill $backend_pid; exit 1; }
else
    echo "Node modules already installed."
fi

# Run npm run dev in background
npm run dev &	

# Save the PID of the frontend process
frontend_pid=$!

# Trap SIGINT (Ctrl+C) and stop background processes
trap 'echo "Stopping backend and frontend..."; kill $backend_pid $frontend_pid; exit 1' SIGINT

# Wait for frontend and backend to start
wait $backend_pid $frontend_pid
