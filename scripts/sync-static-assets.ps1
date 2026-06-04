$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$dist = Join-Path $root "dist"
New-Item -ItemType Directory -Path $dist -Force | Out-Null

function Remove-DistDirectory($destination) {
    if (-not (Test-Path -LiteralPath $destination)) {
        return
    }

    $resolvedDestination = (Resolve-Path -LiteralPath $destination).Path
    $resolvedDist = (Resolve-Path -LiteralPath $dist).Path.TrimEnd([char[]]@('\', '/'))
    $distPrefix = $resolvedDist + [System.IO.Path]::DirectorySeparatorChar

    if (-not $resolvedDestination.StartsWith($distPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw "Refusing to remove path outside dist: $resolvedDestination"
    }

    Remove-Item -LiteralPath $resolvedDestination -Recurse -Force
}

function Copy-Directory($source, $destination) {
    if (-not (Test-Path -LiteralPath $source)) {
        return
    }
    if (Test-Path -LiteralPath $destination) {
        Remove-DistDirectory $destination
    }
    New-Item -ItemType Directory -Path (Split-Path -Parent $destination) -Force | Out-Null
    Copy-Item -LiteralPath $source -Destination $destination -Recurse -Force
}

function Copy-DirectoryFiltered($source, $destination, [string[]]$excludedDirectoryNames = @(), [string[]]$excludedFileNames = @()) {
    if (-not (Test-Path -LiteralPath $source)) {
        return
    }
    if (Test-Path -LiteralPath $destination) {
        Remove-DistDirectory $destination
    }

    function Copy-Children($from, $to) {
        New-Item -ItemType Directory -Path $to -Force | Out-Null

        foreach ($item in Get-ChildItem -LiteralPath $from -Force) {
            if ($item.PSIsContainer -and ($excludedDirectoryNames -contains $item.Name)) {
                continue
            }
            if ((-not $item.PSIsContainer) -and ($excludedFileNames -contains $item.Name)) {
                continue
            }

            $target = Join-Path $to $item.Name
            if ($item.PSIsContainer) {
                Copy-Children $item.FullName $target
            }
            else {
                New-Item -ItemType Directory -Path (Split-Path -Parent $target) -Force | Out-Null
                Copy-Item -LiteralPath $item.FullName -Destination $target -Force
            }
        }
    }

    Copy-Children $source $destination
}

function Copy-File($source, $destination) {
    if (-not (Test-Path -LiteralPath $source)) {
        return
    }
    New-Item -ItemType Directory -Path (Split-Path -Parent $destination) -Force | Out-Null
    Copy-Item -LiteralPath $source -Destination $destination -Force
}

Copy-Directory (Join-Path $root "static") (Join-Path $dist "static")
Copy-Directory (Join-Path $root "img") (Join-Path $dist "img")
Copy-DirectoryFiltered (Join-Path $root "tools") (Join-Path $dist "tools") @("node_modules", "build", "dev", "src", "test") @("package.json", "package-lock.json")
Copy-File (Join-Path $root "favicon.ico") (Join-Path $dist "favicon.ico")
Copy-File (Join-Path $root "CNAME") (Join-Path $dist "CNAME")

Write-Host "Static assets synced."
