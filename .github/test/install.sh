#!/usr/bin/env bash
#
# Refresh workspace dependency manifests for the test framework samples.
#

set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
GRAY='\033[0;37m'
NC='\033[0m'

declare -a TEST_DIRS=("test-with-node-testrunner" "test-with-jest" "test-with-vitest")

error() {
    echo -e "${RED}ERROR:${NC} $1" >&2
}

require_command() {
    local command_name="$1"

    if ! command -v "$command_name" >/dev/null; then
        error "Required command not found: $command_name"
        exit 1
    fi
}

cleanup_backups() {
    for test_dir in "${TEST_DIRS[@]}"; do
        rm -f "$REPO_ROOT/$test_dir/package.old.json"
    done
}

trap 'error "Dependency refresh failed. Existing package.old.json backups were kept for troubleshooting."' ERR

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

echo -e "${CYAN}================================================${NC}"
echo -e "${CYAN}NPM Dependency Refresh${NC}"
echo -e "${CYAN}Started: $TIMESTAMP${NC}"
echo -e "${CYAN}================================================${NC}"
echo ""

require_command jq
require_command npm
require_command node

if ! NODE_VERSION=$(node --version); then
    error "Unable to determine the installed Node.js version."
    exit 1
fi

if ! NPM_VERSION=$(npm --version); then
    error "Unable to determine the installed npm version."
    exit 1
fi

echo -e "${GRAY}Using Node.js ${NODE_VERSION} and npm ${NPM_VERSION}${NC}"
echo ""

echo -e "${CYAN}Phase 1: Validate manifests and create backups${NC}"
echo -e "${CYAN}=============================================${NC}"
echo ""

for test_dir in "${TEST_DIRS[@]}"; do
    TEST_PATH="$REPO_ROOT/$test_dir"
    PACKAGE_JSON="$TEST_PATH/package.json"
    PACKAGE_OLD="$TEST_PATH/package.old.json"

    echo -e "${YELLOW}Processing: $test_dir${NC}"

    if [ ! -d "$TEST_PATH" ]; then
        error "Directory not found: $TEST_PATH"
        exit 1
    fi

    if [ ! -f "$PACKAGE_JSON" ]; then
        error "package.json not found: $PACKAGE_JSON"
        exit 1
    fi

    if ! jq empty "$PACKAGE_JSON" >/dev/null; then
        error "Invalid JSON in $PACKAGE_JSON"
        exit 1
    fi

    cp "$PACKAGE_JSON" "$PACKAGE_OLD"

    PACKAGE_NAME=$(jq -r '.name // empty' "$PACKAGE_OLD")
    DEP_COUNT=$(jq '(.dependencies // {}) | length' "$PACKAGE_OLD")
    DEV_DEP_COUNT=$(jq '(.devDependencies // {}) | length' "$PACKAGE_OLD")

    if [ -z "$PACKAGE_NAME" ]; then
        error "Missing package name in $PACKAGE_JSON"
        exit 1
    fi

    echo -e "  ${GREEN}✅ Backed up package.json${NC}"
    echo -e "  ${GRAY}Package:${NC} $PACKAGE_NAME"
    echo -e "  ${GRAY}Dependencies:${NC} $DEP_COUNT"
    echo -e "  ${GRAY}Dev dependencies:${NC} $DEV_DEP_COUNT"
    echo ""
done

echo -e "${CYAN}Phase 2: Refresh workspace dependencies${NC}"
echo -e "${CYAN}=======================================${NC}"
echo ""

cd "$REPO_ROOT"

echo -e "${GRAY}Removing existing workspace install artifacts...${NC}"
rm -rf node_modules package-lock.json

for test_dir in "${TEST_DIRS[@]}"; do
    rm -rf "$REPO_ROOT/$test_dir/node_modules" "$REPO_ROOT/$test_dir/package-lock.json"
done

