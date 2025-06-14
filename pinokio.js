// pinokio.js v1.0.14
// Defines the UI menu for the n8n application in the Pinokio browser.
const path = require('path')
module.exports = {
  version: "1.0.14", 
  title: "N8NGeminiPSv1.1.4", 
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
