@echo off
echo Testing Supabase MCP Server Connection...
echo.
echo Using token: sbp_ee454b9a2296c5c82b8151e1299bdba1646939e3
echo Project ID: ygfwdxzgfgwpqhzwvdlc
echo.
echo Starting MCP server test...
echo.

REM Set the environment variable
set SUPABASE_ACCESS_TOKEN=sbp_ee454b9a2296c5c82b8151e1299bdba1646939e3

REM Try to run the MCP server
npx -y @modelcontextprotocol/server-supabase --help

echo.
echo If you see help text above, the MCP server package is installed correctly.
echo.
echo Now restart VS Code completely (close all windows) for the MCP connection to work.
echo.
pause