echo -e "${GRAY}Running npm install --legacy-peer-deps --workspaces${NC}"
if ! npm install --legacy-peer-deps --workspaces; then
    error "npm install failed for the workspace."
    exit 1
fi

echo -e "${GRAY}Running npm update --legacy-peer-deps --workspaces${NC}"
if ! npm update --legacy-peer-deps --workspaces; then
    error "npm update failed for the workspace."
    exit 1
fi

ROOT_LOCKFILE="$REPO_ROOT/package-lock.json"

if [ ! -f "$ROOT_LOCKFILE" ]; then
    error "Workspace package-lock.json was not created. Workspace resolution may have failed."
    exit 1
fi

if ! jq empty "$ROOT_LOCKFILE" >/dev/null; then
    error "Workspace package-lock.json is malformed."
    exit 1
fi

echo ""
echo -e "${CYAN}Phase 3: Rewrite dependency versions from the workspace lockfile${NC}"
echo -e "${CYAN}===============================================================${NC}"
echo ""

for test_dir in "${TEST_DIRS[@]}"; do
    TEST_PATH="$REPO_ROOT/$test_dir"
    PACKAGE_JSON="$TEST_PATH/package.json"
    PACKAGE_OLD="$TEST_PATH/package.old.json"

    echo -e "${YELLOW}Updating: $test_dir${NC}"

    export REPO_ROOT PACKAGE_JSON PACKAGE_OLD

    if ! node <<'EOF'
const fs = require('fs');
const path = require('path');

const lockfilePath = path.join(process.env.REPO_ROOT, 'package-lock.json');
const packageJsonPath = process.env.PACKAGE_JSON;
const packageOldPath = process.env.PACKAGE_OLD;

const lockfile = JSON.parse(fs.readFileSync(lockfilePath, 'utf8'));
const previousPackage = JSON.parse(fs.readFileSync(packageOldPath, 'utf8'));

if (!lockfile.packages) {
  throw new Error('Root package-lock.json does not contain a packages map.');
}

const resolveSection = (sectionName) => {
  const currentSection = previousPackage[sectionName];

  if (!currentSection) {
    return undefined;
  }

  const resolvedSection = {};
  const missingPackages = [];

  for (const dependencyName of Object.keys(currentSection)) {
    const resolvedPackage = lockfile.packages[`node_modules/${dependencyName}`];

    if (!resolvedPackage || !resolvedPackage.version) {
      missingPackages.push(dependencyName);
      continue;
    }

    resolvedSection[dependencyName] = resolvedPackage.version;
  }

  if (missingPackages.length > 0) {
    throw new Error(
      `Could not resolve ${sectionName} from workspace lockfile: ${missingPackages.join(', ')}`
    );
  }

  return Object.keys(resolvedSection).length > 0 ? resolvedSection : undefined;
};

const nextPackage = { ...previousPackage };
const dependencies = resolveSection('dependencies');
const devDependencies = resolveSection('devDependencies');

if (dependencies) {
  nextPackage.dependencies = dependencies;
} else {
  delete nextPackage.dependencies;
}

if (devDependencies) {
  nextPackage.devDependencies = devDependencies;
} else {
  delete nextPackage.devDependencies;
}

fs.writeFileSync(packageJsonPath, `${JSON.stringify(nextPackage, null, 2)}\n`);
console.log(
  `Resolved ${Object.keys(dependencies || {}).length} dependencies and ${Object.keys(devDependencies || {}).length} dev dependencies.`
);
EOF
    then
        error "Failed to rewrite dependency versions for $test_dir"
        exit 1
    fi

    rm -f "$PACKAGE_OLD"
    echo -e "  ${GREEN}✅ package.json updated and package.old.json removed${NC}"
    echo ""
done

cleanup_backups

echo -e "${CYAN}================================================${NC}"
echo -e "${GREEN}Dependency refresh complete${NC}"
echo -e "${CYAN}================================================${NC}"
