---
name: docs
description: "Fetch documentation from llms.txt URLs for supported libraries. Usage: /docs [library name] [question]"
---

# Documentation Fetcher

## Instructions

1. Parse `$ARGUMENTS` for a library name and an optional question
2. If no library is specified or the library is not recognized, list the supported libraries from the table below and ask the user to pick one
3. Fetch the documentation from the matching URL in the table below
4. If the fetch fails, inform the user and suggest they check the URL directly in their browser
5. Answer the user's question using the fetched documentation. If no question was provided, summarize what the documentation covers so the user knows what to ask about

## Supported Libraries

| Library                            | URL                                        |
| ---------------------------------- | ------------------------------------------ |
| Mastra (core, MCP, pg)             | https://mastra.ai/docs/llms.txt            |
| Drizzle ORM + drizzle-kit          | https://orm.drizzle.team/llms-full.txt     |
| Hono                               | https://hono.dev/llms-full.txt             |
| Lefthook                           | https://lefthook.dev/llms-full.txt         |
| OpenRouter                         | https://openrouter.ai/docs/llms-full.txt   |
| Exa (exa-js)                       | https://exa.ai/docs/llms-full.txt          |
| Firecrawl (@mendable/firecrawl-js) | https://docs.firecrawl.dev/llms-full.txt   |
| Railway                            | https://railway.com/llms.txt               |
| Zod                                | https://zod.dev/llms-full.txt              |
| Doppler                            | https://docs.doppler.com/llms.txt          |
| Turborepo                          | https://turborepo.com/repo/docs/llms.txt   |
| Assistant UI                       | https://www.assistant-ui.com/llms-full.txt |
| Composio                           | https://docs.composio.dev/llms.txt.        |

## Guidelines

- Scope to one library per invocation
- If the user's library name is ambiguous (e.g. "drizzle" could mean Drizzle ORM or drizzle-kit), ask for clarification
- Cite which documentation source was used when providing answers
