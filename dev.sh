#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# NutriAI — Development mode
# Starts FastAPI (port 8000) and Vite dev server (port 5000) in parallel.
# Usage:  bash dev.sh
# ─────────────────────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║          NutriAI — Dev Mode              ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "  Backend  → http://localhost:8000"
echo "  Frontend → http://localhost:5000"
echo "  API docs → http://localhost:8000/api/docs"
echo ""

# Start backend
cd "$SCRIPT_DIR/src"
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# Start frontend
cd "$SCRIPT_DIR/frontend"
npm run dev &
FRONTEND_PID=$!

# Graceful shutdown on Ctrl-C
trap "echo ''; echo 'Shutting down...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" INT TERM

wait $BACKEND_PID $FRONTEND_PID
