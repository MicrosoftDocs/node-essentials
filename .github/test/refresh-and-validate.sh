#!/usr/bin/env bash
#
# Refresh dependency manifests, then validate all test framework samples.
#

set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

error() {
    echo -e "${RED}ERROR:${NC} $1" >&2
}

run_phase() {
    local title="$1"
    local script_path="$2"

    echo -e "${CYAN}================================================${NC}"
    echo -e "${CYAN}${title}${NC}"
    echo -e "${CYAN}================================================${NC}"

    if ! bash "$script_path"; then
        error "${title} failed."
        exit 1
    fi

    echo ""
}

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

echo -e "${CYAN}================================================${NC}"
echo -e "${CYAN}Refresh Dependencies & Validate Frameworks${NC}"
echo -e "${CYAN}Started: $TIMESTAMP${NC}"
echo -e "${CYAN}================================================${NC}"
echo ""

run_phase "Phase 1: Refresh dependencies" "$SCRIPT_DIR/install.sh"
run_phase "Phase 2: Validate frameworks" "$SCRIPT_DIR/validate-all-frameworks.sh"

echo -e "${CYAN}================================================${NC}"
echo -e "${GREEN}✅ Refresh and validation completed successfully${NC}"
echo -e "${CYAN}================================================${NC}"
