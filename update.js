module.exports = {
  version: "4.0",
  run: [
    {
      method: "log",
      params: {
        raw: "Updating n8n to the latest version..."
      }
    },
    // Update n8n globally using npm
    {
      method: "shell.run",
      params: {
        message: "npm update -g n8n"
      }
    },
    {
      method: "log",
      params: {
        raw: "n8n update completed successfully!"
      }
    }
  ]
}
