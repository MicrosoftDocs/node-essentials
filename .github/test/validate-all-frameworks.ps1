#!/usr/bin/env pwsh
<#
.SYNOPSIS
Test all three test frameworks sequentially: install, build, run tests.

.DESCRIPTION
Validates that Node.js test runner, Jest, and Vitest frameworks all work correctly.
Tests installation, build (if needed), and test execution for each framework.

.EXAMPLE
./validate-all-frameworks.ps1
#>

$ErrorActionPreference = 'Continue'
$scriptDir = $PSScriptRoot
# Repo root is two levels up from .github/test
$repoRoot = Split-Path -Parent (Split-Path -Parent $scriptDir)
if (-not $repoRoot) {
    $repoRoot = Get-Location
}

$frameworks = @(
    @{ name = 'Node.js Test Runner'; dir = 'test-with-node-testrunner'; buildStep = $false },
    @{ name = 'Jest'; dir = 'test-with-jest'; buildStep = $true },
    @{ name = 'Vitest'; dir = 'test-with-vitest'; buildStep = $true }
)

$results = @()
$timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Test SDK Integration Validation" -ForegroundColor Cyan
Write-Host "Started: $timestamp" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

foreach ($framework in $frameworks) {
    $frameworkPath = Join-Path $repoRoot $framework.dir
    $frameworkName = $framework.name
    $status = 'PASS'
    $details = @()
    
    Write-Host "Testing: $frameworkName" -ForegroundColor Yellow
    Write-Host "Path: $frameworkPath" -ForegroundColor Gray
    
    # Check directory exists
    if (-not (Test-Path $frameworkPath)) {
        Write-Host "  ❌ Directory not found" -ForegroundColor Red
        $status = 'FAIL'
        $details += "Directory not found: $frameworkPath"
        $results += @{
            framework = $frameworkName
            status = $status
            details = $details -join '; '
        }
        Write-Host ""
        continue
    }
    
    # Change to framework directory
    Push-Location $frameworkPath
    
    try {
        # Step 1: npm install
        Write-Host "  [1/3] Installing dependencies..." -ForegroundColor Gray
        $installOutput = npm install 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-Host "  ❌ npm install failed" -ForegroundColor Red
            $status = 'FAIL'
            $details += "npm install failed with exit code $LASTEXITCODE"
        } else {
            Write-Host "  ✅ Dependencies installed" -ForegroundColor Green
            $details += "npm install: OK"
        }
        
        # Step 2: Build (if needed)
        if ($framework.buildStep) {
            Write-Host "  [2/3] Building..." -ForegroundColor Gray
            $buildOutput = npm run build 2>&1
            if ($LASTEXITCODE -ne 0) {
                Write-Host "  ⚠️  Build had issues (exit code: $LASTEXITCODE)" -ForegroundColor Yellow
                # Don't fail on build - some frameworks might not have build script
                $details += "npm run build: exit code $LASTEXITCODE"
            } else {
                Write-Host "  ✅ Build successful" -ForegroundColor Green
                $details += "npm run build: OK"
            }
        } else {
            Write-Host "  [2/3] Build (skipped - not needed)" -ForegroundColor Gray
            $details += "Build: skipped"
        }
        
        # Step 3: Run tests
        Write-Host "  [3/3] Running tests..." -ForegroundColor Gray
        $testOutput = npm test 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-Host "  ❌ Tests failed" -ForegroundColor Red
            $status = 'FAIL'
            $details += "npm test failed with exit code $LASTEXITCODE"
            # Show last few lines of output
            $lastLines = ($testOutput | Select-Object -Last 5) -join ' | '
            Write-Host "     Error: $lastLines" -ForegroundColor Red
        } else {
            Write-Host "  ✅ Tests passed" -ForegroundColor Green
            $details += "npm test: OK"
        }
        
    } catch {
        Write-Host "  ❌ Exception: $_" -ForegroundColor Red
        $status = 'FAIL'
        $details += "Exception: $_"
    } finally {
        Pop-Location
    }
    
    $results += @{
        framework = $frameworkName
        status = $status
        details = $details -join '; '
    }
    
    Write-Host "  Status: $status" -ForegroundColor $(if ($status -eq 'PASS') { 'Green' } else { 'Red' })
    Write-Host ""
}

# Summary report
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Summary Report" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$passCount = ($results | Where-Object { $_.status -eq 'PASS' }).Count
$failCount = ($results | Where-Object { $_.status -eq 'FAIL' }).Count
$totalCount = $results.Count

foreach ($result in $results) {
    $icon = if ($result.status -eq 'PASS') { '✅' } else { '❌' }
    Write-Host "$icon $($result.framework): $($result.status)" -ForegroundColor $(if ($result.status -eq 'PASS') { 'Green' } else { 'Red' })
    Write-Host "   $($result.details)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Results: $passCount PASS, $failCount FAIL out of $totalCount frameworks" -ForegroundColor $(if ($failCount -eq 0) { 'Green' } else { 'Yellow' })
Write-Host ""

# Exit with appropriate code
exit $(if ($failCount -eq 0) { 0 } else { 1 })
