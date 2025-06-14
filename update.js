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
