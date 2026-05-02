#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# NutriAI — Production startup script
# Builds the React frontend then starts FastAPI to serve everything on one port.
# Usage:  bash start.sh [port]   (default port: 5000)
# ─────────────────────────────────────────────────────────────────────────────

set -e

PORT="${1:-5000}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║          NutriAI — Production Build      ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# ── 1. Install Python dependencies ───────────────────────────────────────────
echo "▶ Installing Python dependencies..."
pip install -r "$SCRIPT_DIR/src/requirements.txt" --quiet

# ── 2. Install Node dependencies ─────────────────────────────────────────────
echo "▶ Installing Node dependencies..."
cd "$SCRIPT_DIR/frontend"
npm install --legacy-peer-deps --silent

# ── 3. Build React app ────────────────────────────────────────────────────────
echo "▶ Building React frontend..."
npm run build

echo "✔ Frontend built → frontend/dist/"

# ── 4. Start FastAPI (serves API + built frontend) ───────────────────────────
echo ""
echo "▶ Starting NutriAI server on port $PORT..."
echo "   API docs  → http://localhost:$PORT/api/docs"
echo "   App       → http://localhost:$PORT/"
echo ""

cd "$SCRIPT_DIR/src"
exec uvicorn main:app --host 0.0.0.0 --port "$PORT"
