#Requires -Version 5.1

# --- Configuration ---
$ScriptVersion = "1.0.14" # <-- Version Bump
Write-Host "Starting PowerShell script generator v$ScriptVersion..."

# --- Determine Folder Name ---
$CurrentLocation = Get-Location
$FolderName = $CurrentLocation.Path.Split('\')[-1]
if (-not $FolderName) {
    Write-Error "Could not determine the folder name. Make sure the script is saved in a folder."
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "Target folder name detected as: $FolderName"

# --- Determine Icon BG Color ---
$colorMap = @(
    @{ Name = "Purple"; Code = "#6A0DAD" },
    @{ Name = "Green";  Code = "#006400" },
    @{ Name = "Blue";   Code = "#00008B" },
    @{ Name = "Red";    Code = "#8B0000" }
)
$colorIndex = (Get-Random -Minimum 0 -Maximum 4)
$IconBGColor = $colorMap[$colorIndex].Code
$ColorName = $colorMap[$colorIndex].Name
Write-Host "Using icon background color: $ColorName ($IconBGColor)"

# --- Helper Function to Write File ---
function Write-ScriptFile {
    param(
        [Parameter(Mandatory=$true)]
        [string]$FileName,
        [Parameter(Mandatory=$true)]
        [string]$Content
    )
    try {
        Write-Host "Creating $FileName..."
        $Content | Out-File -FilePath ".\$FileName" -Encoding UTF8 -ErrorAction Stop
        Write-Host "$FileName created successfully."
    } catch {
        Write-Error "ERROR creating $FileName! : $($_.Exception.Message)"
        throw
    }
}

# --- File Contents ---

# Modified install.js: Use pnpm install, disable telemetry in build env
$installJsContent = @"
// install.js
// Script to clone the n8n repository, install Node.js dependencies, and build the application.
module.exports = {
  run: [
    // Step 1: Clone the n8n repository into the 'app' directory
    {
      method: "shell.run",
      params: {
        message: [ 
          "echo Cloning n8n repository...",
          "git clone https://github.com/n8n-io/n8n app"
        ]
      }
    },
    // Step 2: Install Node.js dependencies using pnpm install
    {
      method: "shell.run",
      params: {
        path: "app",
        message: [ 
          "echo Installing n8n dependencies using pnpm (this might take a while)...",
          "pnpm install" // Use pnpm
        ]
      }
    },
    // Step 3: Build the n8n application
    {
      method: "shell.run",
      params: {
        path: "app",
        env: { // Add env here
          TURBO_TELEMETRY_DISABLED: "1" // Disable turbo telemetry
        },
        message: [ 
           "echo Building n8n (this might also take a while)...",
           "npm run build" // npm run build still uses turbo internally
        ]
      }
    },
    // Step 4: Log success
    {
      method: "log",
      params: {
        message: "n8n installation and build completed successfully."
      }
    }
  ]
}
"@

# Start.js remains the same
$startJsContent = @"
// start.js
// Script to start the n8n application server.
module.exports = {
  daemon: true,
  run: [
    {
      method: "shell.run",
      params: {
        path: "app",
        env: {
          // Example: N8N_PORT: "5678"
        },
        message: [ 
            "echo Starting n8n server...",
            "npm start" // Use npm start, as defined in package.json
        ],
        on: [{
          "event": "/Editor is now accessible via:\\s*(https?:\/\/\S+)/",
          "done": true
        }, {
          "event": "/error|fail/i", 
          "done": false,
           "message": "Potential error detected in n8n startup: {{self.event[0]}}"
        }]
      }
    },
    {
      method: "local.set",
      params: {
        url: "{{input.event[1]}}"
      }
    },
    {
      method: "log",
      params: {
        message: "n8n server started. UI should be accessible."
      }
    }
  ]
}
"@

# Modified update.js: Use pnpm install, disable telemetry in build env
$updateJsContent = @"
// update.js
// Script to update the Pinokio scripts and the n8n application code.
module.exports = {
  run: [
    {
      method: "shell.run",
      params: {
        message: [ 
          "echo Updating Pinokio scripts for n8n...",
          "git pull"
        ]
      }
    },
    {
      method: "shell.run",
      params: {
        path: "app",
        message: [ 
          "echo Updating n8n application code...",
          "git pull"
        ]
      }
    },
    {
      method: "shell.run",
      params: {
        path: "app",
        message: [ 
          "echo Re-installing n8n dependencies using pnpm after update...",
          "pnpm install" // Use pnpm
        ]
      }
    },
    {
      method: "shell.run",
      params: {
        path: "app",
         env: { // Add env here
          TURBO_TELEMETRY_DISABLED: "1" // Disable turbo telemetry
        },
        message: [ 
           "echo Re-building n8n after update...",
           "npm run build" // Use npm run build
        ]
      }
    },
    {
      method: "log",
      params: {
        message: "n8n update process finished."
      }
    }
  ]
}
"@

# Reset.js remains the same
$resetJsContent = @"
// reset.js
// Script to remove the installed n8n application files.
module.exports = {
  run: [
    {
      method: "fs.rm",
      params: {
        message: "Removing n8n application directory...", 
        path: "app"
      }
    },
    {
      method: "log",
      params: {
        message: "n8n reset complete. You can now reinstall."
      }
    }
  ]
}
"@

# Pinokio.js remains the same
$pinokioJsContent = @"
// pinokio.js v$ScriptVersion
// Defines the UI menu for the n8n application in the Pinokio browser.
const path = require('path')
module.exports = {
  version: "$ScriptVersion", 
  title: "$FolderName", 
  description: "Self-hosted workflow automation tool. Build complex automations visually. https://n8n.io/",
  icon: "icon.svg",
  menu: async (kernel, info) => { 
    let installed = info.exists("app/node_modules")
    let running = {
      install: info.running("install.js"),
      start: info.running("start.js"),
      update: info.running("update.js"),
      reset: info.running("reset.js")
    }
    if (running.install) {
      return [{ default: true, icon: "fas fa-cog fa-spin", text: "Installing...", href: "install.js" }]
    } else if (installed) {
      if (running.start) {
        let local_start_info = info.local("start.js")
        if (local_start_info && local_start_info.url) { 
          return [
            { default: true, icon: "fas fa-rocket", text: "Open n8n UI", href: local_start_info.url, target: "_blank" },
            { icon: "fas fa-terminal", text: "Terminal", href: "start.js" }
          ]
        } else {
          return [{ default: true, icon: "fas fa-terminal", text: "Starting...", href: "start.js" }]
        }
      } else if (running.update) {
        return [{ default: true, icon: "fas fa-sync fa-spin", text: "Updating...", href: "update.js" }]
      } else if (running.reset) {
        return [{ default: true, icon: "fas fa-undo fa-spin", text: "Resetting...", href: "reset.js" }]
      } else {
        return [
          { default: true, icon: "fas fa-power-off", text: "Start", href: "start.js" },
          { icon: "fas fa-sync", text: "Update", href: "update.js" },
          { icon: "fas fa-plug", text: "Reinstall", href: "install.js", confirm: "Are you sure you want to reinstall? This might overwrite changes." },
          { icon: "fas fa-undo", text: "Reset", href: "reset.js", confirm: "Are you sure you want to reset n8n? This will delete the cloned code and node_modules." }
        ]
      }
    } else {
      return [{ default: true, icon: "fas fa-plug", text: "Install", href: "install.js" }]
    }
  }
}
"@

$gitignoreContent = @"
# Node.js dependencies
node_modules

# macOS specific files
.DS_Store

# Pinokio environment specific (optional, usually not needed)
# env/

# Temporary files from generator script
*.tmp
*.tmp.*
"@ # Removed *.b64 as it's no longer used in SVG step

$readmeContent = @"
# Pinokio Script: $FolderName (v$ScriptVersion)

A Pinokio script to install and manage the [n8n](https://github.com/n8n-io/n8n) workflow automation tool.

This script will:
1. Clone the official n8n repository.
2. Install required Node.js dependencies using `pnpm install`.
3. Build the n8n application using `npm run build`.
4. Provide options to start, update, and reset the installation via the Pinokio UI.

**Note:** The `icon.svg` file is generated by this script.
"@

$iconSvgContent = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 60" width="100" height="60">
  <rect fill="$IconBGColor" width="100" height="60" rx="10"/>
  <text fill="white" font-family="sans-serif" font-size="24px" font-weight="bold" text-anchor="middle" x="50" y="32">n8n</text>
  <text fill="white" font-family="sans-serif" font-size="10px" text-anchor="middle" x="50" y="48">v$ScriptVersion</text>
</svg>
"@

# --- Write Files ---
try {
    Write-ScriptFile -FileName "install.js" -Content $installJsContent
    Write-ScriptFile -FileName "start.js" -Content $startJsContent
    Write-ScriptFile -FileName "update.js" -Content $updateJsContent
    Write-ScriptFile -FileName "reset.js" -Content $resetJsContent
    Write-ScriptFile -FileName "pinokio.js" -Content $pinokioJsContent 
    Write-ScriptFile -FileName ".gitignore" -Content $gitignoreContent
    Write-ScriptFile -FileName "README.md" -Content $readmeContent
    Write-ScriptFile -FileName "icon.svg" -Content $iconSvgContent

    # --- Initialize Git Repository ---
    Write-Host "Initializing Git repository..."
    $gitExists = (Get-Command git -ErrorAction SilentlyContinue)
    if (-not $gitExists) {
        Write-Warning "Git command not found. Skipping Git initialization. Pinokio might not recognize this script correctly."
    } else {
        git init -b main 
        if ($LASTEXITCODE -ne 0) { Write-Warning "git init failed." }
        git add .
        if ($LASTEXITCODE -ne 0) { Write-Warning "git add failed." }
        Write-Host "Git repository initialized and files added."
    }

    Write-Host "`n=====================================================" -ForegroundColor Green
    Write-Host "Script finished successfully! All files created." -ForegroundColor Green
    Write-Host "=====================================================" -ForegroundColor Green

} catch {
    Write-Host "`n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" -ForegroundColor Red
    Write-Host "An error occurred during file creation or Git initialization." -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" -ForegroundColor Red
}

# --- Final Pause ---
Write-Host ""
Read-Host "Press Enter to exit"