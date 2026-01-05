# Supabase MCP Server Configuration

## Your Supabase Access Token

```
sbp_ee454b9a2296c5c82b8151e1299bdba1646939e3
```

## Configuration for VS Code (Cline/Claude Dev)

1. **Open your MCP settings file:**

   - Press `Ctrl + Shift + P`
   - Type: "Preferences: Open User Settings (JSON)"
   - Or navigate to: `%APPDATA%\Code\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json`

2. **Add this configuration:**

```json
{
  "mcpServers": {
    "supabase-mcp-server": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-supabase",
        "--access-token",
        "sbp_ee454b9a2296c5c82b8151e1299bdba1646939e3"
      ]
    }
  }
}
```

## Configuration for Claude Desktop

1. **Open Claude Desktop config:**

   - Navigate to: `%APPDATA%\Claude\claude_desktop_config.json`
   - Or create it if it doesn't exist

2. **Add this configuration:**

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-supabase",
        "--access-token",
        "sbp_ee454b9a2296c5c82b8151e1299bdba1646939e3"
      ]
    }
  }
}
```

## After Configuration

1. **Restart your IDE/Application** (VS Code or Claude Desktop)
2. **Verify the connection** by asking me to check Supabase advisors

## Environment Variable Method (Alternative)

Instead of hardcoding the token, you can set it as an environment variable:

1. **Add to your system environment variables:**

   ```
   SUPABASE_ACCESS_TOKEN=sbp_ee454b9a2296c5c82b8151e1299bdba1646939e3
   ```

2. **Update MCP config to use the variable:**
   ```json
   {
     "mcpServers": {
       "supabase-mcp-server": {
         "command": "npx",
         "args": ["-y", "@modelcontextprotocol/server-supabase"],
         "env": {
           "SUPABASE_ACCESS_TOKEN": "sbp_ee454b9a2296c5c82b8151e1299bdba1646939e3"
         }
       }
     }
   }
   ```

## Troubleshooting

If the connection still fails:

1. Verify the token has correct permissions at: https://supabase.com/dashboard/account/tokens
2. Check that the token has "All" or at minimum "read:organizations, read:projects" scopes
3. Restart your IDE completely
4. Check the MCP server logs in your IDE's output panel
