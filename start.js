module.exports = {
  version: "4.0",
  daemon: true,
  run: [
    {
      method: "log",
      params: {
        raw: "Starting n8n workflow automation platform..."
      }
    },
    // Start n8n server with task runners enabled
    {
      method: "shell.run",
      params: {
        path: "app",
        message: "n8n start",
        env: {
          "N8N_RUNNERS_ENABLED": "true"
        },
        on: [
          {
            event: "/Editor is now.*(http:\/\/localhost:[0-9]+)/",
            done: true
          }
        ]
      }
    },
    // Set the local URL for the UI
    {
      method: "local.set",
      params: {
        url: "{{input.event[1]}}"
      }
    },
    {
      method: "log",
      params: {
        raw: "n8n is now running at {{local.url}}"
      }
    }
  ]
}
