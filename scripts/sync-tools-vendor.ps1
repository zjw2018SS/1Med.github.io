$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$tools = Join-Path $root "tools"
$vendor = Join-Path $tools "vendor"

function Remove-ToolsVendor($destination) {
    if (-not (Test-Path -LiteralPath $destination)) {
        return
    }

    $resolvedDestination = (Resolve-Path -LiteralPath $destination).Path
    $resolvedTools = (Resolve-Path -LiteralPath $tools).Path.TrimEnd([char[]]@('\', '/'))
    $toolsPrefix = $resolvedTools + [System.IO.Path]::DirectorySeparatorChar

    if (-not $resolvedDestination.StartsWith($toolsPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw "Refusing to remove path outside tools: $resolvedDestination"
    }

    Remove-Item -LiteralPath $resolvedDestination -Recurse -Force
}

function Copy-VendorFile($relativeSource, $fileName) {
    $source = Join-Path $root $relativeSource
    if (-not (Test-Path -LiteralPath $source)) {
        throw "Missing vendor source: $relativeSource. Run npm install first."
    }

    Copy-Item -LiteralPath $source -Destination (Join-Path $vendor $fileName) -Force
}

Remove-ToolsVendor $vendor
New-Item -ItemType Directory -Path $vendor -Force | Out-Null

Copy-VendorFile "node_modules/sweetalert2/dist/sweetalert2.all.min.js" "sweetalert2.all.min.js"

Write-Host "Tools vendor assets synced."
