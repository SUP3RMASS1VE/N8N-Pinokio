// reset.js
// Script to remove the installed n8n application files.
module.exports = {
  run: [
    {
      method: "fs.rm",
      params: {
        message: "Removing n8n application directory...", 
        path: "app"
      }
    },
    {
      method: "log",
      params: {
        message: "n8n reset complete. You can now reinstall."
      }
    }
  ]
}
