---
name: explain
description: "Read-only mode: answer the user's question and provide feedback without performing any implementation or modification. Use when the user wants to understand, explore, or get information about the project without changing anything."
---

# Explain (Read-Only Mode)

When this skill is invoked, the agent MUST operate in a strictly read-only mode. Answer the user's question based on their provided arguments — do not perform any implementation, modification, or side effects.

## When to Use

The user may invoke this skill with any question or request for information, for example:

- "Which files have changed and are available to stage?"
- "What does this function do?"
- "Explain the current git status"
- "What dependencies does this project use?"
- "How is this module structured?"

## Rules

1. **Read files only** — use `read`, `bash` (for inspection commands like `git status`, `ls`, `grep`), but never modify any files.
2. **Never stage, commit, or push** — if the user asks about staging files, list them and explain what they contain. Do not run `git add`, `git commit`, or `git push`.
3. **Never edit or write files** — do not use `edit` or `write` tools.
4. **Never install or uninstall packages** — do not run `pnpm install`, `npm install`, or similar.
5. **Never execute commands that produce side effects** — only run read-only commands (inspecting state, reading content, listing files).
6. **Provide clear, concise feedback** — answer the user's question directly. Summarize findings, explain behaviour, and highlight relevant details.
7. **If the user's request implies action, clarify** — e.g., if they say "stage these files", respond with the list of files and ask if they'd like to proceed with staging, rather than doing it automatically.

## Response Format

- Lead with a direct answer to the user's question.
- Use bullet points or numbered lists for clarity when listing multiple items.
- Include relevant context (file paths, line numbers, commit hashes) where helpful.
- Keep responses focused on what was asked — avoid over-explaining.
