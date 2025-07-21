module.exports = {
  version: "4.0",
  run: [
    // Check Node.js version requirement
    {
      method: "shell.run",
      params: {
        message: "node --version"
      }
    },
    {
      method: "log",
      params: {
        raw: "Installing n8n via npm..."
      }
    },
    // Install n8n globally using npm (much simpler approach)
    {
      method: "shell.run",
      params: {
        message: "npm install -g n8n"
      }
    },
    {
      method: "log",
      params: {
        raw: "Creating app directory for n8n data..."
      }
    },
    // Create app directory for n8n data and configuration
    {
      method: "shell.run",
      params: {
        message: "mkdir app"
      }
    },
    {
      method: "log",
      params: {
        raw: "n8n installation completed successfully! You can now start n8n."
      }
    }
  ]
}
