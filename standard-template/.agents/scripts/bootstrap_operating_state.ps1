$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDir "..\..")

Push-Location $repoRoot
try {
  & node ".agents\scripts\init-project.js" @args
  exit $LASTEXITCODE
} finally {
  Pop-Location
}
