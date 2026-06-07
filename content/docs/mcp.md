---
title: "MCP"
excerpt: ""
---

The Yellow Card Payments API Model Context Protocol (MCP) server enables AI-powered tools to interact directly with the Yellow Card Payments API and documentation.

## What is MCP?

Model Context Protocol (MCP) is an open standard that allows AI applications to securely access external data sources and tools. The Yellow Card Payments API MCP server provides AI agents with:

  * **Direct API access** to Yellow Card Payments API functionality
  * **Documentation search** capabilities
  * **Real-time data** from your Yellow Card Payments API account
  * **Code generation** assistance for Yellow Card Payments API integrations


## Yellow Card Payments API MCP Server Setup

Yellow Card Payments API hosts a remote MCP server at `https://docs.yellowcard.engineering/mcp`. Configure your AI development tools to connect to this server. Our API require authentication, you can pass in headers via query parameters or however headers are configured in your MCP client.

**Add to`~/.cursor/mcp.json`:**

JSON
    
    
    {
      "mcpServers": {
        "payments-service": {
          "url": "https://docs.yellowcard.engineering/mcp"
        }
      }
    }

## Testing Your MCP Setup

Once configured, you can test your MCP server connection:

  1. **Open your AI editor** (Cursor, Windsurf, etc.)
  2. **Start a new chat** with the AI assistant
  3. **Ask about Yellow Card Payments API** \- try questions like:
     * "How do I [common use case]?"
     * "Show me an example of [API functionality]"
     * "Create a [integration type] using Yellow Card Payments API"


The AI should now have access to your Yellow Card Payments API account data and documentation through the MCP server.
