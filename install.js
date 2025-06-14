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
    // Step 2: Download Node.js 22.16+ directly
    {
      method: "shell.run",
      params: {
        message: [ 
          "echo Current Node.js version (Pinokio's):",
          "node --version",
          "echo Downloading Node.js 22.16.0 for n8n installation...",
          "mkdir temp_nodejs",
          "powershell -Command \"Invoke-WebRequest -Uri 'https://nodejs.org/dist/v22.16.0/node-v22.16.0-win-x64.zip' -OutFile 'temp_nodejs/nodejs.zip'\"",
          "powershell -Command \"Expand-Archive -Path 'temp_nodejs/nodejs.zip' -DestinationPath 'temp_nodejs' -Force\"",
          "echo Node.js 22.16.0 downloaded and extracted"
        ]
      }
    },
    // Step 3: Verify downloaded Node.js version
    {
      method: "shell.run",
      params: {
        message: [ 
          "echo Verifying downloaded Node.js version:",
          "temp_nodejs\\node-v22.16.0-win-x64\\node.exe --version"
        ]
      }
    },
    // Step 4: Install pnpm using the downloaded Node.js
    {
      method: "shell.run",
      params: {
        path: "app",
        message: [ 
          "echo Installing pnpm using Node.js 22.16.0...",
          "..\\temp_nodejs\\node-v22.16.0-win-x64\\npm.cmd install -g pnpm"
        ]
      }
    },
    // Step 5: Install Node.js dependencies using the downloaded Node.js directly
    {
      method: "shell.run",
      params: {
        path: "app",
        message: [ 
          "echo Installing n8n dependencies using Node.js 22.16.0 directly...",
          "..\\temp_nodejs\\node-v22.16.0-win-x64\\node.exe --version",
          "..\\temp_nodejs\\node-v22.16.0-win-x64\\npx.cmd pnpm install"
        ]
      }
    },
    // Step 6: Build the n8n application using the downloaded Node.js directly
    {
      method: "shell.run",
      params: {
        path: "app",
        env: {
          TURBO_TELEMETRY_DISABLED: "1" // Disable turbo telemetry
        },
        message: [ 
           "echo Building n8n with Node.js 22.16.0 directly (this might also take a while)...",
           "..\\temp_nodejs\\node-v22.16.0-win-x64\\node.exe --version",
           "..\\temp_nodejs\\node-v22.16.0-win-x64\\npx.cmd npm run build"
        ]
      }
    },
    // Step 7: Cleanup temporary Node.js files
    {
      method: "shell.run",
      params: {
        message: [ 
          "echo Cleaning up temporary Node.js files...",
          "rmdir /s /q temp_nodejs"
        ]
      }
    },
    // Step 8: Log success
    {
      method: "log",
      params: {
        message: "n8n installation and build completed successfully."
      }
    }
  ]
}
