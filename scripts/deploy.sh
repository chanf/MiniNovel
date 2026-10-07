#!/usr/bin/env bash
# Deploy the current milestone; generation and TTS remain separate milestones.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PYTHON="$ROOT/.venv/bin/python"
PORT="${MININOVEL_PORT:-9513}"
DATA_DIR="${MININOVEL_DATA_DIR:-$ROOT/.data}"
COMPOSE_PROJECT="${MININOVEL_COMPOSE_PROJECT:-mininovel}"

usage() {
  printf '%s\n' \
    'Usage: ./scripts/deploy.sh <local|docker> <command>' \
    '' \
    'local:  install | run | start | stop | restart | status | logs' \
    'docker: build | start | stop | restart | status | logs' \
    '' \
    'Default URL: http://127.0.0.1:9513' \
    'MININOVEL_PORT changes the host port.' \
    'MININOVEL_DATA_DIR changes the local data directory (use an absolute path).' \
    'Docker uses its own persistent named volume; stop never deletes data.' \
    'Local deployment requires uv. Docker requires a running engine and Compose.'
}
fail() { printf 'Error: %s\n' "$*" >&2; exit 1; }

MODE="${1:-}"
ACTION="${2:-}"
if [[ "$MODE" == '-h' || "$MODE" == '--help' || "$MODE" == 'help' ]]; then
  usage
  exit 0
fi
[[ $# == 2 ]] || { usage; exit 1; }
[[ "$PORT" =~ ^[0-9]+$ && ${#PORT} -le 5 ]] || fail 'MININOVEL_PORT must be an integer from 1 to 65535.'
PORT="$((10#$PORT))"
(( PORT >= 1 && PORT <= 65535 )) || fail 'MININOVEL_PORT must be from 1 to 65535.'
export MININOVEL_PORT="$PORT"

require_uv() {
  command -v uv >/dev/null 2>&1 || fail 'Install uv first: https://docs.astral.sh/uv/getting-started/installation/'
}
install_local() {
  require_uv
  uv sync --project "$ROOT" --python 3.12 --frozen --no-dev
}
require_environment() {
  [[ -x "$PYTHON" ]] || fail 'Run ./scripts/deploy.sh local install first.'
}
compose() {
  docker compose --project-directory "$ROOT" -p "$COMPOSE_PROJECT" -f "$ROOT/compose.yaml" "$@"
}

case "$MODE" in
  local)
    case "$ACTION" in
      install) install_local ;;
      run)
        install_local
        export MININOVEL_DATA_DIR="$DATA_DIR"
        exec "$PYTHON" "$ROOT/scripts/local_deploy.py" run --port "$PORT" --data-dir "$DATA_DIR"
        ;;
      start|restart)
        install_local
        exec "$PYTHON" "$ROOT/scripts/local_deploy.py" "$ACTION" --port "$PORT" --data-dir "$DATA_DIR"
        ;;
      stop|status|logs)
        require_environment
        exec "$PYTHON" "$ROOT/scripts/local_deploy.py" "$ACTION"
        ;;
      *) usage; fail "Unknown local command: $ACTION" ;;
    esac
    ;;
  docker)
    case "$ACTION" in build|start|stop|restart|status|logs) ;; *) usage; fail "Unknown Docker command: $ACTION" ;; esac
    command -v docker >/dev/null 2>&1 || fail 'Install Docker Desktop or another Docker engine first.'
    docker compose version >/dev/null 2>&1 || fail 'Docker Compose is not available.'
    docker info >/dev/null 2>&1 || fail 'Docker engine is not running. Start Docker Desktop, then retry.'
    case "$ACTION" in
      build) compose build ;;
      start)
        compose up --build --detach --wait --wait-timeout 90
        printf 'MiniNovel: http://127.0.0.1:%s\n' "$PORT"
        printf '%s\n' 'Project configuration and API keys are stored in the persistent SQLite database.'
        ;;
      stop) compose down ;;
      restart)
        # Recreate to apply changed port and image configuration, retaining the volume.
        compose up --build --detach --force-recreate --wait --wait-timeout 90
        printf 'MiniNovel: http://127.0.0.1:%s\n' "$PORT"
        ;;
      status) compose ps ;;
      logs) compose logs --tail=100 --follow ;;
    esac
    ;;
  *) usage; fail "Unknown deployment mode: $MODE" ;;
esac
