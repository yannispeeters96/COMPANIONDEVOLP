$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
node .\scripts-check.mjs
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Host 'Broncontrole geslaagd.' -ForegroundColor Green
