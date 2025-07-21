
This is a Pinokio launcher for [n8n](https://n8n.io), a secure workflow automation platform for technical teams.

## About n8n

n8n is a workflow automation platform that gives technical teams the flexibility of code with the speed of no-code. With 400+ integrations, native AI capabilities, and a fair-code license, n8n lets you build powerful automations while maintaining full control over your data and deployments.

## Features

- **Code When You Need It**: Write JavaScript/Python, add npm packages, or use the visual interface
- **AI-Native Platform**: Build AI agent workflows based on LangChain with your own data and models
- **Full Control**: Self-host with fair-code license
- **Enterprise-Ready**: Advanced permissions, SSO, and air-gapped deployments
- **Active Community**: 400+ integrations and 900+ ready-to-use templates

## Requirements

- Node.js 22.16 or newer
- pnpm 10.2 or newer (automatically handled by the launcher)

## Installation

1. Click the "Install" button in the Pinokio launcher
2. Wait for the installation to complete
3. Click "Start" to launch n8n

**Installation Location**: n8n is installed globally via npm to `pinokio\bin\npm\node_modules\n8n`

## Usage

### Production Mode
- Click "Start" to run n8n in production mode
- Access the web interface at http://localhost:5678

### Development Mode
- Click "Development Mode" to run n8n with hot reload
- Useful for development and testing
- Access the web interface at http://localhost:5678

### Other Options
- **Update**: Pull latest changes and rebuild
- **Reinstall**: Reinstall dependencies and rebuild
- **Factory Reset**: Complete reset of the installation

## Environment Variables

You can customize n8n behavior by editing the environment variables in the "Configure" tab. Common settings include:

- Database configuration
- Security settings (basic auth)
- Webhook URLs
- Timezone settings
- Log levels

## Links

- [Official Website](https://n8n.io)
- [Documentation](https://docs.n8n.io)
- [GitHub Repository](https://github.com/n8n-io/n8n)
- [Community Forum](https://community.n8n.io)
- [Templates](https://n8n.io/workflows)

## License

n8n is fair-code distributed under the Sustainable Use License and n8n Enterprise License.
