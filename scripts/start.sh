#!/usr/bin/env bash
set -e

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; RED='\033[0;31m'; NC='\033[0m'
STEP=1

info()  { echo -e "${CYAN}[${STEP}]${NC} $1"; ((STEP++)); }
ok()    { echo -e "  ${GREEN}✓${NC} $1"; }
warn()  { echo -e "  ${YELLOW}⚠${NC} $1"; }
fail()  { echo -e "  ${RED}✗${NC} $1"; exit 1; }

wait_for_health() {
  local name=$1 url=$2 max=${3:-30}
  for i in $(seq 1 "$max"); do
    if curl -sf "$url" > /dev/null 2>&1; then ok "$name is healthy"; return 0; fi
    sleep 1
  done
  fail "$name did not become healthy after ${max}s"
}

cleanup() {
  echo
  info "Stopping all services..."
  docker compose down
  ok "All services stopped"
}
trap cleanup EXIT

# ─── Phase 1: Database ────────────────────────────────────────────────
echo -e "\n${YELLOW}═══ Phase 1: Starting Database ═══${NC}\n"

info "Starting DynamoDB Local..."
docker compose up -d dynamodb-local
sleep 3
wait_for_health "DynamoDB Local" "http://localhost:8000" 15

# ─── Phase 2: Backend Services ────────────────────────────────────────
echo -e "\n${YELLOW}═══ Phase 2: Starting Backend Services ═══${NC}\n"

info "Building and starting backend services..."
docker compose up -d --build sudoku-service numerox-service numerox-letters-service \
  logic-puzzles-service crosswords-service tango-service n-queens-service

BACKENDS=(
  "sudoku-service:5010"
  "numerox-service:5011"
  "numerox-letters-service:5012"
  "logic-puzzles-service:5013"
  "crosswords-service:5014"
  "tango-service:5015"
  "n-queens-service:5016"
)

for be in "${BACKENDS[@]}"; do
  name="${be%%:*}"
  port="${be##*:}"
  wait_for_health "$name" "http://localhost:$port/health" 30
done

info "Starting API Gateway..."
docker compose up -d --build gateway
wait_for_health "API Gateway" "http://localhost:8080/health" 15
ok "Backend services ready — gateway at http://localhost:8080"

# ─── Phase 3: Frontend Apps ───────────────────────────────────────────
echo -e "\n${YELLOW}═══ Phase 3: Starting Frontend Apps ═══${NC}\n"

info "Building and starting all frontend apps..."
docker compose up -d --build launcher sudoku-frontend numerox-frontend \
  numerox-letters-frontend logic-puzzles-frontend crosswords-frontend \
  tango-frontend n-queens-frontend

FRONTENDS=(
  "Launcher:8091"
  "Sudoku:5001"
  "Numerox:5002"
  "Numerox Letters:5003"
  "Logic Puzzles:5004"
  "Crosswords:5005"
  "Tango:5006"
  "N Queens:5007"
)

for fe in "${FRONTENDS[@]}"; do
  name="${fe%%:*}"
  port="${fe##*:}"
  if curl -sf "http://localhost:$port" > /dev/null 2>&1; then
    ok "$name frontend is up on :$port"
  else
    warn "$name frontend on :$port not responding yet (may still be building)"
  fi
done

# ─── Final Report ─────────────────────────────────────────────────────
echo -e "\n${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}  All systems ready!${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo
echo -e "  ${CYAN}Launcher:${NC}       http://localhost:8091"
echo -e "  ${CYAN}Gateway:${NC}        http://localhost:8080/health"
echo
echo -e "  ${CYAN}Frontend Games:${NC}"
echo -e "    Sudoku:          http://localhost:5001"
echo -e "    Numerox:         http://localhost:5002"
echo -e "    Numerox Letters: http://localhost:5003"
echo -e "    Logic Puzzles:   http://localhost:5004"
echo -e "    Crosswords:      http://localhost:5005"
echo -e "    Tango:           http://localhost:5006"
echo -e "    N Queens:        http://localhost:5007"
echo
echo -e "  ${CYAN}Backend APIs:${NC}"
echo -e "    Sudoku API:      http://localhost:5010/health"
echo -e "    Numerox API:     http://localhost:5011/health"
echo -e "    Numerox Letters: http://localhost:5012/health"
echo -e "    Logic Puzzles:   http://localhost:5013/health"
echo -e "    Crosswords API:  http://localhost:5014/health"
echo -e "    Tango API:       http://localhost:5015/health"
echo -e "    N Queens API:    http://localhost:5016/health"
echo
echo -e "  ${YELLOW}Press Ctrl+C to stop all services${NC}"
echo

# Keep running until Ctrl+C
while true; do sleep 10; done
