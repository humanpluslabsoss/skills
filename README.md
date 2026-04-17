# Agent Skills

A collection of agent skills that enhance your development workflow.

## Development

Skills for day-to-day development.

- **commit** — Create conventional commit messages for staged changes. Supports optional context to guide the commit type and description.

  ```
  npx skills@latest add humanpluslabsoss/skills/commit
  ```

- **explain** — Read-only mode for exploring and understanding your codebase without making changes. Use when you want to investigate code, check status, or learn about a project.

  ```
  npx skills@latest add humanpluslabsoss/skills/explain
  ```

- **docs** — Fetch documentation from `llms.txt` endpoints for supported libraries (Mastra, Drizzle, Hono, Zod, and more). Pass a library name and optional question to get answers grounded in the latest docs.

  ```
  npx skills@latest add humanpluslabsoss/skills/docs
  ```

## 3rd Party Skills

Skills from other authors that I find useful.

### Planning & Design

- **write-a-prd** — Create a PRD through an interactive interview, codebase exploration, and module design.

  ```
  npx skills@latest add https://github.com/mattpocock/skills/write-a-prd
  ```

- **prd-to-plan** — Turn a PRD into a multi-phase implementation plan using tracer-bullet vertical slices.

  ```
  npx skills@latest add https://github.com/mattpocock/skills/prd-to-plan
  ```

- **prd-to-issues** — Break a PRD into independently-grabbable GitHub issues using vertical slices.

  ```
  npx skills@latest add https://github.com/mattpocock/skills/prd-to-issues
  ```

- **grill-me** — Get relentlessly interviewed about a plan or design until every branch of the decision tree is resolved.

  ```
  npx skills@latest add https://github.com/mattpocock/skills/grill-me
  ```

- **improve-codebase-architecture** — Explore a codebase for architectural improvement opportunities, focusing on deepening shallow modules and improving testability.

  ```
  npx skills@latest add https://github.com/mattpocock/skills/improve-codebase-architecture
  ```

### Development

- **tdd** — Test-driven development with a red-green-refactor loop. Builds features or fixes bugs one vertical slice at a time.

  ```
  npx skills@latest add https://github.com/mattpocock/skills/tdd
  ```

- **drizzle-orm** — Skills for working with Drizzle ORM, a TypeScript ORM for SQL databases.

  ```
  npx skills@latest add https://github.com/bobmatnyc/claude-mpm-skills --skill drizzle-orm
  ```

- **mastra** — Skills for building AI agents with the Mastra framework.

  ```
  npx skills@latest add https://github.com/mastra-ai/skills --skill mastra
  ```

- **openrouter-typescript-sdk** — Skills for working with the OpenRouter TypeScript SDK.

  ```
  npx skills@latest add https://github.com/openrouterteam/agent-skills --skill openrouter-typescript-sdk
  ```

- **composio** — Skills for integrating 1000+ app toolkits (Gmail, GitHub, Slack, Notion, and more) into AI agents with authentication and tool execution.

  ```
  npx skills@latest add composiohq/skills
  ```

- **nextjs** — Skills for building applications with the Next.js React framework.

  ```
  npx skills@latest add https://github.com/vercel-labs/vercel-plugin --skill nextjs
  ```

- **clerk** — Skills for adding authentication and user management (sign-in, sign-up, sessions, organizations) to your application.

  ```
  npx skills@latest add clerk/skills
  ```

### Deployment & Infrastructure

- **use-railway** — Skills for deploying and managing applications on Railway.

  ```
  npx skills@latest add https://github.com/railwayapp/railway-skills --skill use-railway
  ```

## License

MIT
