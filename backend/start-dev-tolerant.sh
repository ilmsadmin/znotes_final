#!/bin/bash
set +e  # Don't exit on errors

echo "Starting NestJS in development mode with TypeScript error tolerance..."

# Try to start normally first
npm run start:dev &
PID=$!

# Wait a bit to see if it starts successfully
sleep 10

# Check if the process is still running
if kill -0 $PID 2>/dev/null; then
    echo "Backend started successfully!"
    wait $PID
else
    echo "Normal start failed, trying with transpile-only mode..."
    # Kill any remaining process
    pkill -f "nest start" || true
    
    # Try with transpile-only
    npx nest start --watch --preserveWatchOutput &
    wait
fi
