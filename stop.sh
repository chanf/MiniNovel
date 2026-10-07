#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ $# -gt 1 ]]; then
  printf 'Usage: %s [local|docker]\n' "$0" >&2
  exit 1
fi
case "${1:-local}" in
  -h|--help) printf 'Usage: %s [local|docker] (default: local)\n' "$0" ;;
  local|docker) exec bash "$ROOT/scripts/deploy.sh" "${1:-local}" stop ;;
  *) printf 'Unknown mode: %s. Use local or docker.\n' "$1" >&2; exit 1 ;;
esac
