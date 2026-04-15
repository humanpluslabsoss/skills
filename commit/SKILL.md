---
name: commit
description: "Create a conventional commit message for staged changes. Usage: /commit [optional context]"
disable-model-invocation: false
---

**User-provided context:** $ARGUMENTS

Please create a commit for the staged changes following these guidelines:

1. Run these git commands in parallel to understand the changes:
   - `git status` to see all staged files
   - `git diff --staged` to see the actual changes
   - `git log --oneline -10` to understand the commit message style

2. **Incorporate user-provided context into the commit message:**
   - If context is provided above, it MUST influence the final commit message
   - Use the context to determine the appropriate commit type (feat, fix, refactor, etc.)
   - Reflect the context in the short description on the first line
   - Include relevant details from the context in the bullet points
   - The context explains the "why" - use it to make the message more meaningful
   - Example: if context is "performance optimization for search", the message should mention performance/search, not just generic "update code"
   - If no context is provided, generate the message purely from the staged changes

3. Analyze the staged changes and create a conventional commit message following this format:
   ```
   <type>(<scope>): <short description>

   - Bullet point summary of changes
   - Additional context if needed
   ```

   **CRITICAL LINE LENGTH REQUIREMENT:**
   - The commit message body MUST NOT exceed 100 characters per line
   - If a bullet point is longer than 100 characters, wrap it across multiple lines
   - Use proper indentation (2 spaces) for wrapped lines to maintain readability

4. Commit types to use:
   - `feat`: New feature
   - `fix`: Bug fix
   - `chore`: Maintenance tasks, configuration, dependencies
   - `refactor`: Code restructuring without changing behavior
   - `docs`: Documentation changes
   - `test`: Adding or updating tests
   - `style`: Code style/formatting changes
   - `perf`: Performance improvements
   - `ci`: CI/CD changes

5. Create the commit using a heredoc for proper formatting:
   ```bash
   git commit -m "$(cat <<'EOF'
   <type>(<scope>): <description>

   - First bullet point with concise details
   - Second bullet point, wrapped to multiple lines if needed to stay
     under 100 characters per line
   - Third bullet point
   EOF
   )"
   ```

   **Example of proper line wrapping:**
   ```bash
   git commit -m "$(cat <<'EOF'
   feat(app): add user authentication with JWT tokens

   - Implement JWT-based authentication with refresh token rotation
   - Add login, logout, and token refresh endpoints to API routes
   - Create authentication middleware for protected route validation
   - Update user schema to include hashed password and refresh tokens
   EOF
   )"
   ```

## IMPORTANT NOTES - DO NOT IGNORE THE FOLLOWING:
   - Do NOT add any co-author to the commit message
   - Keep the commit message concise and focused on the "why" rather than the "what"
   - Under any circumstances do not circumvent the commit signing process. All commits should be signed as per the local configuration.

## Handling Git Lifecycle Hooks
   - Git hooks (e.g. pre-commit, commit-msg) may run automatically during commits
   - If a hook fails, report the failure message to the user as-is
   - Do NOT bypass hooks using flags like `--no-verify` or `--no-gpg-sign`
   - Do NOT attempt to fix hook failures automatically or retry the commit
   - Present the failure and let the user decide how to proceed
