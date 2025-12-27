# GitHub MCP Server Setup Guide

## Overview

This guide will help you set up the GitHub MCP Server to integrate GitHub functionality directly into your development workflow.

## Prerequisites

- ✅ Git installed and configured
- ✅ Node.js and npm installed
- ⚠️ GitHub Personal Access Token (needs to be created)

## Step 1: Create GitHub Personal Access Token

1. Visit: https://github.com/settings/tokens/new
2. Token name: `MCP Server - SPMS Hela`
3. Expiration: Choose based on your preference (90 days recommended)
4. Select scopes:
   - ✅ `repo` - Full control of private repositories
   - ✅ `workflow` - Update GitHub Action workflows
   - ✅ `read:org` - Read org and team membership
   - ✅ `user` - Read user profile data
5. Click **"Generate token"**
6. **IMPORTANT:** Copy the token immediately (you won't see it again!)

## Step 2: Install GitHub MCP Server

The official package is deprecated, so we'll use the community-maintained version:

```bash
npx -y @modelcontextprotocol/create-server github
```

Or install the Smithery GitHub MCP Server:

```bash
npx -y @smithery/cli install @smithery/mcp-server-github --client claude
```

## Step 3: Configure MCP Settings

### For Claude Desktop (Windows)

1. Open the Claude Desktop configuration file:

   ```
   %APPDATA%\Claude\claude_desktop_config.json
   ```

2. Add the GitHub MCP server configuration:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your_github_token_here"
      }
    }
  }
}
```

### Alternative: Using Smithery

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@smithery/mcp-server-github"],
      "env": {
        "GITHUB_TOKEN": "your_github_token_here"
      }
    }
  }
}
```

## Step 4: Restart Claude Desktop

After saving the configuration:

1. Completely quit Claude Desktop
2. Restart Claude Desktop
3. Look for the 🔌 icon indicating MCP servers are connected

## Step 5: Verify Connection

Once connected, you should be able to:

- Create and manage repositories
- Create issues and pull requests
- Search repositories and code
- Manage branches
- Review pull requests
- And much more!

## Available GitHub MCP Capabilities

With the GitHub MCP server, you can:

### Repository Management

- Create new repositories
- List repositories
- Get repository details
- Fork repositories
- Update repository settings

### Issues & Pull Requests

- Create, update, and close issues
- Create and manage pull requests
- Add comments and reviews
- Assign issues and PRs
- Manage labels and milestones

### Code Operations

- Search code across repositories
- Create and update files
- Manage branches
- Create commits
- View file contents

### Collaboration

- Manage collaborators
- Review code
- Merge pull requests
- Resolve conflicts

## Troubleshooting

### Server Not Connecting

1. Verify your GitHub token is valid
2. Check that the token has the required scopes
3. Ensure the configuration file is valid JSON
4. Restart Claude Desktop completely

### Permission Errors

- Verify your token has the necessary scopes
- Check repository access permissions
- Ensure you're authenticated with the correct GitHub account

## Security Best Practices

1. **Never commit your token** to version control
2. Use environment variables for tokens
3. Set appropriate token expiration dates
4. Regularly rotate your tokens
5. Use minimal required scopes

## Next Steps

Once configured, try these commands:

- "List my GitHub repositories"
- "Create a new issue in [repo-name]"
- "Show me recent pull requests"
- "Search for code containing [query]"

---

**Note:** The official `@modelcontextprotocol/server-github` package is deprecated. Consider using alternative implementations like Smithery's GitHub MCP server for better long-term support.

## Alternative: Manual GitHub Integration

If MCP server setup is challenging, you can also:

1. Use GitHub CLI (`gh`) for command-line operations
2. Use GitHub Desktop for GUI-based Git operations
3. Integrate GitHub API directly in your applications

---

Created: 2025-12-28
Last Updated: 2025-12-28
