---
description: Create commits with user approval and no Claude attribution (supports both git and jj)
---

# Commit Changes

You are tasked with creating commits for the changes made during this session. This command supports both Git and Jujutsu (jj) version control systems.

## Process:

1. **Think about what changed:**
   - Review the conversation history and understand what was accomplished
   - Check current changes:
     - **For git users**: Run `git status` and `git diff`
     - **For jj users**: Run `jj status` and `jj diff`
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
   - **For git users**:
     - Use `git add` with specific files (never use `-A` or `.`)
     - Create commits with your planned messages: `git commit -m "message"`
     - Show the result with `git log --oneline -n [number]`

   - **For jj users**:
     - Create a new change: `jj new`
     - Describe the change with your message: `jj describe -m "message"`
     - Show the result with `jj log -n [number]`

## Important:
- **NEVER add co-author information or Claude attribution**
- Commits should be authored solely by the user
- Do not include any "Generated with Claude" messages
- Do not add "Co-Authored-By" lines
- Write commit messages as if the user wrote them

## Remember:
- You have the full context of what was done in this session
- Group related changes together
- Keep commits focused and atomic when possible
- The user trusts your judgment - they asked you to commit