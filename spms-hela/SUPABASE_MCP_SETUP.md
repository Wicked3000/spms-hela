# Supabase MCP Server Configuration Guide

## Overview

This guide will help you configure the Supabase MCP (Model Context Protocol) server to work with your AI assistant.

## Prerequisites

- Supabase account with access to your project
- Your project reference: `cneaxmxlpeqtwnsgkilj`
- Your project URL: `https://cneaxmxlpeqtwnsgkilj.supabase.co`

## Step 1: Generate Supabase Access Token

1. Visit: https://supabase.com/dashboard/account/tokens
2. Click the **"Generate new token"** button (green button, top right)
3. Enter a name for your token (e.g., "MCP Server" or "AI Assistant")
4. Select an expiration period (recommend 1 year for convenience)
5. Click **Generate**
6. **IMPORTANT**: Copy the token immediately - it will only be shown once!
7. Store it securely (you'll need it in the next step)

## Step 2: Configure MCP Server

The configuration location depends on your IDE/tool:

### For VS Code with Cline Extension

1. Open VS Code Settings
2. Search for "Cline MCP Settings"
3. Click "Edit in settings.json"
4. Add the following configuration:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server@latest"],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "YOUR_ACCESS_TOKEN_HERE",
        "SUPABASE_PROJECT_REF": "cneaxmxlpeqtwnsgkilj"
      }
    }
  }
}
```

**Replace `YOUR_ACCESS_TOKEN_HERE` with the token you generated in Step 1.**

### For Claude Desktop App

1. Locate your Claude config file:

   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Linux**: `~/.config/Claude/claude_desktop_config.json`

2. Edit the file and add:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server@latest"],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "YOUR_ACCESS_TOKEN_HERE",
        "SUPABASE_PROJECT_REF": "cneaxmxlpeqtwnsgkilj"
      }
    }
  }
}
```

**Replace `YOUR_ACCESS_TOKEN_HERE` with the token you generated in Step 1.**

### For Roo Code Extension

1. Open Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
2. Search for "Roo Code: MCP Settings"
3. Add the Supabase MCP server configuration similar to the Cline setup above

## Step 3: Restart Your IDE/Application

After saving the configuration:

1. **Completely close** your IDE or Claude Desktop app
2. **Reopen** it
3. The MCP server should now be connected

## Step 4: Verify Connection

Once restarted, you can test the connection by asking your AI assistant to:

- List your Supabase projects
- Execute a simple SQL query
- List tables in your database

Example test commands:

- "List my Supabase projects"
- "Show me the tables in my database"
- "Execute: SELECT COUNT(\*) FROM student_profiles"

## Troubleshooting

### MCP Server Not Connecting

1. **Check your access token**: Make sure it's valid and not expired
2. **Verify project reference**: Ensure `cneaxmxlpeqtwnsgkilj` is correct
3. **Check Node.js**: Make sure Node.js is installed (`node --version`)
4. **Check npx**: Verify npx is available (`npx --version`)
5. **Restart completely**: Close and reopen your IDE/app

### Permission Errors

- Ensure your Supabase access token has the necessary permissions
- You may need to regenerate the token with appropriate scopes

### Network Issues

- Check your internet connection
- Verify you can access `https://supabase.com` in your browser
- Check if any firewall or proxy is blocking the connection

## Security Notes

⚠️ **IMPORTANT SECURITY REMINDERS**:

- Never commit your access token to version control
- Store tokens securely
- Rotate tokens periodically
- Use environment-specific tokens (dev vs production)
- Set appropriate expiration dates

## What You Can Do With MCP Server

Once configured, you can:

- ✅ Execute SQL queries
- ✅ List and manage tables
- ✅ Apply database migrations
- ✅ Manage Edge Functions
- ✅ View project logs
- ✅ Check security advisors
- ✅ Generate TypeScript types
- ✅ And much more!

## Additional Resources

- [Supabase MCP Server Documentation](https://github.com/supabase/mcp-server-supabase)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [Supabase Documentation](https://supabase.com/docs)

---

**Your Project Details:**

- Project Reference: `cneaxmxlpeqtwnsgkilj`
- Project URL: `https://cneaxmxlpeqtwnsgkilj.supabase.co`
- Database: PostgreSQL (via Supabase)
