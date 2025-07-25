const path = require("path")

module.exports = {
  version: "3.7",
  title: "n8n",
  description: "Secure Workflow Automation for Technical Teams",
  icon: "icon.png",
  menu: async (kernel, info) => {
    let installing = info.running("install.js")
    let installed = info.exists("app")
    
    if (installing) {
      return [{ 
        icon: "fa-solid fa-plug", 
        text: "Installing...", 
        href: "install.js" 
      }]
    } else if (installed) {
      let running = info.running("start.js")
      if (running) {
        let memory = info.local("start.js")
        if (memory && memory.url) {
          return [
            { 
              icon: "fa-solid fa-rocket", 
              text: "Web UI", 
              href: memory.url 
            },
            { 
              icon: "fa-solid fa-terminal", 
              text: "Terminal", 
              href: "start.js" 
            },
            { 
              icon: "fa-solid fa-rotate", 
              text: "Update", 
              href: "update.js" 
            },
            {
              icon: "fa-solid fa-code",
              text: "Development Mode",
              href: "dev.js"
            }
          ]
        } else {
          return [
            { 
              icon: "fa-solid fa-terminal", 
              text: "Terminal", 
              href: "start.js" 
            },
            { 
              icon: "fa-solid fa-rotate", 
              text: "Update", 
              href: "update.js" 
            },
            {
              icon: "fa-solid fa-code",
              text: "Development Mode",
              href: "dev.js"
            }
          ]
        }
      } else {
        return [
          {
            icon: "fa-solid fa-power-off",
            text: "Start",
            href: "start.js",
          },
          {
            icon: "fa-solid fa-code",
            text: "Development Mode",
            href: "dev.js"
          },
          {
            icon: "fa-solid fa-rotate", 
            text: "Update", 
            href: "update.js"
          },
          {
            icon: "fa-solid fa-plug", 
            text: "Reinstall", 
            href: "install.js"
          },
          {
            icon: "fa-solid fa-broom", 
            text: "Factory Reset", 
            href: "reset.js"
          }
        ]
      }
    } else {
      return [
        { 
          icon: "fa-solid fa-plug", 
          text: "Install", 
          href: "install.js" 
        },
        { 
          icon: "fa-solid fa-rotate", 
          text: "Update", 
          href: "update.js" 
        }
      ]
    }
  }
}
