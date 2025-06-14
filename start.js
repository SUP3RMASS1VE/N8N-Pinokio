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
          "event": "/Press.*open in Browser/",
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
        url: "http://localhost:5678"
      }
    },
    {
      method: "browser.open",
      params: {
        url: "{{local.url}}"
      }
    },
    {
      method: "log",
      params: {
        message: "n8n server started and opened in browser. UI should be accessible at {{local.url}}"
      }
    }
  ]
}
