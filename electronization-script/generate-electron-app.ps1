# --- Configuration ---
$projectName = "my-electron-app"       # Name of the electron-vite project
$reactAppPath = "Enter-Path-Of-React-App" # Full path to your existing React app
$electronViteRoot = "$PSScriptRoot\$projectName" # Path to the newly created electron-vite app

# Generate electron-vite application ---
Write-Host "Generating electron-vite application '$projectName'..."
npm create @quick-start/electron@latest $projectName -- --template react
if ($LASTEXITCODE -ne 0) {
    Write-Error "Error generating electron-vite app. Please check the output."
    exit 1
}
Write-Host "Electron-vite application generated successfully at '$electronViteRoot'."

# Copy and overwrite App.tsx ---
$sourceAppTsx = Join-Path $reactAppPath "src\App.tsx"
$destAppTsx = Join-Path $electronViteRoot "src\renderer\src\App.tsx"
$sourceAppCss = Join-Path $reactAppPath "src\App.css"
$destAppCss = Join-Path $electronViteRoot "src\renderer\src\App.css"

Write-Host "Copying and overwriting '$sourceAppTsx' to '$destAppTsx'..."
Write-Host "Copying and overwriting '$sourceAppCss' to '$destAppCss'..."

Copy-Item -Path $sourceAppTsx -Destination $destAppTsx -Force
Copy-Item -Path $sourceAppCss -Destination $destAppCss -Force
if ($?) {
    Write-Host "App.tsx copied successfully."
} else {
    Write-Warning "Error copying App.tsx."
}

# Copy main components ---
$componentsSource = Join-Path $reactAppPath "src\components"
$componentsDest = Join-Path $electronViteRoot "src\renderer\src\components"

if (Test-Path $componentsSource) {
    Write-Host "Copying main components from '$componentsSource' to '$componentsDest'..."
    Copy-Item -Path $componentsSource\* -Destination $componentsDest -Recurse -Force
    if ($?) {
        Write-Host "Main components copied successfully."
    } else {
        Write-Warning "Error copying main components."
    }
} else {
    Write-Warning "Source components folder '$componentsSource' not found."
}

# Copy redux store ---
$reduxSource = Join-Path $reactAppPath "src\redux" # Change if needed
$reduxDest = Join-Path $electronViteRoot "src\renderer\src\redux"

if (Test-Path $reduxSource) {
    Write-Host "Copying redux from '$reduxSource' to '$reduxDest'..."
    Copy-Item -Path $reduxSource\* -Destination $reduxDest -Recurse -Force
    if ($?) {
        Write-Host "Redux files copied successfully."
    } else {
        Write-Warning "Error copying redux."
    }
} else {
    Write-Warning "Source redux folder '$reduxSource' not found."
}

# Copy core module used files ---
$coreSource = Join-Path $reactAppPath "src\core"
$coreDest = Join-Path $electronViteRoot "src\renderer\core"

if (Test-Path $coreSource) {
    Write-Host "Copying core module files from '$coreSource' to '$coreDest'..."
    Copy-Item -Path $coreSource\* -Destination $coreDest -Recurse -Force
    if ($?) {
        Write-Host "Core module files copied successfully."
    } else {
        Write-Warning "Error copying core module files."
    }
} else {
    Write-Warning "Source core module folder '$coreSource' not found."
}

# Copy npm dependencies from source to destination package.json ---
$sourcePackageJson = Join-Path $reactAppPath "package.json"
$destPackageJson = Join-Path $electronViteRoot "package.json"

if ((Test-Path $sourcePackageJson) -and (Test-Path $destPackageJson)) {
    Write-Host "Merging npm dependencies from '$sourcePackageJson' into '$destPackageJson'..."
    
    $sourcePackage = Get-Content -Path $sourcePackageJson | ConvertFrom-Json
    $destPackage = Get-Content -Path $destPackageJson | ConvertFrom-Json

    # Convert dependencies to hashtable
    $sourceDependencies = @{}
    if ($sourcePackage.dependencies) {
        $sourcePackage.dependencies.PSObject.Properties | ForEach-Object {
            $sourceDependencies[$_.Name] = $_.Value
        }
    }

    $destDependencies = @{}
    if ($destPackage.dependencies) {
        $destPackage.dependencies.PSObject.Properties | ForEach-Object {
            $destDependencies[$_.Name] = $_.Value
        }
    }

    # Merge dependencies
    foreach ($key in $sourceDependencies.Keys) {
        # Write-Host "Merging dependency: $key : $($sourceDependencies[$key])"
        $destDependencies[$key] = $sourceDependencies[$key]
    }

    # Convert devDependencies to hashtable
    $sourceDevDependencies = @{}
    if ($sourcePackage.devDependencies) {
        $sourcePackage.devDependencies.PSObject.Properties | ForEach-Object {
            $sourceDevDependencies[$_.Name] = $_.Value
        }
    }

    $destDevDependencies = @{}
    if ($destPackage.devDependencies) {
        $destPackage.devDependencies.PSObject.Properties | ForEach-Object {
            $destDevDependencies[$_.Name] = $_.Value
        }
    }

    # Merge devDependencies
    foreach ($key in $sourceDevDependencies.Keys) {
        # Write-Host "Merging devDependency: $key : $($sourceDevDependencies[$key])"
        $destDevDependencies[$key] = $sourceDevDependencies[$key]
    }

    # Update the destination package.json
    $destPackage.dependencies = $destDependencies
    $destPackage.devDependencies = $destDevDependencies

    # Save the updated package.json
    $destPackage | ConvertTo-Json -Depth 10 -Compress | Set-Content -Path $destPackageJson -Force
    Write-Host "Dependencies merged successfully."
} else {
    Write-Warning "Either source or destination package.json not found. Skipping dependency merge."
}

# Install npm dependencies ---
Write-Host "Installing npm dependencies from React app in '$electronViteRoot'..."
cd $electronViteRoot

npm install --force # Check if --force is needed
if ($LASTEXITCODE -ne 0) {
    Write-Error "Error installing npm dependencies. Please check the output."
    exit 1
}
Write-Host "npm dependencies installed successfully."

Write-Host "Migration process completed!"
