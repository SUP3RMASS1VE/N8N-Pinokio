module.exports = {
  version: "4.0",
  run: [
    {
      method: "log",
      params: {
        raw: "Resetting n8n installation..."
      }
    },
    // Uninstall n8n globally
    {
      method: "shell.run",
      params: {
        message: "npm uninstall -g n8n"
      }
    },
    // Remove app directory
    {
      method: "fs.rm",
      params: {
        path: "app"
      }
    },
    {
      method: "log",
      params: {
        raw: "Reinstalling n8n..."
      }
    },
    // Reinstall n8n globally
    {
      method: "shell.run",
      params: {
        message: "npm install -g n8n"
      }
    },
    // Recreate app directory
    {
      method: "shell.run",
      params: {
        message: "mkdir app"
      }
    },
    {
      method: "log",
      params: {
        raw: "n8n reset completed successfully!"
      }
    }
  ]
}
