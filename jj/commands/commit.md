# Commit Changes

You are tasked with creating jj commits for the changes made during this session.

## Process:

1. **Think about what changed:**
   - Review the conversation history and understand what was accomplished
   - Run `jj status` to see current changes
   - Run `jj diff` to understand the modifications
   - Consider whether changes should be one commit or multiple logical commits

2. **Plan your commit(s):**
   - Identify which files belong together
   - Draft clear, descriptive commit messages
   - Use imperative mood in commit messages
   - Focus on why the changes were made, not just what

3. **Present your plan to the user:**
   - List the files you plan to include for each commit
   - Show the commit message(s) you'll use
   - Ask: "I plan to create [N] commit(s) with these changes. Shall I proceed?"

4. **Execute upon confirmation:**
   - Use `jj describe` to set the commit message for the current working copy
   - Use `jj split` if multiple logical commits are needed
   - Show the result with `jj log -n [number]`

## Important:
- **NEVER add co-author information or Claude attribution**
- Commits should be authored solely by the user
- Do not include any "Generated with Claude" messages
- Do not add "Co-Authored-By" lines
- Write commit messages as if the user wrote them

## Jujutsu-specific notes:
- Jujutsu automatically tracks all changes in the working copy
- Use `jj describe` to set the commit message
- Use `jj split` to split changes into multiple commits if needed
- Use `jj squash` to combine commits if necessary
- The working copy revision is automatically updated

## Remember:
- You have the full context of what was done in this session
- Group related changes together
- Keep commits focused and atomic when possible
- The user trusts your judgment - they asked you to commit
