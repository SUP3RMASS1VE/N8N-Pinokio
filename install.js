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
    // Step 2: Install Node.js dependencies using pnpm install with --force to bypass engine check
    {
      method: "shell.run",
      params: {
        path: "app",
        message: [ 
          "echo Installing n8n dependencies using pnpm (bypassing engine check)...",
          "pnpm install --force" // Use --force to bypass Node.js version check
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
