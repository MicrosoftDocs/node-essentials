#!/usr/bin/env bash
#
# Test all three test frameworks sequentially: install, build, and run tests.
#
# Usage: ./validate-all-frameworks.sh
#

set -o pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Repo root is two levels up from .github/test
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

# Frameworks to test
declare -a FRAMEWORKS=("Node.js Test Runner:test-with-node-testrunner:false" "Jest:test-with-jest:true" "Vitest:test-with-vitest:true")

# Results tracking
PASS_COUNT=0
FAIL_COUNT=0
TOTAL_COUNT=${#FRAMEWORKS[@]}

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

echo -e "${CYAN}================================================${NC}"
echo -e "${CYAN}Test SDK Integration Validation${NC}"
echo -e "${CYAN}Started: $TIMESTAMP${NC}"
echo -e "${CYAN}================================================${NC}"
echo ""

# Process each framework
for framework_config in "${FRAMEWORKS[@]}"; do
    IFS=':' read -r FRAMEWORK_NAME FRAMEWORK_DIR BUILD_STEP <<< "$framework_config"
    FRAMEWORK_PATH="$REPO_ROOT/$FRAMEWORK_DIR"
    STATUS="PASS"
    DETAILS=()
    
    echo -e "${YELLOW}Testing: $FRAMEWORK_NAME${NC}"
    echo -e "${GRAY}Path: $FRAMEWORK_PATH${NC}"
    
    # Check directory exists
    if [ ! -d "$FRAMEWORK_PATH" ]; then
        echo -e "  ${RED}❌ Directory not found${NC}"
        STATUS="FAIL"
        DETAILS+=("Directory not found: $FRAMEWORK_PATH")
        ((FAIL_COUNT++))
        echo ""
        continue
    fi
    
    # Change to framework directory
    cd "$FRAMEWORK_PATH" || exit 1
    
    # Step 1: npm install
    echo -e "  ${GRAY}[1/3] Installing dependencies...${NC}"
    if npm install; then
        echo -e "  ${GREEN}✅ Dependencies installed${NC}"
        DETAILS+=("npm install: OK")
    else
        echo -e "  ${RED}❌ npm install failed${NC}"
        STATUS="FAIL"
        DETAILS+=("npm install failed")
    fi
    
    # Step 2: Build (if needed)
    if [ "$BUILD_STEP" = "true" ]; then
        echo -e "  ${GRAY}[2/3] Building...${NC}"
        if npm run build; then
            echo -e "  ${GREEN}✅ Build successful${NC}"
            DETAILS+=("npm run build: OK")
        else
            echo -e "  ${YELLOW}⚠️  Build had issues${NC}"
            DETAILS+=("npm run build: issues")
        fi
    else
        echo -e "  ${GRAY}[2/3] Build (skipped - not needed)${NC}"
        DETAILS+=("Build: skipped")
    fi
    
    # Step 3: Run tests
    echo -e "  ${GRAY}[3/3] Running tests...${NC}"
    if npm test; then
        echo -e "  ${GREEN}✅ Tests passed${NC}"
        DETAILS+=("npm test: OK")
    else
        echo -e "  ${RED}❌ Tests failed${NC}"
        STATUS="FAIL"
        DETAILS+=("npm test failed")
    fi
    
    # Track results
    if [ "$STATUS" = "PASS" ]; then
        ((PASS_COUNT++))
        echo -e "  ${GREEN}Status: $STATUS${NC}"
    else
        ((FAIL_COUNT++))
        echo -e "  ${RED}Status: $STATUS${NC}"
    fi
    
    echo ""
done

# Summary report
echo -e "${CYAN}================================================${NC}"
echo -e "${CYAN}Summary Report${NC}"
echo -e "${CYAN}================================================${NC}"
echo ""

# Re-iterate to show summary (simplified - just showing counts)
echo -e "Results: ${GREEN}$PASS_COUNT PASS${NC}, $([ $FAIL_COUNT -eq 0 ] && echo -e "${GREEN}$FAIL_COUNT FAIL${NC}" || echo -e "${RED}$FAIL_COUNT FAIL${NC}") out of $TOTAL_COUNT frameworks"
echo ""

# Exit with appropriate code
if [ $FAIL_COUNT -eq 0 ]; then
    exit 0
else
    exit 1
fi
